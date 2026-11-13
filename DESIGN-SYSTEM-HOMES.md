# Glonari Homes — Design System

Version: 1.0 (2026-11-05)
Status: approved by the owner as the base for all new Glonari Homes pages.

## 1. Purpose and precedence

This file is the single visual source of truth for the Glonari Homes website (`docs/`). It documents the system that is **already built and approved** on the home page (`index.html`, `css/main.css`, `css/home.css`), plus the structural guidelines adopted from the wider Glonari design-system family for pages not yet built.

Precedence when documents disagree:

1. The current task/prompt controls scope.
2. The home page as already shipped is the visual reference. Do not change it to match this document — this document was written to match it.
3. This file controls typography, color, spacing, components, and motion for every other page.
4. `SITE-STRUCTURE.md` controls page list, navigation, and section order.
5. `Glonari_Homes_All_Pages_v2.md` (2026-11-12) controls the page list, section order and all English copy. It has priority over the older `.docx` and over earlier decisions about which sections exist.

### 1.1 Relationship to the other Glonari design systems

Three sibling design-system files live in the project root for reference: `GLOBAL-DREAM-LIGHT-DESIGN-SYSTEM.md`, `GLOBAL-RESERVE-DESIGN-SYSTEM.md`, `GLONARI_PULSE_COLORS.md`. They describe **other Glonari products**, not this site. Glonari Homes does not import their tokens or exact colors. It uses:

- **Global Dream Light** — as the source for structural/compositional rules (spacing scale, section rhythm, vertical relationships, responsive bands, motion timing, media and card discipline) in Sections 4–8 below, reconciled with the tokens Glonari Homes already uses.
- **Global Reserve** and **Glonari Pulse** — only for the shared brand DNA in Section 2. Their dark tokens (`--gr-*`, `--gp-*` color values) are not part of this system, except where `--gp-*` is already used on this site today (see 3.4).
- No sky-blue accent (`--gd-sky` in Global Dream Light) is adopted. It is not used anywhere on Glonari Homes.
- No button-radius or heading-font rule is imported from Global Dream Light — Glonari Homes keeps its own already-approved pill buttons and serif headings (Section 3).

## 2. Brand DNA (shared across all Glonari products)

Principles common to Global Dream, Global Reserve and Glonari Pulse, which Glonari Homes also follows:

- Gold/bronze is the one accent that means "Glonari" and "primary action." It is never used decoratively for unrelated elements.
- Warm materials: cream, limestone, bronze, charcoal — never cold or sterile neutrals.
- No neon, no crypto-exchange or gaming visual language, no saturated red/green trading colors.
- Motion is restrained and purposeful, not decorative; it never hijacks scroll outside the approved scenes.
- No heavy shadows or glassmorphism by default; depth comes from contrast and restraint.
- Consistent, generous section padding — never cramped.

## 3. Typography (as built — do not change)

| Role | Family | Where used |
|---|---|---|
| Hero word / large numbers | Cormorant Garamond | `.hero__word` |
| Headings (H2) | Playfair Display | `.h2`, section titles |
| Lead paragraphs | Playfair Display | `.lead` |
| Body text, nav, buttons | IBM Plex Sans | default body font |
| Eyebrows / labels / mono data | IBM Plex Mono | `.eyebrow` |

Loaded once per page via Google Fonts (`Cormorant Garamond 500/600`, `Playfair Display 500`, `IBM Plex Sans 400/500/600`, `IBM Plex Mono 500/600`).

Type sizes in use (`css/main.css`):

- `.eyebrow`: 12px, weight 600, letter-spacing .14em, uppercase, mono.
- `.h2`: `clamp(34px, 4.4vw, 60px)`, weight 500, line-height 1.08.
- `.lead`: `clamp(22px, 2.1vw, 30px)`, weight 500, line-height 1.3.
- Body: 17px / 1.6 (IBM Plex Sans).

**Do not** move standard headings to IBM Plex Sans or otherwise change font roles — this is a deliberate difference from Global Dream Light, confirmed by the owner.

## 4. Color tokens (as built)

Defined in `css/main.css`:

| Token | Hex | Use |
|---|---|---|
| `--gh-cream` | `#F4EDE2` | default page background |
| `--gh-paper` | `#FBF7F0` | lighter surface (cards, light header state) |
| `--gh-line` | `#E2D7C6` | hairlines, dividers |
| `--gh-ink` | `#1F1A14` | primary text, default button fill |
| `--gh-ink-2` | `#5C5145` | secondary/muted text |
| `--gh-gold-ink` | `#8A6628` | gold that must read as text on cream (eyebrows) |
| `--gh-brown` | `#2B1A0C` | footer background, button hover, the dark sections (see 4.1) |
| `--gh-honey` / `--gh-honey-ink` | `#D9BE85` / `#4A3712` | step card "Live" (TBYB timeline) — fill / text |
| `--gh-slate` / `--gh-slate-ink` | `#8FA9C4` / `#1D3049` | step card "Build" — fill / text |
| `--gh-navy` | `#3F5F86` | step card "Decide" — fill (text `--gh-cream`) |

The three step colours are only for coloured step cards on a dark band (Living With Glonari, Try Before You Buy). No green or olive tones.

### 4.1 Dark sections (owner's decision)

**2026-11-12:** the owner confirmed that dark bands may be used on other screens too, wherever the new document's sections call for them. Rule of thumb: at most one or two dark bands per page, hard paper↔brown edges with one `--section-y` inside the band on each side (as on Living). First use after this decision: home page "Your future" (`.future`). The text below is the history of earlier decisions.

Besides the footer, the site has deliberate dark (`--gh-brown`) bands: How It Works chapter 05 (GLO), a future manifesto section, and Living With Glonari section 2 (Try Before You Buy — the third, an exception approved by the owner, 2026-11-06). A dark band in the middle of a page enters and leaves through soft paper↔brown stretches (`clamp(120px, 18svh, 220px)`), not a hard edge.

Living With Glonari section 3 "Two ways to own" is also dark (owner's decision, 2026-11-06): it continues Try Before You Buy as one dark chapter — the two sections share solid `--gh-brown` with no seam. On this page the owner rejected the soft stretches (2026-11-06): the chapter has hard paper↔brown edges, with one `--section-y` of padding on each side of each edge (inside its own band). Further down that page: "When life changes" and "Gia goes with you" are light, "The bigger idea" is dark.

### 3.4 Existing use of Glonari Pulse tokens (open item)

`css/main.css` currently reuses four dark tokens from Glonari Pulse for the dark footer and focus states: `--gp-gold-mid` (focus outline), `--gp-champagne` (footer column headings), `--gp-text` / `--gp-text-2` (footer body text). This predates this design system and is **not changed by this document**.

**Decision (2026-11-05):** a future task will introduce dedicated `--gh-dark-*` tokens (ink/paper equivalents for the one dark section — the footer) so Glonari Homes stops depending on another product's palette. Until that task runs, `--gp-*` stays as-is in `main.css`. Do not remove or rename it without a separate, explicit go-ahead.

No sky-blue token is defined or planned for this site.

## 5. Spacing, grid and section rhythm

Core layout tokens (`css/main.css`):

```css
--container: 1240px;
--page-pad: clamp(24px, 3.5vw, 48px);
--section-y: clamp(96px, 11vw, 168px);
--header-h: 76px;        /* 64px at ≤480px */
--radius: 14px;
--ease: cubic-bezier(.22, .61, .36, 1);
```

Container pattern:

```css
.container {
  width: min(100%, calc(var(--container) + 2 * var(--page-pad)));
  margin-inline: auto;
  padding-inline: var(--page-pad);
}
```

Section spacing rule: a section gets only `padding-top: var(--section-y)`. Never put `--section-y` on both the top and the bottom — the paddings of neighbouring sections add up and double the gap. Only the last section before the footer gets a bottom `--section-y`. A section with a pinned scene gets `padding-top: 0` under `.has-scenes`, because the scene stage brings its own space from the header. (How It Works also follows two corollaries: a section that starts with a full-bleed photo takes the gap as `margin-top`, so it shows the page background; a section on its own background colour, like the dark chapter 05, keeps a bottom `--section-y` inside its band.)

Vertical relationships (adopted from Global Dream Light — consistent with what is already built, now made explicit for new pages):

| Relationship | Distance |
|---|---:|
| Eyebrow to heading | 16–20px |
| Heading to body | 24–32px |
| Body paragraph to secondary paragraph | 16px |
| Body to feature list / component | 32–48px |
| Heading group to major media/grid | 64–96px |
| Divider to content below | 24px |

Two-column split (desktop): `grid-template-columns: minmax(0,1fr) minmax(0,1fr)`, gap 48–96px depending on composition (see `.gia__grid`, `.formula__body` in `home.css` for existing examples). All grid children: `min-width: 0`.

### 5.1 Spacing QA gate (mandatory before reporting any section as done)

Rules:
1. The first text element of a section never touches the section's top edge. Gap from section top to the eyebrow/heading is --section-y (0 only for a pinned scene whose stage brings its own space).
2. Panels and bands (paper panels under photos, dark blocks, cards): padding top and bottom are equal (±8px). Padding between the last content and the next band's edge is a token, never "whatever is left".
3. No dead gap inside a section larger than --section-y; no content jammed against the next section (less than 64px) unless it's a hairline-separated footer-style block.
4. Two-column blocks share one alignment line (tops, or bottoms, or centers) — columns never float at different heights without a design reason stated in the report.
5. Heading group → content, eyebrow → heading, heading → body follow the table in §5.

How to check (do not judge by eye):
- Measure with getBoundingClientRect (Playwright) at 1440×900, 1024, 768 and 375×812. For each section record: top gap, bottom gap, internal panel padding top/bottom, gap between columns' alignment lines.
- Take viewport screenshots scrolled to every section boundary (not full-page; full-page headless screenshots come out blank). Before/after when changing existing spacing.
- If a screenshot or measurement could not be taken, say so; do not claim it was checked.

Report format: after the 3–6 lines, add the table «section | top | bottom | panel pad T/B | OK?» for each section touched, at 1440 and 375. A task without this table is not done. If any value breaks a rule, fix it before reporting; if it is intentional, state why.

### 5.2 Spacing check (mandatory)

After every edit to a page, check spacing with numbers, not by eye. Runs together with §5.1 and before every report.

For each section, measure the distance between neighbouring blocks (getBoundingClientRect, Playwright) at **1440, 1024, 768 and 375 px** and put the numbers in the report.

Norms:
- Between large blocks (section → section, heading group → major media/grid): at least one `--section-y`.
- Between a pinned scene and the next section: at least `clamp(120px, 16vw, 240px)`.
- Nothing touches the edge of the neighbouring screen (scene stage, next section, viewport edge).
- Nothing overlaps the eyebrow of the next section (the eyebrow's top must be below the previous block's bottom).

If any number is below the norm, fix it before reporting. Do not report with a known violation; if a value is intentionally lower, state why in the report.

## 6. Responsive bands (as built)

- **≥ 1101px** — full desktop header (inline nav + CTA).
- **769–1100px** — tablet: nav collapses to the burger menu (`@media (max-width: 1100px)` in `main.css`); two-column sections may still sit side by side depending on the section.
- **≤ 768px** — scenes drop their pinned/sticky behavior (`.has-scenes` is only enabled by JS at `min-width: 769px`); split layouts stack to one column.
- **≤ 480px** — `--page-pad: 20px`, `--header-h: 64px`.

New pages should test at 1440×900, 1024px, 768px and 375px, matching how the home page was checked (see `PROJECT-STATUS.md`).

## 7. Components (catalog)

| Component | Class(es) | Notes |
|---|---|---|
| Primary button | `.btn` | Pill shape (`border-radius: 999px`), dark ink fill, 52px min-height. Do not change to the 6–8px radius used by other Glonari products. |
| Button variants | `.btn--small`, `.btn--light`, `.btn--ghost` | Small = 42px height; light = cream fill for dark backgrounds; ghost = transparent/outline for dark backgrounds. |
| Link with arrow | `.link-arrow` | Underlined text + arrow that slides on hover. |
| Eyebrow label | `.eyebrow`, `.eyebrow--light` | Mono, uppercase, gold-ink on light / champagne on dark. |
| Heading | `.h2`, `.lead` | See Section 3. |
| Site header | `.site-header` (+ `.is-solid`, `.is-hidden`) | Fixed; transparent with light text over the hero, switches to solid cream + dark text once scrolled (`.is-solid`), hides on scroll-down (`.is-hidden`). |
| Mobile nav | `.nav`, `.burger`, `.nav-open` | Collapses under 1100px; full-screen panel, large Playfair Display links. |
| Site footer | `.site-footer` | Dark (`--gh-brown`), three-column link grid + brand column, disclosure and legal lines. See 3.4 for its token dependency. |
| Placeholder/stub page | `.stub` | Used by the five not-yet-built pages: header-height offset, `.h2` + one paragraph. Replace with real sections when a page is built — do not leave `.stub` in a "finished" page. |
| Reveal animation | `[data-reveal]` / `.is-in` | Simple fade-up for static ("pause") content blocks; disabled under `prefers-reduced-motion: reduce`. |
| Scene (pinned scroll stage) | `.scene`, `.scene__stage`, `.has-scenes` | Tall wrapper + sticky full-screen stage for scrubbed GSAP timelines; CSS alone renders the static final layout (mobile / reduced motion / no-JS); `.has-scenes` + pinning is added by `gsap.matchMedia` at `min-width: 769px`. Used by: hero, problem (before/after), formula (the three cards), economics, Try Before You Buy. |
| Formula card | `.fcard` | Square image + label, used in the "Home + Business + Gia" scene. |
| Chat widget | `.chat`, `.msg--you`, `.msg--gia`, `.msg--typing` | Conversation with Gia. Look and typing dots live in `main.css`; each page sets only the placement (home "Meet Gia": `.gia .chat` in `home.css`; Living "Gia goes with you": `.liv-gia__chat`, scrubbed history in `living.js`). |
| TBYB frame | `.tbyb__frame`, `.tbyb__progress` | Horizontal scroll track with numbered captioned frames. |
| Chapter rail (How It Works) | `.hiw-toc` + `--rail` | Fixed left chapter list ≥1101px (content padded by `--rail`), compact "02 / 08" chip below; `.is-dark` inverts it over dark areas. |
| Chapter opener | `.hiw-opener` | Full-screen photo pause: left veil, huge Cormorant number, heading revealed line by line (`--d`), slow zoom. |
| Chapter head | `.hiw-head` | Big gold Cormorant number (lining figures) + eyebrow + `.h2`. |
| Gold line / timeline (Living) | `.liv-rail`, `--tl-x`, `.liv-step__card` | One 1px gold vertical (`--gp-gold-mid`) shared by Security and TBYB via `--tl-x` (share of the container width); starts at a 13px ring; in TBYB it becomes a step scale (mono labels left, cards right, travelling dot). Cards: outlined, or filled with the step colours + slight tilt. In "Two ways to own" the line splits into two SVG paths to the cards (≥1101px, motion-safe). |
| Ownership duo (Living) | `.liv-own__duo`, `.liv-own__card` | The `.hiw-duo` two-card hover-widen pattern repeated on brown: card fill cream 5%, 1px cream 12% border, gold focus outline. |
| Manifesto scene (Living) | `.liv-idea*` | Pinned dark stage: lines stacked in one grid cell replace each other on scroll, overlay thins, canvas gold dust; the page's main CTA as a gold `.btn` (`.liv-idea__btn`, `--gp-gold` fill, ink text). Static: lines stacked. |
| Line icons | `.hiw-icon` + `<symbol>` sprite | 48×48, 1.5px stroke, `currentColor` (gold-ink on cream, cream on dark). |

### 7.1 Media rules (as built)

- Every photo has an explicit `width`/`height` (or `aspect-ratio`) and `srcset` for at least two sizes.
- `loading="lazy"` on everything except the hero's three layered images (`fetchpriority="high"`).
- Decorative images: empty `alt=""`; meaningful photography has a full descriptive `alt`.
- `object-fit: cover` for all cropped photography.

## 8. Motion

- Reveal: opacity 0→1, `translateY(28px)→0`, 900ms, `var(--ease)`.
- Hover feedback: 200–300ms.
- Scrubbed scenes use GSAP `fromTo` (never bare `from` — breaks under `ScrollTrigger.refresh()`).
- `prefers-reduced-motion: reduce` must show the complete static final composition — reveal and scene-pin both have a no-motion fallback already built in.

## 9. What not to bring in from the sibling design systems

- Do not adopt `--gd-*` / `--gr-*` / `--gp-*` exact color values as new Homes tokens.
- Do not add a sky-blue secondary accent.
- Do not change button radius to 6–8px or drop pill buttons.
- Do not move H1/H2 to IBM Plex Sans.
- Do not introduce Reserve's or Pulse's full dark-mode surfaces — Glonari Homes is light; the footer (governed by 3.4) and the dark bands allowed by 4.1 are the only dark areas.

## 10. Before building a new page

Read this file in full, plus `SITE-STRUCTURE.md` for that page's planned sections and `Glonari Homes — Website Architecture & Copy v2.docx` for its approved copy. Reuse the components in Section 7 before inventing new ones. New pages must visually match the home page — same header/footer, same type scale, same spacing tokens, same motion language.
