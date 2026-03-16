# PRODUCT_SPEC.md

## Product Name
**ChatNorm**

## One-line Pitch
Convert messy AI chat export JSON files into clean, Obsidian-ready Markdown notes with a single CLI command.

## Problem Being Solved
AI chat tools generate valuable knowledge, but exports are inconsistent and hard to reuse. Users lose time manually copying, reformatting, and organizing conversations before they become useful documentation.

## MVP Scope (Ruthlessly Minimal)
1. Parse JSON exports from:
   - OpenAI ChatGPT export shape (`conversations.json`-style mapping)
   - Generic chat JSON (`messages` arrays with role/content)
2. Normalize conversations into Markdown files:
   - One file per conversation
   - Preserved role order and code blocks
3. Generate an `index.md` file:
   - Conversation links
   - Message counts
   - Update timestamps
4. Safe defaults:
   - Works offline
   - No external dependencies
   - Clear errors for invalid JSON or unsupported format

## Non-Goals (for MVP)
- No web UI
- No cloud sync
- No direct scraping from live chat websites
- No attachment downloading

## Tech Stack Decision
- **Language:** Python 3.10+
- **Reasoning:**
  - Fastest path to useful CLI and JSON processing
  - Excellent standard library (`json`, `argparse`, `pathlib`, `datetime`)
  - Easy install and scriptability for technical users
- **Dependencies:** None (stdlib-only)

## Data Model

### Normalized Message
```json
{
  "role": "user|assistant|system|tool|unknown",
  "content": "string",
  "timestamp": "ISO-8601|null"
}
```

### Normalized Conversation
```json
{
  "title": "string",
  "source": "openai|generic",
  "updated_at": "ISO-8601|null",
  "messages": [ "NormalizedMessage", "..."]
}
```

## CLI Contract
```bash
python3 chatnorm.py convert \
  --input <path/to/export.json> \
  --output <output-directory> \
  [--source auto|openai|generic]
```

### CLI Behavior
- `--source auto` attempts format detection.
- Writes markdown files to output directory.
- Writes `index.md` summary file.
- Prints conversion summary to stdout.

## Output Wireframe (Markdown)
```text
---
title: Example conversation
source: openai
updated_at: 2026-03-16T00:00:00Z
message_count: 4
---

# Example conversation

## User
How do I optimize this query?

## Assistant
Start by checking index selectivity...
```

## Success Criteria
- Command runs successfully on sample data.
- Produces readable Markdown files and `index.md`.
- Handles malformed input gracefully with non-zero exit code.
