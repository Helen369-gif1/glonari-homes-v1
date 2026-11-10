/* ==========================================================
   Hero scene (home page)
   p = 0 … 1 over the pinned distance. The sky stays still, the
   valley grows and sinks, the girl settles a little, the word
   rises from behind the valley and stands behind her. Then the
   shade and the copy arrive.
   ========================================================== */
(() => {
  "use strict";

  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const doc = document.documentElement;
  const stage = hero.querySelector(".hero__stage");
  const get = (name) => hero.querySelector(`[data-layer="${name}"]`);
  const sky = get("sky"), valley = get("valley"), girl = get("girl"), wordLayer = get("word");
  const word = hero.querySelector(".hero__word-inner");
  const shade = hero.querySelector(".hero__shade");
  const cue = hero.querySelector(".hero__cue");
  const copy = [...hero.querySelectorAll("[data-copy]")];
  if (!stage || !sky || !valley || !girl || !wordLayer || !word) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const smooth = (t) => t * t * (3 - 2 * t);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function render(p) {
    const d = easeInOut(seg(p, 0, .9));
    const rise = easeOut(seg(p, .04, .8));

    sky.style.transform = "none";
    wordLayer.style.transform = "none";
    valley.style.transform = `translate3d(0, ${lerp(0, 3.5, d)}%, 0) scale(${lerp(1, 1.11, d)})`;
    girl.style.transform = `translate3d(0, ${lerp(0, 1.5, d)}%, 0)`;
    word.style.transform = `translate3d(0, ${lerp(wordFrom, 0, rise)}%, 0)`;

    if (shade) shade.style.opacity = smooth(seg(p, .72, .92)).toFixed(3);
    copy.forEach((el, i) => {
      const t = easeOut(seg(p, .78 + i * .06, .94 + i * .06));
      el.style.opacity = t.toFixed(3);
      el.style.transform = `translate3d(0, ${lerp(24, 0, t)}px, 0)`;
    });
    if (cue) cue.style.opacity = (1 - smooth(seg(p, 0, .08))).toFixed(3);
  }

  function renderFinal() {
    [sky, wordLayer, valley, girl, word, ...copy].forEach((el) => { el.style.transform = ""; el.style.opacity = ""; });
    if (shade) shade.style.opacity = "";
  }

  let target = 0, current = 0, raf = 0, active = false, wordFrom = 175;

  function readVars() {
    const v = parseFloat(getComputedStyle(doc).getPropertyValue("--word-from"));
    wordFrom = Number.isFinite(v) ? v : 175;
  }
  function measure() {
    const travel = hero.offsetHeight - stage.offsetHeight;
    target = travel > 0 ? clamp(-hero.getBoundingClientRect().top / travel) : 1;
  }

  /* Lenis already smooths the scroll, so with it the scene follows
     the scroll directly. Without it, a calm catch-up softens jumps. */
  const smoothed = () => !(window.Glonari && window.Glonari.lenis);

  function tick() {
    current = smoothed() ? current + (target - current) * .09 : target;
    if (Math.abs(target - current) < .0004) current = target;
    render(current);
    raf = current === target ? 0 : requestAnimationFrame(tick);
  }
  function onScroll() {
    if (!active) return;
    measure();
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function setMode() {
    active = !reduce.matches;
    hero.classList.toggle("is-static", !active);
    if (!active) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      renderFinal();
      return;
    }
    readVars();
    measure();
    current = target;
    render(current);
  }

  doc.classList.add("js");
  document.body.classList.remove("no-js");

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { readVars(); onScroll(); }, { passive: true });
  if (reduce.addEventListener) reduce.addEventListener("change", setMode);
  setMode();
})();
