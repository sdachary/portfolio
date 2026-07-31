# Architecture — Portfolio

## Key Decisions
- Vite + React + TypeScript for fast dev experience
- Static site deploy to Cloudflare Pages
- Scan script generates project data from local repos

## Data Flow
Vite build → static assets → Cloudflare Pages CDN

## Services
- **alert-router/** — CF Worker (`alert-router.sdachary-582.workers.dev`). Receives GitHub Actions + Sentry webhooks, routes to Telegram. Zero infra cost.
- **manacitra/** — Mānacitra infrastructure diagram at `/manacitra/`. React Three Fiber + drei + zustand. Flat fixed-isometric diagram (no camera flight): low-poly compound-geometry buildings, lines/labels/status badges drawn on a camera-tracking off-screen canvas projected as a CanvasTexture overlay (anisotropy maxed, custom blending), light neutral canvas, pan/zoom only. UI via framer-motion, full a11y, search/filters/layers, mobile touch controls. Data loaded from `data.json`, auto-synced via systemd timer on oradev (manacitra-sync.timer, weekly). Health checks update online/offline status.

## Integration Points
- Cloudflare Pages (hosting)
- Cloudflare Workers (alert-router)
- Local filesystem (scan_projects.py data source)
