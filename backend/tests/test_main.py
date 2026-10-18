import json
from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

import main


def fake_completion(text):
    message = SimpleNamespace(content=text)
    return SimpleNamespace(choices=[SimpleNamespace(message=message)])


class FakeOpenAI:
    reply = "Usman is an AI engineer."
    last_create_kwargs = None
    error = None

    def __init__(self, **kwargs):
        def create(**create_kwargs):
            if FakeOpenAI.error is not None:
                raise FakeOpenAI.error
            FakeOpenAI.last_create_kwargs = create_kwargs
            return fake_completion(self.reply)

        self.chat = SimpleNamespace(completions=SimpleNamespace(create=create))


FRIENDLY_MODEL_ERROR = (
    "I could not generate a reply just now. Please try again in a moment."
)


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.setattr(main, "OpenAI", FakeOpenAI)
    main._request_log.clear()
    FakeOpenAI.last_create_kwargs = None
    FakeOpenAI.error = None
    FakeOpenAI.reply = "Usman is an AI engineer."
    return TestClient(main.app)


def test_chat_returns_reply(client):
    response = client.post("/api/chat", json={"message": "What does Usman do?"})
    assert response.status_code == 200
    assert response.json() == {"reply": "Usman is an AI engineer."}


def test_chat_truncates_long_reply(client, monkeypatch):
    monkeypatch.setattr(FakeOpenAI, "reply", "word " * 400)
    reply = client.post("/api/chat", json={"message": "hi"}).json()["reply"]
    assert len(reply) <= main.MAX_REPLY_CHARS
    assert reply.endswith("…")


def test_chat_rejects_overlong_question(client):
    response = client.post("/api/chat", json={"message": "x" * 501})
    assert response.status_code == 422


@pytest.mark.parametrize(
    "payload",
    [
        {"message": ""},
        {},
        {"message": 12},
    ],
)
def test_chat_rejects_invalid_message(client, payload):
    assert client.post("/api/chat", json=payload).status_code == 422


def test_chat_rejects_invalid_json(client):
    response = client.post(
        "/api/chat",
        content="not-json",
        headers={"content-type": "application/json"},
    )
    assert response.status_code == 422


def test_chat_rate_limits_per_ip(client):
    for _ in range(main.RATE_LIMIT_REQUESTS):
        assert client.post("/api/chat", json={"message": "hi"}).status_code == 200
    response = client.post("/api/chat", json={"message": "hi"})
    assert response.status_code == 429
    assert "Retry-After" in response.headers


def test_chat_without_key_returns_503(client, monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY")
    assert client.post("/api/chat", json={"message": "hi"}).status_code == 503


def test_chat_strips_whitespace_before_sending_to_model(client):
    padded = "  What does Usman do?  "
    assert client.post("/api/chat", json={"message": padded}).status_code == 200
    user_message = FakeOpenAI.last_create_kwargs["messages"][1]
    assert user_message["role"] == "user"
    assert user_message["content"] == padded.strip()


def test_system_prompt_includes_knowledge_base(client):
    assert client.post("/api/chat", json={"message": "hi"}).status_code == 200
    system_message = FakeOpenAI.last_create_kwargs["messages"][0]
    assert system_message["role"] == "system"
    assert json.dumps(main.PORTFOLIO_CONTEXT) in system_message["content"]


def test_health_returns_ok(client):
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["openaiConfigured"] is True


def test_health_reports_missing_key(client, monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY")
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["openaiConfigured"] is False


@pytest.mark.parametrize("error", [TimeoutError("timed out"), RuntimeError("upstream failed")])
def test_chat_returns_friendly_error_when_model_fails(client, monkeypatch, error):
    monkeypatch.setattr(FakeOpenAI, "error", error)
    response = client.post("/api/chat", json={"message": "hi"})
    assert response.status_code == 502
    assert response.json()["detail"] == FRIENDLY_MODEL_ERROR
    assert "Traceback" not in response.text
    assert type(error).__name__ not in response.text


@pytest.mark.parametrize("reply", ["", None])
def test_chat_returns_friendly_error_when_reply_blank(client, monkeypatch, reply):
    monkeypatch.setattr(FakeOpenAI, "reply", reply)
    response = client.post("/api/chat", json={"message": "hi"})
    assert response.status_code == 502
    assert response.json()["detail"] == FRIENDLY_MODEL_ERROR


def test_chat_allows_requests_after_rate_limit_window(client, monkeypatch):
    clock = {"now": 1_000_000.0}
    monkeypatch.setattr(main, "time", lambda: clock["now"])

    for _ in range(main.RATE_LIMIT_REQUESTS):
        assert client.post("/api/chat", json={"message": "hi"}).status_code == 200

    blocked = client.post("/api/chat", json={"message": "hi"})
    assert blocked.status_code == 429
    assert blocked.headers["Retry-After"].isdigit()

    clock["now"] += main.RATE_LIMIT_WINDOW_SECONDS + 1
    assert client.post("/api/chat", json={"message": "hi"}).status_code == 200


def test_chat_rate_limit_uses_first_forwarded_ip(client):
    first_client = {"x-forwarded-for": "1.1.1.1, 9.9.9.9"}
    other_client = {"x-forwarded-for": "2.2.2.2, 9.9.9.9"}

    for _ in range(main.RATE_LIMIT_REQUESTS):
        assert (
            client.post("/api/chat", json={"message": "hi"}, headers=first_client).status_code
            == 200
        )

    assert (
        client.post("/api/chat", json={"message": "hi"}, headers=first_client).status_code
        == 429
    )
    assert (
        client.post("/api/chat", json={"message": "hi"}, headers=other_client).status_code
        == 200
    )


def test_cors_allows_known_origin(client):
    origin = "http://localhost:5175"
    response = client.get("/health", headers={"Origin": origin})
    assert response.headers.get("access-control-allow-origin") == origin


def test_cors_rejects_unknown_origin(client):
    response = client.get("/health", headers={"Origin": "https://evil.example"})
    assert "access-control-allow-origin" not in response.headers


def test_chatbot_context_has_required_sections():
    with main.CONTEXT_PATH.open(encoding="utf-8") as context_file:
        context = json.load(context_file)

    assert context["experience"]
    assert context["projects"]
    assert context["technicalSkills"]
    assert context["personalInfo"]["email"]

       