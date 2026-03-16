#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SAMPLE_DIR="${ROOT_DIR}/envguard/examples/sample_project"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "${WORK_DIR}"' EXIT

cp "${SAMPLE_DIR}/app.py" "${WORK_DIR}/app.py"
cp "${SAMPLE_DIR}/service.js" "${WORK_DIR}/service.js"
cp "${SAMPLE_DIR}/.env" "${WORK_DIR}/.env"
cp "${SAMPLE_DIR}/.env.example" "${WORK_DIR}/.env.example"

echo "1) Running initial check (expected failure because .env.example is incomplete)..."
if python3 -m envguard check --project "${WORK_DIR}" --env-file "${WORK_DIR}/.env" --example-file "${WORK_DIR}/.env.example"; then
  echo "Unexpected pass on initial check."
else
  echo "Initial check failed as expected."
fi

echo
echo "2) Syncing missing keys into .env.example..."
python3 -m envguard sync --project "${WORK_DIR}" --example-file "${WORK_DIR}/.env.example"

echo
echo "3) Running check again (expected pass)..."
python3 -m envguard check --project "${WORK_DIR}" --env-file "${WORK_DIR}/.env" --example-file "${WORK_DIR}/.env.example"

echo
echo "Demo complete."

