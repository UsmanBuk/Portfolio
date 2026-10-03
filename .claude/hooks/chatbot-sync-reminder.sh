#!/bin/bash
# Remind to keep the chatbot knowledge base in sync and live after content edits

TOOL_INPUT="$1"

if echo "$TOOL_INPUT" | grep -q 'chatbot-context\.json'; then
  echo ""
  echo "🚀 REMINDER: chatbot-context.json is bundled into the Lambda."
  echo "   Run AWS_PROFILE=portfolio backend/deploy.sh to update the live chatbot."
  echo ""
elif echo "$TOOL_INPUT" | grep -qE 'src/components/|src/legacy/|case-studies/'; then
  echo ""
  echo "📝 REMINDER: If you updated experience, skills, or projects,"
  echo "   also update assets/js/chatbot-context.json and redeploy the backend."
  echo ""
fi

exit 0
