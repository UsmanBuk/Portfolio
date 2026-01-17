# Component Patterns

## Case Study Structure

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
    <!-- Content -->
  </section>
</article>
```

## Metrics Grid

```html
<div class="case-study-metrics">
  <div class="case-study-metric">
    <div class="case-study-metric-label">[Label]</div>
    <div class="case-study-metric-value">[Value]</div>
  </div>
</div>
```

## Tech Stack

```html
<div class="case-study-stack">
  <div class="case-study-stack-group">
    <p class="case-study-stack-title">[Category]</p>
    <p class="case-study-stack-items">[Comma-separated techs]</p>
  </div>
</div>
```

## CTA Buttons

```html
<div class="case-study-cta-row">
  <a class="case-study-cta primary" href="mailto:usmanbukhari541@gmail.com">
    <ion-icon name="mail-outline"></ion-icon>
    Contact me
  </a>
  <a class="case-study-cta secondary" href="../assets/documents/UsmanCV.pdf" target="_blank" rel="noopener">
    <ion-icon name="download-outline"></ion-icon>
    Download CV
  </a>
</div>
```

## Image Conventions

- Location: `assets/images/`
- Always: `loading="lazy"` for below-fold images
- Always: descriptive `alt` text
- Prefer: SVG for diagrams
- Icons: Ionicons via `<ion-icon name="icon-name"></ion-icon>`
