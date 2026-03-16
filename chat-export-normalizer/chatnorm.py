#!/usr/bin/env python3
"""ChatNorm: normalize AI chat exports into Markdown."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


@dataclass
class Message:
    role: str
    content: str
    timestamp: str | None = None


@dataclass
class Conversation:
    title: str
    source: str
    updated_at: str | None
    messages: list[Message]


class ConversionError(Exception):
    """Raised when input cannot be parsed into expected conversation structures."""


def iso_timestamp(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        try:
            return (
                datetime.fromtimestamp(float(value), tz=timezone.utc)
                .replace(microsecond=0)
                .isoformat()
            )
        except (OSError, OverflowError, ValueError):
            return None
    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return None
        return stripped
    return None


def safe_title(raw: Any, fallback: str) -> str:
    text = str(raw).strip() if raw is not None else ""
    return text if text else fallback


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", text.lower()).strip("-")
    return slug or "conversation"


def markdown_escape_heading(text: str) -> str:
    return text.replace("\n", " ").strip()


def extract_content(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        parts = [extract_content(item).strip() for item in value]
        return "\n".join([p for p in parts if p])
    if isinstance(value, dict):
        if "parts" in value:
            return extract_content(value.get("parts"))
        if "text" in value:
            return extract_content(value.get("text"))
        if "content" in value:
            return extract_content(value.get("content"))
        if "value" in value:
            return extract_content(value.get("value"))
    return str(value)


def normalize_role(raw_role: Any) -> str:
    role = str(raw_role or "").strip().lower()
    if role in {"user", "assistant", "system", "tool"}:
        return role
    return "unknown"


def parse_openai(payload: Any) -> list[Conversation]:
    if isinstance(payload, dict):
        conversations = payload.get("conversations")
    elif isinstance(payload, list):
        conversations = payload
    else:
        raise ConversionError("OpenAI payload must be a list or object with conversations.")

    if not isinstance(conversations, list):
        raise ConversionError("OpenAI conversations payload is not a list.")

    parsed: list[Conversation] = []
    for i, conv in enumerate(conversations, start=1):
        if not isinstance(conv, dict):
            continue
        title = safe_title(conv.get("title"), f"Conversation {i}")
        mapping = conv.get("mapping")
        if not isinstance(mapping, dict):
            continue

        rows: list[tuple[float, int, Message]] = []
        ordinal = 0
        for node in mapping.values():
            if not isinstance(node, dict):
                continue
            message = node.get("message")
            if not isinstance(message, dict):
                continue

            author = message.get("author") or {}
            role = normalize_role(author.get("role"))
            content = extract_content(message.get("content")).strip()
            if not content:
                continue

            ts_iso = iso_timestamp(message.get("create_time"))
            sort_ts = message.get("create_time")
            if not isinstance(sort_ts, (float, int)):
                sort_ts = 10**18

            rows.append((float(sort_ts), ordinal, Message(role=role, content=content, timestamp=ts_iso)))
            ordinal += 1

        rows.sort(key=lambda item: (item[0], item[1]))
        messages = [row[2] for row in rows]
        if not messages:
            continue

        updated_at = iso_timestamp(conv.get("update_time"))
        parsed.append(Conversation(title=title, source="openai", updated_at=updated_at, messages=messages))

    if not parsed:
        raise ConversionError("No conversations with messages found in OpenAI payload.")
    return parsed


def parse_generic(payload: Any) -> list[Conversation]:
    def normalize_messages(raw_messages: Any) -> list[Message]:
        if not isinstance(raw_messages, list):
            return []
        out: list[Message] = []
        for raw in raw_messages:
            if not isinstance(raw, dict):
                continue
            role = normalize_role(raw.get("role"))
            content = extract_content(raw.get("content")).strip()
            if not content:
                continue
            ts = iso_timestamp(raw.get("timestamp") or raw.get("created_at") or raw.get("time"))
            out.append(Message(role=role, content=content, timestamp=ts))
        return out

    parsed: list[Conversation] = []
    if isinstance(payload, dict):
        if isinstance(payload.get("messages"), list):
            title = safe_title(payload.get("title"), "Conversation 1")
            messages = normalize_messages(payload.get("messages"))
            if messages:
                updated = iso_timestamp(payload.get("updated_at") or payload.get("update_time"))
                parsed.append(
                    Conversation(title=title, source="generic", updated_at=updated, messages=messages)
                )
        elif isinstance(payload.get("conversations"), list):
            payload = payload.get("conversations")
        else:
            raise ConversionError("Generic payload must include messages or conversations.")

    if isinstance(payload, list):
        for i, conv in enumerate(payload, start=1):
            if not isinstance(conv, dict):
                continue
            title = safe_title(conv.get("title"), f"Conversation {i}")
            messages = normalize_messages(conv.get("messages"))
            if not messages:
                continue
            updated = iso_timestamp(conv.get("updated_at") or conv.get("update_time"))
            parsed.append(Conversation(title=title, source="generic", updated_at=updated, messages=messages))

    if not parsed:
        raise ConversionError("No conversations with messages found in generic payload.")
    return parsed


def detect_source(payload: Any) -> str:
    if isinstance(payload, list) and payload and isinstance(payload[0], dict):
        sample = payload[0]
        if "mapping" in sample:
            return "openai"
        if "messages" in sample:
            return "generic"
    if isinstance(payload, dict):
        if "conversations" in payload:
            conversations = payload.get("conversations")
            if isinstance(conversations, list) and conversations and isinstance(conversations[0], dict):
                if "mapping" in conversations[0]:
                    return "openai"
            if isinstance(conversations, list):
                return "generic"
        if "messages" in payload:
            return "generic"
    raise ConversionError("Could not auto-detect input format. Use --source explicitly.")


def write_markdown_files(conversations: list[Conversation], output_dir: Path) -> list[Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    used_names: dict[str, int] = {}

    for idx, conv in enumerate(conversations, start=1):
        base = slugify(conv.title)
        used_names[base] = used_names.get(base, 0) + 1
        suffix = f"-{used_names[base]}" if used_names[base] > 1 else ""
        filename = f"{idx:03d}-{base}{suffix}.md"
        path = output_dir / filename

        lines: list[str] = [
            "---",
            f"title: {conv.title}",
            f"source: {conv.source}",
            f"updated_at: {conv.updated_at or 'unknown'}",
            f"message_count: {len(conv.messages)}",
            "---",
            "",
            f"# {conv.title}",
            "",
        ]

        for message in conv.messages:
            heading_role = message.role.capitalize()
            lines.append(f"## {heading_role}")
            if message.timestamp:
                lines.append(f"_timestamp: {message.timestamp}_")
                lines.append("")
            lines.append(message.content.rstrip())
            lines.append("")

        path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
        written.append(path)

    return written


def write_index(conversations: list[Conversation], markdown_files: list[Path], output_dir: Path) -> Path:
    lines = [
        "# ChatNorm Export Index",
        "",
        f"_Generated at: {datetime.now(timezone.utc).replace(microsecond=0).isoformat()}_",
        "",
        "| # | Title | Messages | Updated | File |",
        "|---|-------|----------|---------|------|",
    ]

    for i, (conv, file_path) in enumerate(zip(conversations, markdown_files), start=1):
        title = markdown_escape_heading(conv.title).replace("|", "\\|")
        updated = conv.updated_at or "unknown"
        lines.append(f"| {i} | {title} | {len(conv.messages)} | {updated} | [{file_path.name}]({file_path.name}) |")

    index_path = output_dir / "index.md"
    index_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return index_path


def convert(input_path: Path, output_dir: Path, source: str) -> int:
    if not input_path.exists():
        raise ConversionError(f"Input file does not exist: {input_path}")
    if input_path.is_dir():
        raise ConversionError(f"Input path must be a file, got directory: {input_path}")

    try:
        payload = json.loads(input_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ConversionError(f"Invalid JSON in {input_path}: {exc}") from exc

    chosen_source = detect_source(payload) if source == "auto" else source
    if chosen_source == "openai":
        conversations = parse_openai(payload)
    elif chosen_source == "generic":
        conversations = parse_generic(payload)
    else:
        raise ConversionError(f"Unsupported source '{chosen_source}'.")

    files = write_markdown_files(conversations, output_dir)
    index_path = write_index(conversations, files, output_dir)

    total_messages = sum(len(conv.messages) for conv in conversations)
    print(f"Converted {len(conversations)} conversations ({total_messages} messages) from {chosen_source}.")
    print(f"Wrote {len(files)} markdown files + index: {index_path}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="chatnorm",
        description="Normalize AI chat export JSON into Markdown notes.",
    )
    subparsers = parser.add_subparsers(dest="command")

    convert_parser = subparsers.add_parser("convert", help="Convert JSON export to Markdown files.")
    convert_parser.add_argument("--input", required=True, help="Path to input JSON file.")
    convert_parser.add_argument("--output", required=True, help="Directory for generated markdown.")
    convert_parser.add_argument(
        "--source",
        default="auto",
        choices=["auto", "openai", "generic"],
        help="Input format (default: auto).",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command != "convert":
        parser.print_help()
        return 1

    try:
        return convert(
            input_path=Path(args.input).expanduser().resolve(),
            output_dir=Path(args.output).expanduser().resolve(),
            source=args.source,
        )
    except ConversionError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2
    except OSError as exc:
        print(f"Filesystem error: {exc}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
