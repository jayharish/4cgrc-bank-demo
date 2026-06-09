# 4CGRC — Banking Operations Compliance Platform

A real-time GRC (Governance, Risk & Compliance) demo platform built for UAE banking operations. Covers branch network monitoring, ATM management, vendor accountability, merchant compliance, and weighted inspection checklists with auto-ticket generation.

**Live:** https://4cgrc-bank-demo.vercel.app

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS v3, Framer Motion |
| Routing | React Router v6 |
| Backend | Vercel Serverless Functions (Node.js) |
| Database | Supabase (PostgreSQL) |
| Maps | React Leaflet |
| Charts | Recharts |
| Deployment | Vercel |

---

## Modules

### Branch Network
Live compliance map across all 7 UAE emirates. Filter by emirate, status, date range. KPI cards show average branch score vs 85% target, incidents, overdue tickets. Interactive Leaflet map with colour-coded markers (compliant / attention / critical).

### ATM Network
UAE ATM coverage with online/offline status. Filter by emirate and connectivity. Alerts banner for offline ATMs with location details. Emirate-level breakdown chart.

### Incident Management
Full CRUD incident register for branch and ATM incidents. Ticket ID generation, priority levels (Low → Critical), SLA-aware status tracking (Pending → In Progress → Resolved → Overdue). Filter by emirate, department, status.

### Vendor Management
SLA monitoring across service vendors (FM, ATM hardware, branding, etc.). Work order tracking with SLA target vs actual hours and variance highlighting. Breach alerts with vendor-level detail.

### Merchant Compliance
POS, ATM, and loyalty partner compliance monitoring. Compliance scores, audit scheduling (Review Due alerts), non-compliant count. Map view with merchant locations.

### Inspection Engine
Weighted W1–W5 compliance checklists with auto-ticket generation.

| Weight | Severity | SLA |
|--------|----------|-----|
| W5 | Critical | 4h |
| W4 | High | 24h |
| W3 | Medium | 72h |
| W2 | Low | 168h |
| W1 | Minor | 336h |

Score = (Σ passed weights) / (Σ all weights) × 100. Open W5 items cap score at 70%; open W4 items cap at 82%. Failed W3–W5 items auto-create incident tickets. Submission history with per-inspection drill-down.

---

## Architecture

```
Browser
  └── src/lib/dataApi.js  (dbQuery / dbInsert / dbUpdate / dbDelete)
        └── POST /api/data  (Vercel serverless function)
              └── Supabase  (service role key — bypasses RLS)

Auth: Supabase anon client → magic link / email+password → session in localStorage
```

All data reads/writes go through the `/api/data` proxy. This bypasses a Supabase RLS recursion issue on the `profiles` table without requiring a DB schema change.

---

## Local Development

```bash
# Clone
git clone git@github.com:jayharish/4cgrc-bank-demo.git
cd 4cgrc-bank-demo

# Install
npm install

# Add environment variables
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY

# Run — must use vercel dev (not npm run dev) to serve /api/ functions locally
npx vercel dev
```

App runs on `http://localhost:3000`.

---

## Environment Variables

| Variable | Where used |
|----------|-----------|
| `VITE_SUPABASE_URL` | Browser — Supabase auth client |
| `VITE_SUPABASE_ANON_KEY` | Browser — Supabase auth client |
| `SUPABASE_URL` | Server — `/api/data` proxy |
| `SUPABASE_SERVICE_KEY` | Server — `/api/data` proxy (never exposed to browser) |

---

## Deployment

```bash
# One-time: authenticate Vercel CLI
npx vercel login

# Deploy to production
npx vercel deploy --prod --yes
```

No GitHub → Vercel auto-deploy is configured. Deployments are triggered manually via CLI after each push.

---

## Database

Supabase project: `pikdtdwbfsugwshkbzgb`

**Tables:** `profiles`, `branches`, `atms`, `vendors`, `work_orders`, `merchants`, `incidents`, `checklist_templates`, `checklist_submissions`, `checklist_items`

**Seed data:** 25 branches · 15 ATMs · 8 vendors · 10 work orders · 12 merchants · 15 incidents · 3 inspection templates

To re-seed: `node scripts/seed-db.mjs`

---

## What's Next

### Immediate
- [ ] Wire Executive Summary KPIs to live database (currently placeholder values)
- [ ] Add production URL to Supabase allowed redirect list

### Planned Features
- [ ] **Analytics module** — multi-dimensional compliance analytics by emirate, branch type, department, time period
- [ ] **Full ticket lifecycle** — FINDING → ASSIGNED → IN PROGRESS → PENDING VERIFICATION → RESOLVED → ESCALATED with owner assignment and comment threads
- [ ] **Photo evidence** — image upload on ticket closure for audit trail
- [ ] **SLA escalation engine** — auto-escalate tickets approaching or breaching SLA
- [ ] **Compliance score auto-update** — recalculate branch/ATM scores when linked tickets resolve
- [ ] **Reports module** — exportable compliance reports (PDF/Excel) with date range and filter support
- [ ] **GitHub → Vercel integration** — auto-deploy on push to main

### Known Issues
- Supabase `profiles` table has an RLS infinite recursion bug — worked around via `/api/data` proxy, not fixed at DB level
- Vendor rows show UUID in table — needs display name join fix

---

Built by [Jay Harish Jethva](mailto:jayh.jethva@gmail.com) · Lead BI Architect, UAE
