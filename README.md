# 🍚 Dipikar Rannghor

Hands-on **Cloud Kitchen Documentation + TODO management PWA**. Not a
documentation website — a system that pushes you from *learning* to
*executing* a real Cloud Kitchen launch:

> Learn → Do → Verify → Document → Track

Built to the brief in [`MASTER PROMPT — Dipikar Rannghor.md`](./MASTER%20PROMPT%20%E2%80%94%20Dipikar%20Rannghor.md).

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** — dark-first premium UI, Poppins, larger-than-usual type
- **HashRouter** — GitHub Pages friendly (no server rewrites)
- **vite-plugin-pwa** (Workbox) — installable, offline-ready docs
- **Storage abstraction** (`src/lib/storage/`) — `LocalStorageAdapter` today,
  drop-in `SupabaseStorageAdapter` later without touching app logic

## Features (V1)

Dashboard · Documentation (10 Bangla-heavy docs) · Roadmap (milestones M0–M11) ·
TODO (seed backlog + custom tasks, status/priority/phase/dependency) ·
Checklists · Break-even & Food Cost calculators · Glossary · Decision Log ·
Resources · Search (`Ctrl/⌘ K`) · Filters · Learning vs Execution progress ·
Backup export/import.

## Develop

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # type-check + production build to dist/
npm run preview
npm run gen:icons      # regenerate PWA icons from public/favicon.svg (needs sharp)
```

## Deploy

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds and
publishes `dist/` to GitHub Pages. The Vite `base` is `/dipikar-rannaghor/`
(the repo name) for production builds.

**One-time setup:** repo → Settings → Pages → Source = **GitHub Actions**.

## Roadmap

V2 richer calculators + persistence · V3 Recipe/Inventory/Supplier ·
V4 Order/Expense/Revenue · V5 Vercel + Supabase (auth, sync) ·
V6 Analytics & forecasting.

## Data & accuracy

All user state lives in the browser (`localStorage`) — export backups from
Settings. FSSAI / GST / Zomato / Swiggy rules change often; the docs only tell
you *what to verify* against official sources, never quote them as current fact.
