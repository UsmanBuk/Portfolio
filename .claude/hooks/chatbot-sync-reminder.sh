#!/bin/bash
# Remind to update chatbot-context.json after editing portfolio content

TOOL_INPUT="$1"

# Check if editing index.html or case studies (where experience/skills/projects live)
if echo "$TOOL_INPUT" | grep -qE 'index\.html|case-studies/'; then
  echo ""
  echo "📝 REMINDER: If you updated experience, skills, or projects,"
  echo "   also update assets/js/chatbot-context.json to keep the chatbot in sync."
  echo ""
fi

exit 0
