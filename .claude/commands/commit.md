# Git Commit

Create a conventional commit for staged changes.

## Process

1. Check `git status` to see what's staged and unstaged
2. If nothing is staged, suggest files to stage based on recent changes
3. Run `git diff --cached` to analyze staged changes
4. Check recent commits with `git log -5 --oneline` for message style reference

## Commit Message Format

Follow the repository's established patterns:
- "Add [feature] to [location]"
- "Update [item] in [section]"
- "Remove [item] from [section]"
- "Improve [item] [aspect]"
- "Fix [issue] in [location]"

## Guidelines

- Keep messages concise (max 72 characters for subject line)
- Focus on the "what" and "why", not "how"
- Use imperative mood (Add, Update, Fix - not Added, Updated, Fixed)
- If multiple files changed, summarize the overall change
- Don't commit files with secrets (.env, credentials, API keys)

## Output

1. Show what will be committed
2. Generate the commit message
3. Execute `git commit -m "message"`
4. Show `git status` after commit to confirm success

Add co-author line:
```
Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```
