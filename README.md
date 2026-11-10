# Glonari Homes — website

A static marketing site for Glonari Homes. Plain HTML/CSS/JS, no build step, no dependencies to install.

## Run it locally

Requires Python 3 (for its built-in web server) and a modern browser. From the project root:

```bash
python -m http.server 5173 --directory site
```

Then open `http://localhost:5173` in a browser.

If you changed `site/partials/header.html` or `footer.html`, run `python scripts/sync-partials.py` first.

The same command is saved as `.claude/launch.json` ("glonari-site") for Claude Code's preview tool.

## Open this project on another computer

1. Copy the whole project folder (the one containing this file) to the new machine.
2. Open it in Claude Code.
3. Start a new session: it will read `CLAUDE.md` first, which points to `PROJECT-STATUS.md`, `DESIGN-SYSTEM-HOMES.md`, and `SITE-STRUCTURE.md` to restore full context.
4. Run the site locally with the command above.

No `npm install` or other setup is needed — there is no `package.json` and no build step.

## Where things are documented

- `CLAUDE.md` — permanent working rules and a short project overview.
- `PROJECT-STATUS.md` — what is built, what is next, open questions.
- `DESIGN-SYSTEM-HOMES.md` — colors, typography, spacing, components, motion.
- `SITE-STRUCTURE.md` — pages, navigation, and each page's planned sections.

## Project layout

```
site/
  index.html, how-it-works.html, ...   — pages
  css/main.css                         — shared styles (tokens, header, footer, buttons)
  css/home.css                         — home-page-only section styles
  js/main.js, js/hero.js, js/home.js   — Lenis, header/menu, reveal, scene animations
  assets/images/                       — WebP images
  partials/header.html, footer.html    — the single source of the header/footer
scripts/
  sync-partials.py                     — copies the partials into every site/*.html page
masters/                               — original PNG/JPG/MP4 sources (not published; the site uses WebP/MP4 from them)
```

Site text is English only. Project conversation and documentation are in Russian, per the owner's preference.
