/* ==========================================================
   Glonari Homes — home page scenes
   Each scene's CSS default is its final, static layout (phones,
   reduced motion, no JS). On wide screens with motion allowed,
   .has-scenes pins the stage and the timelines below play with
   the scroll, forwards and backwards.
   ========================================================== */
(() => {
  "use strict";

  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Gia: the conversation plays once when it comes into view ---------- */
  const chat = $("[data-chat]");
  if (chat) {
    const msgs = $$("[data-msg]", chat);
    const typing = $("[data-typing]", chat);
    const showAll = () => msgs.forEach((m) => m.classList.add("is-shown"));
    const play = () => {
      if (reduce.matches) return showAll();
      msgs[0].classList.add("is-shown");
      setTimeout(() => typing.classList.add("is-on"), 700);
      setTimeout(() => { typing.classList.remove("is-on"); msgs[1].classList.add("is-shown"); }, 2300);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((en) => {
        if (en[0].isIntersecting) { io.disconnect(); play(); }
      }, { threshold: .45 });
      io.observe(chat);
    } else showAll();
  }

  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const scrubTo = (trigger) => ({ trigger, start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true });

  /* ---------- 2. Problem: a right-to-left wipe reveals the Glonari Home ----------
     The wipe container and its image counter-slide at the same rate, so the
     "after" photo never visibly moves — only the reveal edge sweeps across,
     right to left (same principle as the classic GSAP image-comparison wipe). */
  function problemScene() {
    const scene = $('[data-scene="problem"]');
    if (!scene) return;
    const wipe = $(".problem__wipe", scene);
    const wipeImg = $(".problem__wipe-in img", scene);
    const capBefore = $(".problem__cap--before", scene);
    const capAfter = $(".problem__cap--after", scene);

    gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } })
      .fromTo(wipe, { xPercent: 100, x: 0 }, { xPercent: 0, duration: .6 }, 0)
      .fromTo(wipeImg, { xPercent: -100, x: 0 }, { xPercent: 0, duration: .6 }, 0)
      .fromTo(capBefore, { autoAlpha: 1 }, { autoAlpha: 0, duration: .22 }, 0)
      .fromTo(capAfter, { autoAlpha: 0 }, { autoAlpha: 1, duration: .24 }, .42)
      .to({}, { duration: .2 });
  }

  /* ---------- 3. Formula: one card opens into three, then the result ---------- */
  function formulaScene() {
    const scene = $('[data-scene="formula"]');
    if (!scene) return;
    const row = $(".formula__row", scene);
    const cards = $$(".fcard", scene);
    const ops = $$(".formula__op", scene);
    const result = $(".formula__result", scene);

    // distance from each card's final place to the centre of the row
    const toCentre = (i) => row.offsetWidth / 2 - (cards[i].offsetLeft + cards[i].offsetWidth / 2);

    gsap.timeline({ scrollTrigger: scrubTo(scene) })
      .fromTo(cards, { x: (i) => toCentre(i), y: (i) => i * 14, scale: (i) => 1 - i * .05 }, { x: 0, y: 0, scale: 1, duration: 1, ease: "power2.inOut" }, .2)
      .fromTo(ops, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .25, ease: "power2.out" }, 1)
      .fromTo(result, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .4, ease: "power2.out" }, 1.3)
      .to({}, { duration: .35 });
  }

  /* ---------- 4. Economics: big numbers rise from behind the house ---------- */
  function econScene() {
    const scene = $('[data-scene="econ"]');
    if (!scene) return;
    const intro = $(".econ__intro", scene);
    const house = $(".econ__house", scene);
    const steps = $$(".econ__step", scene);

    const tl = gsap.timeline({ scrollTrigger: scrubTo(scene) });
    tl.fromTo(house, { yPercent: 30 }, { yPercent: 0, duration: 1, ease: "power2.out" }, 0)
      .fromTo(intro, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -40, duration: .6, ease: "power2.in" }, 1.2);

    const enter = (step, at) => {
      tl.fromTo(step, { autoAlpha: 0 }, { autoAlpha: 1, duration: .05 }, at)
        .fromTo($$(".econ__num", step), { yPercent: 55, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .7, ease: "power2.out", stagger: .2 }, at)
        .fromTo($$(".econ__label", step), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .5, ease: "power2.out", stagger: .2 }, at + .15);
    };
    const leave = (step, at) => {
      tl.fromTo($$(".econ__num", step), { yPercent: 0, autoAlpha: 1 }, { yPercent: -25, autoAlpha: 0, duration: .55, ease: "power2.in", immediateRender: false }, at)
        .fromTo($$(".econ__label", step), { autoAlpha: 1 }, { autoAlpha: 0, duration: .4, immediateRender: false }, at);
    };

    let t = 1.6;
    steps.forEach((step, i) => {
      enter(step, t);
      if (i < steps.length - 1) { leave(step, t + 1.5); t += 1.9; }
    });
    tl.to({}, { duration: 1 });
  }

  /* ---------- 6. Try Before You Buy: vertical scroll moves the strip sideways ---------- */
  function tbybScene() {
    const scene = $('[data-scene="tbyb"]');
    if (!scene) return;
    const track = $("[data-track]", scene);
    const bar = $("[data-progress]", scene);
    const travel = () => Math.max(0, track.scrollWidth - doc.clientWidth);
    const setTravel = () => scene.style.setProperty("--travel", `${travel()}px`);

    setTravel();
    ScrollTrigger.addEventListener("refreshInit", setTravel);

    gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } })
      .to(track, { x: () => -travel(), duration: 1 }, 0)
      .to(bar, { scaleX: 1, duration: 1 }, 0);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", setTravel);
      scene.style.removeProperty("--travel");
    };
  }

  /* ---------- 7. CTA: the light softens to evening, the words arrive, light returns a little ---------- */
  function ctaScene() {
    const scene = $('[data-scene="cta"]');
    if (!scene) return;
    const dusk = $(".cta__img--dusk", scene);
    const veil = $(".cta__veil", scene);
    const copy = $(".cta__copy", scene).children;

    gsap.timeline({ scrollTrigger: scrubTo(scene) })
      .fromTo(dusk, { opacity: 0 }, { opacity: 1, duration: 1, ease: "sine.inOut" }, 0)
      .fromTo(veil, { opacity: .25 }, { opacity: 1, duration: 1, ease: "sine.inOut" }, 0)
      .fromTo($$(".cta__img", scene), { scale: 1.05 }, { scale: 1, duration: 2, ease: "none" }, 0)
      .fromTo(copy, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .5, stagger: .12, ease: "power2.out" }, .5)
      .fromTo(dusk, { opacity: 1 }, { opacity: .55, duration: .8, ease: "sine.inOut", immediateRender: false }, 1.2);
  }

  const mm = gsap.matchMedia();
  mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
    doc.classList.add("has-scenes");
    problemScene();
    formulaScene();
    econScene();
    const undoTbyb = tbybScene();
    ctaScene();
    ScrollTrigger.refresh();
    return () => {
      if (undoTbyb) undoTbyb();
      doc.classList.remove("has-scenes");
    };
  });

  // Images load lazily; re-measure once everything has its size.
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
