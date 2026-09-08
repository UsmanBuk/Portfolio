# Portfolio chatbot API

Small FastAPI service that answers questions about Syed Usman Bukhari using `assets/js/chatbot-context.json` and the OpenAI API.

## Setup

```powershell
cd "FastAPI backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Ask the portfolio owner for `OPENAI_API_KEY` and put it in `.env`. This project uses an OpenAI-compatible key from OpenRouter (`sk-or-v1-...`), so keep `OPENAI_BASE_URL=https://openrouter.ai/api/v1`. Do not commit `.env`.

## Run

```powershell
uvicorn main:app --reload --port 8000
```

- `GET /health` — confirms the context file loaded and whether a key is present
- `POST /api/chat` — `{ "message": "What is Usman's current role?" }` returns `{ "reply": "..." }`
- Questions are limited to 500 characters; replies are capped at 800 characters
- Rate limit: 8 questions per IP per 60 seconds (`429` when exceeded)
