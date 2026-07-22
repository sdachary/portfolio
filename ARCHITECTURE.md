# Architecture — Portfolio

## Key Decisions
- Vite + React + TypeScript for fast dev experience
- Static site deploy to Cloudflare Pages
- Scan script generates project data from local repos

## Data Flow
Vite build → static assets → Cloudflare Pages CDN

## Services
- **alert-router/** — CF Worker (`alert-router.sdachary-582.workers.dev`). Receives GitHub Actions + Sentry webhooks, routes to Telegram. Zero infra cost.

## Integration Points
- Cloudflare Pages (hosting)
- Cloudflare Workers (alert-router)
- Local filesystem (scan_projects.py data source)
