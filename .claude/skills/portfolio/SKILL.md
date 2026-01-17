# Portfolio Design System

This skill provides design tokens, component patterns, and conventions for the portfolio website.

## When to Apply

This skill auto-loads when working with:
- `index.html`
- `case-studies/*.html`
- `assets/css/style.css`
- `assets/js/script.js`

## Design Tokens

### Colors (from CSS variables)

```css
/* Dark theme backgrounds */
--smoky-black: hsl(0, 0%, 7%);        /* Page background */
--eerie-black-1: hsl(240, 2%, 13%);   /* Card backgrounds */
--eerie-black-2: hsl(240, 2%, 12%);   /* Alternate cards */
--onyx: hsl(240, 1%, 17%);            /* Borders, dividers */
--jet: hsl(0, 0%, 22%);               /* Secondary borders */

/* Text colors */
--white-1: hsl(0, 0%, 100%);          /* Headings */
--white-2: hsl(0, 0%, 98%);           /* Body text */
--light-gray: hsl(0, 0%, 84%);        /* Secondary text */
--light-gray-70: hsla(0, 0%, 84%, 0.7); /* Muted text */

/* Accent colors */
--orange-yellow-crayola: hsl(45, 100%, 72%);  /* Primary accent (gold) */
--vegas-gold: hsl(45, 54%, 58%);              /* Secondary accent */
--bittersweet-shimmer: hsl(0, 43%, 51%);      /* Error/warning */

/* Gradients */
--bg-gradient-onyx       /* Card background gradient */
--bg-gradient-jet        /* Subtle background */
--bg-gradient-yellow-1   /* Accent decorations */
--text-gradient-yellow   /* Highlighted text */
```

### Typography

```css
--ff-poppins: 'Poppins', sans-serif;  /* Only font family */

/* Font sizes */
--fs-1: 24px;  /* Page titles */
--fs-2: 18px;  /* Section titles */
--fs-3: 17px;  /* Subtitles */
--fs-4: 16px;  /* Body large */
--fs-5: 15px;  /* Body default */
--fs-6: 14px;  /* Body small */
--fs-7: 13px;  /* Captions */
--fs-8: 11px;  /* Labels */

/* Font weights */
--fw-300: 300;  /* Light */
--fw-400: 400;  /* Regular */
--fw-500: 500;  /* Medium */
--fw-600: 600;  /* Semibold */
```

### Shadows & Effects

```css
--shadow-1: -4px 8px 24px hsla(0, 0%, 0%, 0.25);
--shadow-2: 0 16px 30px hsla(0, 0%, 0%, 0.25);
--shadow-3: 0 16px 40px hsla(0, 0%, 0%, 0.25);
--shadow-4: 0 25px 50px hsla(0, 0%, 0%, 0.15);
--shadow-5: 0 24px 80px hsla(0, 0%, 0%, 0.25);

--transition-1: 0.25s ease;
--transition-2: 0.5s ease-in-out;
```

## Component Patterns

### Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Page Title] | Syed Usman Bukhari</title>
  <meta name="description" content="[150-160 char description]" />
  <link rel="shortcut icon" href="assets/images/logo.ico" type="image/x-icon" />
  <link rel="stylesheet" href="assets/css/style.css" />
  <!-- Google Fonts loaded via preconnect -->
</head>
<body>
  <main>
    <div class="main-content">
      <!-- Content here -->
    </div>
  </main>
  <!-- Ionicons at end of body -->
</body>
</html>
```

### Case Study Structure

```html
<article class="case-study active">
  <header class="case-study-header">
    <p class="case-study-breadcrumbs">
      <a href="../index.html" class="case-study-backlink">
        <ion-icon name="arrow-back-outline"></ion-icon>
        Back to portfolio
      </a>
    </p>
    <h2 class="h2 article-title">[Client Name]</h2>
    <p class="case-study-subtitle">[Project Type]</p>
    <div class="case-study-badges">[Technology badges]</div>
    <div class="case-study-callout">[Role description]</div>
  </header>

  <section class="case-study-section">
    <h3 class="h3 case-study-section-title">[Section Title]</h3>
    <!-- Section content -->
  </section>
</article>
```

### Metrics Grid

```html
<div class="case-study-metrics">
  <div class="case-study-metric">
    <div class="case-study-metric-label">[Label]</div>
    <div class="case-study-metric-value">[Value]</div>
  </div>
</div>
```

### Tech Stack Display

```html
<div class="case-study-stack">
  <div class="case-study-stack-group">
    <p class="case-study-stack-title">[Category]</p>
    <p class="case-study-stack-items">[Comma-separated technologies]</p>
  </div>
</div>
```

### CTA Buttons

```html
<div class="case-study-cta-row">
  <a class="case-study-cta primary" href="mailto:email@example.com">
    <ion-icon name="mail-outline"></ion-icon>
    Contact me
  </a>
  <a class="case-study-cta secondary" href="path/to/file.pdf" target="_blank" rel="noopener">
    <ion-icon name="download-outline"></ion-icon>
    Download CV
  </a>
</div>
```

## File Conventions

### Images
- Location: `assets/images/`
- Always use `loading="lazy"` for images below the fold
- Provide descriptive `alt` text
- Prefer SVG for diagrams and icons
- Optimize images before committing (< 500KB)

### Links
- Internal: relative paths (`../index.html`, `case-studies/file.html`)
- External: always include `rel="noopener"` with `target="_blank"`
- Email: use `mailto:` prefix

### Icons
- Use Ionicons library (loaded from CDN)
- Format: `<ion-icon name="icon-name"></ion-icon>`
- Common icons: `arrow-back-outline`, `mail-outline`, `download-outline`, `logo-github`, `logo-linkedin`

## JavaScript Patterns

Vanilla JS only. No frameworks or libraries.

```javascript
// Event delegation pattern
document.querySelector('.parent').addEventListener('click', (e) => {
  if (e.target.matches('.child')) {
    // Handle click
  }
});

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize
});
```

## CSS Conventions

- Use CSS variables for all colors and common values
- Mobile-first responsive design
- Use existing class naming patterns
- Avoid `!important` unless overriding third-party styles
- Group related properties together
