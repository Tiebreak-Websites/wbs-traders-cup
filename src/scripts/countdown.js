// Countdown — target date set via data-target on [data-countdown].
// Matches the design prototype's useCountdown helper:
//   diff = max(0, target - now); split into D / H / M / S, zero-padded.
// v2 — reads data-target instead of legacy data-live-start/end.

function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

function init() {
  const root = document.querySelector('[data-countdown]');
  if (!root) return;

  const target = new Date(root.dataset.target || '2026-06-14T15:00:00Z');

  const dEl = root.querySelector('[data-d]');
  const hEl = root.querySelector('[data-h]');
  const mEl = root.querySelector('[data-m]');
  const sEl = root.querySelector('[data-s]');

  function tick() {
    const now = new Date();
    const diff = Math.max(0, target - now);
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    if (dEl) dEl.textContent = pad(days);
    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(mins);
    if (sEl) sEl.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
}

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
