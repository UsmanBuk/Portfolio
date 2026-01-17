# Pull Request

Create a pull request with a comprehensive description.

## Process

1. Check current branch with `git branch --show-current`
2. Verify remote tracking with `git status -sb`
3. Get all commits since diverging from main: `git log main..HEAD --oneline`
4. Get full diff against main: `git diff main...HEAD --stat`
5. Push branch if not already pushed: `git push -u origin <branch>`

## PR Template

```markdown
## Summary
<1-3 bullet points describing what this PR does>

## Changes
<List of key changes, grouped by category if needed>

## Testing
- [ ] Tested locally with `python -m http.server`
- [ ] Verified on mobile viewport
- [ ] Checked for console errors
- [ ] Validated HTML structure

## Notes
<Any additional context, screenshots, or considerations>

---
Generated with [Claude Code](https://claude.com/claude-code)
```

## Guidelines

- Title should be concise and descriptive (max 72 characters)
- Summary should explain the "why" not just the "what"
- Link any related issues with "Fixes #123" or "Relates to #456"
- For portfolio changes, note which sections are affected

## Output

1. Show branch comparison summary
2. Create PR using `gh pr create` with proper title and body
3. Return the PR URL
