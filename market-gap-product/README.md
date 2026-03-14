# PromptBudgetGuard

PromptBudgetGuard is a small CLI that scans prompt/tool files in a repo, estimates token usage and input cost, and fails fast when you exceed budget thresholds.

## Who it's for

- AI product developers shipping prompt/tool workflows
- Teams that want CI guardrails before expensive LLM calls
- Solo founders tracking token risk in pull requests

## Why it exists

Most token tools are browser calculators. They are useful for one prompt, but not for repository-wide preflight checks with CI exit codes.

PromptBudgetGuard gives you:

- multi-file scanning
- model-aware token estimates
- cost estimates
- hard budget enforcement (`--max-tokens`, `--max-cost-usd`)

## Install

From this directory:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Usage

### 1) Basic scan

```bash
python3 -m prompt_budget_guard.cli --path .
```

### 2) Scan selected files and enforce budgets

```bash
python3 -m prompt_budget_guard.cli \
  --path . \
  --glob "examples/*.md" \
  --glob "examples/*.json" \
  --model gpt-4o-mini \
  --max-tokens 1200 \
  --max-cost-usd 0.01 \
  --top 5
```

### 3) JSON output for automation

```bash
python3 -m prompt_budget_guard.cli --path . --json
```

## Demo

Run:

```bash
bash demo.sh
```

You should see a report with:
- total token count
- estimated total cost
- top files by token usage
- PASS/FAIL budget status

## Supported model pricing keys (MVP)

- `gpt-4o-mini`
- `gpt-4o`
- `gpt-4.1-mini`
- `gpt-4.1`
- `claude-3-5-sonnet`

If pricing is unknown for a model key, token estimation still works and cost returns `0.0`.

## Exit codes

- `0` success (budgets respected)
- `2` runtime/validation error
- `3` budget breach
