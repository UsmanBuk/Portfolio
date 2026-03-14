#!/usr/bin/env python3
"""Repair malformed LLM JSON outputs and optionally validate schemas."""

from __future__ import annotations

import argparse
import ast
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


SMART_CHAR_MAP = {
    "\u2018": "'",
    "\u2019": "'",
    "\u201c": '"',
    "\u201d": '"',
    "\u00a0": " ",
}


@dataclass
class RepairResult:
    parsed: Any | None = None
    normalized_text: str = ""
    steps_applied: list[str] = field(default_factory=list)
    parse_error: str | None = None
    schema_errors: list[str] = field(default_factory=list)


def read_input(input_path: str | None) -> str:
    if input_path:
        return Path(input_path).read_text(encoding="utf-8")
    return sys.stdin.read()


def write_text(path: str, content: str) -> None:
    Path(path).write_text(content, encoding="utf-8")


def extract_candidate_json(raw_text: str) -> tuple[str, list[str]]:
    steps: list[str] = []
    text = raw_text.strip()
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, flags=re.IGNORECASE)
    if fence_match:
        steps.append("extracted JSON from markdown code fence")
        text = fence_match.group(1).strip()

    first_object = text.find("{")
    first_array = text.find("[")
    starts = [i for i in (first_object, first_array) if i != -1]
    if not starts:
        return text, steps

    start_index = min(starts)
    if start_index > 0:
        text = text[start_index:]
        steps.append("trimmed non-JSON prefix")

    last_object = text.rfind("}")
    last_array = text.rfind("]")
    end_index = max(last_object, last_array)
    if end_index != -1 and end_index < len(text) - 1:
        text = text[: end_index + 1]
        steps.append("trimmed non-JSON suffix")

    return text.strip(), steps


def parse_json(text: str) -> tuple[Any | None, str | None]:
    try:
        return json.loads(text), None
    except json.JSONDecodeError as exc:
        return None, f"{exc.msg} (line {exc.lineno}, col {exc.colno})"


def normalize_smart_chars(text: str) -> str:
    updated = text
    for source, target in SMART_CHAR_MAP.items():
        updated = updated.replace(source, target)
    return updated


def strip_js_comments(text: str) -> str:
    without_block = re.sub(r"/\*.*?\*/", "", text, flags=re.DOTALL)
    return re.sub(r"^\s*//.*?$", "", without_block, flags=re.MULTILINE)


def remove_trailing_commas(text: str) -> str:
    return re.sub(r",\s*([}\]])", r"\1", text)


def quote_unquoted_keys(text: str) -> str:
    return re.sub(r'([{\[,]\s*)([A-Za-z_][A-Za-z0-9_-]*)(\s*:)', r'\1"\2"\3', text)


def append_missing_closers(text: str) -> str:
    stack: list[str] = []
    in_string = False
    quote_char = ""
    escaped = False

    for char in text:
        if in_string:
            if escaped:
                escaped = False
                continue
            if char == "\\":
                escaped = True
                continue
            if char == quote_char:
                in_string = False
            continue

        if char in ("'", '"'):
            in_string = True
            quote_char = char
            continue

        if char == "{":
            stack.append("}")
        elif char == "[":
            stack.append("]")
        elif char in ("}", "]") and stack and char == stack[-1]:
            stack.pop()

    if not stack:
        return text
    return text + "".join(reversed(stack))


def parse_with_literal_eval(text: str) -> tuple[Any | None, str | None]:
    pythonish = re.sub(r"\bnull\b", "None", text)
    pythonish = re.sub(r"\btrue\b", "True", pythonish)
    pythonish = re.sub(r"\bfalse\b", "False", pythonish)
    try:
        value = ast.literal_eval(pythonish)
    except (SyntaxError, ValueError) as exc:
        return None, str(exc)
    try:
        json.dumps(value)
    except (TypeError, ValueError) as exc:
        return None, f"literal_eval output not JSON serializable: {exc}"
    return value, None


def repair_json(raw_text: str) -> RepairResult:
    result = RepairResult()
    candidate, extract_steps = extract_candidate_json(raw_text)
    result.steps_applied.extend(extract_steps)
    working = candidate
    result.normalized_text = working

    parsed, error = parse_json(working)
    if parsed is not None:
        result.parsed = parsed
        return result

    transforms: list[tuple[str, Any]] = [
        ("normalized smart punctuation", normalize_smart_chars),
        ("removed JavaScript-style comments", strip_js_comments),
        ("removed trailing commas", remove_trailing_commas),
        ("quoted unquoted object keys", quote_unquoted_keys),
        ("balanced missing closing braces/brackets", append_missing_closers),
    ]

    for step_name, transform in transforms:
        updated = transform(working)
        if updated != working:
            result.steps_applied.append(step_name)
            working = updated
            result.normalized_text = working

        parsed, error = parse_json(working)
        if parsed is not None:
            result.parsed = parsed
            return result

    parsed, literal_error = parse_with_literal_eval(working)
    if parsed is not None:
        result.parsed = parsed
        result.steps_applied.append("parsed Python-style literal and converted to JSON")
        return result

    result.parse_error = literal_error or error or "unknown parse error"
    return result


def validate_against_schema(instance: Any, schema_path: str) -> list[str]:
    try:
        import jsonschema
    except ImportError:
        return ["jsonschema is not installed. Run: python3 -m pip install jsonschema"]

    schema = json.loads(Path(schema_path).read_text(encoding="utf-8"))
    validator = jsonschema.Draft202012Validator(schema)
    errors = sorted(validator.iter_errors(instance), key=lambda err: list(err.absolute_path))

    formatted: list[str] = []
    for err in errors:
        path = "$"
        if err.absolute_path:
            path += "." + ".".join(str(x) for x in err.absolute_path)
        formatted.append(f"{path}: {err.message}")
    return formatted


def build_report(result: RepairResult, schema_path: str | None) -> str:
    lines: list[str] = []
    lines.append("LLM JSON Guard Report")
    lines.append("=" * 22)
    lines.append(f"parse_success: {result.parsed is not None}")
    lines.append(f"schema_checked: {bool(schema_path)}")
    lines.append("")
    lines.append("steps_applied:")
    if result.steps_applied:
        for step in result.steps_applied:
            lines.append(f"- {step}")
    else:
        lines.append("- none")

    lines.append("")
    if result.parse_error:
        lines.append("parse_error:")
        lines.append(f"- {result.parse_error}")
        lines.append("")

    if schema_path:
        lines.append("schema_validation:")
        if result.schema_errors:
            for message in result.schema_errors:
                lines.append(f"- {message}")
        else:
            lines.append("- valid")

    return "\n".join(lines).rstrip() + "\n"


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="llm-json-guard",
        description="Repair malformed LLM JSON output and optionally validate a schema.",
    )
    parser.add_argument("input_file", nargs="?", help="Path to input text file. Defaults to stdin.")
    parser.add_argument("--schema", help="Optional JSON Schema file.")
    parser.add_argument("--output", help="Write repaired JSON to file instead of stdout.")
    parser.add_argument("--report", help="Write repair report to a text file.")
    parser.add_argument("--compact", action="store_true", help="Emit compact JSON output.")
    parser.add_argument(
        "--fail-on-schema",
        action="store_true",
        help="Exit with status 3 when schema validation fails.",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    raw_text = read_input(args.input_file)
    result = repair_json(raw_text)

    if result.parsed is None:
        if args.report:
            write_text(args.report, build_report(result, args.schema))
        error_message = result.parse_error or "could not parse JSON"
        print(f"Parse failed: {error_message}", file=sys.stderr)
        return 2

    if args.schema:
        result.schema_errors = validate_against_schema(result.parsed, args.schema)

    indent = None if args.compact else 2
    output_json = json.dumps(result.parsed, indent=indent, ensure_ascii=False)
    if not args.compact:
        output_json += "\n"

    if args.output:
        write_text(args.output, output_json)
    else:
        sys.stdout.write(output_json)

    if args.report:
        write_text(args.report, build_report(result, args.schema))

    if args.fail_on_schema and result.schema_errors:
        for err in result.schema_errors:
            print(f"Schema error: {err}", file=sys.stderr)
        return 3
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
