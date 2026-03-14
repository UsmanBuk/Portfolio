#!/usr/bin/env bash
set -euo pipefail

python3 -m prompt_budget_guard.cli \
  --path . \
  --glob "examples/*.md" \
  --glob "examples/*.json" \
  --model gpt-4o-mini \
  --max-tokens 1200 \
  --max-cost-usd 0.01 \
  --top 5
