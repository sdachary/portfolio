# Portfolio

> Auto-loaded by OpenCode at session start. Last updated: 2026-06-21

---

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 20+ |
| Framework | Vite + React | 18+ |
| Database | None (static) | — |
| Deploy | GitHub Pages | — |
| Auth | None | — |

---

## Architecture

Personal portfolio website — single-page React app showcasing projects, skills, and experience. Fully static: no backend, no database, no API calls. All content is sourced from `projects.json` (public/) and local JS data files (`src/data/`). Built with Vite, deployed via GitHub Actions to GitHub Pages.

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Vite + React | Fast dev, simple static export |
| Backend | None | Portfolio is fully static — no server needed |
| Data source | `projects.json` + JS data files | Easy to update without rebuilding components |
| Deploy target | GitHub Pages | Free, simple, fits static site |
| DPDP compliance | Phase 25 baseline | No PII collected — public portfolio only |

---

## Data Model

| Entity | Key Fields | PII? | Retention |
|--------|-----------|------|-----------|
| projects.json | name, description, url, tech, status | No | Forever (public) |
| skills.js | name, category, proficiency | No | Forever (public) |
| experience.js | role, company, period, description | No | Forever (public) |

---

## External Dependencies

| Service | Purpose | Data Shared | DPDP Status |
|---------|---------|-------------|-------------|
| GitHub Pages | Hosting | None | N/A (static) |
| GitHub Actions | CI/CD (deploy) | None | N/A |

---

## Security

| Measure | Status |
|---------|--------|
| CSP headers | Not configured (static site) |
| Rate limiting | N/A (static) |
| Audit logging | N/A (static) |
| Encryption at rest | N/A (static files) |
| Encryption in transit | GitHub Pages (HTTPS) |
| RLS/Permissions | N/A (static) |
| DPDP compliance phase | Phase 25 — complete |

---

## Session History

Significant decisions and changes from past sessions:

- 2026-06-20: Phase 25 baseline — README + PRIVACY_POLICY.md updated with DPDP Act disclosure, DPO contact, data localization
