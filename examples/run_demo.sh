#!/usr/bin/env bash

set -euo pipefail

python3 -m envsentry examples/sample-app \
  --env-file .env.example \
  --env-file .env.local \
  --env-file .env.production

