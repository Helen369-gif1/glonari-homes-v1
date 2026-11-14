/* Glonari Homes — FAQs. Reveal and header live in main.js; hero lines are CSS.
   Here: a link to a group (#faq-03) or a question opens it, so the answer is never hidden behind a link. */
(() => {
  "use strict";
  function openTarget() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const q = el.closest("details");
    if (q) q.open = true;
    else { const first = el.querySelector("details"); if (first) first.open = true; }
  }
  openTarget();
  window.addEventListener("hashchange", openTarget);
})();
