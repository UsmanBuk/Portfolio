# ArgFix

ArgFix is a tiny CLI for repairing malformed LLM tool-call JSON and validating it against a schema.

## Who it's for

- Engineers building LLM agents/tool-calling workflows
- Teams with flaky JSON payloads in logs, webhooks, or queue records
- Anyone who wants a lightweight repair layer in Unix pipelines

## Install

No third-party dependencies are required.

```bash
python3 -m argfix --help
```

## Usage

### 1) Repair records from file

```bash
python3 -m argfix --input examples/broken_tool_calls.ndjson
```

### 2) Repair + validate with schema

```bash
python3 -m argfix \
  --input examples/broken_tool_calls.ndjson \
  --schema examples/tool_call_schema.json \
  --fail-on-error
```

### 3) Emit only valid repaired JSON payloads

```bash
python3 -m argfix \
  --input examples/broken_tool_calls.ndjson \
  --data-only
```

## Example output (report mode)

```json
{"index":1,"ok":true,"repaired":true,"actions":["stripped_markdown_fence","converted_single_quoted_keys","converted_single_quoted_values","removed_trailing_commas"],"errors":[],"data":{"name":"Front Door Lock","domain":"lock"},"candidate":"{\"name\":\"Front Door Lock\",\"domain\":\"lock\"}"}
```

## Notes

- ArgFix uses deterministic heuristics, not model calls.
- Schema support is intentionally minimal (`type`, `required`, `properties`, `items`) for MVP speed and reliability.
