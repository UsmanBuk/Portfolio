# MockSwitch

MockSwitch is a tiny Python CLI for running local mock APIs with per-request scenario switching.

## Who it's for

- Frontend engineers waiting on backend APIs
- QA/integration developers testing success/error/latency paths
- Solo builders who want terminal-first, scriptable mocks without GUI setup

## Why it exists

Many mock API tools are either too heavy for quick local workflows or require custom middleware code for route-specific scenarios. MockSwitch keeps this minimal: one JSON file, one command, scenario switching via query/header.

## Features (MVP)

- Serve mock endpoints from one JSON spec
- Route-specific scenarios (`default`, `error`, `slow`, etc.)
- Scenario selection with:
  - query param: `__scenario=<name>`
  - header: `X-Mock-Scenario: <name>`
- Built-in validation and route listing commands
- Zero runtime dependencies (Python stdlib only)

## Installation

```bash
git clone <this-repository-url>
cd mockswitch-product
python3 -m mockswitch --help
```

No `pip install` step is required for the MVP.

## Usage

### 1) Validate your spec

```bash
python3 -m mockswitch validate --spec examples/mock-api.json
```

### 2) Inspect routes

```bash
python3 -m mockswitch routes --spec examples/mock-api.json
```

### 3) Start the server

```bash
python3 -m mockswitch serve --spec examples/mock-api.json --host 127.0.0.1 --port 8080
```

### 4) Call endpoints

Default response:

```bash
curl "http://127.0.0.1:8080/orders"
```

Scenario via query parameter:

```bash
curl "http://127.0.0.1:8080/orders?__scenario=error"
```

Scenario via header:

```bash
curl -H "X-Mock-Scenario: slow" "http://127.0.0.1:8080/orders"
```

## Spec format

See `examples/mock-api.json` for a complete working spec.

Top-level keys:

- `global_headers` (optional object of string headers)
- `routes` (required array)

Each route:

- `method` (GET/POST/PUT/PATCH/DELETE/OPTIONS/HEAD)
- `path` (e.g. `/orders`)
- `default` (response object)
- `scenarios` (optional object of named response objects)

Each response object:

- `status` (100-599, default `200`)
- `headers` (optional object)
- `delay_ms` (optional non-negative integer)
- `body` (JSON value or string)

## Demo script

Run:

```bash
bash examples/demo.sh
```

This starts MockSwitch, performs requests against default/error/slow scenarios, and prints outputs.
