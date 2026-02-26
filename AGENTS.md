# AGENTS.md

## Cursor Cloud specific instructions

This is a zero-build static portfolio site (HTML/CSS/vanilla JS). No package manager, no build step, no framework dependencies.

### Running the dev server

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. See `CLAUDE.md` for alternative server commands.

### Linting

There is no project-level linter config. Use `htmlhint` (globally installed) for HTML validation and `node -c <file>` for JS syntax checks:

```bash
htmlhint index.html schedule.html case-studies/*.html
node -c assets/js/script.js
python3 -c "import json; json.load(open('assets/js/chatbot-context.json'))"
```

### Key caveats

- The chatbot uses `assets/js/chatbot-context.json` as its knowledge base — no external API keys are needed for the chatbot to function locally.
- All content is hardcoded in HTML files; there is no database or CMS.
- Google Fonts (Poppins) is loaded from CDN; the site degrades gracefully without network access.
