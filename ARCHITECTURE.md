# Architecture — Portfolio

## Key Decisions
- Vite + React + TypeScript for fast dev experience
- Static site deploy to Cloudflare Pages
- Scan script generates project data from local repos

## Data Flow
Vite build → static assets → Cloudflare Pages CDN

## Services
- **alert-router/** — CF Worker (`alert-router.sdachary-582.workers.dev`). Receives GitHub Actions + Sentry webhooks, routes to Telegram. Zero infra cost.
- **manacitra/** — Mānacitra ops map at `/manacitra/`. React Three Fiber + drei + zustand. Fixed-isometric network diagram (pan + rotate camera): 4 zones (oradb/oradev/cloudflare/external) rendered as flat rounded slabs, neutral 3D blocks per service with colored brand-logo decals (simple-icons path data in `logos.ts` drawn to CanvasTexture, cached), dashed connections + animated flow particles, health badges. Lines/labels/badges/particles drawn on a camera-tracking off-screen canvas projected as a CanvasTexture overlay (anisotropy maxed, custom blending), light neutral canvas. UI via framer-motion, full a11y, search/filters/layers, mobile touch controls. Data loaded from `data.json`, auto-synced via systemd timer on oradev (manacitra-sync.timer, weekly). Health checks update online/offline status. Hover shows tooltip, click opens deployed URL.

## Integration Points
- Cloudflare Pages (hosting)
- Cloudflare Workers (alert-router)
- Local filesystem (scan_projects.py data source)
