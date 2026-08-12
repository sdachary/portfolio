# Architecture — Portfolio

## Key Decisions
- Vite + React + TypeScript for fast dev experience
- Static site deploy to Cloudflare Pages
- Scan script generates project data from local repos

## Data Flow
Vite build → static assets → Cloudflare Pages CDN

## Services
- **alert-router/** — CF Worker (`alert-router.sdachary-582.workers.dev`). Receives GitHub Actions + Sentry webhooks, routes to Telegram. Zero infra cost.
- **manacitra/** — Mānacitra ops map at `/manacitra.html`. React + zustand, flat 2D SVG diagram (no three.js). Fixed 2×2 zone grid (cloudflare top-left, oradb top-right, oradev bottom-left, external bottom-right); zone cards as rounded rects with translucent surface, colored left bezel, 72×72 rounded-square service tiles (`rx=16`, logo decal top-center, name below, status dot top-right) with simple-icons brand logos. Connections are orthogonal with polygon arrowheads that land on block edges: intra-zone routes exit the source tile's left gutter, rise to a lane above the target tile, dive into its **top edge**; inter-zone tile targets enter via the card's left padding gutter then the same top-edge approach; card targets end on the card's left/bottom edge (verified: 18 paths, 0 tile-crossings). Connection labels with halo (API/DB/SSH Tunnel/CI deploy/Errors), health badges, animated flow dots; `<text>` for crisp labels. Search/filters/layers/high-contrast wired to store, hover dim/active transitions. Embedded on the homepage as an iframe section after Projects. Data loaded from `data.json` (per-service `url`+`logo`), auto-synced via systemd timer on oradev (manacitra-sync.timer, weekly; stats derived from zones so counts can't drift). React Flow canvas editor at `/floweditor.html` (internal admin only, no public link) — node positions persist to localStorage.

## Integration Points
- Cloudflare Pages (hosting)
- Cloudflare Workers (alert-router)
- Local filesystem (scan_projects.py data source)
