/* ==========================================================
   Glonari Homes — Find Your Home
   Pinned scenes (motion allowed):
     >=769px  .has-scenes : 01 hero, 06 "What happens next?"
     >=1024px .is-pinned  : 03 the first questions (read-only);
                            below 1024px the questions are a plain list.
   Light scrubbed accents (no pin, any width, motion allowed): the map
   route, the dark band's rule, the cost screen's house/line/underline.
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

  /* ---------- 01 hero ---------- */
  function heroScene() {
    const scene = $('[data-scene="find-hero"]');
    if (!scene) return;
    // two effects: the home settles onto the street, then one slow push-in of the street
    gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } })
      .fromTo($(".find-hero__cue", scene), { opacity: 1 }, { opacity: 0, duration: .06 }, 0)
      .fromTo($(".find-hero__home", scene), { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: .36, ease: "power1.out" }, .04)
      .fromTo($(".find-hero__bg", scene), { scale: 1 }, { scale: 1.04, duration: .5, immediateRender: false }, .5);
  }

  /* ---------- 06 what happens next ---------- */
  function nextScene() {
    const scene = $('[data-scene="find-next"]');
    if (!scene) return;
    gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } })
      .fromTo($(".find-next__bg", scene), { scale: 1 }, { scale: 1.02, duration: 1 }, 0)
      .fromTo($(".find-next__people", scene), { scale: 1 }, { scale: 1.05, duration: 1 }, 0)
      // the panel's lines come up into the paper panel (the panel itself stays: no empty strip under the photo)
      .fromTo($(".find-next__panel-in", scene), { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: .22, ease: "power2.out" }, .72);
  }

  /* ---------- 03 the first questions (>=1024px) ---------- */
  let qScrollTo = null;
  function questionsScene() {
    const scene = $('[data-scene="find-q"]');
    if (!scene) return () => {};
    const items = $$(".find-q__item", scene);
    const dotsBox = $(".find-q__dots", scene);
    const N = items.length;
    const TEXT = (k) => [$(".find-q__no", items[k]), $(".find-q__q", items[k])];
    const IMG = (k) => $(".find-q__fig img", items[k]);
    const START = .5, STEP = 1, TR = .5;                  // question k (k>=1) starts changing at START + (k-1)*STEP
    const startOf = (k) => START + (k - 1) * STEP;
    const END = startOf(N - 1) + TR + .6;

    scene.classList.add("is-pinned");
    const dots = items.map((_, k) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "find-q__dot"; b.textContent = String(k + 1).padStart(2, "0");
      b.setAttribute("aria-label", `Question ${k + 1}`);
      b.addEventListener("click", () => qScrollTo && qScrollTo(k));
      dotsBox.appendChild(b);
      return b;
    });
    const mark = (n) => dots.forEach((d, i) => d.setAttribute("aria-current", i === n ? "true" : "false"));
    mark(0);

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    for (let k = 1; k < N; k++) {
      const t = startOf(k);
      // the old question leaves upward, the new one comes up from below; the next photo opens from the base of the arch
      tl.fromTo(TEXT(k - 1), { opacity: 1, y: 0 }, { opacity: 0, y: -26, duration: .3, ease: "power1.in" }, t)
        .fromTo(TEXT(k), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .34, ease: "power2.out" }, t + .2)
        .fromTo(IMG(k), { clipPath: "inset(100% 0% 0% 0%)", scale: 1.05 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: TR, ease: "power2.inOut" }, t);
    }
    tl.to({}, { duration: .6 }, END - .6);

    const idxAt = (p) => { let n = 0; for (let k = 1; k < N; k++) if (p >= startOf(k) + TR / 2) n = k; return n; };
    const trig = ScrollTrigger.create({
      trigger: scene, start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true, animation: tl,
      onUpdate: (self) => mark(idxAt(self.progress * END)),
    });
    qScrollTo = (k) => {
      const t = k === 0 ? .15 : startOf(k) + TR + .1;
      const y = trig.start + (t / END) * (trig.end - trig.start);
      const lenis = window.Glonari && window.Glonari.lenis;
      if (lenis) lenis.scrollTo(y, { duration: 1.2 }); else window.scrollTo({ top: y, behavior: "smooth" });
    };
    return () => {
      qScrollTo = null;
      scene.classList.remove("is-pinned");
      trig.kill(); tl.kill();
      gsap.set($$(".find-q__no, .find-q__q, .find-q__fig img", scene), { clearProps: "all" });
      dotsBox.textContent = "";
    };
  }

  /* ---------- map pins: placed on the route by JS (static map has only the line) ---------- */
  function buildPins() {
    const map = $(".find-map");
    const path = $(".find-map__path");
    if (!map || !path) return [];
    const len = path.getTotalLength();
    const pts = [0, .2, .4, .6, .8, 1];
    return pts.map((t) => {
      const p = path.getPointAtLength(len * t);
      const pin = document.createElement("span");
      pin.className = "find-map__pin";
      pin.style.left = (p.x / 1200 * 100) + "%";
      pin.style.top = (p.y / 560 * 100) + "%";
      map.appendChild(pin);
      return pin;
    });
  }
  const pins = buildPins();

  const mm = gsap.matchMedia();
  mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
    doc.classList.add("has-scenes");
    heroScene();
    nextScene();
    doc.classList.remove("scenes-pending");
    ScrollTrigger.refresh();
    return () => doc.classList.remove("has-scenes");
  });

  const mmQ = gsap.matchMedia();
  mmQ.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    const undo = questionsScene();
    ScrollTrigger.refresh();
    return undo;
  });
  doc.classList.remove("scenes-pending");

  /* ---------- light accents ---------- */
  const mmLight = gsap.matchMedia();
  mmLight.add("(prefers-reduced-motion: no-preference)", () => {
    // 02: the gold route is drawn, the rings appear as it reaches them
    const map = $(".find-map");
    if (map) {
      const tl = gsap.timeline({ scrollTrigger: st(map, "top 78%", "bottom 52%"), defaults: { ease: "none" } });
      tl.fromTo($(".find-map__path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1 }, 0);
      pins.forEach((p, i) => tl.fromTo(p, { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .08 }, i * .2));
    }
    // 04: the gold rule between the heading and the statements is drawn
    const rule = $(".find-opt__rule");
    if (rule) gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: st(rule, "top 90%", "top 55%") });
    // 05: the home rises a little, the ground line is drawn, "estimated" gets its underline
    const house = $(".find-cost__house img");
    if (house) gsap.fromTo(house, { y: 48 }, { y: 0, ease: "none", scrollTrigger: st($(".find-cost__house"), "top 95%", "bottom 75%") });
    const ground = $(".find-cost__ground");
    if (ground) gsap.fromTo(ground, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: st(ground, "top 92%", "top 70%") });
    const u = $(".find-cost__u");
    if (u) gsap.fromTo(u, { "--u": 0 }, { "--u": 1, ease: "none", scrollTrigger: st(u, "top 82%", "top 52%") });
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();

