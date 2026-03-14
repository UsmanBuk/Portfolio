"""CLI for PromptBudgetGuard."""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict, dataclass
from fnmatch import fnmatch
from pathlib import Path
from typing import Iterable

import tiktoken


DEFAULT_GLOBS = [
    "**/*.md",
    "**/*.txt",
    "**/*.json",
    "**/*.yml",
    "**/*.yaml",
]

DEFAULT_EXCLUDES = [
    "**/.git/**",
    "**/node_modules/**",
    "**/__pycache__/**",
    "**/.venv/**",
]

MODEL_PRICING_USD_PER_1K_INPUT = {
    "gpt-4o-mini": 0.00015,
    "gpt-4o": 0.0025,
    "gpt-4.1-mini": 0.0004,
    "gpt-4.1": 0.0020,
    "claude-3-5-sonnet": 0.0030,
}


@dataclass
class FileReport:
    path: str
    tokens: int
    estimated_cost_usd: float
    bytes: int


@dataclass
class RunReport:
    model: str
    files_scanned: int
    total_tokens: int
    total_cost_usd: float
    breaches: list[str]
    top_offenders: list[FileReport]
    files: list[FileReport]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="prompt-budget-guard",
        description=(
            "Scan prompt/tool files, estimate token/cost usage, "
            "and fail when budgets are exceeded."
        ),
    )
    parser.add_argument("--path", default=".", help="Base directory to scan (default: .)")
    parser.add_argument(
        "--glob",
        action="append",
        dest="globs",
        help="Include glob pattern (repeatable).",
    )
    parser.add_argument(
        "--exclude",
        action="append",
        dest="excludes",
        help="Exclude glob pattern (repeatable).",
    )
    parser.add_argument(
        "--model",
        default="gpt-4o-mini",
        help="Model name for token encoding/pricing (default: gpt-4o-mini).",
    )
    parser.add_argument("--max-tokens", type=int, default=None, help="Max allowed total tokens.")
    parser.add_argument(
        "--max-cost-usd", type=float, default=None, help="Max allowed total estimated cost in USD."
    )
    parser.add_argument(
        "--top",
        type=int,
        default=5,
        help="How many largest files to show (default: 5).",
    )
    parser.add_argument("--json", action="store_true", help="Output JSON report.")
    return parser.parse_args()


def get_encoder(model: str):
    try:
        return tiktoken.encoding_for_model(model)
    except KeyError:
        return tiktoken.get_encoding("cl100k_base")


def is_excluded(path: Path, exclude_patterns: Iterable[str], base_path: Path) -> bool:
    rel = path.relative_to(base_path).as_posix()
    return any(fnmatch(rel, pattern) for pattern in exclude_patterns)


def discover_files(base_path: Path, include_patterns: list[str], exclude_patterns: list[str]) -> list[Path]:
    files: set[Path] = set()
    for pattern in include_patterns:
        for candidate in base_path.glob(pattern):
            if candidate.is_file() and not is_excluded(candidate, exclude_patterns, base_path):
                files.add(candidate)
    return sorted(files)


def count_tokens(text: str, encoder) -> int:
    return len(encoder.encode(text))


def estimate_cost_usd(tokens: int, model: str) -> float:
    rate = MODEL_PRICING_USD_PER_1K_INPUT.get(model)
    if rate is None:
        return 0.0
    return (tokens / 1000.0) * rate


def scan_files(files: list[Path], base_path: Path, model: str) -> list[FileReport]:
    reports: list[FileReport] = []
    encoder = get_encoder(model)

    for file_path in files:
        try:
            raw = file_path.read_bytes()
            text = raw.decode("utf-8", errors="ignore")
            tokens = count_tokens(text, encoder)
            reports.append(
                FileReport(
                    path=file_path.relative_to(base_path).as_posix(),
                    tokens=tokens,
                    estimated_cost_usd=estimate_cost_usd(tokens, model),
                    bytes=len(raw),
                )
            )
        except OSError as exc:
            raise RuntimeError(f"Failed reading {file_path}: {exc}") from exc

    return reports


def evaluate_budgets(total_tokens: int, total_cost_usd: float, max_tokens: int | None, max_cost: float | None):
    breaches: list[str] = []
    if max_tokens is not None and total_tokens > max_tokens:
        breaches.append(f"Token budget exceeded: {total_tokens} > {max_tokens}")
    if max_cost is not None and total_cost_usd > max_cost:
        breaches.append(f"Cost budget exceeded: ${total_cost_usd:.6f} > ${max_cost:.6f}")
    return breaches


def build_report(
    model: str,
    reports: list[FileReport],
    max_tokens: int | None,
    max_cost: float | None,
    top_n: int,
) -> RunReport:
    sorted_reports = sorted(reports, key=lambda r: r.tokens, reverse=True)
    total_tokens = sum(item.tokens for item in sorted_reports)
    total_cost_usd = sum(item.estimated_cost_usd for item in sorted_reports)
    breaches = evaluate_budgets(total_tokens, total_cost_usd, max_tokens, max_cost)
    return RunReport(
        model=model,
        files_scanned=len(sorted_reports),
        total_tokens=total_tokens,
        total_cost_usd=total_cost_usd,
        breaches=breaches,
        top_offenders=sorted_reports[: max(top_n, 0)],
        files=sorted_reports,
    )


def print_human_report(report: RunReport) -> None:
    print("PromptBudgetGuard report")
    print("-" * 80)
    print(f"Model:              {report.model}")
    print(f"Files scanned:      {report.files_scanned}")
    print(f"Total tokens:       {report.total_tokens:,}")
    print(f"Estimated cost USD: ${report.total_cost_usd:.6f}")
    print()
    print("Top files by token usage:")
    if not report.top_offenders:
        print("  (no files found)")
    else:
        for index, item in enumerate(report.top_offenders, start=1):
            print(
                f"  {index:>2}. {item.path} | "
                f"{item.tokens:,} tokens | "
                f"${item.estimated_cost_usd:.6f} | "
                f"{item.bytes:,} bytes"
            )
    if report.breaches:
        print()
        print("Budget status: FAIL")
        for breach in report.breaches:
            print(f"  - {breach}")
    else:
        print()
        print("Budget status: PASS")


def main() -> int:
    try:
        args = parse_args()
        base_path = Path(args.path).expanduser().resolve()
        if not base_path.exists():
            print(f"Error: path does not exist: {base_path}", file=sys.stderr)
            return 2
        if not base_path.is_dir():
            print(f"Error: path is not a directory: {base_path}", file=sys.stderr)
            return 2

        include_patterns = args.globs or DEFAULT_GLOBS
        exclude_patterns = args.excludes or DEFAULT_EXCLUDES
        files = discover_files(base_path, include_patterns, exclude_patterns)
        reports = scan_files(files, base_path, args.model)
        report = build_report(
            model=args.model,
            reports=reports,
            max_tokens=args.max_tokens,
            max_cost=args.max_cost_usd,
            top_n=args.top,
        )

        if args.json:
            payload = {
                "model": report.model,
                "files_scanned": report.files_scanned,
                "total_tokens": report.total_tokens,
                "total_cost_usd": round(report.total_cost_usd, 8),
                "breaches": report.breaches,
                "top_offenders": [asdict(item) for item in report.top_offenders],
            }
            print(json.dumps(payload, indent=2))
        else:
            print_human_report(report)

        if report.breaches:
            return 3
        return 0
    except Exception as exc:  # noqa: BLE001
        print(f"Runtime error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
