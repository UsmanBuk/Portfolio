# Testing & CI Checklist

Goal: every pull request is automatically built and tested before it can be merged. Merging to `main` deploys straight to production through Amplify, so this is the safety net.

Do this as **three separate PRs, in order**. Each PR must pass `npm run build` and the backend tests before you ask for review.

## Ground Rules

- [ ] **Ask the owner before adding any new dependency** (Vitest, Testing Library, Playwright, ESLint, etc.). Say what it is and why you need it.
- [ ] No test calls a real external service: OpenRouter, EmailJS, Cal.com, or the live `/api/chat`. Mock them all.
- [ ] No API keys or secrets in tests, fixtures, or workflow files.
- [ ] Test behaviour a user would notice, not implementation details. No snapshot tests.
- [ ] Each test checks one thing and has a name that says what it checks.
- [ ] The full suite (frontend + backend) runs in under 2 minutes in CI.
- [ ] Do not change repo settings, branch protection, AWS, or Amplify settings. Ask the owner.

## PR 1 — Continuous Integration (CI)

- [ ] Add `backend/requirements-dev.txt` with `pytest` (it is not in `requirements.txt` today).
- [ ] Add `.github/workflows/ci.yml` that runs on every pull request and on push to `main`.
- [ ] Frontend job: Node 20 (matches `amplify.yml`), `npm ci`, `npm run build`.
- [ ] Backend job: Python 3.12 (matches the Lambda), install `requirements.txt` + `requirements-dev.txt`, run `python -m pytest -q tests` from `backend/`.
- [ ] Cache npm and pip dependencies so the workflow is fast.
- [ ] Prove it works: open a throwaway PR that breaks the build, confirm the check goes red, then close it.
- [ ] Add a "Running tests" section to `README.md`.

**Done when:** a PR shows green checks for both jobs, and a broken PR shows a red check.

## PR 2 — Backend Tests (`backend/tests/`)

Existing tests cover: normal reply, reply truncation, overlong question, per-IP rate limit, missing key → 503. Keep those and add:

- [ ] `GET /health` returns `status: ok` and reports `openaiConfigured` correctly with and without a key.
- [ ] `POST /api/chat` with an empty message, missing `message` field, wrong type, or invalid JSON returns 422.
- [ ] Whitespace around the question is stripped before it is sent to the model.
- [ ] The system prompt sent to the model contains the knowledge base from `chatbot-context.json`.
- [ ] OpenRouter raising an error or timing out returns a friendly error, not a stack trace.
- [ ] The model returning an empty or `None` reply returns the friendly error.
- [ ] Rate limit: the 429 response includes a `Retry-After` header, and requests are allowed again after the window passes (mock the clock, don't `sleep`).
- [ ] Rate limit uses the first IP in `X-Forwarded-For`, so different clients don't share a limit.
- [ ] CORS: an allowed origin gets the CORS headers, and an unknown origin does not.
- [ ] `chatbot-context.json` is valid JSON and contains the sections the chatbot relies on (experience, skills, projects, contact).
- [ ] Reset the in-memory rate-limit log between tests so tests don't affect each other.

**Done when:** all of the above pass in CI, with the OpenAI client mocked everywhere.

## PR 3 — Frontend Tests

### Component tests (Vitest + React Testing Library, ask first)

- [ ] Add an `npm test` script.
- [ ] Navigation: clicking each navbar tab shows that page and hides the others (check `inert` / `aria` state).
- [ ] Portfolio: the category filter shows only matching projects; opening a project modal shows its details and closes with the button and with Escape.
- [ ] Chatbot: opening and closing; sending a message shows a loading state, then the reply (mock `fetch`).
- [ ] Chatbot: a server error, a 429, and a network failure each show a useful message, not a blank or crash.
- [ ] Chatbot: overlong input is blocked or trimmed to the backend limit (500 characters).
- [ ] Contact form: required-field validation, a success message on send, and an error message on failure (mock EmailJS).
- [ ] Dialogs keep focus inside while open (`useFocusTrap`) and return focus when closed.

### Smoke tests (Playwright against `npm run preview`, ask first)

- [ ] Every tab loads with no console errors.
- [ ] `/schedule.html` loads (don't test inside the Cal.com embed, just that the page renders).
- [ ] The case study page `/case-studies/nhs-south-yorkshire-rag.html` loads with styles applied.
- [ ] CV PDF links return 200.
- [ ] Chatbot sends a message and shows a reply, with `/api/chat` mocked via Playwright route interception.
- [ ] Run once at mobile width (375px) and once at desktop width (1280px).
- [ ] Add the frontend tests to the CI workflow from PR 1.

**Done when:** `npm test` and the Playwright suite pass locally and in CI.

## Handover

- [ ] `README.md` explains how to run each test suite locally and what CI checks.
- [ ] List anything you could not test, and why, in the final PR description.
- [ ] Tell the owner when CI is green on `main` so branch protection can be turned on.

Prioritise reliable tests over a high test count. A flaky test is worse than no test: if a test sometimes fails for no reason, fix it or remove it.
