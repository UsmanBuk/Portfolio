# PRODUCT_SPEC.md

## Product name

**PromptBudgetGuard**

## One-line pitch

A CI-friendly CLI that scans your prompt and tool files, estimates token/cost usage per model, and fails fast when budgets are exceeded.

## MVP scope (ruthlessly minimal)

1. **Scan local files** (txt, md, json, yaml, yml by default) via glob patterns.
2. **Token estimation** per file and total using model-aware encoding (tiktoken).
3. **Cost estimation** using a built-in pricing table for common models.
4. **Budget guardrails**:
   - `--max-tokens`
   - `--max-cost-usd`
   - non-zero exit code when breached (for CI usage)
5. **Actionable output**:
   - largest files by token count
   - summary totals
   - optional JSON output for automation

Non-goals for MVP:
- no cloud dashboard
- no auth/API keys
- no prompt rewriting UI
- no database

## Tech stack decision

**Python 3.10+** + `tiktoken`.

Why Python:
- fast to ship as a standalone CLI;
- excellent file/glob support for repo scanning;
- rich ecosystem for AI tokenization;
- ideal for solo-dev MVP under 500 LOC.

## Data model / schema

No persistent database needed.

In-memory structures:

```text
FileReport
- path: str
- tokens: int
- estimated_cost_usd: float
- bytes: int

RunReport
- model: str
- files_scanned: int
- total_tokens: int
- total_cost_usd: float
- breaches: list[str]
- top_offenders: list[FileReport]
```

## CLI contract

```bash
python -m prompt_budget_guard.cli \
  --path . \
  --glob "**/*.{md,txt,json,yml,yaml}" \
  --model gpt-4o-mini \
  --max-tokens 120000 \
  --max-cost-usd 0.50 \
  --top 10
```

Flags:

- `--path` (default `.`): root directory to scan
- `--glob` (repeatable): include globs
- `--exclude` (repeatable): exclude globs
- `--model`: model key for tokenizer/pricing
- `--max-tokens`: fail if total exceeds this
- `--max-cost-usd`: fail if estimated cost exceeds this
- `--top`: number of largest files to show (default 5)
- `--json`: output machine-readable JSON

Exit codes:

- `0` success, budgets respected
- `2` validation/runtime error
- `3` budget breach
