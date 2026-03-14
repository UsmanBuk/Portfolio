#!/usr/bin/env bash
set -euo pipefail

python3 -m argfix \
  --input examples/broken_tool_calls.ndjson \
  --schema examples/tool_call_schema.json
