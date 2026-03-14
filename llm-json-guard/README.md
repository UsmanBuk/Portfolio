# LLM JSON Guard

LLM JSON Guard is a tiny Python CLI that repairs malformed JSON produced by LLMs and optionally validates the repaired output against a JSON Schema.

## Who it's for

- AI/product engineers wiring LLM output into automations
- Backend engineers who need predictable JSON before downstream processing
- Teams currently relying on retries and ad-hoc parsing fixes

## What it does

- Extracts JSON from mixed text (including markdown code fences)
- Repairs common breakages:
  - smart quotes
  - trailing commas
  - unquoted object keys
  - JavaScript-style comments
  - missing closing braces/brackets
- Falls back to parsing Python-style dict/list literals when needed
- Optionally validates against a JSON Schema (`jsonschema`)
- Emits a repair report for debugging and auditability

## Install

```bash
cd llm-json-guard
python3 -m pip install -r requirements.txt
```

## CLI usage

```bash
python3 llm_json_guard.py [input_file] \
  [--schema schema.json] \
  [--output out.json] \
  [--report report.txt] \
  [--compact] \
  [--fail-on-schema]
```

### Exit codes

- `0`: success
- `2`: JSON parse failure
- `3`: schema validation failure (only when `--fail-on-schema` is set)

## Example

Use the included sample:

```bash
python3 llm_json_guard.py \
  examples/broken_output.txt \
  --schema examples/schema.json \
  --output examples/fixed_output.json \
  --report examples/report.txt \
  --fail-on-schema
```

Or run the demo script:

```bash
python3 demo.py
```

## Library-style use (optional)

```python
from llm_json_guard import repair_json

raw = '```json\\n{name: "Ada", active: true,}\\n```'
result = repair_json(raw)
if result.parsed:
    print(result.parsed)
```

If you want this import style, copy `llm_json_guard.py` into your project and import from it directly.
