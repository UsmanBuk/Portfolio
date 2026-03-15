# PRODUCT_SPEC.md — `envsentry`

## Product name
**envsentry**

## One-line pitch
`envsentry` is a zero-dependency CLI that audits your codebase against `.env` files to detect missing variables, stale keys, and config drift before they break deploys.

## MVP scope (ruthlessly minimal)

1. **Source usage scanner**
   - Detect env var references in common patterns:
     - `process.env.X`
     - `import.meta.env.X`
     - `os.getenv("X")`
     - `os.environ.get("X")`
     - `${X}` in scripts/config templates

2. **Env file parser**
   - Parse `.env`-style files (`KEY=VALUE`, optional `export KEY=...`).
   - Accept multiple env files for comparison.

3. **Audit report**
   - Variables used in code but missing in each env file.
   - Variables defined in env files but unused in code.
   - Variables with conflicting values across env files (drift).

4. **Output modes**
   - Human-readable terminal report.
   - JSON output for CI tooling integration.

5. **Exit behavior**
   - Non-zero exit with `--strict` when issues exist.

## Non-goals (for MVP)

- Secret storage / encryption.
- Cloud integrations (AWS/GCP/Vault/etc.).
- Runtime secret injection.
- Auto-fixing env files.

## Tech stack decision

**Python 3 (standard library only)**.

Why:
- Fast to build and portable.
- Strong text processing with built-ins (`argparse`, `re`, `json`, `pathlib`).
- No dependency install friction for MVP.
- Keeps implementation under the requested complexity budget.

## Data model

```text
EnvAuditResult
  used_variables: set[str]
  env_files: dict[file_path -> dict[key -> value]]
  missing_by_file: dict[file_path -> list[key]]
  unused_by_file: dict[file_path -> list[key]]
  drift: dict[key -> dict[file_path -> value]]
  warnings: list[str]
```

## CLI contract

```text
Usage:
  python -m envsentry [PATH] [options]

Arguments:
  PATH                      Root directory to scan (default: .)

Options:
  --env-file FILE           Env file to include (repeatable)
  --strict                  Exit code 1 when issues are found
  --json                    Print JSON report to stdout
  --json-out FILE           Write JSON report to file
  --include-ext EXT[,EXT]   Extra file extensions to scan
  --exclude-dir NAME[,NAME] Extra directory names to exclude
```

## ASCII output wireframe

```text
envsentry audit: /path/to/repo
scanned files: 42 | env files: 3 | used vars: 19

[MISSING IN ENV FILES]
- .env.example: DATABASE_URL, STRIPE_API_KEY
- .env.production: SENTRY_DSN

[UNUSED IN ENV FILES]
- .env.local: OLD_FLAG, LEGACY_TOKEN

[DRIFT ACROSS ENV FILES]
- API_BASE_URL
  .env.development -> http://localhost:8000
  .env.production  -> https://api.example.com

status: issues found (strict mode would exit 1)
```

