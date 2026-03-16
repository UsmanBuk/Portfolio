# PRODUCT_SPEC: EnvGuard CLI

## Product Name
**EnvGuard**

## One-line Pitch
**A zero-dependency CLI that prevents `.env` and `.env.example` drift before it breaks onboarding, CI, or production.**

## MVP Scope (Ruthlessly Minimal)

### 1) `scan`
- Recursively scan a project for env-variable references in common patterns:
  - `os.getenv("KEY")`
  - `os.environ["KEY"]`
  - `os.environ.get("KEY")`
  - `getenv("KEY")`
  - `process.env.KEY`
  - `process.env["KEY"]`
  - `import.meta.env.KEY`
- Output sorted key list.

### 2) `check`
- Compare **referenced keys** against:
  - `.env`
  - `.env.example`
- Report:
  - keys used in code but missing from `.env`
  - keys used in code but missing from `.env.example`
  - (optional strict mode) keys in `.env.example` not found in code
- Exit non-zero when check fails (CI-friendly).

### 3) `sync`
- Append missing keys to `.env.example` as blank assignments:
  - `MISSING_KEY=`
- Preserve existing file content and ordering; only append missing keys.
- Create `.env.example` if absent.

## Out of Scope (for MVP)
- Secret encryption
- Cloud secret backends
- Per-environment matrix management (`.env.production`, etc.)
- Deep AST parsing for every language

## Tech Stack Decision

**Language:** Python 3 (standard library only)

**Reasoning:**
- Fast to build and portable for solo developers.
- No runtime dependencies keeps install friction low.
- Easy CI usage via `python3 -m envguard ...`.

## Data Model / Schema

No database.

In-memory sets/lists:
- `referenced_keys: set[str]`
- `env_keys: set[str]`
- `example_keys: set[str]`

Parsed line model for env files:
- `raw_lines: list[str]`
- key extraction regex: `^[A-Za-z_][A-Za-z0-9_]*=`

## CLI Contract

```text
python3 -m envguard scan [--project PATH]

python3 -m envguard check
  [--project PATH]
  [--env-file PATH]
  [--example-file PATH]
  [--strict]

python3 -m envguard sync
  [--project PATH]
  [--example-file PATH]
```

### Exit Codes
- `0`: success / no drift
- `1`: drift or missing files/keys detected
- `2`: invalid usage / argument errors

## UX Notes
- Human-readable output with sections:
  - `Missing from .env`
  - `Missing from .env.example`
  - `Extra in .env.example` (strict only)
- Deterministic sorted key printing for stable CI diffs.
