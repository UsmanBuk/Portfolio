# Branch Catchup

Review all changes on the current branch since diverging from main.

## Process

1. Show current branch: `git branch --show-current`
2. Find merge-base with main: `git merge-base main HEAD`
3. List all commits: `git log main..HEAD --oneline --no-decorate`
4. Show files changed: `git diff main...HEAD --stat`
5. For each changed file, provide a brief summary of what changed

## Output Format

```
## Branch: feature/your-branch-name
Commits ahead of main: X

### Commits
- abc1234 Add new feature
- def5678 Fix bug in component
- ...

### Files Changed (N files)
| File | Changes |
|------|---------|
| index.html | Added new project card |
| style.css | New case study styles |

### Summary
<2-3 sentence summary of the overall changes and their purpose>

### Ready to merge?
- [ ] All changes are intentional
- [ ] No debug code or console.logs
- [ ] Meta tags updated if needed
- [ ] Tested locally
```

## Guidelines

- Focus on what changed and why, not how
- Highlight any breaking changes or areas needing attention
- Note if there are merge conflicts with main
- Identify any files that might need review
