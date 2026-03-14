# Market Research: LLM Tool-Call JSON Reliability Gap

## Problem statement (with evidence)

### Observed pain pattern
Developers are repeatedly blocked by malformed JSON in LLM tool-calling pipelines. The failure mode is not niche; it appears across IDE copilots, agent SDKs, local inference stacks, and community forums.

Evidence quotes:

1. **OpenAI Agents SDK issue**
   - Quote: `"Tool calls should not fail when there is an empty string in arguments: \"\" ... SyntaxError: Unexpected end of JSON input"`
   - URL: https://github.com/openai/openai-agents-js/issues/664

2. **VS Code / Copilot issue**
   - Quote: `"Request Failed: 400 {\"error\":{\"message\":\"Invalid JSON format in tool call arguments\",\"code\":\"invalid_tool_call_format\"}}"`
   - URL: https://github.com/microsoft/vscode/issues/280155

3. **llama.cpp issue**
   - Quote: `"arguments field in tool call responses contains invalid JSON with mixed single and double quotes"`
   - URL: https://github.com/ggml-org/llama.cpp/issues/20359

4. **Goose issue (local model users)**
   - Quote: `"they frequently emit malformed JSON when attempting tool calls ... Goose simply fails the tool call"`
   - URL: https://github.com/block/goose/issues/6688

5. **OpenClaw issue**
   - Quote: `"Error frequency: ~5-10% of tool calls"`
   - URL: https://github.com/openclaw/openclaw/issues/9916

6. **Ask HN demand framing**
   - Quote: `"only OpenAI has a robust structured output mode ... This is a pretty killer requirement for doing anything serious with LLM's"`
   - URL: https://news.ycombinator.com/item?id=42113985

7. **Show HN validation of the same pain**
   - Quote: `"If you're facing problems getting GPT to adhere to a schema (JSON, XML, etc.)"`
   - URL: https://news.ycombinator.com/item?id=36750083

8. **Reddit signal**
   - Quote (thread title): `"Anyone using 'JSON Patch' (RFC 6902) to fix only broken parts of LLM JSON outputs?"`
   - URL: https://www.reddit.com/r/LocalLLaMA/comments/1qafzs9/anyone_using_json_patch_rfc_6902_to_fix_only/

## Target user persona

- **Primary:** AI app engineers and automation builders shipping agent/tool-calling workflows.
- **Environment:** Python/TypeScript backends, local or hosted models, NDJSON logs, webhook pipelines.
- **Current pain:** They can handle retries and prompts, but malformed JSON still breaks deterministic pipelines and causes flaky production behavior.

## Existing alternatives (and why they fall short for this gap)

1. **json_repair** (https://github.com/mangiucugna/json_repair, 4,585 stars)
   - Strength: robust JSON repair library.
   - Gap: library-first; many teams still need a tiny, no-dependency, pipeline-native CLI that emits per-record audit output and CI-friendly exit behavior.

2. **Guardrails** (https://github.com/guardrails-ai/guardrails, 6,536 stars)
   - Repo description: `"Adding guardrails to large language models."`
   - Gap: broader framework; heavy for teams that only need fast post-hoc repair + validation on already-generated tool-call payloads.

3. **BAML** (https://github.com/BoundaryML/baml, 7,755 stars)
   - Repo description: `"The AI framework that adds the engineering to prompt engineering ..."`
   - Gap: excellent for full structured generation workflows, but overkill when teams need a lightweight drop-in CLI in shell pipelines and existing ETL jobs.

## Why this solution is better / different

The proposed product is intentionally small and operational:

- **Single-purpose:** repair and validate malformed tool-call JSON from existing logs/responses.
- **Pipeline-native:** works with stdin/stdout and NDJSON files.
- **Audit-friendly:** outputs repair actions + validation errors per record.
- **Dependency-light:** pure Python standard library, easy to vendor in constrained environments.
- **MVP scope discipline:** solves one expensive production problem instead of replacing full agent frameworks.

## Estimated demand signal

- `gh search issues "invalid_tool_call_format" --limit 200` returned **200 matching issues** (hit query cap), with many from late 2025 to early 2026.
- HN signals:
  - `Show HN: Structured output from LLMs without reprompting` → **174 points**
    - https://news.ycombinator.com/item?id=36750083
  - `Jsonformer: Generate structured output from LLMs` → **340 points**
    - https://news.ycombinator.com/item?id=35790092
  - `Show HN: I made a tool which fixes broken JSONs` → **29 points**
    - https://news.ycombinator.com/item?id=40030411
- Cross-channel recurrence: GitHub issues, HN threads, and Reddit posts all independently describe the same reliability failure class (malformed JSON in LLM outputs/tool arguments).
