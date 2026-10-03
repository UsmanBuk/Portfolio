# Portfolio chatbot API

Small FastAPI service that answers questions about Syed Usman Bukhari using `assets/js/chatbot-context.json` and the OpenAI API.

## Setup

```powershell
cd backend
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

## Test

```bash
pip install -r requirements.txt pytest
python -m pytest -q tests
```

## Deploy

The API runs on AWS Lambda (arm64, Python 3.12) behind an API Gateway HTTP API in `eu-west-2`, defined in `template.yaml` (stack `portfolio-chatbot`). The Amplify app proxies `/api/<*>` to it with a rewrite rule, so the browser calls the API on the site's own domain and no CORS setup is needed.

```bash
OPENAI_API_KEY=sk-or-v1-... ./deploy.sh   # first deploy or key rotation
./deploy.sh                               # code/context changes; keeps the deployed key
```

Requires Docker and the AWS CLI. Redeploy after editing `assets/js/chatbot-context.json`, because the context is bundled into the Lambda package.

Abuse protection: API Gateway throttles to 2 requests/sec (burst 5), the app limits 8 questions per IP per minute (best effort, per Lambda instance), and the OpenRouter key should have a monthly credit limit.
