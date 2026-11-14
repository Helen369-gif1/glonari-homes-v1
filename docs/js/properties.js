/* ==========================================================
   Glonari Homes — Glonari Properties & GPA
   Pinned scenes (>=769px, motion allowed): 01 hero, 04 value. Two pins.
   One effect per screen: 01 the Already-Own-a-Home hero timeline; 04 the gold line and the three
   figures are drawn; 03 the gold line is drawn; 05 the modeled figure counts up (no pin).
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
  const st = (trigger, start, end) => ({ trigger, start, end, scrub: .6, invalidateOnRefresh: true });

  /* ---------- 01 hero: the Already-Own-a-Home hero timeline, value for value (own.js heroScene; same as living.js) ---------- */
  // the woman's base size (owner: smaller than the source, she sits further back on the porch);
  // the same value is the CSS `scale` for the static layout — GSAP folds that property into its own transform
  const WOMAN = .86;
  // and her place on the porch (owner's reference: head below the top of the door), % of the frame;
  // same values as the CSS `translate` for the static layout
  const WX = -2, WY = 0.5;
  function heroScene() {
    const scene = $('[data-scene="np-hero"]');
    if (!scene) return;
    const house = $(".np-hero__house", scene);
    const woman = [$(".np-hero__woman", scene), $(".np-hero__shadow", scene)];

    gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } })
      .fromTo($(".np-hero__cue", scene), { opacity: 1 }, { opacity: 0, duration: .06 }, 0)
      // coming home: the porch comes in over the sunset
      .fromTo(house, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: .3, ease: "power1.out" }, .04)
      // the woman appears in her chair, in front of the word
      .fromTo(woman, { opacity: 0, xPercent: WX, yPercent: WY + 3, scale: WOMAN }, { opacity: 1, xPercent: WX, yPercent: WY, scale: WOMAN, duration: .2, ease: "power1.out" }, .36)
      // a slow shared zoom (same transform-origin, so she stays on the porch)
      .fromTo(house, { scale: 1 }, { scale: 1.05, duration: .42, immediateRender: false }, .58)
      .fromTo(woman, { scale: WOMAN }, { scale: WOMAN * 1.09, duration: .42, immediateRender: false }, .58)
      .fromTo($(".np-hero__shade", scene), { opacity: 0 }, { opacity: 1, duration: .2 }, .62)
      .fromTo($$("[data-hcopy]", scene), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .16, stagger: .08 }, .7);
  }


  /* ---------- 04 value: the line is drawn, the figures come in along it ---------- */
  function calcScene() {
    const scene = $('[data-scene="np-calc"]');
    if (!scene) return;
    const nums = $$("[data-n]", scene);
    const tl = gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } });
    tl.fromTo($(".np-calc__line", scene), { scaleX: 0 }, { scaleX: 1, duration: .8 }, .05);
    nums.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .16, ease: "power1.out" }, .02 + i * .17));
  }

  const mm = gsap.matchMedia();
  mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
    doc.classList.add("has-scenes");
    heroScene();
    calcScene();
    doc.classList.remove("scenes-pending");
    ScrollTrigger.refresh();
    return () => doc.classList.remove("has-scenes");
  });
  doc.classList.remove("scenes-pending");

  /* ---------- light accents (no pin, any width, motion allowed) ---------- */
  const mmLight = gsap.matchMedia();
  mmLight.add("(prefers-reduced-motion: no-preference)", () => {
    // 05: the modeled figure counts from $100 to $437.83 and the gold rule between them is drawn
    const fig = $("[data-fig]");
    if (fig) {
      const live = $("[data-count]", fig);
      const to = parseFloat(live.dataset.count), from = parseFloat(live.dataset.from);
      const o = { v: 0 };
      const fmt = (v) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const tl = gsap.timeline({ scrollTrigger: st(fig, "top 85%", "bottom 55%"), defaults: { ease: "none" } });
      tl.fromTo($(".np-nav__rule", fig), { scaleX: 0 }, { scaleX: 1, duration: .5 }, 0)
        .fromTo(o, { v: from }, { v: to, duration: 1, onUpdate: () => { live.textContent = fmt(o.v); } }, 0);
    }
    // 03: the gold line down the left edge of the three paragraphs is drawn, the ring comes last
    const rail = $(".np-shares__rail");
    if (rail) {
      const box = $(".np-shares__grid");
      gsap.timeline({ scrollTrigger: st(box, "top 85%", "bottom 62%"), defaults: { ease: "none" } })
        .fromTo($("i", rail), { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
        .fromTo($("b", rail), { opacity: 0 }, { opacity: 1, duration: .1 }, .9);
    }
    // 07: the gold rule is drawn
    const rule = $(".np-adv__rule");
    if (rule) gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: st(rule, "top 90%", "top 55%") });
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
