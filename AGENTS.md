# AGENTS.md

Instructions for AI agents working with this portfolio codebase.

## Project Overview

React + Vite vCard-style portfolio website for Syed Usman Bukhari, an AI Systems Architect specialising in Healthcare Technology. It includes an AI chatbot backed by a small FastAPI service on AWS Lambda.

**Build, deployment and AWS details are in `CLAUDE.md`, which is the source of truth.** Merging to `main` deploys to production through AWS Amplify.

## Development Environment

### Running Locally

```bash
npm ci
npm run dev        # http://localhost:5175, proxies /api to 127.0.0.1:8000
npm run build      # production build into dist/
```

To run the chatbot API locally, see `backend/README.md`. Backend tests: `cd backend && python -m pytest -q tests`.

### Cursor Cloud specific instructions

1. Start the dev server: `npm ci && npm run dev &`
2. Use the `computerUse` subagent to open `http://localhost:5175` in Chrome and verify changes visually.
3. For CSS/HTML changes, always take screenshots to confirm rendering.
4. For case study pages, navigate to `http://localhost:5175/case-studies/<filename>.html`.
5. Run `npm run build` before committing to catch build errors.

## Architecture

### Key Files

| File | Purpose |
|------|---------|
| `index.html`, `schedule.html` | Vite entry points (meta tags, `<div id="root">`) |
| `src/App.jsx` | Tab switching and `/schedule.html` routing |
| `src/components/*.jsx` | One component per section. Content lives here (e.g. `Resume.jsx`, `Portfolio.jsx`) |
| `src/legacy/pages.html` | GitHub tab, still raw HTML |
| `src/styles/style.css` | Main stylesheet. Edit this one, not `assets/css/style.css` (the build overwrites that) |
| `assets/js/chatbot-context.json` | AI chatbot knowledge base (structured JSON) |
| `case-studies/*.html` | Standalone static case study pages |
| `backend/` | FastAPI chatbot API, CloudFormation template, deploy script |
| `amplify.yml` | Amplify build spec |

### Directory Structure

```
/
├── index.html / schedule.html   # Vite entry points
├── src/
│   ├── App.jsx, main.jsx
│   ├── components/              # Section components
│   ├── hooks/                   # useFocusTrap
│   ├── legacy/                  # GitHub tab HTML
│   └── styles/                  # style.css, enhancements.css, schedule.css
├── assets/                      # Images, CV PDFs, chatbot-context.json (copied to dist/)
├── case-studies/
│   └── nhs-south-yorkshire-rag.html
├── backend/                     # FastAPI + Lambda (template.yaml, deploy.sh, tests/)
├── amplify.yml
└── .claude/                     # Claude Code configuration (rules, skills, hooks)
```

### Design Decisions

- **React 18 + Vite**: function components and hooks, no state library or router (`App.jsx` switches tabs).
- **CSS variables for theming**: dark theme with gold accents. Never hardcode color values.
- **Plain CSS**: no CSS-in-JS or Tailwind. Styles live in `src/styles/`.
- **No secrets in the frontend**: the LLM key lives only in the Lambda environment, and the browser calls `/api/chat` on the same origin.

## Code Conventions

### HTML

- 2-space indentation
- Semantic elements: `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`
- One `<h1>` per page; headings in order (h1 → h2 → h3, no skipping)
- Always include descriptive `alt` on images
- Use `loading="lazy"` on below-the-fold images
- Add `rel="noopener"` to external `target="_blank"` links
- Self-closing tags with space before slash: `<img />`

### CSS

- Always use CSS variables from `:root` — never hardcode colors or font sizes
- Property order: positioning → box model → typography → visual → animation
- Prefer classes over element selectors; avoid deep nesting (max 3 levels)
- No ID selectors for styling; avoid `!important`
- Mobile-first responsive approach using existing breakpoints (320px, 768px, 1024px, 1200px)

### CSS Variables (Design Tokens)

```css
/* Backgrounds */
--smoky-black: hsl(0, 0%, 7%);
--eerie-black-1: hsl(240, 2%, 13%);
--onyx: hsl(240, 1%, 17%);
--jet: hsl(0, 0%, 22%);

/* Text */
--white-1: hsl(0, 0%, 100%);
--white-2: hsl(0, 0%, 98%);
--light-gray: hsl(0, 0%, 84%);

/* Accent (gold) */
--orange-yellow-crayola: hsl(45, 100%, 72%);
--vegas-gold: hsl(45, 54%, 58%);

/* Typography */
--ff-poppins: 'Poppins', sans-serif;
--fs-1: 24px;   /* Titles */
--fs-2: 18px;   /* Section titles */
--fs-5: 15px;   /* Body */
--fs-6: 14px;   /* Small text */
```

### JavaScript / React

- Function components with hooks. Keep content arrays at the top of the component file (see `Resume.jsx`).
- Accessibility: keep the existing `inert`, `aria-*` and focus handling (`useFocusTrap`) patterns.
- Remove `console.log` before committing.
- Only add comments to explain *why*, not *what*.

### Git

- Commit messages: `Add/Update/Remove/Fix/Improve [thing] in [location]`
- Branch naming: `feature/`, `fix/`, `content/` prefixes
- Commit source files only — no generated or cached files

## Chatbot System

The chatbot (`src/components/Chatbot.jsx`) posts to `/api/chat`. The FastAPI backend (`backend/main.py`) answers **only** from `assets/js/chatbot-context.json`, using an OpenRouter model.

**When updating portfolio content (experience, skills, projects), also update `chatbot-context.json` and then redeploy the backend with `backend/deploy.sh`.** The JSON is bundled into the Lambda package, so committing it does not update the live chatbot. See `CLAUDE.md` → Deployment.

## Content & Positioning Guidelines

This portfolio targets premium positioning at £1,600–£2,000/day.

### Identity

- **Primary**: AI Systems Architect | Healthcare Technology
- **Secondary**: Enterprise RAG & LLM Specialist
- **Avoid**: "Full Stack Engineer", "Web Developer"

### Writing Style

- First person: "I architected..." not "The system was architected..."
- Action verbs: Architected, Designed, Led, Delivered
- Always include: team size, budget influenced, C-level engagement, quantified outcomes with £ values
- Translate technical metrics to business value (e.g., "40% downtime reduction" → "£X annual cost avoidance")
- Avoid weak verbs (helped, assisted, supported) and vague quantities (various, many, multiple)

## Case Studies

Case study pages live in `case-studies/` and follow a consistent structure:

1. **Impact metrics** — quantified outcomes with business value translation
2. **Problem** — framed as a business problem
3. **Solution** — technical approach with business justification
4. **Architecture** — high-level diagram or description
5. **Engineering highlights** — 4-5 bullets with action verbs + outcomes
6. **Tech stack** — grouped by category
7. **CTA** — contact link + CV download

File naming: kebab-case, e.g., `client-name-project.html`. After creating a new case study, link it from the relevant tab (search `src/` and `src/legacy/pages.html` for `case-studies/` to find existing links; the featured card is in `Sidebar.jsx`).

### Case Study HTML Pattern

```html
<article class="case-study active">
  <header class="case-study-header">
    <p class="case-study-breadcrumbs">
      <a href="../index.html" class="case-study-backlink">
        <ion-icon name="arrow-back-outline"></ion-icon> Back to portfolio
      </a>
    </p>
    <h2 class="h2 article-title">[Client Name]</h2>
    <p class="case-study-subtitle">[Project Type]</p>
    <div class="case-study-badges">[Technology badges]</div>
    <div class="case-study-callout">[Role description]</div>
  </header>
  <section class="case-study-section">
    <h3 class="h3 case-study-section-title">[Section Title]</h3>
    <!-- Content -->
  </section>
</article>
```

## Testing

### What to Validate

- **HTML**: Correct semantic structure, no broken links, images have `alt` text
- **CSS**: Uses CSS variables (no hardcoded colors), responsive at 320px/768px/1024px/1200px
- **Build**: `npm run build` succeeds, and backend tests pass if `backend/` changed
- **JS**: No `console.log` left in, no React warnings in the console
- **Content**: Chatbot JSON stays in sync with portfolio content
- **Visual**: Dark theme renders correctly, gold accent colors consistent, no layout breaks

### How to Test

1. Start the dev server (`npm run dev`) or build and preview (`npm run build && npm run preview`)
2. Open in browser and check all pages render correctly
3. Test responsive breakpoints by resizing
4. Click through all interactive elements (sidebar toggle, modals, project filters, contact form)
5. Verify case study pages load and link back to main portfolio

### Automated Checks

```bash
npm run build                                   # frontend must build
cd backend && python -m pytest -q tests         # backend tests (mocked LLM)
```

## External Resources

- **Google Fonts**: Poppins (loaded via CDN in HTML head)
- **Ionicons**: Icon library (loaded via CDN script tags at end of body)
- **OpenRouter** (OpenAI-compatible API): powers the chatbot from the Lambda backend; the key is never stored in the repo
- **EmailJS**: contact form
- **Cal.com**: consultation booking embed
