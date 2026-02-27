# ShadowSpend MVP

ShadowSpend is a procurement and finance copilot that identifies SaaS spend leakage from duplicate tools and low utilization.

## Revenue thesis

- Most companies overpay for overlapping SaaS stacks and idle licenses.
- Finance teams rarely get a unified, actionable view of where to cut without disrupting operations.
- ShadowSpend turns tool usage exports into an immediate savings action plan.

## ICP

- CFO, VP Finance, Procurement lead
- IT operations teams with 100+ paid SaaS seats
- Mid-market B2B organizations with fragmented app ownership

## Pricing hypothesis

- Platform fee: $1,500-$6,000/month
- Success fee: 12%-18% of verified annualized savings

## MVP features (in this repo)

- CSV portfolio ingestion
- Duplicate stack detection by functional category
- License utilization-based waste estimation
- Ranked opportunity table and consolidation action list

## Run locally

Option 1: Open `index.html` directly.

Option 2:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/new-repos/shadowspend-mvp/`.

## Tests

```bash
npm test
```

## 30-day next steps

1. Add connectors for SSO exports and procurement systems.
2. Track realized savings after consolidation decisions.
3. Add renewal-timing alerts to prevent duplicate auto-renewals.
