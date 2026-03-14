"""CLI entrypoint for ArgFix."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from .core import process_text


def _load_schema(path: str | None) -> dict[str, Any] | None:
    if not path:
        return None
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"Schema file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid schema JSON in {path}: {exc}") from exc


def _read_input(path: str | None) -> list[str]:
    if path:
        content = Path(path).read_text(encoding="utf-8")
    else:
        content = sys.stdin.read()

    lines = [line for line in content.splitlines() if line.strip()]
    if lines:
        return lines
    return [content] if content.strip() else []


def _write_output(path: str | None, content: str) -> None:
    if path:
        Path(path).write_text(content, encoding="utf-8")
        return
    sys.stdout.write(content)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="argfix",
        description="Repair malformed LLM tool-call JSON and optionally validate with schema.",
    )
    parser.add_argument("--input", help="Path to newline-delimited input records.")
    parser.add_argument("--output", help="Path to output file. Defaults to stdout.")
    parser.add_argument("--schema", help="Path to JSON schema file.")
    parser.add_argument(
        "--data-only",
        action="store_true",
        help="Output only repaired/validated JSON payloads (one line each).",
    )
    parser.add_argument(
        "--fail-on-error",
        action="store_true",
        help="Exit with code 1 if any record fails parse or schema validation.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        schema = _load_schema(args.schema)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2

    try:
        records = _read_input(args.input)
    except FileNotFoundError:
        print(f"Input file not found: {args.input}", file=sys.stderr)
        return 2

    if not records:
        print("No input records detected.", file=sys.stderr)
        return 2

    output_lines: list[str] = []
    failed = False

    for index, record in enumerate(records, start=1):
        result = process_text(record, schema=schema)
        failed = failed or (not result.ok)

        if args.data_only:
            if result.ok:
                output_lines.append(json.dumps(result.data, ensure_ascii=True))
            continue

        payload = {
            "index": index,
            "ok": result.ok,
            "repaired": result.repaired,
            "actions": result.actions,
            "errors": result.errors,
            "data": result.data,
            "candidate": result.candidate,
        }
        output_lines.append(json.dumps(payload, ensure_ascii=True))

    _write_output(args.output, "\n".join(output_lines) + "\n")

    if args.fail_on_error and failed:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

