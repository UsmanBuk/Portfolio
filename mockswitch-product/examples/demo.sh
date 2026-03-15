#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SPEC_PATH="$ROOT_DIR/examples/mock-api.json"
HOST="127.0.0.1"
PORT="8091"

python3 -m mockswitch serve --spec "$SPEC_PATH" --host "$HOST" --port "$PORT" > /tmp/mockswitch-demo.log 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

sleep 1

echo "== Default orders response =="
curl -s "http://$HOST:$PORT/orders"
echo
echo

echo "== Error scenario (query param) =="
curl -s "http://$HOST:$PORT/orders?__scenario=error"
echo
echo

echo "== Slow scenario (header) =="
curl -s -H "X-Mock-Scenario: slow" "http://$HOST:$PORT/orders"
echo
echo

echo "== Unknown route =="
curl -s "http://$HOST:$PORT/unknown"
echo
