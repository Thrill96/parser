# AEO Monitor

AI Engine Optimization monitoring. Tracks whether AI chatbots — **ChatGPT,
Claude, Gemini, Perplexity** — can find, recommend, and correctly identify a
brand, plus a technical **schema/JSON-LD audit** of the brand's homepage.

Replicates the core of what Searchable sells at \$50–\$400/month, built on
Next.js + Turso + the Anthropic API for near-zero marginal cost
(~\$0.27/month for one domain).

**Stack:** Next.js 14 (App Router) · Turso (libSQL) · Anthropic SDK · Vercel Cron
· Recharts.

---

## What it does

```
[Vercel Cron weekly] → Prompt Runner → ChatGPT / Claude / Gemini / Perplexity
                                          │
                                          ▼
                              Response Parser (Claude → structured JSON)
                                          │
                                          ▼
                               Turso DB ── Dashboard ── Mandrill alerts
```

- **Prompt runner** asks each engine a standardized set of prompts
  (recommendation / identity / comparison / direct).
- **Parser** uses Claude to extract: brand mentioned? site linked? correctly
  identified? competitors named? sentiment, and a 0–10 prominence score.
- **Visibility score** (0–100) is computed per-engine and overall, stored each
  run for trend lines.
- **Schema auditor** fetches the homepage, parses JSON-LD + meta/OG tags, and
  scores technical AEO health 0–100 against a rubric.
- **Alerts** email via Mandrill when the score drops ≥10 points or a competitor
  starts displacing the brand.

---

## Quick start (local)

Requires Node ≥ 18.17.

```bash
cd aeo-monitor
npm install
cp .env.example .env.local
```

For local dev you can use a file-backed SQLite DB instead of hosted Turso —
set this in `.env.local`:

```
TURSO_DATABASE_URL=file:local.db
ANTHROPIC_API_KEY=sk-ant-...        # required (engine + parser)
OPENAI_API_KEY=...                  # optional — engine skipped if absent
GEMINI_API_KEY=...                  # optional
PERPLEXITY_API_KEY=...              # optional
```

Then:

```bash
npm run db:init     # apply db/schema.sql
npm run db:seed     # seed empower-core.com + 12 prompts
npm run scan        # run schema audit + engine scan from the CLI (uses your keys)
npm run dev         # dashboard at http://localhost:3000
```

> Engines without an API key are silently skipped, so you can start with just
> `ANTHROPIC_API_KEY` and add the others later. At least one engine key is
> required for a scan; the **schema audit needs no keys**.

---

## Production (Turso + Vercel)

1. **Create the database**

   ```bash
   turso db create aeo-monitor
   turso db show aeo-monitor --url            # → TURSO_DATABASE_URL
   turso db tokens create aeo-monitor         # → TURSO_AUTH_TOKEN
   ```

2. **Apply schema + seed** (point the env vars at the Turso URL/token first):

   ```bash
   npm run db:init
   npm run db:seed
   ```

3. **Deploy to Vercel** and set environment variables (Project → Settings →
   Environment Variables): everything in `.env.example`. Set a strong
   `CRON_SECRET` — the cron routes require `Authorization: Bearer $CRON_SECRET`.

4. **Cron** is configured in `vercel.json`:
   - `/api/cron/aeo-scan` — Sundays 06:00 UTC
   - `/api/cron/schema-audit` — Sundays 07:00 UTC

   Vercel automatically sends the `CRON_SECRET` as a Bearer token on cron
   invocations.

---

## Endpoints

| Route | Method | Purpose |
|---|---|---|
| `/` | GET | Dashboard (score, per-engine cards, trend, results table, schema, competitors) |
| `/api/cron/aeo-scan` | GET | Weekly engine scan + scoring + alerts |
| `/api/cron/schema-audit` | GET | Weekly homepage schema audit |
| `/api/scan` | POST | On-demand "Run Scan Now" (audit + scan); body `{ "domainId": 1 }` |

All three API routes require the `CRON_SECRET` bearer token when that env var is
set (it's open when unset, for local dev).

---

## Project layout

```
app/
  page.jsx                 dashboard (server component)
  layout.jsx, globals.css
  components/              ScoreCard, EngineBreakdown, SchemaCard,
                          TrendChart, ResultsTable, CompetitorView, RunScanButton
  api/
    cron/aeo-scan/route.js
    cron/schema-audit/route.js
    scan/route.js
lib/
  db.js                    libSQL client + helpers
  engines/                 chatgpt, claude, gemini, perplexity + registry
  parser.js                Claude structured extraction
  scoring.js               visibility score computation
  schema-audit.js          JSON-LD / meta / OG auditor + rubric
  scan.js                  scan orchestrator
  run-schema-audit.js      audit orchestrator
  alerts.js                Mandrill email alerts
  prompts.js               default prompt template generator
  dashboard-data.js        read-side queries
db/schema.sql              full schema
scripts/                   init-db, seed-db, run-scan (CLI)
vercel.json                cron config
```

## Scoring

- **Per result:** `confidence_score × 10`, +10 if the site was linked, +5 if
  correctly identified, forced to 0 if the brand wasn't mentioned (clamped 0–100).
- **Per engine:** average of its result points.
- **Overall:** 80% prompt visibility + 20% schema health (when a schema audit
  exists).
- **Competitor displacement:** % of results that named a competitor.

Schema rubric (0–100): Person +15, Organization +15, LinkedIn `sameAs` +10,
other `sameAs` +5, WebSite +5, Service/Product +10, keyword-rich meta
description +10, `og:title` with brand+role +10, brand in image alt +5,
structured data present +10, robots.txt+sitemap +5.

---

## Roadmap (from the build spec)

- **Phase 1 (this MVP):** scan + parser + scoring + schema audit + dashboard + cron. ✅
- **Phase 2:** richer competitor view, on-demand scans ✅, Mandrill alerts ✅, more charts.
- **Phase 3:** multi-tenant (`users` table, Stripe, per-plan rate limits),
  onboarding + auto-prompt generation, white-label PDF reports.

---

## Note on repository placement

This app was scaffolded as a **self-contained project** inside the
`aeo-monitor/` directory. It has zero coupling to anything outside this folder.
To move it into its own standalone Git repository:

```bash
# from the parent repo root
git subtree split --prefix=aeo-monitor -b aeo-monitor-only
# then push that branch to a fresh empty repo, OR simply:
cp -r aeo-monitor /path/to/new/aeo-monitor && cd /path/to/new/aeo-monitor && git init
```
