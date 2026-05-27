// Magnetic CTA — subtle cursor-follow translate on the hero's primary CTA.
// rAF + lerp for buttery motion. Composes with the button's hover lift via
// CSS custom properties --cta-x / --cta-y (defined in global.css Phase 2).
//
// Disabled under prefers-reduced-motion, on touch-primary devices, and on
// viewports below 720px (no hover state to magnet to).

const PULL = 0.22;      // cursor proximity weight — higher = stronger magnet
const MAX_OFFSET = 8;   // clamp px so the button never drifts too far
const EASE = 0.22;      // lerp factor per frame

function shouldEnable() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (matchMedia('(hover: none)').matches) return false;
  if (window.innerWidth < 720) return false;
  return true;
}

function bind(el) {
  let raf = 0;
  let cur = { x: 0, y: 0 };
  let tgt = { x: 0, y: 0 };

  function clamp(v) { return Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, v)); }

  function tick() {
    cur.x += (tgt.x - cur.x) * EASE;
    cur.y += (tgt.y - cur.y) * EASE;
    el.style.setProperty('--cta-x', cur.x.toFixed(2) + 'px');
    el.style.setProperty('--cta-y', cur.y.toFixed(2) + 'px');

    if (Math.abs(tgt.x - cur.x) > 0.1 || Math.abs(tgt.y - cur.y) > 0.1) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
      if (tgt.x === 0 && tgt.y === 0) el.classList.remove('is-magnetizing');
    }
  }

  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    tgt.x = clamp((e.clientX - cx) * PULL);
    tgt.y = clamp((e.clientY - cy) * PULL);
    el.classList.add('is-magnetizing');
    if (!raf) raf = requestAnimationFrame(tick);
  });

  el.addEventListener('pointerleave', () => {
    tgt.x = 0;
    tgt.y = 0;
    if (!raf) raf = requestAnimationFrame(tick);
  });
}

function init() {
  if (!shouldEnable()) return;
  document.querySelectorAll('[data-magnetic]').forEach(bind);
}

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
