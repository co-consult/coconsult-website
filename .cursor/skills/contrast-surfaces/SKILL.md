---
name: contrast-surfaces
description: >-
  Enforce readable text contrast on Coconsult website UI. Use whenever editing
  CSS, Astro layouts, experience pages, heroes, eyebrows, CTAs, cards, or any
  visual pass — especially modes, cases, solutions, innovation, partnerships,
  sectors, home paper sections, and service pages.
---

# Contrast on light and dark surfaces

## Hard rule

- Never place light text on a light background.
- Never place dark text on a dark background.
- Eyebrows, kickers, meta labels, muted copy, links, and icons must remain clearly readable against their actual surface.

## Surfaces in this project

| Surface | Examples | Text must be |
| --- | --- | --- |
| Light / paper | `.paper`, `.modes-page`, `.cases-page`, `.solutions-page`, `.innovation-page`, `.partnerships-page`, `.sectors-page`, `.service-page`, white cards | Dark ink (`#122033`, `#0b5f6b`, `#24384c`) — not `--cyan` / `#8ef3ff` |
| Dark / night | `.experience` night hero, final CTA night band, chatbot panel | Light ink (`#e7eef2`, `#8ef3ff`) — not paper-ink |

## Primary buttons

On light pages, `--cyan` is remapped to dark teal. Never keep night primary styling (`color: #062033` on cyan) there — use **white text on `var(--brand-teal)`**. On `.final-cta` (night band), keep light cyan fill with dark ink.

## Common failure

`.eyebrow` and `.section-head > .eyebrow` default to `var(--cyan)` (`#8ef3ff`) for the dark home experience. On light pages that cyan becomes unreadable. On paper-like pages, force:

```css
color: #0b5f6b; /* or var(--brand-teal) when it resolves dark */
```

Also remapped on light shells:

```css
.modes-page,
.cases-page,
.solutions-page,
.innovation-page,
.partnerships-page,
.sectors-page,
.service-page {
  --cyan: #0b5f6b;
}
```

## Checklist before finishing UI work

1. Identify whether the section is light or dark.
2. Check eyebrows, kickers, meta lines, links, and muted paragraphs.
3. Prefer explicit dark teal / ink on light surfaces over inheriting night `--cyan`.
4. Prefer explicit light ink / cyan on dark surfaces over inheriting paper ink.
5. Verify with a screenshot or computed styles when unsure.
