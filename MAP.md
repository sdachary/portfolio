# Portfolio — File Map

> Auto-loaded by OpenCode at session start. Last updated: 2026-06-21

---

## Entry Points

| Purpose | Path |
|---------|------|
| App root | `src/main.jsx` |
| App component | `src/App.jsx` |
| HTML shell | `index.html` |

---

## Routes / Pages

Single-page app — all content rendered in `App.jsx` via component composition. No router.

| Route | File | Auth | Purpose |
|-------|------|------|---------|
| / (single page) | `src/App.jsx` | Public | Renders all sections: Hero, About, Skills, Experience, Projects, Services, Contact |

---

## API Endpoints

None — fully static site.

---

## Models / Schema

No formal models. Data files export plain JS objects/arrays.

| Entity | File | Key Relationships |
|--------|------|-------------------|
| Projects | `public/projects.json` | Rendered by `Projects.jsx` |
| Skills | `src/data/skills.js` | Rendered by `Skills.jsx` |
| Experience | `src/data/experience.js` | Rendered by `Experience.jsx` |

---

## Configuration

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite build configuration |
| `tsconfig.json` | TypeScript config (JSX project — lax) |
| `package.json` | Dependencies and scripts |
| `eslint.config.js` | ESLint flat config |
| `.env.example` | Env var template (empty — static site) |

---

## Deployment

| File | Purpose |
|------|---------|
| `.github/workflows/static.yml` | GitHub Actions — build + deploy to GitHub Pages |
| `index.html` | Entry HTML for Vite build |

---

## Key Files Quick Reference

| What | Where |
|------|-------|
| App entry | `src/main.jsx` |
| Root component | `src/App.jsx` |
| Global styles | `src/index.css` |
| Projects data | `public/projects.json` |
| Skills data | `src/data/skills.js` |
| Experience data | `src/data/experience.js` |
| Components | `src/components/*.jsx` |
| Deploy workflow | `.github/workflows/static.yml` |
| Build config | `vite.config.js` |
| DPDP policy | `docs/PRIVACY_POLICY.md` |
