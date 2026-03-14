# PRODUCT_SPEC: ArgFix

## Product name
**ArgFix**

## One-line pitch
Repair malformed LLM tool-call JSON and validate it against a schema from the command line.

## MVP goal
Make broken tool-call payloads safe for automation pipelines without adding heavy framework dependencies.

## Core feature set (MVP only)

1. **Input handling**
   - Read newline-delimited records from a file or stdin.
   - Each record can be raw text (possibly with markdown fences or surrounding prose).

2. **JSON extraction + repair**
   - Strip markdown code fences.
   - Extract the largest JSON-like segment.
   - Apply deterministic repairs for common breakage:
     - trailing commas
     - single-quoted keys/values
     - unquoted object keys
     - smart quotes
     - unbalanced braces/brackets

3. **Validation**
   - Parse repaired JSON with strict `json.loads`.
   - Optional schema validation (minimal JSON-Schema subset):
     - `type`
     - `required`
     - `properties`
     - `items`

4. **Output**
   - JSON-lines report per record:
     - `ok`
     - `repaired`
     - `actions`
     - `errors`
     - `data` (when valid)
   - Optional data-only output for successful records.
   - Non-zero exit code when `--fail-on-error` is set and any record fails.

## Tech stack decision

**Python (stdlib-only)**:
- Fast to ship for CLI utilities.
- No package installation friction.
- Easy deployment in CI and containers.
- Enough regex/string tooling for deterministic repair heuristics.

## Data model / schema

### Input record
```json
{
  "line": "raw model output line"
}
```

### Output record
```json
{
  "index": 1,
  "ok": true,
  "repaired": true,
  "actions": ["stripped_markdown_fence", "removed_trailing_commas"],
  "errors": [],
  "data": {"name": "Front Door Lock", "domain": "lock"}
}
```

## CLI contract

```text
argfix [--input INPUT] [--output OUTPUT] [--schema SCHEMA]
       [--data-only] [--fail-on-error]
```

### Flags
- `--input`: path to newline-delimited input file (default: stdin)
- `--output`: output file path (default: stdout)
- `--schema`: optional JSON schema path
- `--data-only`: emit only repaired valid JSON objects (one per line)
- `--fail-on-error`: exit with code 1 if any record fails parse/validation

## Non-goals (for MVP)

- No model API integration
- No streaming parser state machine
- No full JSON Schema spec coverage
- No GUI
