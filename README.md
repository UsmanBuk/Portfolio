# Syed Usman Bukhari

Personal portfolio for **Syed Usman Bukhari**, Founder / AI Engineer. He builds [VacancyBot](https://vacancybot.co.uk) and runs Bukhari Consulting. The site is a React 18 + Vite single-page app. AWS Amplify deploys `main` to [www.usmanbukhari.co.uk](https://www.usmanbukhari.co.uk).

## What he does

- **VacancyBot** — an AI assistant that prepares and submits job applications, starting with Reed. The user reviews every application before it is sent. The code is private; the site links to vacancybot.co.uk only.
- **Bukhari Consulting** — AI training for companies.
- **Contracts** — open to AI engineering contracts and team training. Based in Coventry, UK. BPSS screened, DBS checked.

Recent contract work, newest first: Rolls-Royce & Partners Finance (July 2026 – September 2026), Hudson & Hayes (January 2026 – Present), Ardonagh Specialty (February 2026 – April 2026), and NHS South Yorkshire ICB (May 2025 – February 2026, past).

## Stack

- **Frontend**: React 18, Vite, plain CSS
- **Current engineering work**: Python, FastAPI, Postgres, React/TypeScript, Azure OpenAI, Azure OpenAI Realtime, Azure Communication Services, Document Intelligence, Azure AI Foundry
- **Chatbot API**: FastAPI on AWS Lambda, answers only from `assets/js/chatbot-context.json`

## Run locally

Node.js 20+ and npm. Python 3.12 is only needed for the chatbot API.

```bash
git clone https://github.com/UsmanBuk/Portfolio.git
cd Portfolio
npm ci
npm run dev        # http://localhost:5175, proxies /api to 127.0.0.1:8000
```

```bash
npm run build      # production build into dist/
npm run preview    # serve the build locally
```

The chat window needs the API on port 8000. See [`backend/README.md`](backend/README.md).

## Tests

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every pull request and on every push to `main`.

From the repo root, on Node 20:

```bash
npm ci
npm test           # Vitest
npm run build
npm run test:e2e   # Playwright against npm run preview (builds first unless CI is set)
```

From `backend/`, on Python 3.12:

```bash
pip install -r requirements.txt -r requirements-dev.txt
python -m pytest -q tests
```

## Project structure

```
Portfolio/
├── index.html, schedule.html   # Vite entry points
├── src/
│   ├── App.jsx                 # Tab switching and routing
│   ├── components/             # One component per section (content lives here)
│   ├── legacy/                 # GitHub tab (raw HTML)
│   └── styles/                 # style.css, enhancements.css, schedule.css
├── assets/                     # Images, CV PDF, chatbot-context.json
├── case-studies/               # Static case study pages
├── backend/                    # FastAPI chatbot API, AWS template, deploy script
└── amplify.yml                 # AWS Amplify build spec
```

Edit section copy in `src/components/` (for example `Resume.jsx` and `Portfolio.jsx`). When experience, skills, or projects change, update `assets/js/chatbot-context.json` as well. That file is bundled into the Lambda, so committing it does not update the live chatbot until `backend/deploy.sh` is run.

The CV download points at `assets/documents/UsmanCV.pdf`.

## Contact

- **Email**: usmanbukhari541@gmail.com
- **Phone**: +44 7462 660889
- **Location**: Coventry, UK
- **GitHub**: https://github.com/UsmanBuk
- **LinkedIn**: https://www.linkedin.com/in/syed-usman-bukhari-aideveloper
- **VacancyBot**: https://vacancybot.co.uk

## Deployment

- **Website**: AWS Amplify Hosting (eu-west-2) builds `main` with `amplify.yml`. Merging to `main` is a production release at https://www.usmanbukhari.co.uk.
- **Chatbot API**: FastAPI on AWS Lambda behind API Gateway, deployed with `backend/deploy.sh`. Amplify proxies `/api/*` to it.

Full runbook (preview branches, rollback, access): see `CLAUDE.md` → Deployment.
