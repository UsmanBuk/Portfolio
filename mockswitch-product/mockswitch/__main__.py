"""MockSwitch: scenario-aware local mock API server."""

from __future__ import annotations

import argparse
import json
import sys
import time
from dataclasses import dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse


SUPPORTED_METHODS = {"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"}


@dataclass(frozen=True)
class RouteKey:
    method: str
    path: str


def _fail(message: str) -> None:
    print(f"Error: {message}", file=sys.stderr)
    raise SystemExit(1)


def load_json(path: Path) -> dict[str, Any]:
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        _fail(f"could not read spec file '{path}': {exc}")

    try:
        payload = json.loads(text)
    except json.JSONDecodeError as exc:
        _fail(f"invalid JSON in '{path}': {exc}")

    if not isinstance(payload, dict):
        _fail("top-level spec must be a JSON object")
    return payload


def _validate_status(status: Any, context: str) -> None:
    if not isinstance(status, int) or not (100 <= status <= 599):
        _fail(f"{context}: status must be an integer between 100 and 599")


def _validate_delay(delay: Any, context: str) -> None:
    if delay is None:
        return
    if not isinstance(delay, int) or delay < 0:
        _fail(f"{context}: delay_ms must be a non-negative integer")


def _validate_response_shape(node: Any, context: str) -> None:
    if not isinstance(node, dict):
        _fail(f"{context}: response must be an object")
    status = node.get("status", 200)
    _validate_status(status, context)
    _validate_delay(node.get("delay_ms"), context)
    headers = node.get("headers", {})
    if not isinstance(headers, dict):
        _fail(f"{context}: headers must be an object")
    for key, value in headers.items():
        if not isinstance(key, str) or not isinstance(value, str):
            _fail(f"{context}: header keys and values must be strings")


def validate_spec(spec: dict[str, Any]) -> dict[RouteKey, dict[str, Any]]:
    global_headers = spec.get("global_headers", {})
    if not isinstance(global_headers, dict):
        _fail("global_headers must be an object")
    for key, value in global_headers.items():
        if not isinstance(key, str) or not isinstance(value, str):
            _fail("global_headers keys and values must be strings")

    routes = spec.get("routes")
    if not isinstance(routes, list) or not routes:
        _fail("routes must be a non-empty array")

    route_map: dict[RouteKey, dict[str, Any]] = {}
    for idx, route in enumerate(routes):
        context = f"routes[{idx}]"
        if not isinstance(route, dict):
            _fail(f"{context} must be an object")

        method = route.get("method")
        path = route.get("path")
        default = route.get("default")
        scenarios = route.get("scenarios", {})

        if not isinstance(method, str):
            _fail(f"{context}.method must be a string")
        method = method.upper()
        if method not in SUPPORTED_METHODS:
            _fail(f"{context}.method '{method}' is not supported")

        if not isinstance(path, str) or not path.startswith("/"):
            _fail(f"{context}.path must be a string starting with '/'")

        _validate_response_shape(default, f"{context}.default")
        if not isinstance(scenarios, dict):
            _fail(f"{context}.scenarios must be an object")

        for scenario_name, response in scenarios.items():
            if not isinstance(scenario_name, str) or not scenario_name:
                _fail(f"{context}.scenarios keys must be non-empty strings")
            _validate_response_shape(response, f"{context}.scenarios['{scenario_name}']")

        key = RouteKey(method=method, path=path)
        if key in route_map:
            _fail(f"duplicate route found: {method} {path}")

        route_map[key] = route

    return route_map


def _coerce_response_body(body: Any) -> tuple[bytes, str]:
    if body is None:
        return b"", "application/json"
    if isinstance(body, (dict, list, int, float, bool)):
        return json.dumps(body, ensure_ascii=False).encode("utf-8"), "application/json"
    if isinstance(body, str):
        return body.encode("utf-8"), "text/plain; charset=utf-8"
    _fail("response body must be JSON-serializable primitive, object, array, or string")
    return b"", "application/json"


class MockRequestHandler(BaseHTTPRequestHandler):
    route_map: dict[RouteKey, dict[str, Any]] = {}
    global_headers: dict[str, str] = {}

    def do_GET(self) -> None:  # noqa: N802
        self._serve()

    def do_POST(self) -> None:  # noqa: N802
        self._serve()

    def do_PUT(self) -> None:  # noqa: N802
        self._serve()

    def do_PATCH(self) -> None:  # noqa: N802
        self._serve()

    def do_DELETE(self) -> None:  # noqa: N802
        self._serve()

    def do_OPTIONS(self) -> None:  # noqa: N802
        self._serve()

    def do_HEAD(self) -> None:  # noqa: N802
        self._serve(head_only=True)

    def log_message(self, fmt: str, *args: Any) -> None:
        print(f"{self.log_date_time_string()} - {fmt % args}")

    def _serve(self, head_only: bool = False) -> None:
        parsed = urlparse(self.path)
        method = self.command.upper()
        key = RouteKey(method=method, path=parsed.path)
        route = self.route_map.get(key)
        if route is None:
            payload = {
                "error": "route_not_found",
                "message": f"No route configured for {method} {parsed.path}",
                "available_routes": [f"{k.method} {k.path}" for k in sorted(self.route_map, key=lambda x: (x.path, x.method))],
            }
            self._write_json(404, payload, scenario="n/a", head_only=head_only)
            return

        query = parse_qs(parsed.query)
        query_scenario = query.get("__scenario", [None])[0]
        header_scenario = self.headers.get("X-Mock-Scenario")
        scenario = query_scenario or header_scenario

        response_obj: dict[str, Any]
        if scenario:
            scenarios = route.get("scenarios", {})
            if scenario not in scenarios:
                payload = {
                    "error": "unknown_scenario",
                    "message": f"Scenario '{scenario}' does not exist for {method} {parsed.path}",
                    "available_scenarios": sorted(scenarios.keys()),
                }
                self._write_json(400, payload, scenario=scenario, head_only=head_only)
                return
            response_obj = scenarios[scenario]
        else:
            scenario = "default"
            response_obj = route["default"]

        delay_ms = response_obj.get("delay_ms", 0)
        if delay_ms:
            time.sleep(delay_ms / 1000)

        status = response_obj.get("status", 200)
        custom_headers = response_obj.get("headers", {})
        body = response_obj.get("body")

        payload, default_content_type = _coerce_response_body(body)
        headers = dict(self.global_headers)
        headers.update(custom_headers)
        headers.setdefault("Content-Type", default_content_type)
        headers["Content-Length"] = str(len(payload))

        self.send_response(status)
        for key_name, value in headers.items():
            self.send_header(key_name, value)
        self.end_headers()

        if not head_only:
            self.wfile.write(payload)

        print(f"{method} {parsed.path} scenario={scenario} status={status}")

    def _write_json(self, status: int, payload: dict[str, Any], scenario: str, head_only: bool) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        headers = dict(self.global_headers)
        headers["Content-Type"] = "application/json"
        headers["Content-Length"] = str(len(data))

        self.send_response(status)
        for key_name, value in headers.items():
            self.send_header(key_name, value)
        self.end_headers()
        if not head_only:
            self.wfile.write(data)
        parsed = urlparse(self.path)
        print(f"{self.command} {parsed.path} scenario={scenario} status={status}")


def cmd_validate(spec_path: Path) -> int:
    spec = load_json(spec_path)
    validate_spec(spec)
    print(f"Spec is valid: {spec_path}")
    return 0


def cmd_routes(spec_path: Path) -> int:
    spec = load_json(spec_path)
    route_map = validate_spec(spec)
    print("Configured routes:")
    for key in sorted(route_map, key=lambda k: (k.path, k.method)):
        route = route_map[key]
        scenario_names = sorted(route.get("scenarios", {}).keys())
        scenario_label = ", ".join(scenario_names) if scenario_names else "-"
        print(f"- {key.method:7} {key.path:30} scenarios: {scenario_label}")
    return 0


def cmd_serve(spec_path: Path, host: str, port: int) -> int:
    spec = load_json(spec_path)
    route_map = validate_spec(spec)

    MockRequestHandler.route_map = route_map
    MockRequestHandler.global_headers = spec.get("global_headers", {})

    server = ThreadingHTTPServer((host, port), MockRequestHandler)
    print(f"MockSwitch serving on http://{host}:{port}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
    finally:
        server.server_close()
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="mockswitch",
        description="Serve scenario-aware mock APIs from a single JSON file.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    for command in ("validate", "routes", "serve"):
        p = sub.add_parser(command)
        p.add_argument("--spec", required=True, type=Path, help="Path to spec JSON file")
        if command == "serve":
            p.add_argument("--host", default="127.0.0.1", help="Host to bind (default: 127.0.0.1)")
            p.add_argument("--port", type=int, default=8080, help="Port to bind (default: 8080)")

    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "validate":
        return cmd_validate(args.spec)
    if args.command == "routes":
        return cmd_routes(args.spec)
    if args.command == "serve":
        if not (1 <= args.port <= 65535):
            _fail("--port must be between 1 and 65535")
        return cmd_serve(args.spec, args.host, args.port)

    _fail(f"unknown command: {args.command}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
