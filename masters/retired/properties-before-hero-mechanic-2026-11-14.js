/* ==========================================================
   Glonari Homes — Glonari Properties & GPA
   Pinned scenes (>=769px, motion allowed): 01 hero, 04 value. Two pins.
   One effect per screen: 01 layer parallax (bg 1.04, front 1.08); 04 the gold line and the three
   figures are drawn; 05 the modeled figure counts up (no pin).
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

  /* ---------- 01 hero: parallax of the two layers, nothing else moves (the base of both layers stays on the frame's bottom edge) ---------- */
  function heroScene() {
    const scene = $('[data-scene="np-hero"]');
    if (!scene) return;
    gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } })
      .fromTo($(".np-hero__bg", scene), { scale: 1 }, { scale: 1.04, duration: 1 }, 0)
      .fromTo($(".np-hero__front", scene), { scale: 1 }, { scale: 1.08, duration: 1 }, 0);
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
    // 07: the gold rule is drawn
    const rule = $(".np-adv__rule");
    if (rule) gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: st(rule, "top 90%", "top 55%") });
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
