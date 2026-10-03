#!/usr/bin/env bash
# Builds the Lambda package in a Lambda-compatible container and deploys the stack.
# Usage: OPENAI_API_KEY=... ./deploy.sh   (omit the key to keep the deployed one)
set -euo pipefail
cd "$(dirname "$0")"

STACK=portfolio-chatbot
REGION=${AWS_REGION:-eu-west-2}
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
BUCKET=portfolio-chatbot-artifacts-$ACCOUNT-$REGION

rm -rf build && mkdir build
docker run --rm --platform linux/arm64 -u "$(id -u):$(id -g)" -v "$PWD":/src -w /src \
  --entrypoint pip public.ecr.aws/lambda/python:3.12-arm64 \
  install -q -r requirements.txt -t build --no-cache-dir
cp main.py build/
cp ../assets/js/chatbot-context.json build/

aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null || \
  aws s3 mb "s3://$BUCKET" --region "$REGION"

aws cloudformation package --template-file template.yaml --s3-bucket "$BUCKET" \
  --output-template-file build/packaged.yaml --region "$REGION" >/dev/null

KEY_OVERRIDE=()
if [[ -n "${OPENAI_API_KEY:-}" ]]; then
  KEY_OVERRIDE=(--parameter-overrides "OpenAIApiKey=$OPENAI_API_KEY")
fi

aws cloudformation deploy --template-file build/packaged.yaml --stack-name "$STACK" \
  --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND --region "$REGION" \
  --no-fail-on-empty-changeset "${KEY_OVERRIDE[@]}"

aws cloudformation describe-stacks --stack-name "$STACK" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" --output text
