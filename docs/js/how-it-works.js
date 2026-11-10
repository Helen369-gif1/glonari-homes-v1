/* ==========================================================
   Glonari Homes — How It Works
   Five pinned scenes on wide screens (.has-scenes, >=769px):
     1) first screen — terrace / words / family, the hero.js layering;
     2) chapter 02 opener — café terrace / friends, two-speed zoom (layeredScenes);
     3) chapter 04 — the results flow builds node by node;
     4) chapter 08 opener — home terrace / family dinner, the same (layeredScenes);
     5) chapter 08 — five parts gather around the family and Gia.
   Calm extras: chapter openers zoom slowly; chapter 03 plays two
   small chats on its photos. Chapter rail: see the second block.
   Scrubbed timelines use fromTo only (from breaks on refresh).
   ========================================================== */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const doc = document.documentElement;

  if (!window.gsap || !window.ScrollTrigger) { doc.classList.remove("scenes-pending"); return; }
  gsap.registerPlugin(ScrollTrigger);

  const scrubTo = (trigger) => ({ trigger, start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true });

  function heroScene() {
    const scene = $('[data-scene="hiw-hero"]');
    if (!scene) return;
    const frame = $(".hiw-hero__frame", scene);
    const word = $(".hiw-hero__word", scene);
    const CLIP = .57; // = the wordbox clip-path in CSS (inset bottom 43%): the parapet line
    // start: the top of the words just under the clip line, i.e. hidden behind the parapet/family
    const fromY = () => frame.offsetHeight * CLIP - word.offsetTop + 8;

    gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } })
      .fromTo($(".hiw-hero__bg", scene), { scale: 1 }, { scale: 1.08, duration: 1 }, 0)
      .fromTo($(".hiw-hero__fg", scene), { scale: 1 }, { scale: 1.15, duration: 1 }, 0)
      .fromTo($(".hiw-hero__cue", scene), { opacity: 1 }, { opacity: 0, duration: .06 }, 0)
      .fromTo($(".hiw-hero__word-in", scene), { y: fromY }, { y: 0, duration: .5, ease: "power2.out" }, .04)
      .fromTo($(".hiw-hero__shade", scene), { opacity: 0 }, { opacity: 1, duration: .2 }, .52)
      .fromTo($$("[data-hcopy]", scene), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .16, stagger: .08 }, .6);
  }

  function resultsScene() {
    const scene = $('[data-scene="hiw-results"]');
    if (!scene) return;
    const tl = gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } });
    let t = .04;
    $$("[data-step]", scene).forEach((el) => {
      if (el.dataset.step === "line") {
        tl.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: .05 }, t);
        t += .05;
      } else {
        tl.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .07 }, t);
        t += .07;
      }
    });
    tl.fromTo($("[data-statement]", scene), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .1 }, t + .04)
      .to({}, { duration: .12 }); // hold the finished picture before the pin releases

    // empty space under the centred content when the pin releases; CSS tops it up to one
    // --section-y before chapter 05 (see .has-scenes .hiw-results + .hiw-ch)
    const stage = $(".hiw-results__stage", scene), grid = $(".hiw-results__grid", scene);
    const tail = () => doc.style.setProperty("--pin-tail", Math.max(0, stage.clientHeight - grid.offsetTop - grid.offsetHeight) + "px");
    tail();
    ScrollTrigger.addEventListener("refreshInit", tail);
    return () => { ScrollTrigger.removeEventListener("refreshInit", tail); doc.style.removeProperty("--pin-tail"); };
  }

  function systemScene() {
    const scene = $('[data-scene="hiw-system"]');
    if (!scene) return;
    const lines = $$(".hiw-system__lines line", scene);
    const tl = gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } });
    tl.fromTo($(".hiw-system__img", scene), { opacity: 0, scale: .94 }, { opacity: 1, scale: 1, duration: .14 }, 0);
    $$(".hiw-node__card", scene).forEach((card, i) => {
      const at = .14 + i * .1;
      if (lines[i]) tl.fromTo(lines[i], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .08 }, at);
      tl.fromTo(card, { opacity: 0, scale: .88 }, { opacity: 1, scale: 1, duration: .07 }, at + .04);
    });
    tl.to({}, { duration: .2 }); // hold the finished map; the closing line below is a plain reveal
  }

  /* Chapters 01 and 02: the four cards lie in a pile and spread into their row on scroll
     ("cards laid on the table"). Not pinned, scrubbed. 02: the pile sits on card 1 and
     cards 2–4 slide right one after another. 01: the pile sits in the middle of the row,
     02/03 go out first, 01/04 travel further and a little later. Horizontal only.
     Offsets come from the cards' layout positions (offsetLeft ignores the transforms
     GSAP sets), recomputed on every refresh. Captions show once a card has landed. */
  const ROT = [-1.5, 1.2, -.8, 1.5];
  function dealCards(grid, mode) {
    const cards = $$(".hiw-card", grid);
    if (cards.length !== 4) return () => {};
    grid.classList.add("hiw-deal");
    cards.forEach((c) => c.setAttribute("tabindex", "0"));
    const caps = cards.map((c) => $$(":scope > :not(img)", c));
    const mid = (c) => c.offsetLeft + c.offsetWidth / 2;
    // where the pile's centre is, and each card's small offset inside the pile (top card = 1st)
    const pileX = () => (mode === "left" ? mid(cards[0]) : (mid(cards[1]) + mid(cards[2])) / 2);
    const layer = (i) => (mode === "left" ? i * 5 : (i - 1.5) * 5);
    const off = (i) => () => pileX() - mid(cards[i]) + layer(i);

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: grid, start: "top 80%", end: "top 30%", scrub: .8, invalidateOnRefresh: true,
        onUpdate: (st) => grid.classList.toggle("is-dealt", st.progress > .999),
      },
    });
    const move = (i, at, dur) => {
      tl.fromTo(cards[i], { x: off(i), rotation: ROT[i] }, { x: 0, rotation: 0, duration: dur }, at)
        .fromTo(caps[i], { opacity: 0 }, { opacity: 1, duration: .1 }, at + dur);
    };
    if (mode === "left") {
      move(0, 0, .2);                                   // card 1 stays put, only straightens
      [1, 2, 3].forEach((i) => move(i, (i - 1) * .08, .72));
    } else {
      move(1, 0, .7); move(2, 0, .7);                   // inner pair first
      move(0, .12, .76); move(3, .12, .76);             // outer pair: further and later
    }
    return () => {
      grid.classList.remove("hiw-deal", "is-dealt");
      cards.forEach((c) => c.removeAttribute("tabindex"));
    };
  }

  /* Layered chapter openers 02 and 08, pinned (owner 2026-11-09): two-speed parallax — the
     terrace 1→BG_ZOOM, the people 1→FG_ZOOM, both around --po (CSS, per opener) — then the
     number, the eyebrow and the heading come in; a short hold before release.
     Zoom kept moderate (owner: 1.08/1.15 cut the woman's head under the header at the end);
     the gap between the two speeds is what reads as depth. */
  const BG_ZOOM = 1.04, FG_ZOOM = 1.12;
  function layeredScenes() {
    $$(".scene.hiw-layered").forEach((scene) => {
      gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } })
        .fromTo($(".hiw-opener__bg", scene), { scale: 1 }, { scale: BG_ZOOM, duration: 1 }, 0)
        .fromTo($(".hiw-opener__fg", scene), { scale: 1 }, { scale: FG_ZOOM, duration: 1 }, 0)
        .fromTo($$(".hiw-opener__copy > *", scene), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .16, stagger: .08 }, .42)
        .to({}, { duration: .15 });
    });
  }

  /* Chapter openers (02, 05, 08): the photo comes slowly closer while it passes. Not pinned.
     02 and 08 are layered (terrace + people cut-out): on phones the same two-speed zoom runs
     here unpinned; on wide screens they are the pinned layeredScenes() and are skipped. */
  function openers(pinned) {
    $$("[data-opener]").forEach((op) => {
      const st = { trigger: op, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true };
      const fg = $(".hiw-opener__fg", op);
      if (fg && pinned) return;
      if (fg) {
        gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: st })
          .fromTo($(".hiw-opener__bg", op), { scale: 1 }, { scale: BG_ZOOM }, 0)
          .fromTo(fg, { scale: 1 }, { scale: FG_ZOOM }, 0);
      } else {
        gsap.fromTo($(".hiw-opener__img", op), { scale: 1 }, { scale: 1.08, ease: "none", scrollTrigger: st });
      }
    });
  }

  /* Chapter 03: two chats on the photos, one conversation. Gia works through a few steps,
     asks one question, the You card answers. One looping timeline; runs only while on screen.
     Reduced motion: never called, the 3 static bubbles from the markup stay. */
  function chatDuo() {
    const box = $("[data-duo]");
    const gia = box && $('[data-chat="gia"]', box);
    const you = box && $('[data-chat="you"]', box);
    if (!gia || !you) return;
    const avatar = "assets/images/gia-avatar-256.webp";
    const GIA = ["Searching 14 offers for you…", "Comparing insurance rates", "Organized: 3 opportunities that fit you",
      "Following up with the café partner", "Scheduled your review call · Tue 10:00", "Results tracked this month ✓"];
    const ASK = "Quick question: OK to share your café review?";
    const YOU_EXTRA = ["I’m in for this one", "Introducing my neighbor, Anna", "Here’s my review of the café"];
    const phone = window.matchMedia("(max-width: 768px)");
    const max = () => (phone.matches ? 2 : 3);
    let cycle = 0;

    [gia, you].forEach((c) => {
      c.classList.add("is-live");
      // phones start with the 2 latest static bubbles
      $$(".hiw-msg", c).slice(0, -max()).forEach((m) => m.remove());
    });

    // move the bubbles already in the chat smoothly when the layout changes (FLIP)
    function flip(chat, change) {
      const els = $$(".hiw-msg", chat);
      const before = els.map((el) => el.getBoundingClientRect().top);
      change();
      els.forEach((el, i) => {
        const d = before[i] - el.getBoundingClientRect().top;
        if (d) gsap.fromTo(el, { y: d }, { y: 0, duration: .5, ease: "power2.out", overwrite: "auto" });
      });
    }

    function add(chat, who) {
      const p = document.createElement("p");
      p.className = "hiw-msg hiw-msg--" + who;
      if (who === "gia") { const img = new Image(24, 24); img.src = avatar; img.alt = ""; p.append(img); }
      const b = document.createElement("span");
      b.className = "hiw-msg__b";
      b.innerHTML = '<span class="hiw-msg__dots"><i></i><i></i><i></i></span>';
      p.append(b);
      flip(chat, () => {
        chat.append(p);
        const live = $$(".hiw-msg:not(.is-leaving)", chat);
        live.slice(0, Math.max(0, live.length - max())).forEach((old) => {
          old.classList.add("is-leaving");
          gsap.to(old, { opacity: 0, scale: .94, transformOrigin: who === "gia" ? "0 0" : "100% 0", duration: .45, ease: "power1.out", onComplete: () => old.remove() });
        });
      });
      gsap.fromTo(p, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .45, ease: "power2.out" });
      return b;
    }

    // one cycle ≈ 13.6 s + 2 s pause; text is read from the cycle counter when the call fires
    const STEP = 1.6, TYPE = .8;
    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2, onRepeat: () => { cycle++; } });
    const pending = { gia: null, you: null };
    const type = (who) => () => { pending[who] = add(who === "gia" ? gia : you, who); };
    const show = (who, text) => () => {
      const b = pending[who];
      if (!b) return;
      const chat = who === "gia" ? gia : you;
      flip(chat, () => { b.textContent = typeof text === "function" ? text() : text; });
    };
    const at = (t, who, text) => tl.call(type(who), null, t).call(show(who, text), null, t + TYPE);

    for (let i = 0; i < 5; i++) at(i * STEP, "gia", () => GIA[(cycle * 5 + i) % GIA.length]);
    at(2 * STEP + .5, "you", () => YOU_EXTRA[cycle % YOU_EXTRA.length]);
    at(5 * STEP, "gia", ASK);
    at(5 * STEP + 1.2, "you", "Yes, let’s do it");
    at(5 * STEP + 1.2 + STEP, "you", "Permission granted ✓");
    tl.to({}, { duration: 5 * STEP + 1.2 + STEP + TYPE + 2 }, 0); // hold the last line, then repeatDelay

    new IntersectionObserver(([e]) => { if (e.isIntersecting) tl.play(); else tl.pause(); }, { threshold: .2 }).observe(box);
  }

  const mm = gsap.matchMedia();
  mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
    doc.classList.add("has-scenes");
    heroScene();
    layeredScenes();
    const undoResults = resultsScene();
    systemScene();
    openers(true);
    doc.classList.remove("scenes-pending");
    ScrollTrigger.refresh();
    return () => { doc.classList.remove("has-scenes"); if (undoResults) undoResults(); };
  });
  mm.add("(max-width: 768px) and (prefers-reduced-motion: no-preference)", () => { openers(false); });
  // >=1101px: the grid is one row of 4 there (2x2 below, which would need vertical moves)
  mm.add("(min-width: 1101px) and (prefers-reduced-motion: no-preference)", () => {
    const undo = [["#ch-01 .hiw-grid4", "center"], ["#ch-02 .hiw-grid4", "left"]]
      .map(([s, mode]) => { const g = $(s); return g ? dealCards(g, mode) : () => {}; });
    ScrollTrigger.refresh();
    return () => undo.forEach((f) => f());
  });
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) chatDuo();
  doc.classList.remove("scenes-pending");
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();

/* ==========================================================
   Chapter rail: hidden on the first screen, slides in at its end,
   marks the chapter crossing the middle of the screen, inverts
   over dark backgrounds (first screen, chapter 05), steps aside
   for the footer. Clicks scroll with Lenis. Runs everywhere.
   ========================================================== */
(() => {
  "use strict";
  const toc = document.querySelector("[data-hiw-toc]");
  if (!toc) return;
  const items = [...toc.querySelectorAll("li")];
  const links = items.map((li) => li.querySelector("a"));
  const chapters = links.map((a) => document.getElementById(a.getAttribute("href").slice(1)));
  const counter = toc.querySelector("[data-hiw-toc-current]");
  const hero = document.querySelector("[data-hero]");
  const dark = document.querySelector("[data-dark]");
  const footer = document.querySelector(".site-footer");
  let active = -1, raf = 0;

  function setActive(i) {
    if (i === active) return;
    active = i;
    items.forEach((li, k) => {
      li.classList.toggle("is-active", k === i);
      if (k === i) links[k].setAttribute("aria-current", "location");
      else links[k].removeAttribute("aria-current");
    });
    if (counter) counter.textContent = links[i].querySelector(".hiw-toc__n").textContent;
  }

  function update() {
    raf = 0;
    const vh = window.innerHeight;
    const travel = hero ? hero.offsetHeight - vh : 0;
    const r = toc.getBoundingClientRect();
    const probe = r.top + r.height / 2;          // the rail's own vertical centre
    const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;

    toc.classList.toggle("is-on", window.scrollY > Math.max(travel * .9, vh * .6) && footerTop > r.bottom + 24);

    let idx = 0;
    chapters.forEach((el, i) => { if (el && el.getBoundingClientRect().top <= vh * .5) idx = i; });
    setActive(idx);

    const over = (el) => { if (!el) return false; const b = el.getBoundingClientRect(); return b.top < probe && b.bottom > probe; };
    toc.classList.toggle("is-dark", over(hero) || over(dark));
  }
  const queue = () => { if (!raf) raf = requestAnimationFrame(update); };

  links.forEach((a, i) => a.addEventListener("click", (e) => {
    const el = chapters[i];
    if (!el) return;
    e.preventDefault();
    const lenis = window.Glonari && window.Glonari.lenis;
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    history.replaceState(null, "", "#" + el.id);
  }));

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });
  window.addEventListener("load", queue);
  update();
})();
