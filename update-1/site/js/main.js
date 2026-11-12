/* ==========================================================
   Glonari Homes — shared behaviour (all pages)
   Smooth scroll (Lenis + GSAP ticker), header state, mobile menu,
   simple reveal for "pause" blocks.
   ========================================================== */
(() => {
  "use strict";

  const doc = document.documentElement;
  doc.classList.add("js");
  document.body.classList.remove("no-js");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduce.matches) {
    lenis = new Lenis({ lerp: .1, smoothWheel: true });
    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const loop = (t) => { lenis.raf(t); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
  }
  window.Glonari = { lenis, reduce, hasGsap };

  /* ---------- Header ----------
     Over the hero photo it stays transparent; past it (or on pages
     without a hero) it turns solid. */
  const header = document.querySelector("[data-header]");
  const hero = document.querySelector("[data-hero]");
  function updateHeader() {
    if (!header) return;
    const limit = hero ? hero.offsetTop + hero.offsetHeight - header.offsetHeight : -1;
    header.classList.toggle("is-solid", window.scrollY > limit);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("resize", updateHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector("[data-burger]");
  const nav = document.getElementById("site-nav");
  function setMenu(open) {
    doc.classList.toggle("nav-open", open);
    if (burger) burger.setAttribute("aria-expanded", String(open));
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  if (burger && nav) {
    burger.addEventListener("click", () => setMenu(!doc.classList.contains("nav-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && doc.classList.contains("nav-open")) { setMenu(false); burger.focus(); }
    });
    window.matchMedia("(min-width: 1101px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Active nav link ---------- */
  if (nav) {
    const here = location.pathname.split("/").pop() || "index.html";
    nav.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href").split("/").pop();
      if (href === here) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  /* ---------- Reveal ---------- */
  const items = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px" });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-in"));
  }
})();
