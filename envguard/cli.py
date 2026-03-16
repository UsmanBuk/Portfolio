from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Iterable


ENV_PATTERNS = (
    re.compile(r"""\bos\.getenv\(\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]"""),
    re.compile(r"""\bos\.environ\[\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*\]"""),
    re.compile(r"""\bos\.environ\.get\(\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]"""),
    re.compile(r"""\bgetenv\(\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]"""),
    re.compile(r"""\bprocess\.env\.([A-Za-z_][A-Za-z0-9_]*)"""),
    re.compile(r"""\bprocess\.env\[\s*['"]([A-Za-z_][A-Za-z0-9_]*)['"]\s*\]"""),
    re.compile(r"""\bimport\.meta\.env\.([A-Za-z_][A-Za-z0-9_]*)"""),
)

ENV_ASSIGNMENT = re.compile(r"^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=")

DEFAULT_EXTENSIONS = {
    ".py",
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".mjs",
    ".cjs",
    ".sh",
    ".go",
    ".php",
    ".rb",
}

SKIP_DIRS = {
    ".git",
    ".hg",
    ".svn",
    ".venv",
    "venv",
    "__pycache__",
    "node_modules",
    "dist",
    "build",
}


def _iter_source_files(project_root: Path) -> Iterable[Path]:
    for path in project_root.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix.lower() in DEFAULT_EXTENSIONS:
            yield path


def _extract_env_keys(text: str) -> set[str]:
    keys: set[str] = set()
    for pattern in ENV_PATTERNS:
        keys.update(pattern.findall(text))
    return keys


def scan_project(project_root: Path) -> set[str]:
    if not project_root.exists():
        raise FileNotFoundError(f"Project path does not exist: {project_root}")
    if not project_root.is_dir():
        raise NotADirectoryError(f"Project path is not a directory: {project_root}")

    keys: set[str] = set()
    for source_file in _iter_source_files(project_root):
        try:
            text = source_file.read_text(encoding="utf-8", errors="ignore")
        except OSError as exc:
            print(f"Warning: could not read {source_file}: {exc}", file=sys.stderr)
            continue
        keys.update(_extract_env_keys(text))
    return keys


def parse_env_file_keys(path: Path) -> set[str]:
    keys: set[str] = set()
    if not path.exists():
        return keys

    try:
        lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
    except OSError as exc:
        raise OSError(f"Could not read {path}: {exc}") from exc

    for line in lines:
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        match = ENV_ASSIGNMENT.match(line)
        if match:
            keys.add(match.group(1))
    return keys


def _print_key_block(title: str, keys: set[str]) -> None:
    print(f"\n{title}:")
    if not keys:
        print("  - none")
        return
    for key in sorted(keys):
        print(f"  - {key}")


def cmd_scan(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    try:
        keys = scan_project(project)
    except (FileNotFoundError, NotADirectoryError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if not keys:
        print("No environment variable usage found.")
        return 0

    print("\n".join(sorted(keys)))
    return 0


def cmd_check(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    env_file = Path(args.env_file).resolve()
    example_file = Path(args.example_file).resolve()

    try:
        referenced = scan_project(project)
    except (FileNotFoundError, NotADirectoryError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if not env_file.exists():
        print(f"Error: env file not found: {env_file}", file=sys.stderr)
    if not example_file.exists():
        print(f"Error: example file not found: {example_file}", file=sys.stderr)
    if not env_file.exists() or not example_file.exists():
        return 1

    try:
        env_keys = parse_env_file_keys(env_file)
        example_keys = parse_env_file_keys(example_file)
    except OSError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    missing_from_env = referenced - env_keys
    missing_from_example = referenced - example_keys
    extra_in_example = example_keys - referenced if args.strict else set()

    print(f"Scanned {len(referenced)} referenced keys in {project}")
    _print_key_block("Missing from .env", missing_from_env)
    _print_key_block("Missing from .env.example", missing_from_example)
    if args.strict:
        _print_key_block("Extra keys in .env.example (strict mode)", extra_in_example)

    if missing_from_env or missing_from_example or extra_in_example:
        print("\nResult: FAIL")
        return 1
    print("\nResult: PASS")
    return 0


def cmd_sync(args: argparse.Namespace) -> int:
    project = Path(args.project).resolve()
    example_file = Path(args.example_file).resolve()

    try:
        referenced = scan_project(project)
    except (FileNotFoundError, NotADirectoryError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    try:
        existing_keys = parse_env_file_keys(example_file)
    except OSError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    missing = sorted(referenced - existing_keys)
    if not missing:
        print(f"{example_file} already includes all referenced keys.")
        return 0

    existing_text = ""
    if example_file.exists():
        try:
            existing_text = example_file.read_text(encoding="utf-8", errors="ignore")
        except OSError as exc:
            print(f"Error: could not read {example_file}: {exc}", file=sys.stderr)
            return 1

    additions: list[str] = []
    if existing_text and not existing_text.endswith("\n"):
        additions.append("")
    if existing_text:
        additions.append("")
    additions.append("# Added by envguard")
    additions.extend(f"{key}=" for key in missing)

    new_text = existing_text + "\n".join(additions) + "\n"
    try:
        example_file.parent.mkdir(parents=True, exist_ok=True)
        example_file.write_text(new_text, encoding="utf-8")
    except OSError as exc:
        print(f"Error: could not write {example_file}: {exc}", file=sys.stderr)
        return 1

    print(f"Updated {example_file}")
    print(f"Added {len(missing)} keys:")
    for key in missing:
        print(f"  - {key}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="envguard",
        description="Detect and fix .env/.env.example drift.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    scan_parser = subparsers.add_parser("scan", help="Print env keys referenced in code.")
    scan_parser.add_argument("--project", default=".", help="Project root to scan.")
    scan_parser.set_defaults(func=cmd_scan)

    check_parser = subparsers.add_parser("check", help="Check for env drift.")
    check_parser.add_argument("--project", default=".", help="Project root to scan.")
    check_parser.add_argument("--env-file", default=".env", help="Path to .env file.")
    check_parser.add_argument(
        "--example-file",
        default=".env.example",
        help="Path to .env.example file.",
    )
    check_parser.add_argument(
        "--strict",
        action="store_true",
        help="Fail when .env.example contains keys not referenced by code.",
    )
    check_parser.set_defaults(func=cmd_check)

    sync_parser = subparsers.add_parser(
        "sync", help="Append missing referenced keys to .env.example."
    )
    sync_parser.add_argument("--project", default=".", help="Project root to scan.")
    sync_parser.add_argument(
        "--example-file",
        default=".env.example",
        help="Path to .env.example file.",
    )
    sync_parser.set_defaults(func=cmd_sync)

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return int(args.func(args))

