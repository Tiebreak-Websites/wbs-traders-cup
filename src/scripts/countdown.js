// Countdown — target date set via data-target on each [data-countdown].
// There can be more than one on the page (the hero countdown and the topbar
// mini-countdown), so we drive every [data-countdown] element, not just the
// first one. diff = max(0, target - now); split into D / H / M / S, zero-padded.
//
// Phase 2: when a digit value changes, briefly toggle .is-tick so the CSS
// flip-clock animation plays. We skip the very first render so the page
// doesn't fire 4 flip animations on load.

function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

function setDigit(el, val, firstRender) {
  if (!el) return;
  if (el.textContent === val) return;
  el.textContent = val;
  if (firstRender) return;
  // restart the animation: remove the class, force a reflow, then re-add.
  el.classList.remove('is-tick');
  // eslint-disable-next-line no-unused-expressions
  void el.offsetWidth;
  el.classList.add('is-tick');
}

function makeTicker(root) {
  const target = new Date(root.dataset.target || '2026-06-14T15:00:00Z');
  const dEl = root.querySelector('[data-d]');
  const hEl = root.querySelector('[data-h]');
  const mEl = root.querySelector('[data-m]');
  const sEl = root.querySelector('[data-s]');
  let first = true;

  return function tick() {
    const now = new Date();
    const diff = Math.max(0, target - now);
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    setDigit(dEl, pad(days),  first);
    setDigit(hEl, pad(hours), first);
    setDigit(mEl, pad(mins),  first);
    setDigit(sEl, pad(secs),  first);
    first = false;
  };
}

function init() {
  const roots = document.querySelectorAll('[data-countdown]');
  if (!roots.length) return;

  const tickers = Array.from(roots).map(makeTicker);
  const tickAll = () => tickers.forEach((t) => t());

  tickAll();
  setInterval(tickAll, 1000);
}

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
