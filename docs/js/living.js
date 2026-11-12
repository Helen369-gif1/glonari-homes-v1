/* ==========================================================
   Glonari Homes — Living With Glonari
   Page 03 of Glonari_Homes_All_Pages_v2.md, 7 screens. Three pinned scenes
   (.has-scenes, >=769px, motion-safe): 01 hero (garden, kitchen, the word,
   the family: heroScene()); 02 Gia (four views behind one window, the chat
   keeps its history: giaScene()); 07 final (the night villa: finalScene()).
   Not scenes: 03 settleLight() (the light comes on), 04 lifeStage() (self-playing
   stage, no GSAP), 05+06 chapRails() (two gold lines drawn with the scroll).
   Scrubbed timelines use fromTo only (from breaks on refresh).
   ========================================================== */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const doc = document.documentElement;

  /* When life changes (a pause, no pin, no GSAP): three scenarios play in turn.
     The end of the active timer bar (CSS animation `life-timer`, length --life-ms) advances the
     scene; steps, pill and timer all restart with .is-run, so CSS is the single clock.
     .is-paused (CSS) freezes every animation: off screen only (no hover or touch pause).
     Reduced motion: no autoplay, no movement — manual switching only (instant).
     Without JS the CSS shows scene 1 complete (this function adds .is-on). */
  const LIFE_SCENE_MS = 4000; // how long one scenario is shown
  function lifeStage() {
    const stage = $("[data-life-stage]");
    if (!stage) return;
    const cards = $$(".liv-pc", stage);
    const tabs = $$(".liv-tab", stage);
    const dots = $$(".liv-dot", stage);
    const pill = $(".liv-pill", stage);
    const pillText = $(".liv-pill__t", stage);
    const status = $(".liv-stage__status", stage);
    const n = cards.length;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hold = new Set(["view"]); // reasons to pause (no hover); "view" is lifted once the stage is on screen
    let cur = 0;

    const sync = () => stage.classList.toggle("is-paused", hold.size > 0);
    const restart = () => {
      stage.classList.remove("is-run"); pill.classList.remove("is-run");
      if (rm.matches) return;
      void stage.offsetWidth; // let the animations reset
      stage.classList.add("is-run"); pill.classList.add("is-run");
    };
    const go = (i) => {
      cur = ((i % n) + n) % n;
      cards.forEach((c, k) => {
        const d = (k - cur + n) % n, was = c.dataset.pos;
        c.dataset.pos = d === 0 ? 0 : d === 1 ? 1 : -1;
        // a card crossing from one back position to the other passes behind the stack
        if (!rm.matches && was && was !== "0" && c.dataset.pos !== "0" && was !== c.dataset.pos) {
          c.classList.add("is-wrap"); setTimeout(() => c.classList.remove("is-wrap"), 900);
        }
      });
      [tabs, dots].forEach((list) => list.forEach((b, k) => (k === cur ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current"))));
      const text = cards[cur].dataset.gia;
      pillText.textContent = text; status.textContent = text;
      restart();
    };

    stage.style.setProperty("--life-ms", LIFE_SCENE_MS + "ms");
    stage.dataset.motion = rm.matches ? "off" : "on";
    stage.classList.add("is-on");
    sync();
    restart();
    rm.addEventListener("change", () => { stage.dataset.motion = rm.matches ? "off" : "on"; restart(); });

    stage.addEventListener("animationend", (e) => {
      if (e.animationName === "life-timer" && e.target.offsetParent) go(cur + 1);
    });
    [...tabs, ...dots].forEach((b) => b.addEventListener("click", () => go(+b.dataset.i)));

    const toggle = (why, on) => { on ? hold.add(why) : hold.delete(why); sync(); };

    // swipe on the photo stack
    const stack = $(".liv-stage__stack", stage);
    let x0 = null, y0 = 0;
    stack.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    stack.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => toggle("view", !en.isIntersecting), { threshold: .3 }).observe(stage);
    } else toggle("view", false);
  }
  lifeStage(); // before the GSAP guard below: needs no GSAP

  if (!window.gsap || !window.ScrollTrigger) { doc.classList.remove("scenes-pending"); return; }
  gsap.registerPlugin(ScrollTrigger);

  const scrubTo = (trigger) => ({ trigger, start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true });

  function heroScene() {
    const scene = $('[data-scene="liv-hero"]');
    if (!scene) return;
    const kitchen = $(".liv-hero__kitchen", scene);
    const family = $(".liv-hero__family", scene);

    gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } })
      .fromTo($(".liv-hero__cue", scene), { opacity: 1 }, { opacity: 0, duration: .06 }, 0)
      // entering the home: the kitchen comes in over the garden
      .fromTo(kitchen, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: .3, ease: "power1.out" }, .04)
      // the family appears at the table, in front of the word
      .fromTo(family, { opacity: 0, yPercent: 3 }, { opacity: 1, yPercent: 0, duration: .2, ease: "power1.out" }, .36)
      // a slow shared zoom (same transform-origin, so the two tables stay on top of each other)
      .fromTo(kitchen, { scale: 1 }, { scale: 1.06, duration: .42, immediateRender: false }, .58)
      .fromTo(family, { scale: 1 }, { scale: 1.1, duration: .42, immediateRender: false }, .58)
      .fromTo($(".liv-hero__shade", scene), { opacity: 0 }, { opacity: 1, duration: .2 }, .62)
      .fromTo($$("[data-hcopy]", scene), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .16, stagger: .08 }, .7);
  }

  /* Gia goes with you: the room stays, the view behind the glass changes four times
     (city → suburb → sea → garden; each new view fades in over the last, scale 1.06→1),
     the place label follows, and for each place Gia types (the home page's three dots)
     and her message is added under the earlier ones. The list slides up so the newest
     message is at the bottom; at most 3 stay in view (the oldest fades as it leaves).
     The chat body's height follows what is visible (head only → dots → message);
     heights and list offsets are function values, re-measured on refresh (invalidateOnRefresh). */
  function giaScene() {
    const scene = $('[data-scene="liv-gia"]');
    if (!scene) return () => {};
    const SHOW = 3;
    const views = $$(".liv-gia__view", scene);
    const places = $$(".liv-gia__place-i", scene);
    const items = $$(".liv-gia__item", scene);
    const body = $(".liv-gia__body", scene);
    const list = $(".liv-gia__msgs", scene);
    // the chat grows with its content (owner, 2026-11-08: no big empty panel at the start):
    // the body's height follows the visible run — just the head, then room for the dots,
    // then the message; once 3 are in view the list slides up and the oldest fades.
    const first = (i) => items[Math.max(0, i - SHOW + 1)].offsetTop;
    const yAt = (i) => -first(i);
    const hTyping = (i) => Math.ceil(items[i].offsetTop + $(".msg--typing", items[i]).offsetHeight - first(i));
    const hMsg = (i) => Math.ceil(items[i].offsetTop + items[i].offsetHeight - first(i));

    const tl = gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } });
    tl.fromTo($(".liv-gia__zoom", scene), { scale: 1 }, { scale: 1.04, duration: 4.4 }, 0);
    items.forEach((item, i) => {
      const typing = $(".msg--typing", item);
      const msg = $(".msg--gia", item);
      // the view change is the scene's main beat: a long, soft cross-fade; the new view
      // settles from a closer, slightly shifted framing while the old one drifts the other way
      tl.fromTo(views[i], { opacity: i ? 0 : 1, scale: 1.16, xPercent: 2.5 },
        { opacity: 1, scale: 1, xPercent: 0, duration: .85, ease: "sine.inOut" }, i);
      if (i) {
        tl.fromTo(views[i - 1], { scale: 1, xPercent: 0 },
          { scale: 1.05, xPercent: -2, duration: .85, ease: "sine.inOut", immediateRender: false }, i)
          .fromTo(places[i - 1], { opacity: 1 }, { opacity: 0, duration: .12, immediateRender: false }, i + .22)
          .fromTo(places[i], { opacity: 0 }, { opacity: 1, duration: .12 }, i + .32)
          .fromTo(list, { y: () => yAt(i - 1) }, { y: () => yAt(i), duration: .15, immediateRender: false }, i + .3);
      }
      if (i >= SHOW) tl.fromTo(items[i - SHOW], { opacity: 1 }, { opacity: 0, duration: .12, immediateRender: false }, i + .3);
      tl.fromTo(body, { height: () => (i ? hMsg(i - 1) : 0) }, { height: () => hTyping(i), duration: .12, ease: "power1.inOut", immediateRender: !i }, i + .3)
        .fromTo(typing, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .1 }, i + .4)
        .fromTo(typing, { opacity: 1 }, { opacity: 0, duration: .06, immediateRender: false }, i + .7)
        .fromTo(body, { height: () => hTyping(i) }, { height: () => hMsg(i), duration: .14, ease: "power1.inOut", immediateRender: false }, i + .7)
        .fromTo(msg, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .14 }, i + .72);
    });
    tl.to({}, { duration: .4 }); // hold the garden and the full history before the pin releases

    // looping view videos (preload none, poster first): they start loading once the scene is
    // near, and only a view that is actually seen plays — shown (opacity > 0) and not yet
    // fully covered by the next one; the rest are paused. All pause when the scene has gone.
    let near = false;
    const syncVideos = () => views.forEach((v, i) => {
      if (v.tagName !== "VIDEO") return;
      const next = views[i + 1];
      const seen = near && +gsap.getProperty(v, "opacity") > .01 && !(next && +gsap.getProperty(next, "opacity") >= .99);
      if (seen && v.paused) { const p = v.play(); if (p) p.catch(() => {}); }
      else if (!seen && !v.paused) v.pause();
    });
    const vt = ScrollTrigger.create({
      trigger: scene, start: "top bottom", end: "bottom top",
      onToggle: (s) => {
        near = s.isActive;
        if (near) views.forEach((v) => { if (v.tagName === "VIDEO") v.preload = "auto"; });
        syncVideos();
      },
    });
    tl.eventCallback("onUpdate", syncVideos);

    return () => { body.style.removeProperty("height"); vt.kill(); near = false; syncVideos(); };
  }

  /* Final invitation: one screen pinned over the night villa. The headline is there from the
     start; the line and then the gold button come in (autoAlpha, so the button can't be clicked
     while hidden), the dark overlay thins out and a warm glow rises from the windows.
     Gold dust: a canvas of slow rising, twinkling specks; it only runs while the scene is
     on screen and gets a little brighter with the scroll (level 0 to 1). */
  function ideaDust(canvas) {
    const ctx = canvas.getContext("2d");
    const sprite = document.createElement("canvas");
    const S = 32;
    sprite.width = sprite.height = S;
    const sc = sprite.getContext("2d");
    const g = sc.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, "rgba(255, 226, 168, 1)");
    g.addColorStop(.25, "rgba(242, 179, 90, .75)");
    g.addColorStop(1, "rgba(242, 179, 90, 0)");
    sc.fillStyle = g;
    sc.fillRect(0, 0, S, S);

    let w = 0, h = 0, dpr = 1, specks = [], raf = 0, level = 0, last = 0;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const speck = (anyY) => ({
      x: Math.random() * w, y: anyY ? Math.random() * h : h + 20 * dpr,
      r: rnd(2.5, 9) * dpr, vy: rnd(6, 22) * dpr, sway: rnd(4, 16) * dpr,
      ph: Math.random() * 6.28, tw: rnd(.6, 1.8), a: rnd(.25, .9),
    });
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.round(canvas.clientWidth * dpr);
      h = canvas.height = Math.round(canvas.clientHeight * dpr);
      const n = Math.min(140, Math.round((canvas.clientWidth * canvas.clientHeight) / 11000));
      specks = Array.from({ length: n }, () => speck(true));
    };
    const frame = (t) => {
      const dt = Math.min(.05, (t - (last || t)) / 1000);
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const k = .45 + .55 * level;
      for (const p of specks) {
        p.y -= p.vy * dt;
        p.ph += p.tw * dt;
        if (p.y < -20 * dpr) Object.assign(p, speck(false));
        const x = p.x + Math.sin(p.ph) * p.sway;
        ctx.globalAlpha = p.a * k * (.55 + .45 * Math.sin(p.ph * 2.3));
        ctx.drawImage(sprite, x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    return {
      set level(v) { level = v; },
      toggle: (on) => (on ? start() : stop()),
      kill: () => { stop(); ro.disconnect(); ctx.clearRect(0, 0, w, h); },
    };
  }

  function finalScene() {
    const scene = $('[data-scene="liv-final"]');
    if (!scene) return () => {};
    const dust = ideaDust($(".liv-final__dust", scene));

    const tl = gsap.timeline({
      scrollTrigger: {
        ...scrubTo(scene),
        onToggle: (st) => dust.toggle(st.isActive),
        onUpdate: (st) => { dust.level = st.progress; },
      },
      defaults: { ease: "none" },
    });
    tl.fromTo($(".liv-final__dark", scene), { opacity: 1 }, { opacity: .3, duration: 1.8 }, 0)
      .fromTo($(".liv-final__glow", scene), { opacity: 0 }, { opacity: 1, duration: 1.8 }, 0)
      .fromTo($(".liv-final__p", scene), { opacity: 0, y: 40, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: .45, ease: "power2.out" }, .3)
      .fromTo($(".liv-final__cta", scene), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .35, ease: "power2.out" }, 1.05)
      .to({}, { duration: .6 }); // hold the finished screen before the pin releases

    return () => dust.kill();
  }

  /* Feeling at home (a pause, no pin): the "lit" photo fades in over the dusk photo (which has a
     static darkening filter) the whole time the strip passes the screen, from its top at 85% of the
     window height to its bottom at 30%. Same photo, same framing, only opacity moves. */
  function settleLight() {
    const stage = $("[data-settle]");
    if (!stage) return;
    gsap.fromTo($(".liv-settle__lit", stage), { opacity: 0 }, {
      opacity: 1, ease: "none",
      scrollTrigger: { trigger: stage, start: "top 85%", end: "bottom 30%", scrub: .6, invalidateOnRefresh: true },
    });
  }

  /* The gold line of the "Feeling at home" text block: drawn down with the scroll from the strip's
     lower edge to the ring at the block's foot (the one effect of that block). */
  function settleRail() {
    const box = $(".liv-settle__text");
    if (!box) return;
    gsap.timeline({
      scrollTrigger: { trigger: box, start: "top 85%", end: "bottom 62%", scrub: .6, invalidateOnRefresh: true },
      defaults: { ease: "none" },
    })
      .fromTo($(".liv-settle__rail i", box), { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
      .fromTo($(".liv-settle__rail b", box), { opacity: 0 }, { opacity: 1, duration: .1 }, .9);
  }

  /* Dark chapter: the two gold lines are drawn down with the scroll (scaleY from the top);
     the rings at their ends appear when each line arrives. Static layout = lines complete. */
  function chapRails() {
    const duo = $("[data-chap]");
    if (!duo) return;
    gsap.timeline({
      scrollTrigger: { trigger: duo, start: "top 78%", end: "bottom 72%", scrub: .6, invalidateOnRefresh: true },
      defaults: { ease: "none" },
    })
      .fromTo($$(".liv-chap__rail i", duo), { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
      .fromTo($$(".liv-chap__rail b", duo), { opacity: 0 }, { opacity: 1, duration: .1 }, .9);
  }

  const mm = gsap.matchMedia();
  mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
    doc.classList.add("has-scenes");
    heroScene();
    const giaOff = giaScene();
    const finalOff = finalScene();
    settleLight();
    settleRail();
    chapRails();
    doc.classList.remove("scenes-pending");
    ScrollTrigger.refresh();
    return () => { giaOff(); finalOff(); doc.classList.remove("has-scenes"); };
  });
  doc.classList.remove("scenes-pending");
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
