#!/usr/bin/env bash

set -euo pipefail

python3 -m envsentry examples/sample-app \
  --env-file examples/sample-app/.env.example \
  --env-file examples/sample-app/.env.local \
  --env-file examples/sample-app/.env.production

