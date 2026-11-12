# Glonari Homes — Design Brief (read before building or changing any page)

Precedence: `DESIGN-SYSTEM-HOMES.md`, the already built pages and the screenshots in `reference/` come first. This brief comes after them. If a rule below conflicts with a reference or with the design system, follow the reference / design system. Use the owner's provided copy as-is (`Glonari_Homes_All_Pages_v2.md`); do not rewrite or invent text.

## Objective

Create web layouts and code that feel handcrafted and intentional, as if made by a thoughtful human designer. Avoid predictable AI patterns, generic SaaS landing page structures and overused web clichés. The result must have character but stay clear, usable and easy to read at first glance. When choosing between bold and clear, choose clear.

## Layout

- Avoid formulaic alternating blocks (image left / text right, then the reverse).
- Prefer asymmetrical grids, varied column widths, slight offsets and generous white space as a deliberate design element.
- Overlaps and grid breaks are allowed as accents only. The underlying structure must stay clear and readable.

## Typography

- Typography is the foundation: large-scale, expressive headings with print-inspired layout.
- Use the typefaces from the design system. If a new pairing is needed (for example a serif for key messages and a monospace for technical accents), propose options rather than choosing something exotic on your own.

## Texture and detail

- Avoid smooth glossy gradients, glows and neon outlines.
- Favor tactility: subtle noise or micro-textures, thin crisp lines (1–2px), and a contrast between sharp corners and soft curves, but only where it fits the references and the design system.

## Motion

- Subtle and purposeful. Maximum 1–2 signature effects per screen (for example a scroll reveal or a per-character text animation); keep everything else calm.
- Animation must support reading and orientation, never get in the way. Respect `prefers-reduced-motion`.

## Code

- Clean semantic markup, tidy CSS components, no redundant code.
- Fully responsive (mobile included) with comfortable text contrast and legibility.

## New screens and sections (owner's rule, 2026-11-12)

- If the document or the design needs a screen that does not exist yet, build it as a **new, full screen** with its own composition, designed to the level of the home page (the hero, the wipe scene, the pinned numbers). Say so in the plan; do not hide it as an add-on.
- Never attach extra content to an existing screen just because it is convenient. If it would look cramped, small or ugly, it becomes its own screen.
- Never fall back to a generic block (image on one side, text on the other, a plain card, small print over a photo). Mandatory notes and disclaimers are part of the design: readable (at least 16px, contrast 4.5:1), on a calm background, never over a busy photo.
- If there is no suitable image or video yet, use a placeholder (any stock-looking image or video, clearly named `placeholder-…`) so the owner can see the real composition and replace the media later. Do not wait for assets and do not fill the gap with a plain template.
- Before showing a new screen, run the self-check below. The owner should not have to say that something looks bad.

## Self-check before delivering

1. Does it look like a typical template or AI-generated page?
2. Is everything easy to read and understand at first glance?
3. Does it match the references and the design system?

If the answer to 1 is yes, or to 2 or 3 is no, revise before showing it.

## Deliverable

A polished, studio-quality result with its own personality that does not look templated, and does not look strange for the sake of being different.
