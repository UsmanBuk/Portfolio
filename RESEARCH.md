# RESEARCH.md

## Market Gap Chosen

### Problem statement

LLM builders repeatedly hit the same operational pain: **before an API call, they cannot reliably answer “Will this prompt/tool payload fit the context window, and how much will it cost?”** in a repo/CI workflow.

Below is quoted evidence from public sources:

1. **Reddit (r/SaaS)**  
   > "Experimenting with a middleware to compress LLM prompts and cut API costs by ~30%. Is this a real pain point?"  
   Source: https://www.reddit.com/r/SaaS/comments/1rh62n2/experimenting_with_a_middleware_to_compress_llm.json

2. **Reddit (r/ClaudeAI, relevant AI-dev workflow)**  
   > "How do you guys keep token consumption down in Claude code"  
   Source: https://www.reddit.com/r/ClaudeAI/comments/1r6buxo/how_do_you_guys_keep_token_consumption_down_in/

3. **GitHub Issue (LangChain)**  
   > "I have defined about 50+ tools with detailed description. So the prompt to GPT is likely over 4096 tokens within 4 loops."  
   Source: https://github.com/langchain-ai/langchain/issues/4217

4. **GitHub Issue (openai-python)**  
   > "It would be useful if the module provided a function to calculate number of token in a given prompt for a given model..."  
   Source: https://github.com/openai/openai-python/issues/412

5. **GitHub Issue (tiktoken)**  
   > "Token count discrepancy between tiktoken and API response when messages contain tool calls"  
   Source: https://github.com/openai/tiktoken/issues/474

6. **Ask HN (AI cost tracking pain)**  
   > "I built https://tokencost.is to solve a recurring headache: manually scraping dozens of provider pages just to estimate API spend for my agentic workflows."  
   Source: https://news.ycombinator.com/item?id=47110844

7. **Indie Hackers (founder pain)**  
   > "AI cost tracking tools didn't even exist until recently, so most of us are just winging it with spreadsheets or hoping for the best."  
   Source: https://www.indiehackers.com/post/how-are-you-tracking-your-ai-costs-after-vibecoding-everything-d135f5b374

8. **Product Hunt launch signal (token-cost product)**  
   > "AgentReady | Product Hunt launch dashboard (116 upvotes | 23 comments)"  
   > "TokenCut compresses text before it hits GPT-4, Claude, or any LLM — same meaning, fewer tokens, lower bill."  
   Source: https://hunted.space/dashboard/agentready-2

### Target user persona

- **Primary**: Solo developers and small AI product teams shipping agent/chat features.
- **Workflow**: Prompt templates + tool schemas in repo, pushed through CI/CD.
- **Pain**:
  - Context overflows happen late (runtime errors in production).
  - Token cost is hard to estimate before deployment.
  - Browser token counters are disconnected from codebase files and thresholds.

## Existing alternatives (and why they fall short)

1. **Web token calculators** (e.g., Prompt Token Counter / TokenCount-like tools)  
   - Good for one-off text checks.
   - Fall short for repo-level automation: no multi-file scan, no threshold gating, no CI exit codes.

2. **Platform-specific dashboards** (e.g., LangSmith usage views)  
   - Helpful after requests are made.
   - Fall short for preflight prevention; teams need failure **before** expensive/broken API calls.

3. **General cost trackers** (e.g., tokencost.is class tools)  
   - Good for price lookup.
   - Fall short on prompt+tool payload analysis per file/workflow in local dev and pull requests.

## Why this solution is better/different

Proposed product is a **local-first CLI preflight guardrail** that:

- scans real prompt/tool files in a repository;
- estimates model-specific token usage and cost in one command;
- enforces hard budgets (`max tokens`, `max cost`) with CI-friendly non-zero exits;
- highlights top offenders so teams can trim the right files first.

In short: **move from reactive “post-spend analytics” to proactive “pre-send prevention.”**

## Estimated demand signal

- **GitHub issue volume** (search API snapshots):
  - `"prompt is too long" llm is:issue` → **148** issues
  - `"token count" "tool call" is:issue` → **2,174** issues
  - `"context window" "exceed" is:issue` → **6,564** issues
- **HN activity**:
  - "Show HN: Token price calculator for 400+ LLMs" → **268 points / 76 comments**  
    https://news.ycombinator.com/item?id=40710154
  - "Ask HN: What developer tool do you wish existed in 2026?" → **22 points / 24 comments**  
    https://news.ycombinator.com/item?id=46345827
- **Product Hunt adjacent launch signal**:
  - AgentReady token-compression positioning with **116 upvotes / 23 comments**  
    https://hunted.space/dashboard/agentready-2

Conclusion: demand is not speculative; this is an active, repeated operational pain in shipping LLM products.
