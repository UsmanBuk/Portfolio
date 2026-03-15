# PRODUCT_SPEC: MockSwitch

## Product name
**MockSwitch**

## One-line pitch
Run scenario-aware mock APIs from a single JSON file in under 10 seconds.

## MVP scope (ruthlessly minimal)

### Goals
- Serve local HTTP mock endpoints for frontend/integration testing.
- Support per-route scenario switching without editing code.
- Provide simple CLI commands to validate and inspect specs.

### Non-goals (for MVP)
- No GUI.
- No persistent database.
- No OpenAPI import/export.
- No auth system.
- No cloud hosting.

## Tech stack decision

- **Language:** Python 3.11+  
  Reasoning: ships with batteries-included HTTP server, argparse, JSON parsing, and strong portability with zero external dependencies.
- **Runtime dependencies:** none (stdlib only).
- **Packaging:** lightweight module with `python3 -m mockswitch`.

## Data model / spec schema

MockSwitch consumes one JSON file:

```json
{
  "global_headers": {
    "X-Powered-By": "MockSwitch"
  },
  "routes": [
    {
      "method": "GET",
      "path": "/health",
      "default": {
        "status": 200,
        "headers": {"Content-Type": "application/json"},
        "body": {"ok": true}
      },
      "scenarios": {
        "slow": {
          "delay_ms": 1200,
          "status": 200,
          "body": {"ok": true, "mode": "slow"}
        },
        "error": {
          "status": 500,
          "body": {"error": "simulated failure"}
        }
      }
    }
  ]
}
```

### Scenario selection priority
1. Query parameter `__scenario=<name>`
2. Header `X-Mock-Scenario: <name>`
3. Fallback to `default`

## CLI contract

```bash
python3 -m mockswitch validate --spec example/mock-api.json
python3 -m mockswitch routes --spec example/mock-api.json
python3 -m mockswitch serve --spec example/mock-api.json --host 127.0.0.1 --port 8080
```

### Command behavior
- `validate`: schema and route sanity checks; non-zero exit code on invalid spec.
- `routes`: print method/path and available scenarios.
- `serve`: start HTTP server and return JSON responses with optional delay.

## Error handling requirements
- Clear user-facing errors for:
  - missing/invalid JSON spec
  - duplicate method+path entries
  - invalid HTTP status codes
  - unknown scenario names
- HTTP errors:
  - `404` for unknown route
  - `400` for unknown scenario requested on a known route

## Useful output requirement
- Request logs include method, path, chosen scenario, and status code.
- `404` payload includes available routes to reduce developer friction.

## Success criteria
- Works end-to-end locally with no dependencies.
- Under ~500 lines of implementation code.
- Demonstrates scenario switching in provided demo spec and README examples.
