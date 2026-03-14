#!/usr/bin/env python3
"""Run a quick end-to-end demo for llm-json-guard."""

from __future__ import annotations

import subprocess
from pathlib import Path


ROOT = Path(__file__).parent
INPUT = ROOT / "examples" / "broken_output.txt"
SCHEMA = ROOT / "examples" / "schema.json"
OUTPUT = ROOT / "examples" / "fixed_output.json"
REPORT = ROOT / "examples" / "report.txt"


def main() -> int:
    command = [
        "python3",
        "llm_json_guard.py",
        str(INPUT),
        "--schema",
        str(SCHEMA),
        "--output",
        str(OUTPUT),
        "--report",
        str(REPORT),
        "--fail-on-schema",
    ]
    completed = subprocess.run(command, cwd=ROOT, check=False)
    print(f"Exit code: {completed.returncode}")
    print(f"Wrote JSON: {OUTPUT}")
    print(f"Wrote report: {REPORT}")
    return completed.returncode


if __name__ == "__main__":
    raise SystemExit(main())
