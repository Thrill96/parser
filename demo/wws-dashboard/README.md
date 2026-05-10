# Washington Winter Show — Donor Intelligence Dashboard (Demo)

A functional demo of a unified donor-intelligence dashboard for the Washington
Winter Show. Pulls from five source systems (eTapestry, Squarespace, Mailchimp,
Gmail, DonorSearch) and presents the operational view that fundraising staff
actually use day-to-day.

## What this is

This is a **sales/scoping demo**, not the production product. It uses
**synthetic mock data** that mirrors the real WWS distribution by tier, zip,
and giving range — so the screens look like a real WWS dashboard, but no real
donor data is exposed.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4 (CSS-first theme tokens)
- TypeScript

## Running locally

```bash
cd demo/wws-dashboard
npm install
npm run dev
# http://localhost:3000
```

## Deploying to Vercel

From this directory:

```bash
npx vercel
```

Vercel will detect Next.js automatically. First deploy gives you a preview URL;
`npx vercel --prod` promotes to production. Set a custom domain like
`wws-demo.yourdomain.com` from the Vercel dashboard.

## Hero scenarios (the demo walk-through)

1. **Overview** (`/`) — KPIs, alerts, revenue chart with the 2024–25 data gap
   visualized honestly.
2. **Unmatched-gift resolution** (`/unmatched`) — A Squarespace order arrives,
   the system looks for an eTapestry match, staff resolves with one click.
3. **Profile + Gmail composer** (`/constituents/[id]`) — Donor profile with the
   DonorSearch intelligence panel. "Email via Gmail" opens a composer; sending
   logs a journal entry back to eTapestry.
4. **Prospect discovery** (`/prospecting`) — Pick a zip, run DonorSearch,
   results stream in.
5. **Geography** (`/geography`) — Zip-by-zip with donor concentration and
   untapped capacity flagged by DonorSearch.
6. **Sync status** (`/sync`) — Audit log of every sync event across all five
   systems. Trust surface.

## Mock data

Synthetic data lives in `lib/data/`. Volume mirrors real data:

- 1,010 constituents (49 Eagle sponsors + tiered attendees)
- 40 wealth profiles (top givers)
- 8 upgrade candidates
- 5 prospect discoveries
- 17 zip-stat rows

To swap in real data for a live pitch meeting, replace these JSON files. The
schema in `lib/types.ts` is the contract; nothing else needs to change.
