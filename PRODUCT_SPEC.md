# PRODUCT_SPEC.md

## Product Name
**LLM JSON Guard**

## One-line pitch
A tiny Python CLI that repairs malformed LLM JSON responses and optionally validates them against a JSON Schema before they break your pipeline.

## MVP Scope (ruthlessly minimal)

1. **Input handling**
   - Accept input from file path or stdin.
   - Accept optional JSON Schema file path.

2. **LLM-aware extraction + repair**
   - Extract JSON from markdown fences or mixed text.
   - Apply common repairs:
     - normalize smart quotes,
     - remove comments,
     - remove trailing commas,
     - quote unquoted keys,
     - append missing closing brackets/braces.

3. **Parsing strategy**
   - Multi-stage parse attempts using `json.loads`.
   - Fallback to `ast.literal_eval` for Python-like dict/list output.

4. **Validation**
   - Optional JSON Schema validation using `jsonschema`.
   - Configurable fail-on-schema behavior.

5. **Output**
   - Write repaired JSON to stdout or output file.
   - Write an optional repair report (what transformations were applied).
   - Non-zero exit codes for parse failure and schema failure.

## Out of scope (for MVP)

- No hosted API.
- No UI.
- No network calls.
- No semantic auto-correction beyond syntax/structure repair.
- No automatic schema inference.

## Tech stack decision

- **Language:** Python 3.10+
  Reason: fast to ship a robust CLI, excellent stdlib text parsing, and broad adoption in AI automation stacks.
- **Dependency:** `jsonschema`
  Reason: reliable standards-based schema validation without building custom validators.

## Data model

### Internal result object

```text
RepairResult
- parsed: Any | None
- normalized_text: str
- steps_applied: list[str]
- parse_error: str | None
- schema_errors: list[str]
```

## CLI contract

```text
Usage:
  python3 llm_json_guard.py [input_file] [--schema schema.json]
                            [--output out.json] [--report report.txt]
                            [--compact] [--fail-on-schema]

Arguments:
  input_file         Optional file path (defaults to stdin)
  --schema           Optional JSON Schema path
  --output           Optional output file for repaired JSON (defaults to stdout)
  --report           Optional report file listing repair steps and validation status
  --compact          Output minified JSON instead of pretty-printed
  --fail-on-schema   Exit non-zero when schema validation fails

Exit codes:
  0 success
  2 parse failure
  3 schema validation failure (when --fail-on-schema is set)
```

## ASCII flow wireframe

```text
raw LLM output
      |
      v
[extract candidate JSON]
      |
      v
[repair pipeline]
  - normalize quotes
  - strip fences/comments
  - fix commas/keys/brackets
      |
      v
[parse attempts]
  json.loads -> fallbacks -> ast.literal_eval
      |
      +---- fail --> exit 2 + diagnostics
      |
      v
[optional schema validation]
      |
      +---- fail + --fail-on-schema --> exit 3
      |
      v
write JSON + report
```
