"""Core repair and validation logic for ArgFix."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from typing import Any


SMART_QUOTES = {
    "\u201c": '"',
    "\u201d": '"',
    "\u2018": "'",
    "\u2019": "'",
}

KEY_WITH_SINGLE_QUOTES = re.compile(
    r"(?P<prefix>[{,]\s*)'(?P<key>[^'\\]*(?:\\.[^'\\]*)*)'(?P<suffix>\s*:)"
)
VALUE_WITH_SINGLE_QUOTES = re.compile(
    r"(?P<prefix>:\s*)'(?P<value>[^'\\]*(?:\\.[^'\\]*)*)'(?P<suffix>\s*[,}\]])"
)
UNQUOTED_KEY = re.compile(r'([{,]\s*)([A-Za-z_][A-Za-z0-9_-]*)(\s*:)')
TRAILING_COMMA = re.compile(r",\s*([}\]])")
CODE_FENCE = re.compile(r"^\s*```(?:json)?\s*(.*?)\s*```\s*$", re.DOTALL | re.IGNORECASE)


@dataclass
class ProcessResult:
    """Processed record result."""

    ok: bool
    repaired: bool
    actions: list[str]
    errors: list[str]
    data: Any | None
    raw: str
    candidate: str


def _normalize_quotes(text: str) -> tuple[str, bool]:
    updated = text
    changed = False
    for bad, good in SMART_QUOTES.items():
        if bad in updated:
            updated = updated.replace(bad, good)
            changed = True
    return updated, changed


def _strip_code_fence(text: str) -> tuple[str, bool]:
    match = CODE_FENCE.match(text)
    if not match:
        return text, False
    return match.group(1).strip(), True


def _extract_json_candidate(text: str) -> tuple[str, bool]:
    start = min((i for i in (text.find("{"), text.find("[")) if i != -1), default=-1)
    if start == -1:
        return text, False
    return text[start:].strip(), start > 0


def _quote_unquoted_keys(text: str) -> tuple[str, bool]:
    updated = text
    changed = False
    while True:
        new_text, count = UNQUOTED_KEY.subn(r'\1"\2"\3', updated)
        updated = new_text
        if count == 0:
            break
        changed = True
    return updated, changed


def _replace_single_quoted_keys(text: str) -> tuple[str, bool]:
    changed = False

    def repl(match: re.Match[str]) -> str:
        nonlocal changed
        changed = True
        key = match.group("key").replace('"', '\\"')
        return f'{match.group("prefix")}"{key}"{match.group("suffix")}'

    return KEY_WITH_SINGLE_QUOTES.sub(repl, text), changed


def _replace_single_quoted_values(text: str) -> tuple[str, bool]:
    changed = False

    def repl(match: re.Match[str]) -> str:
        nonlocal changed
        changed = True
        value = match.group("value").replace('"', '\\"')
        return f'{match.group("prefix")}"{value}"{match.group("suffix")}'

    return VALUE_WITH_SINGLE_QUOTES.sub(repl, text), changed


def _remove_trailing_commas(text: str) -> tuple[str, bool]:
    updated, count = TRAILING_COMMA.subn(r"\1", text)
    return updated, count > 0


def _sanitize_brackets(text: str) -> tuple[str, bool]:
    stack: list[str] = []
    out: list[str] = []
    in_string = False
    escape = False
    changed = False

    for char in text:
        out.append(char)
        if in_string:
            if escape:
                escape = False
            elif char == "\\":
                escape = True
            elif char == '"':
                in_string = False
            continue

        if char == '"':
            in_string = True
            continue

        if char in "{[":
            stack.append(char)
            continue

        if char == "}":
            if not stack or stack[-1] != "{":
                out.pop()
                changed = True
            else:
                stack.pop()
            continue

        if char == "]":
            if not stack or stack[-1] != "[":
                out.pop()
                changed = True
            else:
                stack.pop()

    if stack:
        changed = True
        for open_char in reversed(stack):
            out.append("}" if open_char == "{" else "]")

    return "".join(out), changed


def validate_schema(data: Any, schema: dict[str, Any], path: str = "$") -> list[str]:
    """Validate data against a minimal JSON-schema subset."""
    errors: list[str] = []
    schema_type = schema.get("type")

    if schema_type and not _matches_type(data, schema_type):
        errors.append(f"{path}: expected type {schema_type}, got {type(data).__name__}")
        return errors

    if schema_type == "object":
        if not isinstance(data, dict):
            return errors

        for required_key in schema.get("required", []):
            if required_key not in data:
                errors.append(f"{path}.{required_key}: missing required key")

        properties = schema.get("properties", {})
        for key, subschema in properties.items():
            if key in data:
                errors.extend(validate_schema(data[key], subschema, f"{path}.{key}"))

    if schema_type == "array":
        if not isinstance(data, list):
            return errors
        item_schema = schema.get("items")
        if item_schema:
            for idx, value in enumerate(data):
                errors.extend(validate_schema(value, item_schema, f"{path}[{idx}]"))

    return errors


def _matches_type(value: Any, schema_type: str) -> bool:
    mapping = {
        "object": dict,
        "array": list,
        "string": str,
        "number": (int, float),
        "integer": int,
        "boolean": bool,
        "null": type(None),
    }
    expected = mapping.get(schema_type)
    if expected is None:
        return True
    if schema_type == "number":
        return isinstance(value, expected) and not isinstance(value, bool)
    if schema_type == "integer":
        return isinstance(value, int) and not isinstance(value, bool)
    return isinstance(value, expected)


def process_text(raw_text: str, schema: dict[str, Any] | None = None) -> ProcessResult:
    """Extract, repair, parse and optionally validate a JSON payload."""
    actions: list[str] = []
    errors: list[str] = []
    text = raw_text.strip()

    text, changed = _strip_code_fence(text)
    if changed:
        actions.append("stripped_markdown_fence")

    text, changed = _normalize_quotes(text)
    if changed:
        actions.append("normalized_smart_quotes")

    candidate, changed = _extract_json_candidate(text)
    if changed:
        actions.append("extracted_json_segment")
    candidate = candidate.strip()

    candidate, changed = _replace_single_quoted_keys(candidate)
    if changed:
        actions.append("converted_single_quoted_keys")

    candidate, changed = _replace_single_quoted_values(candidate)
    if changed:
        actions.append("converted_single_quoted_values")

    candidate, changed = _quote_unquoted_keys(candidate)
    if changed:
        actions.append("quoted_unquoted_keys")

    candidate, changed = _remove_trailing_commas(candidate)
    if changed:
        actions.append("removed_trailing_commas")

    candidate, changed = _sanitize_brackets(candidate)
    if changed:
        actions.append("balanced_brackets")

    parsed: Any | None = None
    try:
        parsed = json.loads(candidate)
    except json.JSONDecodeError as exc:
        errors.append(f"parse_error: {exc.msg} at line {exc.lineno}, column {exc.colno}")

    if parsed is not None and schema is not None:
        schema_errors = validate_schema(parsed, schema)
        if schema_errors:
            errors.extend([f"schema_error: {err}" for err in schema_errors])

    return ProcessResult(
        ok=not errors,
        repaired=bool(actions),
        actions=actions,
        errors=errors,
        data=parsed if not errors else None,
        raw=raw_text,
        candidate=candidate,
    )

