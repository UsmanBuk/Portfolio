# DenialGuard MVP

DenialGuard is a revenue cycle copilot for healthcare teams that need to recover denied claims faster.

## Revenue thesis

- Denials represent immediate cash-flow leakage.
- Teams often lack claim-level prioritization and draft-quality appeals at speed.
- DenialGuard prioritizes by likely recovery value and auto-generates an appeal draft to reduce turnaround.

## ICP

- Multi-site provider groups
- Revenue cycle leaders
- Billing companies with high denial volume

## Pricing hypothesis

- Platform fee: $2,500-$8,000/month by claim volume
- Outcome fee: 10%-20% of verified net-new recovered dollars

## MVP features (in this repo)

- Denial backlog dashboard with likely recoverable value
- Claim priority scoring (high/medium/low)
- Root-cause diagnosis from denial code playbook
- Auto-generated appeal draft with one-click export

## Run locally

Option 1: Open `index.html` directly.

Option 2:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/new-repos/denialguard-mvp/`.

## Tests

```bash
npm test
```

## 30-day next steps

1. Add payer-specific policy prompts and reason-code expansions.
2. Ingest ERA/EOB CSV exports from clearinghouses.
3. Add simple team workflow: owner assignment, SLA timers, and appeal status tracking.
