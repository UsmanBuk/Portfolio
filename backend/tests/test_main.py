from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

import main


def fake_completion(text):
    message = SimpleNamespace(content=text)
    return SimpleNamespace(choices=[SimpleNamespace(message=message)])


class FakeOpenAI:
    reply = "Usman is an AI engineer."

    def __init__(self, **kwargs):
        self.chat = SimpleNamespace(
            completions=SimpleNamespace(create=lambda **_: fake_completion(self.reply))
        )


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.setattr(main, "OpenAI", FakeOpenAI)
    main._request_log.clear()
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


def test_chat_rate_limits_per_ip(client):
    for _ in range(main.RATE_LIMIT_REQUESTS):
        assert client.post("/api/chat", json={"message": "hi"}).status_code == 200
    response = client.post("/api/chat", json={"message": "hi"})
    assert response.status_code == 429
    assert "Retry-After" in response.headers


def test_chat_without_key_returns_503(client, monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY")
    assert client.post("/api/chat", json={"message": "hi"}).status_code == 503
