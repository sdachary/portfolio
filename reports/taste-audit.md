# Taste Audit — Portfolio (sdachary.github.io)

## Design Read

Reading this as: **developer/architect portfolio** for **technical hiring managers and prospective clients**, with a **brutalist-meets-editorial** language, leaning toward **custom CSS + framer-motion + SVG noise overlay**.

---

## Scores

| Dimension | Score (1–10) | Notes |
|-----------|:---:|-------|
| **Originality** | 7.5 | Distinct typographic system (Bebas Neue + Fraunces + DM Mono), SVG noise overlay, dual-identity split layout, warm-dark palette. Not a template — genuinely authored. Loses points for standard scroll-reveal stagger and the familiar portfolio section ordering (Hero → About → Skills → Projects → Contact). |
| **Visual Sophistication** | 8.0 | Strong materiality: grain overlay, glass navbar, outlined big numbers, gold/rust accent pair on near-black. Typographic hierarchy is intentional. The warm off-white text (`#f0ece4`) against `#080808` is a considered choice, not a default. Light mode is also well-executed with a warm cream base. The hero gradients (gold radial + rust radial blended) are brand-consistent. |
| **Premium Feel** | 7.0 | Feels intentional and bespoke, not templated. However, the absence of real imagery (hero background is a gradient, no profile photo, no project screenshots) reduces the premium perception. Premium portfolios at this tier typically lead with a real photograph or cinematic visual. The all-typography approach is a legitimate minimalist choice but straddles "intentional restraint" and "incomplete." |
| **Design Taste** | 8.5 | The type choices are unconventional and cohesive — Bebas Neue for display (often misused) works because the rest of the system is subdued. The Fraunces serif for body is a bold pick (rare in dev portfolios). Gold/rust pairing is distinctive. The SVG noise is subtle enough to add texture without distraction. The giant outlined "9" and "Deepak" background text show editorial confidence. |
| **Motion Quality** | 6.0 | framer-motion `whileInView` staggers on every section — this is the default AI/dev-portfolio move and feels mechanical after the third section. The custom cubic bezier (`0.32, 0.72, 0, 1`) is good. No scroll-driven animation, no parallax, no pinned sections, no micro-interactions beyond hover states. Motion is present but not expressive. Respects `prefers-reduced-motion`. |
| **Typography Quality** | 8.0 | Excellent type selection and pairing. Bebas Neue headline scale is aggressive but controlled (`clamp(3.5rem, 10vw, 9rem)`). Fraunces body is readable with good line-height. DM Mono for metadata is consistent. **However**: Plus Jakarta Sans is loaded via Google Fonts but **never used** anywhere — dead weight (~25KB). `font-display: swap` is set but performance could be better with `next/font`-style self-hosting (impossible in Vite — but preconnect + preload could be optimized). |
| **Layout Creativity** | 7.0 | Strong asymmetric bento for projects (featured card spans full width), 1.5fr/1fr/1fr asymmetric card grid, dual-identity split with vertical ruler, activity timeline with gradient rail. The section-layout repetition is moderate — About and Services both use left-text-right-card patterns. The all-sections-in-order (Hero → About → Identity → Services → Skills → Projects → Blog → Activity → Experience → CTA → Contact) is the conventional portfolio arc. |

---

## Detailed Observations

### Strengths

- **Consistent dark-light dual mode** — not a common portfolio feature. The light theme flip is well-calibrated (warm cream, not cold white).
- **Materiality through noise** — the SVG fractal noise overlay is a premium touch seen on high-end agency sites. Subtle enough at `opacity: 0.4`.
- **Typography-first identity** — no hero image, no avatar, no logos. The design commits to type as the primary visual element. This is rare and confident.
- **Custom easing curve** — used consistently across all transitions. Small detail, big impact.
- **Outlined numbers as editorial devices** — the `-webkit-text-stroke` treatment on "9" and section background text is well-executed.
- **Dual Identity section** — the Day/Night split with vertical divider is the most original layout on the page. Communicates the dual role effectively.

### Weaknesses

- **No real imagery** — 0 photos, 0 screenshots, 0 illustrations. The gradient hero and noise overlay are the only "visuals." For a portfolio of a data architect + full-stack builder, showing no output (no dashboards, no architecture diagrams, no product screenshots) is a missed trust signal.
- **Motion monotony** — every section uses the same `whileInView: { opacity: 1, y: 0 }` stagger. After the 4th section, the animation feels templated rather than expressive. No section has a distinct entrance choreography.
- **Plus Jakarta Sans shipped but unused** — a ~25KB font download that has zero visual impact. This is a performance leak.
- **No favicon on dark browser tabs** — the SVG favicon uses `#080808` background, making it invisible on dark-themed browsers until hovered.
- **Hero lacks a secondary visual hook** — the gradient is beautiful but static. A subtle particle effect, a typed loop, or a scroll-driven reveal of the headline would elevate it.
- **Blog posts use `dangerouslySetInnerHTML`** — security concern for a portfolio that sources from hardcoded data, but still a red flag in audit.
- **Async data fetches have no loading states** — `Projects.tsx` and `RecentActivity.tsx` silently return `null` if the fetch fails. No skeleton, no error message, no retry.

---

## Recommendations

1. **Add one hero visual** — an architecture diagram, a data viz snippet, or an abstract generative art piece generated by one of the tools in your ecosystem. The all-text hero is a statement, but one visual anchor would push premium feel from 7 to 8.
2. **Differentiate section entrances** — vary the motion language per section. Hero could have a typewriter or letter-stagger reveal. Projects could use a scale-in. About could use a wipe. Currently everything fades up.
3. **Remove Plus Jakarta Sans** — save ~25KB and one HTTP request.
4. **Add loading/error states** to the two JSON-fetching components — currently invisible failures.
5. **Fix favicon contrast** — use a visible background for dark-mode tabs.
6. **Avoid `dangerouslySetInnerHTML`** — render blog body as React components or at minimum sanitize the HTML string.
7. **Consider a scroll-driven section** — the Dual Identity section is a natural candidate for a pinned scroll-reveal (cards slide in as the user scrolls through), which would differentiate it from the fade-up rhythm of every other section.
