# Market Research: Gap in Lightweight API Mocking

## Problem statement

Developers repeatedly ask for a faster way to run realistic mock APIs without heavy setup, custom middleware code, or paid platforms.

### Evidence from real sources

1. **Hacker News (Ask HN)**  
   Quote: *"I'm looking for a good way to Mock APIs ... I haven't found any solution that has blown me away."*  
   Source: https://news.ycombinator.com/item?id=23515857  
   API mirror (thread metadata): https://hn.algolia.com/api/v1/items/23515857

2. **GitHub issue in json-server (popular mock API tool)**  
   Quote: *"Not finding any way to change a response for a request from the client side ... modify, delay, etc a response based on the criteria of that test."*  
   Source: https://github.com/typicode/json-server/issues/1002

3. **GitHub issue in json-server (status control pain)**  
   Quote: *"I need to change a status code for POST, is it possible...?"*  
   Source: https://github.com/typicode/json-server/issues/1196

4. **GitHub issue in json-server (per-collection ID behavior gap)**  
   Quote: *"Feature-request: Allow to define id per collection"*  
   Source: https://github.com/typicode/json-server/issues/1377

5. **Reddit thread title (explicit unmet demand wording)**  
   Quote: *"Every HTTP API mocking tool I tried either didn't actually meet my needs, forced me to run separate servers, or cost way too much."*  
   Source: https://www.reddit.com/r/SideProject/comments/1r853k3/every_http_api_mocking_tool_i_tried_either_didnt/

6. **Reddit/IndieHackers community cross-post title**  
   Quote: *"Need quick mock API endpoints? I made a tool that gives you one instantly."*  
   Source: https://www.reddit.com/r/indiehackers/comments/1mb9sz6/need_quick_mock_api_endpoints_i_made_a_tool_that/

7. **IndieHackers post metadata**  
   Quote: *"APIs power today's apps—but waiting on backend APIs can stall development."*  
   Source: https://www.indiehackers.com/post/how-to-use-api-mocking-best-practices-real-world-success-2871d96dc3

8. **Product Hunt category surface area (market exists but fragmented)**  
   Sources:  
   - https://www.producthunt.com/products/webhook-site/reviews  
   - https://www.producthunt.com/products/mockoon  
   - https://www.producthunt.com/products/mockanapi  

## Target user persona

- **Primary user:** solo developer or small product team building frontend/API integrations before backend is stable.
- **Workflow pain:** needs mock endpoints in minutes, with scenario switching (success/error/slow responses) during local testing.
- **Constraints:** avoids heavy GUI tools, paid per-seat plans, and custom JavaScript middleware for simple tests.

## Existing alternatives and why they fall short

1. **json-server** (https://github.com/typicode/json-server)  
   - Strong adoption, but common feature requests show friction for route-specific response mutation and status control (issues #1002, #1196, #1377).  
   - Source URLs:  
     - https://github.com/typicode/json-server/issues/1002  
     - https://github.com/typicode/json-server/issues/1196  
     - https://github.com/typicode/json-server/issues/1377

2. **Mockoon** (https://github.com/mockoon/mockoon)  
   - Great local mock UX, but users continue asking for advanced behaviors and roadmap gaps (e.g., SSE support thread).  
   - Source URL: https://github.com/mockoon/mockoon/issues/990

3. **WireMock** (https://github.com/wiremock/wiremock)  
   - Powerful but Java-based (higher setup/cognitive overhead for quick local prototyping compared to tiny CLI workflows).  
   - Source URLs:  
     - https://github.com/wiremock/wiremock  
     - https://api.github.com/repos/wiremock/wiremock

## Why this solution is better/different

**Proposed solution:** a tiny Python CLI that serves mock routes from one JSON file and supports scenario switching via header/query string.

Differentiators:
- **Zero GUI:** fully scriptable for terminal-first developers.
- **No custom middleware code required:** route scenarios are declarative in JSON.
- **Fast iteration:** switch scenarios per request (`__scenario` query param or `X-Mock-Scenario` header).
- **Under 500 LOC MVP:** intentionally minimal, easy to audit and extend.

## Estimated demand signal

1. **HN discussion density**  
   - `mock api` stories on HN Algolia: **544 hits**  
   - `webhook testing` stories on HN Algolia: **88 hits**  
   Source URLs:  
   - https://hn.algolia.com/api/v1/search?tags=story&query=mock%20api  
   - https://hn.algolia.com/api/v1/search?tags=story&query=webhook%20testing

2. **Specific Ask HN engagement**  
   - "Ask HN: Best Way to Mock APIs in 2020?" reached substantial discussion and voting.  
   Source URLs:  
   - https://news.ycombinator.com/item?id=23515857  
   - https://hn.algolia.com/api/v1/items/23515857

3. **GitHub issue frequency in a major mock tool**  
   - Search query `repo:typicode/json-server is:issue mock response` returns **40 issues**.  
   Source URL: https://api.github.com/search/issues?q=repo%3Atypicode/json-server%20is%3Aissue%20mock%20response

4. **Large installed base indicates broad relevance**  
   - `json-server` npm downloads (last week): **291,810**.  
   Source URL: https://api.npmjs.org/downloads/point/last-week/json-server

5. **Popular repos in this category**  
   - json-server stars: 75k+, Mockoon: 8k+, WireMock: 7k+ (strong sustained interest in API mocking workflows).  
   Source URLs:  
   - https://api.github.com/repos/typicode/json-server  
   - https://api.github.com/repos/mockoon/mockoon  
   - https://api.github.com/repos/wiremock/wiremock
