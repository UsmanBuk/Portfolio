# New MVP Repos (Revenue-First)

This folder contains two repo-ready MVPs selected after parallel market research across Healthcare and RevOps/Procurement.

## Why these two

1. **DenialGuard MVP** (`denialguard-mvp`)
   - Problem: providers lose substantial recoverable cash due to denials that are never appealed.
   - Buyer: RCM director, revenue cycle VP, billing service owner.
   - Monetization: platform fee + outcome fee tied to recovered claim value.

2. **ShadowSpend MVP** (`shadowspend-mvp`)
   - Problem: companies overpay for duplicated and underutilized SaaS tools.
   - Buyer: CFO, procurement lead, IT operations lead.
   - Monetization: subscription + percentage of verified annual savings.

## Quick start

Each repo runs with zero dependencies:

- Open `index.html` directly in a browser, or
- Serve from repo root with:

```bash
python3 -m http.server 8000
```

Each repo also includes logic tests runnable with:

```bash
npm test
```
