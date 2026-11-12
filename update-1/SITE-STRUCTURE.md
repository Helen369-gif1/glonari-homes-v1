# Glonari Homes — Site Structure

Page list, navigation, and per-page sections. Approved English copy for each section lives in `Glonari_Homes_All_Pages_v2.md` (main source since 2026-11-12; it replaces the older `.docx`) — this file does not duplicate it, only the structure. Visual rules live in `DESIGN-SYSTEM-HOMES.md`. Build status lives in `PROJECT-STATUS.md`.

## Navigation (as built, every page)

- **Header nav:** Home · How It Works · Living With Glonari · Find Your Home · Glonari Properties · FAQs
- **Header CTA** (always visible, not in the nav list): Find My Glonari Home → `find-your-home.html`
- **Footer columns:** *Explore* — the six pages above; *Legal* — Privacy, Legal & Disclosures, Contact (the last three still `#`). Tagline: "AI for Human Prosperity™".
- **Footer disclosure** (verbatim from the document, every page): "Glonari Homes is a proposed program. Content and numbers on this preliminary site are illustrative and subject to definitive agreements and approval…"

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

### 1. Home — `site/index.html` — ✅ rebuilt to the 2026-11-12 document

1. Hero (scene, layered; new copy)
2. Why Glonari? (wipe scene, "More Than a Place to Live.")
3. The cost (pinned numbers: $7,469 · $8,333 · −$2,500 · $5,833; the "Important" note always visible)
4. Find your home
5. Meet Gia (chat kept as it was, owner's decision)
6. Your future (dark band)
7. Final invitation

### 2. How It Works — `site/how-it-works.html` — ✅ built (awaiting owner review)

A "magazine in eight chapters". Page files: `css/how-it-works.css`, `js/how-it-works.js`. Pinned scenes: first screen, 04, 08 (exactly three). Chapter anchors `#ch-01`…`#ch-08`.

- First screen (scene) — layered terrace / "HOW IT WORKS" / family cut-out, copy "How a Glonari Home Works"
- Chapter rail 01–08, fixed left (compact "02 / 08" at ≤1100px)
1. Four Parts — 4 cards
2. Where the Money Comes From — full-screen opener, paragraph, 4 source cards, closing line
3. Participation — two highlighted columns
4. How Results Work (scene) — flow diagram + statement + disclaimer
5. GLO (the only dark chapter) — opener, GLO seal, is / is-not panels, note
6. Your Statement — Digital Banker mock-up built in code + chat with Gia
7. Privacy — copy + three icon labels
8. The Whole System — opener, then scene: cut-out + five cards, closing line, CTA → `living-with-glonari.html`

### 3. Living With Glonari — `site/living-with-glonari.html` — ✅ built (awaiting owner review)

Page files: `css/living.css`, `js/living.js`. Pinned scenes (owner's decision, four): Hero, Try Before You Buy, Gia goes with you, The bigger idea.

Planned sections:

- Hero (scene) — garden → kitchen → "LIVING" → family cut-out, copy "This Is Your Home While You Build Your Future." ✅
1. Security (`#security`, pause, paper) — 01–04 + note; the gold line starts here ✅
2. Try Before You Buy™ (`#try-before-you-buy`, scene, dark) — the gold line becomes the Prepare → Decide timeline with step cards ✅
3. Two ways to own (`#ownership`, linked from the home page; pause, dark — continues TBYB) — two hover-widen cards, the gold line splits into two paths, closing line ✅
4. When life changes (`#when-life-changes`, pause, paper) — self-playing stage (5 s per scenario): scenario buttons | stack of three 4:5 photo cards + Gia pill | Gia card with 4 steps lighting up; phones: stack + dots + status line, swipe ✅
5. Gia goes with you (`#gia-goes-with-you`, scene, paper) — one room by a big window, four views behind the glass (City · Suburb · By the sea · Garden home), Gia's chat keeps its history; phones: room + chat below + 4 view cards ✅
6. The journey before and after (`#journey-before-and-after`, pause, paper) — preview frame linking to Global Dream Journey™ + copy, two columns ≥1024px ✅
7. The bigger idea (`#the-bigger-idea`, scene, dark) — night villa, five manifesto lines one at a time in gold Cormorant, gold dust (canvas), the night lightens, gold button → Find Your Home; static: all lines stacked ✅

### (retired) Already Own a Home? — `site/already-own-a-home.html` — unlinked, kept as a file

Page files: `css/own.css`, `js/own.js`.

Planned sections:

- Hero (scene) — sunset → porch home → "HOME" → woman in her chair, copy "Your Home. More Possibilities." ✅
1. What Gia can do in your home
2. Module vs. full Glonari Home
3. Status and CTA

### 5. Find Your Home — `site/find-your-home.html` — ⏳ stub only

Planned sections:

- Hero
1. Conversation with Gia
2. Your Glonari Home journey
3. Illustrative home card

### 6. FAQs — `site/faqs.html` — ⏳ stub only (7 screens in the document; questions without an approved answer are shown with the note that terms will be in the final agreements — owner's decision)

### 7. Glonari Properties & GPA — `site/glonari-properties.html` — ⏳ stub only (new page, 7 screens in the document)

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
