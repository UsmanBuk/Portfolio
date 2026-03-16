# ChatNorm

ChatNorm is a tiny CLI that converts AI chat export JSON into clean Markdown files plus an index, so you can drop conversations straight into Obsidian, docs repos, or personal knowledge bases.

## Who it's for
- Developers and founders who use ChatGPT/LLM chats as working notes
- Researchers who want local, portable archives
- Anyone tired of manually copy/pasting chat threads into Markdown

## Features
- Auto-detects input format (`openai` export shape or generic `messages` JSON)
- Preserves role order and code blocks
- Generates one Markdown file per conversation
- Builds `index.md` with links and message counts
- Runs locally with zero dependencies

## Installation
```bash
git clone <this-repo>
cd chat-export-normalizer
python3 --version
```

No packages are required for runtime.

## Usage
```bash
python3 chatnorm.py convert \
  --input examples/openai_conversations_sample.json \
  --output output \
  --source auto
```

### Explicit source
```bash
python3 chatnorm.py convert \
  --input examples/generic_chat_sample.json \
  --output output-generic \
  --source generic
```

## Example output
```text
Converted 2 conversations (7 messages) from openai.
Wrote 2 markdown files + index: /.../output/index.md
```

Generated files:
- `001-<conversation-title>.md`
- `002-<conversation-title>.md`
- `index.md`

## Demo script
Run:
```bash
./demo.sh
```

This converts sample data and prints the generated files.

## Limitations (MVP)
- Does not download remote attachments/images
- Does not scrape live browser sessions
- Optimized for exported JSON workflows
