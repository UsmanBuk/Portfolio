"""envsentry: lightweight environment variable audit CLI."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

DEFAULT_ENV_FILES = [
    ".env",
    ".env.example",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.test",
]

DEFAULT_SOURCE_EXTENSIONS = {
    ".py",
    ".js",
    ".mjs",
    ".cjs",
    ".ts",
    ".tsx",
    ".jsx",
    ".sh",
    ".bash",
    ".zsh",
    ".yaml",
    ".yml",
    ".toml",
}

DEFAULT_EXCLUDE_DIRS = {
    ".git",
    "node_modules",
    ".venv",
    "venv",
    "__pycache__",
    "dist",
    "build",
    ".next",
}

ENV_USAGE_PATTERNS = [
    re.compile(r"process\.env\.([A-Z][A-Z0-9_]*)"),
    re.compile(r"import\.meta\.env\.([A-Z][A-Z0-9_]*)"),
    re.compile(r"os\.getenv\(\s*['\"]([A-Z][A-Z0-9_]*)['\"]"),
    re.compile(r"os\.environ(?:\.get)?\(\s*['\"]([A-Z][A-Z0-9_]*)['\"]"),
    re.compile(r"getenv\(\s*['\"]([A-Z][A-Z0-9_]*)['\"]"),
    re.compile(r"\$\{([A-Z][A-Z0-9_]*)\}"),
]

SENSITIVE_PARTS = ("SECRET", "TOKEN", "PASSWORD", "PRIVATE", "KEY")
PUBLIC_PREFIXES = ("NEXT_PUBLIC_", "VITE_", "REACT_APP_")


@dataclass
class AuditResult:
    root: str
    scanned_files: int
    used_variables: set[str]
    env_files: dict[str, dict[str, str]]
    missing_by_file: dict[str, list[str]]
    unused_by_file: dict[str, list[str]]
    drift: dict[str, dict[str, str]]
    risky_public_keys: list[str]
    warnings: list[str]

    def to_jsonable(self) -> dict:
        return {
            "root": self.root,
            "scanned_files": self.scanned_files,
            "used_variables": sorted(self.used_variables),
            "env_files": self.env_files,
            "missing_by_file": self.missing_by_file,
            "unused_by_file": self.unused_by_file,
            "drift": self.drift,
            "risky_public_keys": self.risky_public_keys,
            "warnings": self.warnings,
        }

    def has_issues(self) -> bool:
        return any(self.missing_by_file.values()) or any(
            self.unused_by_file.values()
        ) or bool(self.drift) or bool(self.risky_public_keys)


def _parse_csv_values(values: Iterable[str] | None) -> set[str]:
    output: set[str] = set()
    if not values:
        return output
    for chunk in values:
        for part in chunk.split(","):
            value = part.strip()
            if value:
                output.add(value)
    return output


def _normalize_extensions(raw_extensions: set[str]) -> set[str]:
    normalized: set[str] = set()
    for ext in raw_extensions:
        normalized.add(ext if ext.startswith(".") else f".{ext}")
    return normalized


def discover_env_files(root: Path, explicit_files: list[str] | None) -> list[Path]:
    files: list[Path] = []
    candidates = explicit_files if explicit_files else DEFAULT_ENV_FILES
    for item in candidates:
        path = Path(item)
        if not path.is_absolute():
            path = root / path
        if path.exists() and path.is_file():
            files.append(path)
    seen: set[str] = set()
    deduped: list[Path] = []
    for file_path in files:
        key = str(file_path.resolve())
        if key not in seen:
            deduped.append(file_path)
            seen.add(key)
    return deduped


def parse_env_file(path: Path) -> tuple[dict[str, str], list[str]]:
    variables: dict[str, str] = {}
    warnings: list[str] = []
    key_pattern = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")

    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        return {}, [f"failed to read env file {path}: {exc}"]

    for line_no, line in enumerate(lines, start=1):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("export "):
            stripped = stripped[len("export ") :].strip()
        if "=" not in stripped:
            warnings.append(
                f"{path}:{line_no} skipped invalid line (missing '='): {line.strip()}"
            )
            continue
        key, value = stripped.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not key_pattern.match(key):
            warnings.append(f"{path}:{line_no} skipped invalid key: {key}")
            continue
        if (
            len(value) >= 2
            and value[0] == value[-1]
            and value[0] in {'"', "'"}
        ):
            value = value[1:-1]
        variables[key] = value
    return variables, warnings


def _should_skip_path(path: Path, exclude_dirs: set[str]) -> bool:
    return any(part in exclude_dirs for part in path.parts)


def scan_source_usage(
    root: Path, include_extensions: set[str], exclude_dirs: set[str]
) -> tuple[set[str], int, list[str]]:
    used: set[str] = set()
    scanned_files = 0
    warnings: list[str] = []

    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if _should_skip_path(path, exclude_dirs):
            continue
        if path.suffix.lower() not in include_extensions:
            continue
        scanned_files += 1
        try:
            content = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError) as exc:
            warnings.append(f"failed to read source file {path}: {exc}")
            continue
        for pattern in ENV_USAGE_PATTERNS:
            used.update(pattern.findall(content))
    return used, scanned_files, warnings


def build_drift(env_maps: dict[str, dict[str, str]]) -> dict[str, dict[str, str]]:
    per_key_values: dict[str, dict[str, str]] = {}
    for file_name, variables in env_maps.items():
        for key, value in variables.items():
            per_key_values.setdefault(key, {})[file_name] = value

    drift: dict[str, dict[str, str]] = {}
    for key, values_by_file in per_key_values.items():
        unique_values = set(values_by_file.values())
        if len(unique_values) > 1 and len(values_by_file) > 1:
            drift[key] = values_by_file
    return drift


def detect_risky_public_keys(used_variables: set[str]) -> list[str]:
    risky: list[str] = []
    for var in sorted(used_variables):
        if not var.startswith(PUBLIC_PREFIXES):
            continue
        if any(part in var for part in SENSITIVE_PARTS):
            risky.append(var)
    return risky


def run_audit(
    root: Path,
    env_files: list[str] | None = None,
    include_extensions: set[str] | None = None,
    exclude_dirs: set[str] | None = None,
) -> AuditResult:
    include_extensions = include_extensions or set(DEFAULT_SOURCE_EXTENSIONS)
    exclude_dirs = exclude_dirs or set(DEFAULT_EXCLUDE_DIRS)

    env_paths = discover_env_files(root, env_files)
    env_maps: dict[str, dict[str, str]] = {}
    warnings: list[str] = []

    for env_path in env_paths:
        vars_for_file, parse_warnings = parse_env_file(env_path)
        env_maps[str(env_path)] = vars_for_file
        warnings.extend(parse_warnings)

    used_variables, scanned_files, scan_warnings = scan_source_usage(
        root, include_extensions, exclude_dirs
    )
    warnings.extend(scan_warnings)

    if not env_paths:
        warnings.append("no env files found; use --env-file to specify files explicitly")
    if scanned_files == 0:
        warnings.append("no source files scanned; adjust --include-ext or PATH")

    missing_by_file: dict[str, list[str]] = {}
    unused_by_file: dict[str, list[str]] = {}
    for file_name, variables in env_maps.items():
        keys = set(variables.keys())
        missing_by_file[file_name] = sorted(used_variables - keys)
        unused_by_file[file_name] = sorted(keys - used_variables)

    drift = build_drift(env_maps)
    risky_public_keys = detect_risky_public_keys(used_variables)

    return AuditResult(
        root=str(root),
        scanned_files=scanned_files,
        used_variables=used_variables,
        env_files=env_maps,
        missing_by_file=missing_by_file,
        unused_by_file=unused_by_file,
        drift=drift,
        risky_public_keys=risky_public_keys,
        warnings=warnings,
    )


def _print_kv_list(title: str, data: dict[str, list[str]]) -> None:
    print(f"\n[{title}]")
    if not data:
        print("- none")
        return
    has_any = False
    for file_name, items in data.items():
        if not items:
            continue
        has_any = True
        print(f"- {file_name}: {', '.join(items)}")
    if not has_any:
        print("- none")


def _print_drift(drift: dict[str, dict[str, str]]) -> None:
    print("\n[DRIFT ACROSS ENV FILES]")
    if not drift:
        print("- none")
        return
    for key, by_file in sorted(drift.items()):
        print(f"- {key}")
        for file_name, value in sorted(by_file.items()):
            preview = value if len(value) <= 80 else value[:77] + "..."
            print(f"  {file_name} -> {preview}")


def _print_risky_keys(risky_public_keys: list[str]) -> None:
    print("\n[POTENTIALLY SENSITIVE PUBLIC KEYS]")
    if not risky_public_keys:
        print("- none")
        return
    for key in risky_public_keys:
        print(f"- {key}")


def print_human_report(result: AuditResult, strict: bool) -> None:
    print(f"envsentry audit: {result.root}")
    print(
        "scanned files: "
        f"{result.scanned_files} | env files: {len(result.env_files)} | "
        f"used vars: {len(result.used_variables)}"
    )

    _print_kv_list("MISSING IN ENV FILES", result.missing_by_file)
    _print_kv_list("UNUSED IN ENV FILES", result.unused_by_file)
    _print_drift(result.drift)
    _print_risky_keys(result.risky_public_keys)

    if result.warnings:
        print("\n[WARNINGS]")
        for warning in result.warnings:
            print(f"- {warning}")

    if result.has_issues():
        print("\nstatus: issues found")
        if strict:
            print("strict mode: exit 1")
    else:
        print("\nstatus: clean")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="envsentry",
        description=(
            "Audit source code vs .env files to find missing variables, "
            "unused keys, and cross-file drift."
        ),
    )
    parser.add_argument("path", nargs="?", default=".", help="Root path to scan.")
    parser.add_argument(
        "--env-file",
        dest="env_files",
        action="append",
        help="Env file to include (repeatable).",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit code 1 if issues are detected.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        dest="json_stdout",
        help="Print JSON report to stdout.",
    )
    parser.add_argument(
        "--json-out",
        help="Write JSON report to a file path.",
    )
    parser.add_argument(
        "--include-ext",
        action="append",
        help="Comma-separated list of additional file extensions to scan.",
    )
    parser.add_argument(
        "--exclude-dir",
        action="append",
        help="Comma-separated list of additional directory names to exclude.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    root = Path(args.path).resolve()
    if not root.exists() or not root.is_dir():
        print(f"error: path is not a readable directory: {root}", file=sys.stderr)
        return 2

    include_extensions = set(DEFAULT_SOURCE_EXTENSIONS)
    include_extensions |= _normalize_extensions(_parse_csv_values(args.include_ext))
    exclude_dirs = set(DEFAULT_EXCLUDE_DIRS) | _parse_csv_values(args.exclude_dir)

    result = run_audit(
        root=root,
        env_files=args.env_files,
        include_extensions=include_extensions,
        exclude_dirs=exclude_dirs,
    )

    if args.json_stdout:
        print(json.dumps(result.to_jsonable(), indent=2, sort_keys=True))
    else:
        print_human_report(result, strict=args.strict)

    if args.json_out:
        try:
            Path(args.json_out).write_text(
                json.dumps(result.to_jsonable(), indent=2, sort_keys=True),
                encoding="utf-8",
            )
        except OSError as exc:
            print(f"error: failed writing --json-out file: {exc}", file=sys.stderr)
            return 2

    if args.strict and result.has_issues():
        return 1
    return 0

