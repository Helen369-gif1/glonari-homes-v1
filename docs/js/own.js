/* ==========================================================
   Glonari Homes — Already Own a Home?
   Pinned scenes on wide screens (.has-scenes, >=769px, motion-safe):
     1) first screen — "coming home": the sunset with the word → the
        porch home comes in → the woman in her chair, in front of the
        word → a slow zoom, the shade and the copy (as heroScene() in
        living.js).
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

  // the woman's base size (owner: smaller than the source, she sits further back on the porch);
  // the same value is the CSS `scale` for the static layout — GSAP folds that property into its own transform
  const WOMAN = .86;
  // and her place on the porch (owner's reference: head below the top of the door), % of the frame;
  // same values as the CSS `translate` for the static layout
  const WX = -2, WY = 0.5;
  function heroScene() {
    const scene = $('[data-scene="own-hero"]');
    if (!scene) return;
    const house = $(".own-hero__house", scene);
    const woman = [$(".own-hero__woman", scene), $(".own-hero__shadow", scene)];

    gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } })
      .fromTo($(".own-hero__cue", scene), { opacity: 1 }, { opacity: 0, duration: .06 }, 0)
      // coming home: the porch comes in over the sunset
      .fromTo(house, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: .3, ease: "power1.out" }, .04)
      // the woman appears in her chair, in front of the word
      .fromTo(woman, { opacity: 0, xPercent: WX, yPercent: WY + 3, scale: WOMAN }, { opacity: 1, xPercent: WX, yPercent: WY, scale: WOMAN, duration: .2, ease: "power1.out" }, .36)
      // a slow shared zoom (same transform-origin, so she stays on the porch)
      .fromTo(house, { scale: 1 }, { scale: 1.05, duration: .42, immediateRender: false }, .58)
      .fromTo(woman, { scale: WOMAN }, { scale: WOMAN * 1.09, duration: .42, immediateRender: false }, .58)
      .fromTo($(".own-hero__shade", scene), { opacity: 0 }, { opacity: 1, duration: .2 }, .62)
      .fromTo($$("[data-hcopy]", scene), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .16, stagger: .08 }, .7);
  }

  const mm = gsap.matchMedia();
  mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
    doc.classList.add("has-scenes");
    heroScene();
    doc.classList.remove("scenes-pending");
    ScrollTrigger.refresh();
    return () => doc.classList.remove("has-scenes");
  });
  doc.classList.remove("scenes-pending");
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
