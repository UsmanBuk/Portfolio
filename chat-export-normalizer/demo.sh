#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

rm -rf output output-generic

echo "== Running OpenAI sample conversion =="
python3 chatnorm.py convert \
  --input examples/openai_conversations_sample.json \
  --output output \
  --source auto

echo
echo "== Running generic sample conversion =="
python3 chatnorm.py convert \
  --input examples/generic_chat_sample.json \
  --output output-generic \
  --source auto

echo
echo "== Generated files =="
rg --files output output-generic | sort
