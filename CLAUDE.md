# Glonari Homes — website

Multi-page marketing site for Glonari Homes. The site is English only. Talk to the owner (Helen) in Russian.

## Start of every session

Read, in order: this file, then `PROJECT-STATUS.md` (what's done / in progress / left / open questions), `DESIGN-SYSTEM-HOMES.md` (colors, typography, spacing, components), `SITE-STRUCTURE.md` (pages, navigation, per-page sections). Together they restore full context without needing the chat history — the project is worked on from two computers.
Also read DESIGN-BRIEF.md before building or changing any page. It has priority over generic design habits; DESIGN-SYSTEM-HOMES.md and the screenshots in reference/ have priority over it.

## Обязательные правила

- **Отчёт после работы минимальный:** 3–6 строк — что сделано, какие файлы, что осталось открытым. Без скриншотов, без пересказа кода. Скриншоты делать и присылать только если владелец просит.
- **Проверять работу самому и дёшево:** ошибки в консоли, что картинки грузятся, что раскладка не ломается на 1440 и 375 px. Скриншоты для себя — только если без них не понять проблему.
- **Картинки и видео оптимизировать самому, без отдельной просьбы,** каждый раз, когда в `docs/assets/images` появляется новый исходник:
  - картинки → WebP через ffmpeg (libwebp, q 78; с прозрачностью — сохранить альфу), две ширины: 2560 и 1600 для полноэкранных, 1200 и 800 для карточек; имена `page-section-description-width.webp`;
  - видео → MP4 H.264 (crf 26, без звука, faststart) + WebM, до 4 МБ на петлю;
  - исходные PNG/JPG/MP4 переносить в папку `masters/` в корне проекта (она не публикуется); на сайте оставлять только оптимизированные файлы.

## Permanent rules

- Before building or changing any page, read `DESIGN-SYSTEM-HOMES.md` (including its component catalog, §7) and the relevant page entry in `SITE-STRUCTURE.md`.
- After finishing a significant step of work, update `PROJECT-STATUS.md`. Record only decisions made, what changed, open questions, and the next step — never a transcript of the conversation.
- Do not rewrite already-approved code without the owner's permission. Do not delete images or source materials. Reuse existing components, styles and animations (see `DESIGN-SYSTEM-HOMES.md` §7) instead of inventing new ones.
- New pages must visually match the home page and stay responsive (desktop + phone).
- Site text stays in English; talk to the owner in Russian.
- No `git commit`, `push`, or other remote-repository action without the owner's explicit go-ahead.
- Work only inside this project folder; don't start a second project or restructure the site without a clear need.

## Sources (in this folder)
- `Glonari_Homes_All_Pages_v2.md` (2026-11-12): **the main source** for page list, navigation, section order and all copy. It replaces `Glonari Homes — Website Architecture & Copy v2.docx`, which is now historical. Italic notes in it are open questions, not copy: never publish them; collect them in `OPEN-QUESTIONS.md`. Use the copy as-is, do not rewrite or invent text.
- `Glonari Homes — референсы по секциям11.docx`: what each section should look like, reference sites, image rules (types Т1–Т6, size limits) and the rhythm rule (2–3 pinned "scenes" per page, the rest calm "pauses").
- `скрины.zip`: screenshots of the references. `картини.zip`: source images. `glonari-homes-hero.zip`: the owner's original hero (already moved into `docs/`).
- Zip filenames inside use CP866 encoding. Extract with `[IO.Compression.ZipFile]::ExtractToDirectory(zip, dir, [Text.Encoding]::GetEncoding(866))`.
- `GLOBAL-DREAM-LIGHT-DESIGN-SYSTEM.md`, `GLOBAL-RESERVE-DESIGN-SYSTEM.md`, `GLONARI_PULSE_COLORS.md`: design systems for other Glonari products, kept for reference only. `DESIGN-SYSTEM-HOMES.md` is the one that applies to this site — see its §1.1 for exactly what it borrows from these three.

## Stack and decisions
- Plain static HTML/CSS/JS, no build step. GSAP 3.12.5 + ScrollTrigger (cdnjs) and Lenis 1.1.13 (unpkg) load from CDNs.
- Header and footer live once in `docs/partials/header.html` and `footer.html`, embedded into every page between `<!-- partial:header -->` / `<!-- partial:footer -->` markers. After editing a partial, run `python scripts/sync-partials.py` to propagate the change into every page before previewing or committing. The active menu item (`aria-current="page"`) is set by `docs/js/main.js`, not in the markup.
- Hero: the layered visual (the word "GLONARI", valley, woman) stays; the copy is now from `Glonari_Homes_All_Pages_v2.md` Page 01 Screen 01 (owner's decision, 2026-11-12: the document has priority).
- The CTA lighting effect uses the soft version with no mask. The owner approved this.
- `docs/assets/images/`: WebP files, named `page-section-description-width.webp`. Convert new images with ffmpeg (libwebp).
- Scene pattern: CSS by default gives the static final layout (phones, reduced motion, no JS). The `.has-scenes` class turns on sticky stages with a `--travel` height, and gsap.matchMedia sets it at min-width 769px. In scrubbed timelines use `fromTo` instead of `from`: with invalidateOnRefresh, `from` breaks.
- Run locally with `python -m http.server 5173 --directory site`. The same command is saved in `.claude/launch.json` as "glonari-site". Full instructions in `README.md`.
