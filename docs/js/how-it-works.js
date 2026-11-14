/* ==========================================================
   Glonari Homes — How It Works (7 screens)
   Three pinned scenes on wide screens (.has-scenes, >=769px):
     01 first screen — terrace / words / family, the hero.js layering;
     05 café opener — terrace / friends, two-speed zoom (layeredScenes);
     07 family opener — home terrace / family dinner, the same (layeredScenes).
   Calm, not pinned: 02 the four cards are dealt onto the table (dealCards, >=1101px);
   03 the photo is drawn in with a survey line (chooseScene, >=1024px);
   06 the four journey nodes and their line are drawn by the scroll (stepsScene, >=1024px).
   Chapter rail: see the second block.
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
      .fromTo($$("[data-hcopy]", scene), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .12, stagger: .06 }, .6);
  }

  /* Screen 02: the four cards lie in a pile in the middle of the row and spread into it on
     scroll ("cards laid on the table"). Not pinned, scrubbed. Inner pair first, outer pair
     further and a little later. Horizontal only. Offsets come from the cards' layout positions
     (offsetLeft ignores the transforms GSAP sets), recomputed on every refresh. Captions show
     once a card has landed. */
  const ROT = [-1.5, 1.2, -.8, 1.5];
  function dealCards(grid) {
    const cards = $$(".hiw-card", grid);
    if (cards.length !== 4) return () => {};
    grid.classList.add("hiw-deal");
    cards.forEach((c) => c.setAttribute("tabindex", "0"));
    const caps = cards.map((c) => $$(":scope > :not(img)", c));
    const mid = (c) => c.offsetLeft + c.offsetWidth / 2;
    const pileX = () => (mid(cards[1]) + mid(cards[2])) / 2;
    const off = (i) => () => pileX() - mid(cards[i]) + (i - 1.5) * 5;

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
    move(1, 0, .7); move(2, 0, .7);                     // inner pair first
    move(0, .12, .76); move(3, .12, .76);               // outer pair: further and later
    return () => {
      grid.classList.remove("hiw-deal", "is-dealt");
      cards.forEach((c) => c.removeAttribute("tabindex"));
    };
  }

  /* Screen 03: the photo is drawn in from its base (clip-path inset, the picture settles from
     a slight zoom) and the 1px survey line follows down its right edge and back along its
     bottom edge. One scrubbed timeline, not pinned. */
  function chooseScene() {
    const fig = $("[data-choose]");
    if (!fig) return;
    const ph = $(".hiw-choose__ph", fig), img = $("img", ph);
    gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: fig, start: "top 85%", end: "bottom 55%", scrub: .6, invalidateOnRefresh: true },
    })
      .fromTo(ph, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .6, ease: "power2.out" }, 0)
      .fromTo(img, { scale: 1.12 }, { scale: 1, duration: .8 }, 0)
      .fromTo($(".hiw-choose__ln--v", fig), { scaleY: 0 }, { scaleY: 1, duration: .3 }, .55)
      .fromTo($(".hiw-choose__ln--h", fig), { scaleX: 0 }, { scaleX: 1, duration: .25 }, .85);
    return () => gsap.set([ph, img, ...$$(".hiw-choose__ln", fig)], { clearProps: "all" });
  }

  /* Screen 06: node 1 appears, the line to node 2 is drawn, node 2 appears, and so on. */
  function stepsScene() {
    const list = $("[data-steps]");
    if (!list) return;
    const steps = $$("[data-step]", list);
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: list, start: "top 78%", end: "bottom 50%", scrub: .6, invalidateOnRefresh: true },
    });
    steps.forEach((li, i) => {
      const at = i * .26;
      tl.fromTo($(".hiw-step__node", li), { opacity: .15, scale: .86 }, { opacity: 1, scale: 1, duration: .08 }, at)
        .fromTo($(".hiw-step__p", li), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .1 }, at + .03);
    });
    // connectors are the li::after lines: CSS custom property drives their scale
    steps.slice(0, -1).forEach((li, i) => {
      tl.fromTo(li, { "--line": 0 }, { "--line": 1, duration: .16 }, i * .26 + .09);
    });
    tl.to({}, { duration: .1 });
    return () => gsap.set([...steps, ...$$(".hiw-step__node, .hiw-step__p", list)], { clearProps: "all" });
  }

  /* Screen 04B: the stair line is drawn step by step: figure 01 and its tread, the riser down,
     figure 02 and its tread, the riser, figure 03 and its tread. Not pinned, scrubbed. */
  function monthScene() {
    const list = $("[data-month]");
    if (!list) return;
    const steps = $$("[data-mstep]", list);
    const parts = ".hiw-month__n, .hiw-month__fig, .hiw-month__p";
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: list, start: "top 78%", end: "bottom 55%", scrub: .6, invalidateOnRefresh: true },
    });
    steps.forEach((li, i) => {
      const at = i * .3;
      tl.fromTo($$(parts, li), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .1, stagger: .02 }, at)
        .fromTo(li, { "--t": 0 }, { "--t": 1, duration: .14 }, at + .04);
      if (i < steps.length - 1) tl.fromTo(li, { "--r": 0 }, { "--r": 1, duration: .1 }, at + .18);
    });
    tl.to({}, { duration: .1 });
    return () => gsap.set([...steps, ...$$(parts, list)], { clearProps: "all" });
  }

  /* Layered openers 05 and 07, pinned: two-speed parallax — the terrace 1→BG_ZOOM, the people
     1→FG_ZOOM, both around --po (CSS, per opener) — then the number, the eyebrow and the
     heading come in; a short hold before release. Zoom kept moderate (a bigger one cut the
     woman's head under the header at the end); the gap between the two speeds reads as depth. */
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

  /* Phones: the same two-speed zoom runs unpinned while the opener passes. */
  function phoneOpeners() {
    $$("[data-opener]").forEach((op) => {
      const st = { trigger: op, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true };
      gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: st })
        .fromTo($(".hiw-opener__bg", op), { scale: 1 }, { scale: BG_ZOOM }, 0)
        .fromTo($(".hiw-opener__fg", op), { scale: 1 }, { scale: FG_ZOOM }, 0);
    });
  }

  const mm = gsap.matchMedia();
  mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
    doc.classList.add("has-scenes");
    heroScene();
    layeredScenes();
    doc.classList.remove("scenes-pending");
    ScrollTrigger.refresh();
    return () => doc.classList.remove("has-scenes");
  });
  mm.add("(max-width: 768px) and (prefers-reduced-motion: no-preference)", () => { phoneOpeners(); });
  // 02: >=1101px, where the grid is one row of 4 (2x2 below, which would need vertical moves)
  mm.add("(min-width: 1101px) and (prefers-reduced-motion: no-preference)", () => {
    const g = $("#ch-02 .hiw-grid4");
    const undo = g ? dealCards(g) : () => {};
    ScrollTrigger.refresh();
    return undo;
  });
  // 03, 04B and 06: >=1024px, where their layouts are the wide ones
  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    const undo = [chooseScene(), monthScene(), stepsScene()];
    ScrollTrigger.refresh();
    return () => undo.forEach((f) => f && f());
  });
  doc.classList.remove("scenes-pending");
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();

/* ==========================================================
   Chapter rail: hidden on the first screen, slides in at its end,
   marks the screen crossing the middle of the viewport, inverts
   over dark backgrounds (first screen, 04), steps aside for the
   footer. Clicks scroll with Lenis. Runs everywhere.
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
