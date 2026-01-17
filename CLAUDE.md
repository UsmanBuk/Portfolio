# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Syed Usman Bukhari - a static HTML/CSS/JavaScript vCard-style site with an AI-powered chatbot feature. No build system, frameworks, or dependencies required.

## Development

**Run locally** (any of these):
```bash
python -m http.server 8000
npx http-server -p 8000
php -S localhost:8000
```

Then open `http://localhost:8000`.

## Architecture

### Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main portfolio page (all sections, inline critical CSS) |
| `assets/css/style.css` | Global styles, animations, responsive breakpoints |
| `assets/js/script.js` | DOM interactions (modals, filtering, form validation) |
| `assets/js/chatbot-context.json` | AI chatbot knowledge base - update this for chatbot content changes |
| `case-studies/*.html` | Individual project deep-dives |

### Design Decisions

- **Zero-build static site**: All content is hardcoded HTML, no database or CMS
- **Vanilla JS only**: ~143 lines of JavaScript for interactivity (modals, filtering, validation)
- **CSS variables for theming**: Dark theme (smoky-black/eerie-black) with gold accents
- **Progressive enhancement**: Content accessible without JavaScript
- **Monolithic HTML**: Single index.html contains all portfolio sections in vCard format
- **Comments only on complex code**: Don't add comments to self-explanatory code

### Chatbot System

The chatbot uses `chatbot-context.json` as its knowledge base with structured data about:
- Professional experience and roles
- Technical skills by category
- Education and certifications
- Project details

To update chatbot responses, modify this JSON file directly.

## Deployment

Ready for deployment to GitHub Pages, Netlify, or Vercel without any build configuration.
