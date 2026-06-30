# Portfolio — Coding Conventions

> Auto-loaded by OpenCode at session start. Last updated: 2026-06-21

---

## Code Style

| Rule | Convention |
|------|-----------|
| Indentation | Spaces, 2 |
| Naming (variables) | camelCase |
| Naming (files) | PascalCase for components, camelCase for data/utils |
| Naming (components) | PascalCase |
| Max line length | 100 |
| Quotes | Single |
| Semicolons | Required |

---

## Imports

React first, then third-party libraries, then local components, then data/utils, then styles. No blank lines between groups.

---

## Testing

| Aspect | Convention |
|--------|-----------|
| Framework | None configured |
| File naming | — |
| Location | — |
| Min coverage | — |
| Run command | `npm run dev` (dev server), `npm run build` (production build) |

---

## Git

| Rule | Convention |
|------|-----------|
| Branch naming | feature/description, fix/description |
| Commit style | `tag: message` (e.g. `feat: add project filter`, `fix: mobile nav`) |
| PR template | None |

---

## Error Handling

Minimal — static site with no runtime data fetching. Console.error for any build-time warnings. React Error Boundaries not currently used.

---

## Environment Variables

| Variable | Required? | Purpose |
|----------|-----------|---------|
| (none) | — | Fully static, no env vars |

---

## Files to Avoid Editing

- `node_modules/` — auto-generated
- `dist/` — build output
- `.github/workflows/static.yml` — CI/CD config (modify only for deploy changes)
