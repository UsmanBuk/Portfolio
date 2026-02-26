# AGENTS.md

## Cursor Cloud specific instructions

This is a zero-build static HTML/CSS/JS portfolio site. There is no package manager, no build step, and no dependencies to install.

### Running the dev server

Serve files with any static HTTP server. A local server is **required** because the chatbot uses `fetch()` to load `assets/js/chatbot-context.json`, which fails over the `file://` protocol.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

### Lint / Test / Build

- **No linter, test framework, or build system** is configured for this repo.
- Validate HTML manually in-browser; there are no automated checks to run.

### Chatbot

The chatbot operates in local/mock mode by default (`apiKey` is `null`). It reads structured data from `assets/js/chatbot-context.json` and returns keyword-matched responses — no external API key is needed.

### Key files

See `CLAUDE.md` for the full file map and architecture notes.
