import json
import os
from collections import defaultdict, deque
from pathlib import Path
from time import time

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")

CONTEXT_PATH = ROOT.parent / "assets" / "js" / "chatbot-context.json"

with CONTEXT_PATH.open(encoding="utf-8") as context_file:
    PORTFOLIO_CONTEXT = json.load(context_file)

MAX_QUESTION_CHARS = 500
MAX_REPLY_CHARS = 800
MAX_COMPLETION_TOKENS = 250
RATE_LIMIT_REQUESTS = 8
RATE_LIMIT_WINDOW_SECONDS = 60

SYSTEM_PROMPT = """You are the portfolio assistant for Syed Usman Bukhari.
Answer only from the JSON knowledge base below.
If the answer is not in the knowledge base, say you do not have that information
and suggest emailing usmanbukhari541@gmail.com or using the contact form.
Keep replies concise (under 120 words). Do not invent employers, dates, or metrics.

Knowledge base:
"""

app = FastAPI(title="Portfolio Chatbot API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175", "http://127.0.0.1:5175"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

_request_log = defaultdict(deque)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=MAX_QUESTION_CHARS)


class ChatResponse(BaseModel):
    reply: str


def client_id(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def enforce_rate_limit(request: Request) -> None:
    key = client_id(request)
    now = time()
    window = _request_log[key]
    while window and now - window[0] > RATE_LIMIT_WINDOW_SECONDS:
        window.popleft()
    if len(window) >= RATE_LIMIT_REQUESTS:
        retry_after = max(1, int(RATE_LIMIT_WINDOW_SECONDS - (now - window[0])) + 1)
        raise HTTPException(
            status_code=429,
            detail=f"Too many questions. Please wait {retry_after} seconds and try again.",
            headers={"Retry-After": str(retry_after)},
        )
    window.append(now)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "contextLoaded": True,
        "openaiConfigured": bool(os.getenv("OPENAI_API_KEY")),
        "maxQuestionChars": MAX_QUESTION_CHARS,
        "rateLimit": {
            "requests": RATE_LIMIT_REQUESTS,
            "windowSeconds": RATE_LIMIT_WINDOW_SECONDS,
        },
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, request: Request):
    enforce_rate_limit(request)

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="The chatbot is not configured yet. Please use the contact form or email usmanbukhari541@gmail.com.",
        )

    client_options = {"api_key": api_key}
    base_url = os.getenv("OPENAI_BASE_URL")
    if base_url:
        client_options["base_url"] = base_url
        client_options["default_headers"] = {
            "HTTP-Referer": "http://localhost:5175",
            "X-Title": "Usman Bukhari Portfolio",
        }

    client = OpenAI(**client_options)
    try:
        completion = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "google/gemini-2.5-flash-lite"),
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT + json.dumps(PORTFOLIO_CONTEXT),
                },
                {"role": "user", "content": payload.message.strip()},
            ],
            max_tokens=MAX_COMPLETION_TOKENS,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="I could not generate a reply just now. Please try again in a moment.",
        ) from exc

    reply = (completion.choices[0].message.content or "").strip()
    if not reply:
        raise HTTPException(
            status_code=502,
            detail="I could not generate a reply just now. Please try again in a moment.",
        )

    if len(reply) > MAX_REPLY_CHARS:
        reply = reply[: MAX_REPLY_CHARS - 1].rsplit(" ", 1)[0] + "…"

    return ChatResponse(reply=reply)
