# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Syed Usman Bukhari: a React + Vite vCard-style site with an AI chatbot backed by a small FastAPI service on AWS Lambda. Migrated from a single static `index.html` in October 2026 (PR #137 by Thomas, shipped via #138).

## Development

```bash
npm ci
npm run dev          # Vite on http://localhost:5175, proxies /api to 127.0.0.1:8000
npm run build        # outputs dist/
npm run preview      # serve the built dist/
```

Chatbot backend locally (optional; without it the chat shows a "can't reach the server" message):
```bash
cd backend
python -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                       # put the OpenRouter key in .env (never commit it)
uvicorn main:app --reload --port 8000
```

Backend tests: `cd backend && python -m pytest -q tests`. Python here is system-managed, so use a venv or run inside `python:3.12-slim` in Docker.

## Architecture

### Key Files

| File | Purpose |
|------|---------|
| `index.html`, `schedule.html` | Vite entry points: meta tags, EmailJS init, `<div id="root">` |
| `src/App.jsx` | Page switching (tabs) and `/schedule.html` routing |
| `src/components/*.jsx` | One component per section. Content lives here, e.g. `Resume.jsx` holds the experience/education arrays |
| `src/legacy/pages.html` | GitHub tab, still raw HTML injected by `LegacyPages.jsx` |
| `src/styles/style.css` | Main stylesheet (plus `enhancements.css`, `schedule.css`) |
| `assets/` | Static files (images, CV PDFs, `chatbot-context.json`), copied into `dist/` by `vite.config.js` |
| `case-studies/*.html` | Standalone static pages, copied into `dist/` as-is |
| `backend/main.py` | FastAPI chatbot API (`POST /api/chat`, `GET /health`), Lambda handler via Mangum |
| `backend/template.yaml`, `backend/deploy.sh` | AWS infrastructure and deploy script for the API |
| `amplify.yml` | Amplify build spec (`npm ci && npm run build`, serves `dist/`) |

### Gotchas

- **Edit `src/styles/style.css`, not `assets/css/style.css`.** The build copies the `src` version over `assets/css/style.css` in `dist/` so case studies get the same styles. The copy in `assets/` is stale.
- `assets/js/script.js` is no longer loaded by anything (legacy from the static site).
- The chatbot answers **only** from `assets/js/chatbot-context.json`. When experience, skills or projects change in `src/components/`, update that JSON too and **redeploy the backend** (see below), because the JSON is bundled into the Lambda package. Committing it alone does not update the live chatbot.

### Design Decisions

- **CSS variables for theming**: dark theme (smoky-black/eerie-black) with gold accents
- **Comments only on complex code**: don't add comments to self-explanatory code
- **No secrets in the frontend**: the OpenRouter key lives only in the Lambda environment

## Deployment

Everything runs in AWS account `471112763146`, region `eu-west-2`.

### Frontend: AWS Amplify Hosting

- App `Portfolio` (`dk6u1l8emyz73`) auto-builds the `main` branch from GitHub using `amplify.yml`. **Merging or pushing to `main` deploys to production** (www.usmanbukhari.co.uk). A build takes about 2 minutes.
- The apex `usmanbukhari.co.uk` redirects to `www` with a 302 (Amplify rewrite rule).
- Amplify rewrite rule `/api/<*>` → `https://eapbd1lged.execute-api.eu-west-2.amazonaws.com/api/<*>` (status 200 proxy), so the browser calls the chatbot API on the site's own origin. Rule order matters: it must stay above the SPA `/<*>` → `/index.html` (404-200) rule.
- **Preview before production**: `aws amplify create-branch --app-id dk6u1l8emyz73 --branch-name <branch> --stage DEVELOPMENT --enable-auto-build`, then `aws amplify start-job ... --job-type RELEASE`. The preview URL is `https://<branch with / replaced by ->.dk6u1l8emyz73.amplifyapp.com`. Delete the Amplify branch when done.
- **Watch a build**: `aws amplify list-jobs --app-id dk6u1l8emyz73 --branch-name main --max-items 1`
- **Rollback**: in the Amplify console, redeploy the previous successful job on `main`, or `git revert` the merge and push.

### Chatbot API: Lambda + API Gateway (CloudFormation stack `portfolio-chatbot`)

- `backend/template.yaml`: Lambda (Python 3.12, arm64) behind an HTTP API throttled to 2 req/s (burst 5). There is also a best-effort per-IP limit in the app (8 per minute).
- Deploy (needs Docker and the AWS CLI; builds dependencies in the Lambda arm64 image):
  ```bash
  AWS_PROFILE=portfolio backend/deploy.sh                      # code or chatbot-context.json changes; keeps the deployed key
  OPENAI_API_KEY=$(tr -d '[:space:]' < ~/.config/portfolio/openrouter.key) AWS_PROFILE=portfolio backend/deploy.sh   # key rotation
  ```
- Smoke test after deploying: `curl https://www.usmanbukhari.co.uk/api/chat -X POST -H 'content-type: application/json' -d '{"message":"What is Usman currently working on?"}'`
- LLM: OpenRouter (`OPENAI_BASE_URL=https://openrouter.ai/api/v1`), model `google/gemini-2.5-flash-lite` (template parameters). The key has a $50 credit limit set in OpenRouter.
- Logs: CloudWatch log group `/aws/lambda/<function name>` (30-day retention).

### Access on this machine

- **AWS CLI**: profile `portfolio`, signed in with `aws login`. If credentials have expired, ask Usman to run `! aws login --profile portfolio --region eu-west-2` (it opens a browser).
- **GitHub**: the active `gh` account (`usmanbukhari-web`) gets a 403 when pushing to `UsmanBuk/Portfolio`. Push and open PRs as `UsmanBuk` without switching the global account:
  ```bash
  git -c credential.helper= -c credential.helper='!f(){ echo username=UsmanBuk; echo "password=$(gh auth token -u UsmanBuk)"; }; f' push
  GH_TOKEN=$(gh auth token -u UsmanBuk) gh pr create ...
  ```

### Release checklist

1. `npm run build` succeeds, and backend tests pass if `backend/` changed.
2. Test on an Amplify preview branch for anything beyond copy changes: all tabs, `/schedule.html` (Cal.com embed), case study, CV PDFs, chatbot.
3. If `chatbot-context.json` or `backend/` changed, run `backend/deploy.sh` and smoke-test `/api/chat`.
4. Merge to `main`, wait for the Amplify job to show `SUCCEED`, then check www.usmanbukhari.co.uk.
