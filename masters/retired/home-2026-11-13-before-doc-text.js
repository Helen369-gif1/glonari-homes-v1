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

  /* ---------- 4. Find your home: the placeholder homes in the arch change every few seconds ---------- */
  /* No timer. Pinned (≥1024px, motion allowed): the scroll changes the homes (findScene below).
     Static (phones, tablets, reduced motion): the dots switch the homes by hand; every home up to the
     chosen one stays "open", so going back closes the later ones downward. */
  const arch = $("[data-find-arch]");
  const archImgs = arch ? $$(".find__arch-in img", arch) : [];
  const dots = arch ? $$(".find__ticks button", arch) : [];
  let findScrollTo = null; // set while the scene is pinned
  let findCur = 0;
  const showHome = (n) => {
    findCur = n;
    archImgs.forEach((im, k) => im.classList.toggle("is-on", k <= n));
    markDot(n);
  };
  const markDot = (n) => dots.forEach((d, k) => {
    d.classList.toggle("is-on", k === n);
    d.setAttribute("aria-current", k === n ? "true" : "false");
  });
  dots.forEach((d, k) => d.addEventListener("click", () => (findScrollTo ? findScrollTo(k) : showHome(k))));

  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const scrubTo = (trigger) => ({ trigger, start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true });

  /* ---------- 2. Why Glonari: a right-to-left wipe reveals the Glonari Home ----------
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

  /* ---------- 3. The cost: big numbers rise from behind the house ---------- */
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

  /* ---------- 4. Find your home: the arch grows, then each scroll step opens the next home upward ----------
     Timeline units (1 unit ≈ 58svh of the 280svh travel): arch growth 0–.5; houses change at
     .9 + (k−1) with .4 per change (40% of a step); the rest of each step is a hold. */
  function findScene() {
    const scene = $('[data-scene="find"]');
    if (!scene || !archImgs.length) return () => {};
    const archEl = $(".find__arch", scene);
    const N = archImgs.length;
    const TR = .4, START = .9, END = START + (N - 2) + TR + .5;
    const startOf = (k) => START + (k - 1);
    scene.classList.add("is-pinned");

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.fromTo(archEl, { scale: .62 }, { scale: 1, duration: .5, ease: "power2.out" }, 0);
    archImgs.forEach((im, k) => {
      if (k === 0) return;
      tl.fromTo(im, { clipPath: "inset(100% 0% 0% 0%)", scale: 1.04 },
                    { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: TR, ease: "power2.inOut" }, startOf(k));
    });
    tl.to({}, { duration: .5 }, END - .5);

    const idxAt = (t) => { let n = 0; for (let k = 1; k < N; k++) if (t >= startOf(k) + TR / 2) n = k; return n; };
    const st = ScrollTrigger.create({
      trigger: scene, start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true, animation: tl,
      onUpdate: (self) => markDot(idxAt(self.progress * END)),
    });
    markDot(0);

    findScrollTo = (k) => {
      const t = k === 0 ? .6 : startOf(k) + TR + .15;
      const y = st.start + (t / END) * (st.end - st.start);
      const lenis = window.Glonari && window.Glonari.lenis;
      if (lenis) lenis.scrollTo(y, { duration: 1.2 }); else window.scrollTo({ top: y, behavior: "smooth" });
    };
    return () => {
      findScrollTo = null;
      scene.classList.remove("is-pinned");
      st.kill(); tl.kill();
      gsap.set([archEl, ...archImgs], { clearProps: "all" });
      showHome(0);
    };
  }

  const mmFind = gsap.matchMedia();
  mmFind.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    const undo = findScene();
    ScrollTrigger.refresh();
    return undo;
  });

  const mm = gsap.matchMedia();
  mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
    doc.classList.add("has-scenes");
    problemScene();
    econScene();
    ctaScene();
    ScrollTrigger.refresh();
    return () => {
      doc.classList.remove("has-scenes");
    };
  });

  /* ---------- Light scrubbed accents (no pin, any width, motion allowed only) ---------- */
  const mmLight = gsap.matchMedia();
  mmLight.add("(prefers-reduced-motion: no-preference)", () => {
    const st = (trigger, start, end) => ({ trigger, start, end, scrub: .6, invalidateOnRefresh: true });

    // Why Glonari: the closing sentence lights word by word
    const sentence = $(".problem__statement");
    let original = null;
    if (sentence) {
      original = sentence.innerHTML;
      sentence.innerHTML = sentence.textContent.trim().split(" ").map((w) => `<span class="w">${w}</span>`).join(" ");
      gsap.fromTo($$(".w", sentence), { opacity: .16 }, { opacity: 1, ease: "none", stagger: .12, scrollTrigger: st(sentence, "top 88%", "top 38%") });
    }

    // Your future: the two headline lines drift apart, panels slide at different speeds, the gold line draws
    const fut = $(".future");
    if (fut) {
      const whole = st(fut, "top bottom", "bottom top");
      gsap.fromTo($(".future__today", fut), { x: "5vw" }, { x: "-3vw", ease: "none", scrollTrigger: whole });
      gsap.fromTo($(".future__tomorrow", fut), { x: "-5vw" }, { x: "3vw", ease: "none", scrollTrigger: whole });
      $$(".future__panel img", fut).forEach((im, k) => {
        gsap.fromTo(im, { yPercent: k === 1 ? 6 : -6 }, { yPercent: k === 1 ? -6 : 6, ease: "none", scrollTrigger: whole });
      });
      const strip = $(".future__strip", fut);
      gsap.fromTo($(".future__line", fut), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: st(strip, "top 85%", "top 30%") });
    }

    return () => { if (sentence && original !== null) sentence.innerHTML = original; };
  });

  // Images load lazily; re-measure once everything has its size.
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
