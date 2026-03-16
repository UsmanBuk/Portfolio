# Market Research: `.env` Drift and Missing Env Docs

## Selected Problem

**Problem statement:** teams repeatedly ship code that references environment variables not documented in `.env.example`, causing local setup failures and runtime errors.

### Evidence (quoted, with URLs)

1. **python-dotenv feature request (open):**
   - Quote: _"it would be useful if we could generate a `.env.example` from it"_ and _"It would be useful if a `CLI` command is provided for it."_
   - Source: https://github.com/theskumar/python-dotenv/issues/354

2. **python-dotenv follow-up request (open):**
   - Quote: _"it would be very helpful to have a CLI command that can generate an environment template file directly from an existing .env."_ and _"keep an environment template file up to date automatically."_
   - Source: https://github.com/theskumar/python-dotenv/issues/618

3. **next-auth contributor onboarding bug:**
   - Quote: _"Wrong env variables examples in .env.example for contributors"_ and _"having `NEXTAUTH_GITHUB_ID` and `NEXTAUTH_GITHUB_SECRET` won't work because `GITHUB_ID` and `GITHUB_SECRET` returns undefined."_
   - Source: https://github.com/nextauthjs/next-auth/issues/1083

4. **cal.com API v2 startup failure:**
   - Quote: _"The API v2 `.env.example` file is missing the required `REDIS_URL` environment variable"_ and _"`REDIS_URL` is required ... but completely missing from `.env.example`."_
   - Source: https://github.com/calcom/cal.com/issues/25195

5. **dotenv formatting pain:**
   - Quote: _"`dotenvx ext genexample` ... strips out all comments and formatting. This makes the generated `.env.example` file much harder to understand for new users."_
   - Source: https://github.com/motdotla/dotenv/issues/840

6. **HN demand for local-dev / CI environment parity:**
   - Quote from discussion: _"I would love to be able to have access to the same env as the CI so that I could prototype the script/job on my own machine before committing to git."_
   - Source: https://news.ycombinator.com/item?id=46345827

7. **Reddit / SaaS validation signal:**
   - Quote (thread title): _"What software do you wish existed that would save you hours every week?"_
   - Source: https://www.reddit.com/r/SaaS/comments/1rrtkzv/what_software_do_you_wish_existed_that_would_save/

8. **IndieHackers validation signal:**
   - Quote (post title): _"Secrets management for services is an awful experience to setup"_
   - Source: https://www.indiehackers.com/post/secrets-management-for-services-is-an-awful-experience-to-setup-2f14275245

## Target User Persona

- **Primary:** solo developers and small product teams (1-10 engineers) shipping Python/Node apps.
- **Context:** they use `.env` and `.env.example`, but do not run enterprise secret managers for local development.
- **Pain:** onboarding breaks when variables drift, and CI/runtime fail with missing env vars discovered too late.

## Existing Alternatives and Why They Fall Short

1. **Doppler** (secret ops platform)
   - URL: https://www.producthunt.com/products/doppler-2
   - Gap: strong for managed secrets and team ops, but heavy for simple repo-level drift detection and `.env.example` hygiene in local OSS/small apps.

2. **Infisical** (encrypted secret management)
   - URL: https://www.producthunt.com/products/infisical
   - Gap: optimized for centralized secret sync and infrastructure workflows, not a tiny zero-dependency CLI that checks code references vs `.env.example` in CI.

3. **dotenvx / generator workflows**
   - URLs: https://github.com/motdotla/dotenv/issues/840 and https://dotenvx.com/
   - Gap: users specifically report comment/format stripping during example generation, reducing readability for onboarding docs.

## Why THIS Solution Is Better

**Proposed solution:** a tiny local CLI that does exactly three things well:
1. scans source code for env-variable usage,
2. checks drift against `.env` and `.env.example`,
3. syncs missing keys into `.env.example` without adding heavy infrastructure.

This is deliberately small, scriptable, CI-friendly, and buildable by one developer in well under 500 LOC.

## Estimated Demand Signal

- Repeated feature requests across dotenv ecosystem:
  - python-dotenv #354 (open, 4 comments): https://github.com/theskumar/python-dotenv/issues/354
  - python-dotenv #618 (open, 7 comments): https://github.com/theskumar/python-dotenv/issues/618
- Repeated real breakages in popular repos:
  - next-auth #1083: https://github.com/nextauthjs/next-auth/issues/1083
  - cal.com #25195: https://github.com/calcom/cal.com/issues/25195
- Broad category discussion volume:
  - HN dotenv/config thread reached **354 points** with active discussion: https://news.ycombinator.com/item?id=40789353
  - GitHub issue search shows continuing `.env.example` issue churn across many repos: https://github.com/search?q=env.example&type=issues
