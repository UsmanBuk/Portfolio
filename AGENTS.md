# AGENTS.md

Instructions for AI agents working with this portfolio codebase.

## Project Overview

Static HTML/CSS/JavaScript vCard-style portfolio website for Syed Usman Bukhari — AI Systems Architect specializing in Healthcare Technology. No build system, frameworks, or package managers. Zero dependencies.

## Development Environment

### Running Locally

```bash
python -m http.server 8000
# or
npx http-server -p 8000
# or
php -S localhost:8000
```

Open `http://localhost:8000` in a browser.

### Cursor Cloud specific instructions

Since this is a zero-build static site, there is no install or build step. To test changes:

1. Start a local server: `python -m http.server 8000 &`
2. Use the `computerUse` subagent to open `http://localhost:8000` in Chrome and verify changes visually.
3. For CSS/HTML changes, always take screenshots to confirm rendering.
4. For case study pages, navigate to `http://localhost:8000/case-studies/<filename>.html`.

No CI/CD pipeline exists — validation is done visually and via manual review.

## Architecture

### Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main portfolio page — all sections in one monolithic vCard layout |
| `schedule.html` | Consultation booking page |
| `assets/css/style.css` | Single stylesheet (~2785 lines) — CSS variables, animations, responsive breakpoints |
| `assets/js/script.js` | DOM interactions (~144 lines) — sidebar toggle, modals, filtering, form validation |
| `assets/js/chatbot-context.json` | AI chatbot knowledge base (structured JSON) |
| `case-studies/*.html` | Individual project deep-dive pages |

### Directory Structure

```
/
├── index.html
├── schedule.html
├── assets/
│   ├── css/style.css
│   ├── js/script.js
│   ├── js/chatbot-context.json
│   └── images/              # SVG icons, diagrams
├── case-studies/
│   └── nhs-south-yorkshire-rag.html
└── .claude/                  # Claude Code configuration (rules, skills, hooks)
```

### Design Decisions

- **Zero-build**: No bundlers, transpilers, or package managers. Deploy as-is to any static host.
- **Vanilla JS only**: No frameworks, no jQuery. Use `document.querySelector` and `addEventListener`.
- **CSS variables for theming**: Dark theme with gold accents — never hardcode color values.
- **Progressive enhancement**: All content accessible without JavaScript.
- **Single stylesheet**: All CSS lives in `assets/css/style.css`.

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

### JavaScript

- Vanilla JS only — no frameworks, no jQuery
- Use `document.querySelector` / `addEventListener` (not `.onclick`)
- Event delegation for dynamic content
- Wrap initialization in `DOMContentLoaded`
- Remove `console.log` before committing
- Only add comments to explain *why*, not *what*

### Git

- Commit messages: `Add/Update/Remove/Fix/Improve [thing] in [location]`
- Branch naming: `feature/`, `fix/`, `content/` prefixes
- Commit source files only — no generated or cached files

## Chatbot System

The AI chatbot uses `assets/js/chatbot-context.json` as its knowledge base. This JSON contains structured data about professional experience, skills, education, certifications, and projects.

**When updating portfolio content (experience, skills, projects), also update `chatbot-context.json`** to keep the chatbot responses in sync.

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

File naming: kebab-case, e.g., `client-name-project.html`. After creating a new case study, add a link in `index.html`'s project section.

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
- **JS**: No `console.log` left in, event listeners work, no framework imports
- **Content**: Chatbot JSON stays in sync with portfolio content
- **Visual**: Dark theme renders correctly, gold accent colors consistent, no layout breaks

### How to Test

1. Start a local server (`python -m http.server 8000`)
2. Open in browser and check all pages render correctly
3. Test responsive breakpoints by resizing
4. Click through all interactive elements (sidebar toggle, modals, project filters, contact form)
5. Verify case study pages load and link back to main portfolio

### Automated Checks

No test framework is configured. Validation is manual. Consider checking:

```bash
# Validate HTML (if html-validate is available)
npx html-validate index.html

# Check for broken links
rg 'href="[^"]*"' index.html --only-matching
```

## External Resources

- **Google Fonts**: Poppins (loaded via CDN in HTML head)
- **Ionicons**: Icon library (loaded via CDN script tags at end of body)
- **OpenAI API**: Powers the chatbot (no keys stored in repo)
