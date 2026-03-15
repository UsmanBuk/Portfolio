# envsentry

`envsentry` is a tiny Python CLI that audits environment-variable usage in source code against one or more `.env` files.

It is for solo developers and small teams who keep hitting:
- "works locally, fails in staging"
- stale keys that never get cleaned up
- drift between `.env.local`, `.env.production`, and `.env.example`

## Features

- Detects env vars used in code (`process.env`, `import.meta.env`, `os.getenv`, `${VAR}`, etc.)
- Reports vars **missing** from each env file
- Reports vars **unused** in each env file
- Detects value **drift** across env files
- Flags suspicious public-prefixed keys (e.g. `NEXT_PUBLIC_SECRET_KEY`)
- Supports human-readable output and JSON output

## Install

No external dependencies. Python 3.9+ is enough.

```bash
git clone <repo-url>
cd <repo-root>
python3 -m envsentry --help
```

## Usage

### Basic scan (auto-detect common `.env*` files)

```bash
python3 -m envsentry .
```

### Explicit env files

```bash
python3 -m envsentry . \
  --env-file examples/sample-app/.env.example \
  --env-file examples/sample-app/.env.local \
  --env-file examples/sample-app/.env.production
```

### Strict mode for CI

```bash
python3 -m envsentry . --strict
```

### JSON output

```bash
python3 -m envsentry . --json
python3 -m envsentry . --json-out report.json
```

## Example demo

Run the included example:

```bash
bash examples/run_demo.sh
```

The demo scans `examples/sample-app/` and intentionally shows missing keys, unused keys, and drift.

