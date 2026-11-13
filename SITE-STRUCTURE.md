# Glonari Homes — Site Structure

Page list, navigation, and per-page sections. Approved English copy for each section lives in `Glonari_Homes_All_Pages_v2.md` (main source since 2026-11-12; it replaces the older `.docx`) — this file does not duplicate it, only the structure. Visual rules live in `DESIGN-SYSTEM-HOMES.md`. Build status lives in `PROJECT-STATUS.md`.

## Navigation (as built, every page)

- **Header nav:** Home · How It Works · Living With Glonari · Find Your Home · Glonari Properties · FAQs
- **Header CTA** (always visible, not in the nav list): Find My Glonari Home → `find-your-home.html`
- **Footer columns:** *Explore* — the six pages above; *Legal* — Privacy, Legal & Disclosures, Contact (the last three still `#`). Tagline: "AI for Human Prosperity™".
- **Footer disclosure** (verbatim from the document, every page): "Glonari Homes is a proposed program. Figures on this site are estimated examples, subject to definitive agreements and approval. Investment values can change. Property availability and GPA liquidity are not guaranteed. Conceptual images or examples do not establish actual operating inventory. This website is not an offer to sell, lease, or finance property or to sell securities."

`find-your-home.html` is now a top-level nav item and also the target of the header CTA. `already-own-a-home.html` is no longer in the menu or footer (the document has no such page); the file is kept unlinked.

## Visitor journey (from the architecture doc)

Each page answers one visitor question:

| Page | Visitor's question | What they leave with |
|---|---|---|
| Home | Why would I want this? | A home that costs less and builds toward something |
| How It Works | How can that possibly work? | The four parts, my role, where the money comes from |
| Living With Glonari | What is life like, and where can it lead? | Security, flexibility, a path to ownership |
| Already Own a Home? | Can I get this where I live now? | The Home Module and how to join the waitlist |
| Find Your Home | What do I qualify for? | A first conversation with Gia |
| FAQs | What about...? | Short, honest answers |

Intended reading order: Home → How It Works → Living With Glonari → Find Your Home, with FAQs catching everything else and homeowners branching to Already Own a Home? from the menu.

## Pages

### 1. Home — `docs/index.html` — ✅ rebuilt to the 2026-11-12 document

1. Hero (scene, layered; new copy)
2. Why Glonari? (wipe scene, "More Than a Place to Live.")
3. The cost (pinned numbers: $7,469 · $8,333 · −$2,500 · $5,833; the "Important" note always visible)
4. Find your home
5. Meet Gia (chat kept as it was, owner's decision)
6. Your future (dark band)
7. Final invitation

### 2. How It Works — `docs/how-it-works.html` — ✅ rebuilt 2026-11-12 to Page 02 of the v2 document (awaiting owner review)

7 screens. Page files: `css/how-it-works.css`, `js/how-it-works.js`. Pinned scenes: exactly three (01, 05, 07). Anchors `#ch-01`…`#ch-07`; fixed left rail of 7 (compact "02 / 07" at ≤1100px). One dark band: 04.

1. Introduction (scene) — layered terrace / "HOW IT WORKS" / family cut-out; "A Better Way to Live. Built Around You."; button → 02
2. Who does what? — four role cards (Properties, Homes, Gia, You), dealt onto the table
3. Choose your home — headline + tall photo with a survey line; button → Find Your Home
4. Understand the cost (dark) — fee sentences, ledger of the three figures, note; button → `find-your-home.html#cost-illustration`
5. Who can join? (scene) — café parallax opener, text below
6. The journey — four nodes on a gold line (no pin)
7. Next step (scene) — family parallax opener, text + "Find My Home" below

### 3. Living With Glonari — `docs/living-with-glonari.html` — ✅ rebuilt 2026-11-12 to Page 03 of the v2 document (awaiting owner review)

7 screens. Page files: `css/living.css`, `js/living.js`. Pinned scenes: exactly three (01, 02, 07). Anchors kept for the home page: `#gia-goes-with-you`, `#when-life-changes`.

1. Hero (scene) — garden, kitchen, "LIVING", family; "The Life You Make at Home."; button → `#gia-goes-with-you`
2. Everyday life with Gia (`#gia-goes-with-you`, scene, paper) — one room, four views behind the glass, Gia's chat keeps its history
3. Feeling at home (`#feeling-at-home`, pause, paper) — wide strip, the light comes on with the scroll
4. When life changes (`#when-life-changes`, pause, paper) — self-playing stage: tabs | photo stack + Gia pill | Gia steps
5+6. The possibility of ownership / What stays with you? (`#ownership`, `#what-stays-with-you`, one dark chapter, no pin) — two gold lines that never touch, sentences laid out along them
7. Final invitation (`#final-invitation`, scene, dark) — night villa, headline, line, "Explore Your Home" → Find Your Home

### (retired) Already Own a Home? — `docs/already-own-a-home.html` — unlinked, kept as a file

Page files: `css/own.css`, `js/own.js`.

Planned sections:

- Hero (scene) — sunset → porch home → "HOME" → woman in her chair, copy "Your Home. More Possibilities." ✅
1. What Gia can do in your home
2. Module vs. full Glonari Home
3. Status and CTA

### 4. Find Your Home — `docs/find-your-home.html` — ✅ built (Page 04 of the document, 6 screens)

Page files: `css/find.css`, `js/find.js`. Media are `placeholder-find-…` until the real ones arrive (see `PROJECT-STATUS.md`).

1. Hero (scene, pin) — street + home, "The Home You Have in Mind.", "Start Exploring" → `#where`; the "Glonari Properties may evaluate…" disclaimer on a paper bar that slides up at the end of the scene
2. Where would you like to live? (`#where`, pause, paper) — huge headline, lead, abstract map with a gold route and unnamed rings
3. The first questions (`#priorities`, scene ≥1024px, paper) — five read-only questions replace each other, a square arch with a gold outline opens upward; list with small arches below 1024px / reduced motion
4. Do I qualify? (`#options`, **the page's only dark band**, hard edges, no pin) — two statements, gold rule between them
5. Your home cost illustration (pause, paper) — invisible anchor `#cost-illustration`; house cut-out from the home page, ground line, "illustrative" underlined on scroll
6. What happens next? (`#next`, scene, pin) — family parallax, paper panel with the closing lines and the button "Request a Personal Cost Overview" (placeholder `href="#"`)

Pinned scenes: 01, 03, 06 (03 can lose its pin if three feel heavy: the questions then change with normal scroll).

### 6. FAQs — `docs/faqs.html` — ⏳ stub only (7 screens in the document; questions without an approved answer are shown with the note that terms will be in the final agreements — owner's decision)

### 7. Glonari Properties & GPA — `docs/glonari-properties.html` — ⏳ stub only (new page, 7 screens in the document)

Planned categories:

- The basics
- Money
- GLO
- Living and owning
- Privacy

## Cross-page links already referenced from the home page

- `how-it-works.html`
- `living-with-glonari.html#when-life-changes` and `#gia-goes-with-you`
- `find-your-home.html` (plain)

When each stub page is built, keep these anchors (`#value`, `#ownership`, `#qualify`) or update the home page links to match the final section IDs.
