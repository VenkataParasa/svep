# Detroit Civic Compass

A presales demonstration of a **Scalable Voter Education Platform** for the City of Detroit, built for an RFP response. It personalizes civic information by ZIP code and presents issue-centric content (housing, education, public safety, transportation, healthcare, environment) instead of just listing candidates.

No database is used anywhere. All content is static TypeScript seed data under `data/`, optionally mutated in an in-browser Zustand store for the Admin Panel's demo CRUD.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The demo covers 37 Detroit-area ZIP codes (48201–48243) — try `48226` (Downtown), `48219` (Northwest), or `48209` (Southwest/Mexicantown).

Admin Panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — demo credentials `admin` / `admin123` (demonstration only, not real authentication).

```bash
npm run build   # production build
npm run lint    # eslint
```

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Lucide icons · Framer Motion · Recharts · React Hook Form + Zod · Zustand

"Backend" is implemented as Next.js Route Handlers under `app/api/**` (mock REST endpoints serving the static seed data with simulated latency) rather than a separate FastAPI process — see `.claude/plans` history for the reasoning if present, or just: it keeps the whole demo to a single `npm run dev`.

## Data & sourcing

Real, current officeholders and legislation (Detroit Mayor, City Council, MI Governor, US Senators/House, state legislators, 2026 Governor's race candidates, and several real Michigan bills) are compiled from official `.gov` sources — see `sourceIds` on each record in `data/*.ts` and the citations in `data/sources.ts`. Anything that couldn't be confirmed (mainly ZIP-to-district boundary mappings, and all photos) is explicitly flagged `confidence: "demo-data"` and surfaced as a "Demo Data" badge in the UI — most visibly on the **Why This Information** and **Source Transparency** pages.

## Project layout

```
app/(site)/        Public pages: landing, dashboard, issues, candidates,
                    representatives, sources, audit trail, search
app/admin/          Admin login + sidebar-shelled dashboard/CRUD/analytics
app/api/             Mock REST route handlers
components/          UI building blocks (components/ui is shadcn-generated)
data/                Seed data (issues, representatives, candidates, legislation,
                     sources, audit records, metadata, analytics)
store/               Zustand stores (selected ZIP, admin-editable mock data)
lib/                 Types, utils, auth (demo), search index
```
