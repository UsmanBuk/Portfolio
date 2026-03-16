# EnvGuard

EnvGuard is a tiny Python CLI that detects and fixes drift between code-referenced environment variables and your `.env.example` file.

## Who it's for

- Solo developers and small teams using `.env` files
- OSS maintainers who want easier onboarding
- Teams that want CI checks for missing env keys

## Install

No external dependencies are required.

```bash
python3 --version
```

## Usage

From the repository root:

```bash
python3 -m envguard scan --project .
python3 -m envguard check --project . --env-file .env --example-file .env.example
python3 -m envguard sync --project . --example-file .env.example
```

### Strict mode

Fail if `.env.example` contains keys no longer referenced in code:

```bash
python3 -m envguard check --strict
```

## Example demo

A runnable demo is included:

```bash
bash envguard/examples/demo.sh
```

The script runs:
1. `check` (expected to fail first)
2. `sync` (adds missing keys to `.env.example`)
3. `check` again (expected to pass)

## Supported key-detection patterns

- `os.getenv("KEY")`
- `os.environ["KEY"]`
- `os.environ.get("KEY")`
- `getenv("KEY")`
- `process.env.KEY`
- `process.env["KEY"]`
- `import.meta.env.KEY`

## Exit codes

- `0` success
- `1` drift or missing files
- `2` invalid CLI usage
