# Code Conventions

Standards for HTML, CSS, and JavaScript in this portfolio.

## General Principles

- Zero-build static site: no bundlers, no transpilers
- Vanilla JS only: no frameworks, no jQuery
- Progressive enhancement: content accessible without JS
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

## JavaScript Standards

### No Frameworks
```javascript
// Good
document.querySelector('.element');
element.addEventListener('click', handler);

// Bad
$('.element');
element.onclick = handler;
```

### Event Handling
```javascript
// Use event delegation for dynamic content
document.querySelector('.parent').addEventListener('click', (e) => {
  if (e.target.matches('.child')) {
    // Handle
  }
});

// Use named functions for complex handlers
function handleSubmit(event) {
  event.preventDefault();
  // ...
}
form.addEventListener('submit', handleSubmit);
```

### DOM Ready
```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Initialize
});
```

### Error Handling
```javascript
// Only catch errors you can handle
try {
  const data = JSON.parse(input);
} catch (e) {
  console.error('Invalid JSON:', e.message);
  // Provide fallback or show error
}
```

### No Console in Production
Remove `console.log` before committing. Use proper error handling instead.

## File Organization

```
/
├── index.html              # Main portfolio page
├── case-studies/           # Individual case study pages
│   └── *.html
├── assets/
│   ├── css/
│   │   └── style.css       # Single stylesheet
│   ├── js/
│   │   ├── script.js       # Main interactions
│   │   └── chatbot-context.json
│   ├── images/             # All images
│   └── documents/          # PDFs, etc.
└── .claude/                # Claude Code configuration
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
- No generated or cached files
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
