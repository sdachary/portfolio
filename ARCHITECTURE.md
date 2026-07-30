# Architecture — Portfolio

## Key Decisions
- Vite + React + TypeScript for fast dev experience
- Static site deploy to Cloudflare Pages
- Scan script generates project data from local repos

## Data Flow
Vite build → static assets → Cloudflare Pages CDN

## Services
- **alert-router/** — CF Worker (`alert-router.sdachary-582.workers.dev`). Receives GitHub Actions + Sentry webhooks, routes to Telegram. Zero infra cost.
- **manacitra/** — Mānacitra 3D infrastructure map at `/manacitra/`. React Three Fiber + drei + zustand. Isometric infrastructure map (dark blueprint grid, studio 3-point lighting, PBR materials) with framer-motion UI, full a11y, search/filters/layers, mobile touch controls. Data loaded from `data.json`, auto-synced via systemd timer on oradev (manacitra-sync.timer, weekly). Health checks update online/offline status.

## Integration Points
- Cloudflare Pages (hosting)
- Cloudflare Workers (alert-router)
- Local filesystem (scan_projects.py data source)
