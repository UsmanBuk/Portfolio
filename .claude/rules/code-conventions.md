# Code Conventions

Standards for HTML, CSS, and JavaScript in this portfolio.

## General Principles

- React 18 + Vite: `npm run build` must pass before committing. Deployment details are in `CLAUDE.md`.
- No extra frameworks or libraries without asking (no router, state library, CSS-in-JS or Tailwind)
- Progressive enhancement where practical; case-study pages stay static HTML
- Performance first: minimize requests, optimize assets

## HTML Standards

### Document Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title | Syed Usman Bukhari</title>
  <!-- Meta tags, then favicon, then stylesheets -->
</head>
<body>
  <main>
    <div class="main-content">
      <!-- Content -->
    </div>
  </main>
  <!-- Scripts at end of body -->
</body>
</html>
```

### Semantic Elements
- Use `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`
- One `<h1>` per page (the page title)
- Headings in order: h1 → h2 → h3 (no skipping)
- Use `<button>` for actions, `<a>` for navigation

### Attributes
- Always include `alt` on images (descriptive, not decorative)
- Use `loading="lazy"` on images below the fold
- Add `rel="noopener"` to external links with `target="_blank"`
- Use meaningful `id` and `class` names (BEM-ish)

### Formatting
- 2-space indentation
- Self-closing tags with space before slash: `<img />`
- Attributes in consistent order: id, class, other attributes, data-*

## CSS Standards

### Variable Usage
Always use CSS variables from `:root`:
```css
/* Good */
color: var(--white-1);
background: var(--eerie-black-1);

/* Bad */
color: #ffffff;
background: hsl(240, 2%, 13%);
```

### Selectors
- Prefer classes over element selectors
- Avoid deep nesting (max 3 levels)
- No ID selectors for styling
- Avoid `!important` unless overriding third-party

### Organization
```css
.component {
  /* Positioning */
  position: relative;

  /* Box model */
  display: flex;
  width: 100%;
  padding: 20px;

  /* Typography */
  font-size: var(--fs-5);
  color: var(--white-2);

  /* Visual */
  background: var(--eerie-black-1);
  border-radius: 8px;

  /* Animation */
  transition: var(--transition-1);
}
```

### Responsive Design
- Mobile-first approach
- Use existing breakpoints from style.css
- Test at: 320px, 768px, 1024px, 1200px

## JavaScript / React Standards

### Components
- Function components with hooks, one section per file in `src/components/`
- Keep content (experience, projects, courses) as arrays at the top of the component file
- Use React state and handlers (`onClick`, `onChange`), not `document.querySelector` or manual DOM mutation
- Keep the existing accessibility patterns: `inert` on hidden pages, `aria-*`, `useFocusTrap` for dialogs

### Error Handling
```javascript
// Only catch errors you can handle, and show the user a fallback
try {
  const response = await fetch('/api/chat', { ... })
} catch {
  setMessages((current) => [...current, { isError: true, text: "I can't reach the chatbot server right now." }])
}
```

### No Console in Production
Remove `console.log` before committing. Use proper error handling instead.

### Backend (`backend/`)
- FastAPI + Pydantic; config from environment variables, never hardcoded
- Never commit `.env` or keys; the OpenRouter key lives only in the Lambda environment
- Add or update tests in `backend/tests/` (mock the OpenAI client) when changing `main.py`

## File Organization

```
/
├── index.html, schedule.html   # Vite entry points
├── src/
│   ├── components/*.jsx        # Section components (content lives here)
│   ├── hooks/, legacy/
│   └── styles/style.css        # Main stylesheet (edit this, not assets/css/style.css)
├── case-studies/*.html         # Static case study pages
├── assets/
│   ├── images/, documents/     # Copied to dist/ at build
│   └── js/chatbot-context.json # Chatbot knowledge base (redeploy backend after edits)
├── backend/                    # FastAPI chatbot API + AWS deploy
└── amplify.yml                 # Amplify build spec
```

## Git Workflow

### Commit Message Format
- "Add [feature] to [location]"
- "Update [item] in [section]"
- "Remove [item] from [section]"
- "Fix [issue] in [location]"
- "Improve [item] [aspect]"

### Branch Naming
- `feature/description`
- `fix/description`
- `content/description`

### What to Commit
- Source files only
- No generated or cached files (`dist/`, `node_modules/`, `backend/build/`, `__pycache__`)
- No secrets or API keys

## Comments

Only add comments where necessary:
```javascript
// Good: explains why, not what
// Debounce to prevent API rate limiting
const debouncedSearch = debounce(search, 300);

// Bad: obvious from the code
// Set the width to 100%
element.style.width = '100%';
```
