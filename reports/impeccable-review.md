# Impeccable Review — Portfolio (sdachary.github.io)

## Scoring

| Dimension | Score (1–10) | Notes |
|-----------|:---:|-------|
| **Pixel Perfection** | 7.5 | Generally clean — spacing is consistent (8rem section padding, 3rem horizontal), grids align, no visual jank on desktop. Some issues emerge on intermediate widths and with certain component states. |
| **Component Consistency** | 8.0 | Strong consistency across the system: cards share the same radius (16px), border pattern (1px solid `--line`), hover behavior (gold border). The card system is well-normalized — `.card`, `.card-grid`, `.card-grid-2`, `.card-grid-asymmetric` form a coherent family. |
| **Interaction Quality** | 6.5 | Hover states are present (gold border, shadow lift) but minimal. No pressed/active state feedback on cards. Buttons have hover but no active scale. Form inputs lack focus ring visibility. The theme toggle is a plain `<button>` with emoji content — no transition on the icon swap. |
| **UX Craftsmanship** | 7.0 | Good information architecture — the portfolio arc makes sense. But async data handling is weak (silent null returns), and the blog's `dangerouslySetInnerHTML` is a craftsmanship concern. The scroll spy (navbar appearing only after Hero exits) is a thoughtful touch but implemented with raw scroll listener instead of IntersectionObserver. |

---

## Detailed Findings

### Layout & Alignment

- **Section padding is consistent** — 8rem top/bottom with 3rem horizontal. `.section-alt` properly alternates `--bg2`. The rhythm is reliable.
- **Navbar pill is visually centered** — uses flexbox centering inside a pointer-events-none wrapper. Correct approach.
- **Hero fits viewport** — `height: 100dvh` on desktop (note: should use `min-height: 100dvh` for mobile Safari, but the hero has no scrollable overflow so current behavior is acceptable).
- **Project bento cards align properly** — `featured` class spans `grid-column: 1 / -1` which preserves the 2-column structure. Correct.
- **Blog content width** — capped at 820px, preventing overly long lines. Good typographic practice.

### Component States

| Component | Normal | Hover | Active/Focus | Empty | Error | Notes |
|-----------|--------|-------|-------------|-------|-------|-------|
| Nav links | Muted text | **No visible hover** | No active state | N/A | N/A | - | |
| CTA button (gold pill) | Gold bg | **Brightened** | No active scale | N/A | N/A | `filter: brightness(1.2)` on hover is good but no `:active` | |
| Skill cards | Dark bg | Gold border, shadow | No active state | N/A | N/A | Good hover | |
| Project cards | Dark bg + border | Gold border, shadow, lift | No active state | `null` (hidden) | `null` (silent) | Missing loading/error states | |
| Blog filter buttons | Dark bg | Muted border | `.active` gold bg | "No posts match" | N/A | Active state is good | |
| Contact form inputs | Transparent | No hover | **No visible focus ring** | N/A | Inline error | Error state exists but focus state is weak | |
| Theme toggle | Bordered button | No visible hover | No focus ring | N/A | N/A | Emoji swap has no transition | |

### Border & Radius Consistency

- Card radius: **16px** — used everywhere cards appear. Consistent.
- Button/pill radius: **100px/50%** — used for CTAs, nav pill, filter pills. Consistent.
- Input radius: **100px** — search bar and form inputs. Same as buttons. Consistent.
- Border style: **1px solid `--line`** — used on cards, navbar, buttons, inputs, dividers. Consistent.
- **Exception**: The `.dual-vr` vertical ruler is `1px solid var(--line)` — consistent with the system.

### Color Application

- Gold (`#c8922a`) is consistently used for: brand mark, section accents, hover states, active filters, activity dots. No drift.
- Rust (`#b84c2a`) is consistently used for: hero gradient, "Night" section accent. No drift.
- Status colors are consistent: green (live), gold (in-progress), blue (local), muted (open-source).
- **Light mode** color flips are consistently applied. No element misses its `[data-theme="light"]` override.

### Typography System Usage

| Font | Used correctly | Where |
|------|:---:|-------|
| Bebas Neue | ✅ All headlines, section titles, display text | `.section-title`, `.hero-headline`, `.dual-title`, `.contact-headline` |
| Fraunces | ✅ All body text, descriptions, paragraphs | About paragraphs, service descriptions, project descriptions, blog body |
| DM Mono | ✅ All metadata, nav, tags, labels, inputs | Nav links, tags, dates, form inputs, buttons, activity cards |
| Plus Jakarta Sans | ❌ **Loaded but never used** | Nowhere in CSS — dead weight |

### Animation Implementation

- **framer-motion `AnimatePresence`** for navbar mount/unmount — correct usage.
- **Variants** for staggered children — correct pattern, used in Skills and Dual Identity.
- **`whileInView`** on every section — consistent but monotonous (see taste-audit.md).
- **Custom easing** `0.32, 0.72, 0, 1` — applied consistently across all framer-motion transitions.
- **`useReducedMotion`** via `<MotionConfig reducedMotion="user">` — correctly implemented at root level.
- **CSS `prefers-reduced-motion: reduce`** override block — covers all animations as a backup.

### Accessibility Audit

| Requirement | Status | Details |
|-------------|:------:|---------|
| Skip link | ✅ | Present, visible on focus |
| Semantic HTML | ✅ | `<nav>`, `<section>`, `<article>`, `<h1-h3>` used |
| Heading hierarchy | ✅ | H1 (Hero), H2 (sections), H3 (cards) — logical |
| Alt text | ✅ | No images, so no violations |
| Form labels | ✅ | `aria-label` on inputs |
| Focus states | ⚠️ | Nav links and form inputs lack visible focus indicators |
| Color contrast | ✅ | Warm off-white text on near-black — well above 4.5:1 |
| `prefers-reduced-motion` | ✅ | Both framer-motion config and CSS fallback |
| `dangerouslySetInnerHTML` | ⚠️ | Used in DualIdentity title and Blog body — XSS vector if source compromised |
| Keyboard navigation | ⚠️ | Generally works but no focus rings means keyboard users can't see their position |

---

## Priority Fixes

1. **Add focus rings to all interactive elements** — currently missing on nav links, form inputs, and skill cards. This is a WCAG failure.
2. **Add `:active` scale transforms** — `scale(0.97)` or `translateY(1px)` on press for buttons, cards, links. Currently only hover is handled.
3. **Add loading states** to Projects and RecentActivity — silent `null` return is broken UX.
4. **Add hover state to nav links** — they're entirely unresponsive until clicked.
5. **Fix theme toggle emoji transition** — the sun/moon swap should cross-fade instead of instant swap.
