# Architecture — Portfolio

## Key Decisions
- Vite + React + TypeScript for fast dev experience
- Static site deploy to Cloudflare Pages
- Scan script generates project data from local repos

## Data Flow
Vite build → static assets → Cloudflare Pages CDN

## Services
- **alert-router/** — CF Worker (`alert-router.sdachary-582.workers.dev`). Receives GitHub Actions + Sentry webhooks, routes to Telegram. Zero infra cost.
- **manacitra/** — Mānacitra ops map at `/manacitra.html`. React + zustand, flat 2D SVG diagram (no three.js). Zone cards (oradb/oradev/cloudflare/external) as rounded rects with services as rows; connections as offset cubic-bézier curves with animated flow dots (fan-in spread across target edge, no overlapping lines); SVG `<text>` for crisp labels; brand logos from simple-icons path data in `logos.ts`. Search/filters/layers/high-contrast wired to store, health badges, hover tooltip via InfoPanel, click opens deployed URL. Embedded on the homepage as an iframe section after Projects. Data loaded from `data.json`, auto-synced via systemd timer on oradev (manacitra-sync.timer, weekly).

## Integration Points
- Cloudflare Pages (hosting)
- Cloudflare Workers (alert-router)
- Local filesystem (scan_projects.py data source)
