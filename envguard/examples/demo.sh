#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SAMPLE_DIR="${ROOT_DIR}/envguard/examples/sample_project"

echo "1) Running initial check (expected failure because .env.example is incomplete)..."
if python3 -m envguard check --project "${SAMPLE_DIR}" --env-file "${SAMPLE_DIR}/.env" --example-file "${SAMPLE_DIR}/.env.example"; then
  echo "Unexpected pass on initial check."
else
  echo "Initial check failed as expected."
fi

echo
echo "2) Syncing missing keys into .env.example..."
python3 -m envguard sync --project "${SAMPLE_DIR}" --example-file "${SAMPLE_DIR}/.env.example"

echo
echo "3) Running check again (expected pass)..."
python3 -m envguard check --project "${SAMPLE_DIR}" --env-file "${SAMPLE_DIR}/.env" --example-file "${SAMPLE_DIR}/.env.example"

echo
echo "Demo complete."

