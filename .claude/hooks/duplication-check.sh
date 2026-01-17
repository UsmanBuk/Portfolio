#!/bin/bash
# Duplication Prevention Hook
# Spawns a separate Claude instance to review changes for duplicate code

TOOL_INPUT="$1"

# Only check edits to JS or CSS files (adapt paths as needed)
if ! echo "$TOOL_INPUT" | grep -qE 'assets/js/script\.js|assets/css/style\.css'; then
  exit 0
fi

# Extract the file path from tool input
FILE_PATH=$(echo "$TOOL_INPUT" | grep -oE '"file_path":\s*"[^"]+"' | sed 's/"file_path":\s*"//' | sed 's/"$//')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Check if claude CLI is available
if ! command -v claude &> /dev/null; then
  echo "⚠️  Claude CLI not found - skipping duplication check"
  exit 0
fi

# Get the new content being written (for Write tool) or the change (for Edit tool)
NEW_STRING=$(echo "$TOOL_INPUT" | grep -oE '"new_string":\s*"[^"]*"' | head -1)

if [ -z "$NEW_STRING" ]; then
  # Might be a Write tool, check for content
  exit 0  # Skip for full file writes, only check edits
fi

# Run Claude to check for duplicates
REVIEW_PROMPT="Review this code change for potential duplication.

File: $FILE_PATH
Change: $NEW_STRING

Check if similar functionality already exists in the codebase. Look for:
- Functions with similar names or purposes
- CSS classes that do the same thing
- Repeated patterns that could be consolidated

If you find duplicates, respond with:
DUPLICATE FOUND: [explanation of existing code to use instead]

If no duplicates, respond with:
OK

Be concise - one line only."

RESULT=$(echo "$REVIEW_PROMPT" | claude --print 2>/dev/null)

if echo "$RESULT" | grep -q "DUPLICATE FOUND"; then
  echo ""
  echo "⚠️  DUPLICATION WARNING"
  echo "$RESULT"
  echo ""
  echo "Consider using existing code instead of creating new."
  echo ""
fi

exit 0
