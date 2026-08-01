# Architecture — Portfolio

## Key Decisions
- Vite + React + TypeScript for fast dev experience
- Static site deploy to Cloudflare Pages
- Scan script generates project data from local repos

## Data Flow
Vite build → static assets → Cloudflare Pages CDN

## Services
- **alert-router/** — CF Worker (`alert-router.sdachary-582.workers.dev`). Receives GitHub Actions + Sentry webhooks, routes to Telegram. Zero infra cost.
- **manacitra/** — Mānacitra ops map at `/manacitra.html`. React + zustand, flat 2D SVG diagram (no three.js). Fixed 2×2 zone grid (cloudflare top-left, oradb top-right, oradev bottom-left, external bottom-right); zone cards as rounded rects with translucent surface, colored left bezel, 26px brand logo icons per service. Connections are orthogonal (straight + right-angle turns) with polygon arrowheads showing flow direction, per-destination-card lane allocation (proportional to connection count), connection labels with halo (API/DB/SSH Tunnel/CI deploy/Errors), health badges, animated flow dots; `<text>` for crisp labels. Search/filters/layers/high-contrast wired to store, hover dim/active transitions, click opens deployed URL. Embedded on the homepage as an iframe section after Projects. Data loaded from `data.json`, auto-synced via systemd timer on oradev (manacitra-sync.timer, weekly).

## Integration Points
- Cloudflare Pages (hosting)
- Cloudflare Workers (alert-router)
- Local filesystem (scan_projects.py data source)
