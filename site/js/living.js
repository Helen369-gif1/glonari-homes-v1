/* ==========================================================
   Glonari Homes — Living With Glonari
   Pinned scenes on wide screens (.has-scenes, >=769px):
     1) first screen — "walking into the home": garden in bokeh with
        the word → the kitchen → the family at the table → a slow
        zoom, the shade and the copy (as heroScene() in how-it-works.js);
     2) Try Before You Buy — the gold line becomes a timeline.
   Not a scene: "Two ways to own" — the line splits into two paths
   drawn on scroll (ownBranches(), >=1101px, motion-safe);
   "When life changes" — a self-playing 3-scenario stage, not scrubbed (lifeStage(), pure JS, no GSAP).
     3) "Gia goes with you" — four views behind one window, the chat
        keeps its history (giaScene()).
     4) "The bigger idea" — the manifesto, one line at a time, gold dust,
        the night lightens towards the button (ideaScene()).
   Four scenes in total (owner). Scrubbed timelines use fromTo only (from breaks on refresh).
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

  /* Try Before You Buy: a gold dot runs down the line; when it reaches a step, the step's
     card comes in and stays (y 20→0, scale .94→1). Prepare / Move In stay outlined;
     Live / Build / Decide then fill with colour and settle with a slight tilt and shift
     (the 1Password "A Vision of the Future" cards). Ends with all five cards, dot on Decide. */
  const TILT = { live: [-3, 12], build: [2.5, -10], decide: [-1.5, 14] }; // [rotation°, x px]
  function tbybScene() {
    const scene = $('[data-scene="liv-tbyb"]');
    if (!scene) return;
    const steps = $$(".liv-step", scene);
    const dot = $(".liv-steps__dot", scene);
    // the dot's top so that it sits on a step's ring (ring: top 23px + 3.5px radius; dot radius 6.5px)
    const dotY = (i) => () => $(".liv-step__label", steps[i]).offsetTop + 20;
    const at = (i) => .06 + i * .19;

    const tl = gsap.timeline({ scrollTrigger: scrubTo(scene), defaults: { ease: "none" } });
    tl.fromTo(dot, { y: dotY(0) }, { y: dotY(0), duration: .01 }, 0);
    steps.forEach((step, i) => {
      const card = $(".liv-step__card", step);
      const label = $(".liv-step__label", step);
      const t = at(i);
      if (i > 0) tl.fromTo(dot, { y: dotY(i - 1) }, { y: dotY(i), duration: at(i) - at(i - 1), immediateRender: false }, at(i - 1));
      tl.fromTo(label, { opacity: .4 }, { opacity: 1, duration: .05 }, t)
        .fromTo(card, { opacity: 0, y: 20, scale: .94 }, { opacity: 1, y: 0, scale: 1, duration: .07, ease: "power1.out" }, t);
      const kind = Object.keys(TILT).find((k) => card.classList.contains("liv-step__card--" + k));
      if (kind) {
        const cs = getComputedStyle(card);
        const bg = cs.backgroundColor, ink = cs.color;
        tl.fromTo(card,
          { backgroundColor: bg.replace("rgb(", "rgba(").replace(")", ", 0)"), borderColor: "rgba(244, 237, 226, .32)", color: "rgb(244, 237, 226)", rotation: 0, x: 0 },
          { backgroundColor: bg, borderColor: bg, color: ink, rotation: TILT[kind][0], x: TILT[kind][1], duration: .07, ease: "power2.out" }, t + .07);
      }
    });
    tl.to({}, { duration: .1 }); // hold the finished timeline before the pin releases

    /* The pinned stage is one screen tall with its content centred, so empty brown stays
       under the cards. "Two ways to own" subtracts it (--tbyb-tail) from its top padding:
       content → next eyebrow stays one --section-y (DESIGN-SYSTEM §5), not two. */
    const own = $("#ownership");
    const stage = $(".liv-tbyb__stage", scene);
    const grid = $(".liv-tbyb__grid", scene);
    const tail = () => {
      if (!own) return;
      const t = stage.getBoundingClientRect().bottom - grid.getBoundingClientRect().bottom;
      own.style.setProperty("--tbyb-tail", Math.max(0, Math.round(t)) + "px");
    };
    tail();
    ScrollTrigger.addEventListener("refreshInit", tail);
    return () => {
      ScrollTrigger.removeEventListener("refreshInit", tail);
      if (own) own.style.removeProperty("--tbyb-tail");
    };
  }

  /* Two ways to own (a pause, no pin): the gold line from TBYB runs down beside the heading
     and splits into two curves that reach the top centres of the two cards, ending in small
     rings. The curves draw with the scroll (pathLength="1", so the dash values don't depend
     on the geometry). Geometry is measured in .liv-own__stage with offset* (transform-free,
     so the reveal's translateY doesn't skew it) on every refresh and whenever a card changes
     size (ResizeObserver — this also follows the hover widening frame by frame). */
  function ownBranches() {
    const sec = $("#ownership");
    if (!sec) return () => {};
    const stage = $(".liv-own__stage", sec);
    const head = $(".liv-own__head", sec);
    const duo = $(".liv-own__duo", sec);
    const cards = $$(".liv-own__card", sec);
    const paths = $$(".liv-own__branch", sec);
    const rings = $$(".liv-own__ring", sec);

    const layout = () => {
      const tlx = parseFloat(getComputedStyle(sec).getPropertyValue("--tl-x")) || 0;
      const x0 = Math.round(tlx * stage.clientWidth) + .5;  // centre of the 1px CSS line
      const y0 = head.offsetTop + head.offsetHeight + 20;     // the split: just under the heading
      const y1 = duo.offsetTop;                               // top edge of the cards
      const ym = (y0 + y1) / 2;
      sec.style.setProperty("--own-stem", (stage.offsetTop + y0) + "px");
      cards.forEach((card, i) => {
        const cx = Math.round(card.offsetLeft + card.offsetWidth / 2) + .5;
        paths[i].setAttribute("d", `M${x0} ${y0} C${x0} ${ym} ${cx} ${ym} ${cx} ${y1}`);
        rings[i].setAttribute("cx", cx);
        rings[i].setAttribute("cy", y1);
      });
    };

    doc.classList.add("has-branches");
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(stage);
    cards.forEach((c) => ro.observe(c));
    ScrollTrigger.addEventListener("refresh", layout);

    gsap.timeline({
      scrollTrigger: { trigger: duo, start: "top 92%", end: "top 52%", scrub: .6, invalidateOnRefresh: true },
      defaults: { ease: "none" },
    })
      .fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1 }, 0)
      .fromTo(rings, { opacity: 0 }, { opacity: 1, duration: .15 }, .9);
    ScrollTrigger.refresh(); // .has-branches made the gap above the cards taller

    return () => {
      ro.disconnect();
      ScrollTrigger.removeEventListener("refresh", layout);
      sec.style.removeProperty("--own-stem");
      doc.classList.remove("has-branches");
    };
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

  /* The bigger idea (Endel Manifesto): one screen pinned over the night villa. The five
     manifesto lines replace each other (in: opacity, y 40→0, blur 10→0; out: up and blurred),
     the dark overlay thins out and a warm glow rises from the windows towards the last line,
     then the gold button comes in (autoAlpha, so it can't be clicked while hidden).
     Gold dust: a canvas of slow rising, twinkling specks; it only runs while the scene is
     on screen and gets a little brighter with the scroll (level 0→1). */
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

  function ideaScene() {
    const scene = $('[data-scene="liv-idea"]');
    if (!scene) return () => {};
    const lines = $$(".liv-idea__line", scene);
    const last = lines.length - 1;
    const dust = ideaDust($(".liv-idea__dust", scene));

    const tl = gsap.timeline({
      scrollTrigger: {
        ...scrubTo(scene),
        onToggle: (st) => dust.toggle(st.isActive),
        onUpdate: (st) => { dust.level = st.progress; },
      },
      defaults: { ease: "none" },
    });
    tl.fromTo($(".liv-idea__dark", scene), { opacity: 1 }, { opacity: .3, duration: last + .4 }, 0)
      .fromTo($(".liv-idea__glow", scene), { opacity: 0 }, { opacity: 1, duration: last + .4 }, 0);
    lines.forEach((line, i) => {
      if (i) tl.fromTo(line, { opacity: 0, y: 40, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: .35, ease: "power2.out" }, i - .1);
      else tl.fromTo(line, { opacity: 1, y: 0, filter: "blur(0px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: .01 }, 0);
      if (i < last) tl.fromTo(line, { opacity: 1, y: 0, filter: "blur(0px)" }, { opacity: 0, y: -40, filter: "blur(10px)", duration: .3, ease: "power1.in", immediateRender: false }, i + .6);
    });
    tl.fromTo($(".liv-idea__cta", scene), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .3, ease: "power2.out" }, last + .45)
      .to({}, { duration: .5 }); // hold the last line and the button before the pin releases

    return () => dust.kill();
  }

  const mm = gsap.matchMedia();
  mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
    doc.classList.add("has-scenes");
    heroScene();
    const tbybOff = tbybScene() || (() => {});
    const giaOff = giaScene();
    const ideaOff = ideaScene();
    doc.classList.remove("scenes-pending");
    ScrollTrigger.refresh();
    return () => { tbybOff(); giaOff(); ideaOff(); doc.classList.remove("has-scenes"); };
  });
  // the two ownership paths: only where the line stands at --tl-x beside the text (>=1101px)
  mm.add("(min-width: 1101px) and (prefers-reduced-motion: no-preference)", () => ownBranches());
  doc.classList.remove("scenes-pending");
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
