# Market Research: `envsentry` (Environment Drift & Usage Auditor)

## Problem statement

The gap: teams (especially solo devs and small product teams) still struggle to keep environment variables consistent across local/dev/staging/prod, and most available tools focus on **secret storage** rather than **code-to-config drift detection**.

### Evidence from real sources

1. **Developers explicitly describe env/secrets setup as painful**
   - "Secrets management for services is an awful experience to setup."  
     Source: Indie Hackers post title (2025)  
     https://www.indiehackers.com/post/secrets-management-for-services-is-an-awful-experience-to-setup-2f14275245

2. **People ask for finer-grained environment-variable workflows in existing tools**
   - "is it possible to specify variables for the URL at the level of a request environment?"  
     Source: GitHub issue (`usebruno/bruno` #902)  
     https://github.com/usebruno/bruno/issues/902

3. **Missing env-variable functionality receives material community demand**
   - "Github created the possibility to set environment variables for github actions."  
     Source: GitHub issue (`integrations/terraform-provider-github` #1534, +38 reactions)  
     https://github.com/integrations/terraform-provider-github/issues/1534

4. **Developers still use brittle manual workarounds**
   - "I have to write bash scripts to create js files. This hurts my brain."  
     Source: Ask HN discussion on env/secrets management  
     https://news.ycombinator.com/item?id=22018669

5. **The problem keeps resurfacing in new tool launches**
   - "fixes .env + node_modules hell" (creator phrasing in launch discussions around worktree tooling)  
     Sources:  
     https://www.reddit.com/r/commandline/comments/1re6lx5/workz_zoxidestyle_git_worktree_manager_with_auto.json  
     https://news.ycombinator.com/item?id=47148375

6. **Framework users repeatedly ask how to safely manage env keys**
   - "How are you supposed to feed different env variables, especially those that hold api keys?"  
     Source: GitHub issue (`expo/expo` #83)  
     https://github.com/expo/expo/issues/83

## Target user persona

- **Primary:** solo developers, indie hackers, and 2-10 person engineering teams shipping SaaS/API products.
- **Context:** they use `.env`, `.env.local`, `.env.production`, etc., and frequently switch branches/worktrees or deployment targets.
- **Pain:** they can store secrets somewhere, but they still lack a fast way to answer:
  - Which env vars are used in code but missing in a given env file?
  - Which keys are stale/unused?
  - Where are values drifting across environment files?

## Existing alternatives (and why they fall short for this gap)

1. **Doppler**  
   https://www.producthunt.com/products/doppler-2  
   Great for centralized secret management and sharing, but heavier than needed for local-first code/config auditing; does not replace quick static analysis inside a repo.

2. **Infisical**  
   https://www.producthunt.com/products/infisical  
   Strong open-source secret manager, but still primarily a secret distribution platform, not a lightweight "scan my repo now and show missing/unused/drift" CLI.

3. **HashiCorp Vault**  
   https://developer.hashicorp.com/vault  
   Enterprise-grade and powerful, but setup/operations overhead is too high for many solo/small teams wanting immediate local signal during development.

## Why this solution is better/different

`envsentry` is intentionally narrow:

- **No hosted service**: runs locally in seconds.
- **No vendor lock-in**: reads existing `.env*` files and source code directly.
- **Actionable output**: reports missing vars, unused vars, and cross-file drift in one run.
- **MVP-friendly**: can be adopted in under 5 minutes and dropped into CI later.

## Estimated demand signal

- **Cross-community recurrence:** relevant env-variable pain appears across GitHub Issues, Ask HN, Reddit launch posts, and Indie Hackers discussions (sources above).
- **Issue engagement signal:**  
  - `terraform-provider-github` #1534: **+38 reactions**, 7 comments  
  - `usebruno/bruno` #902: **+6 reactions**, 9 comments  
- **Product category traction:** Product Hunt listings in this space show sustained attention:  
  - Doppler: 527+ followers, 56 reviews (Product Hunt listing)  
  - Infisical: 305 followers, 5 reviews (Product Hunt listing)
- **Frequency trend:** sources span multiple years (2020-2026), suggesting this is persistent operational friction, not a one-off complaint.

