// Count-up — animate any [data-countup] from 0 → its current textContent
// value, once the element (or a parent matching [data-countup-anchor]) becomes
// .is-visible. Preserves the original formatting: $ prefix / suffix, commas,
// and Arabic Western digits (the page uses Latin numerals even on AR).
//
// Skipped entirely under prefers-reduced-motion.

const DURATION = 1200;       // ms
const FPS_TARGET = 60;       // capped via rAF anyway, used for budget
const EASE_OUT = (t) => 1 - Math.pow(1 - t, 3);   // cubic ease-out

function parseTarget(text) {
  // Match: optional leading $ / trailing $, digits, commas, optional decimal.
  // Returns { prefix, suffix, value, decimals, locale-grouped: true/false }.
  const trimmed = text.trim();
  const m = trimmed.match(/^([^\d-]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const numericRaw = m[2].replace(/,/g, '');
  const value = parseFloat(numericRaw);
  if (Number.isNaN(value)) return null;
  const decimals = (numericRaw.split('.')[1] || '').length;
  const grouped = m[2].includes(',');
  return {
    prefix: m[1] || '',
    suffix: m[3] || '',
    value,
    decimals,
    grouped,
  };
}

function format(value, spec) {
  const fixed = spec.decimals > 0 ? value.toFixed(spec.decimals) : Math.round(value).toString();
  let body = fixed;
  if (spec.grouped) {
    const [int, frac] = fixed.split('.');
    body = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (frac !== undefined) body += '.' + frac;
  }
  return spec.prefix + body + spec.suffix;
}

function animate(el, spec) {
  const start = performance.now();
  function frame(now) {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / DURATION);
    const eased = EASE_OUT(t);
    const cur = spec.value * eased;
    el.textContent = format(cur, spec);
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = format(spec.value, spec);   // snap to exact target
  }
  requestAnimationFrame(frame);
}

function arm(el) {
  const spec = parseTarget(el.textContent);
  if (!spec) return null;
  // Render as 0 immediately so the page doesn't flash the final value before
  // the reveal observer fires.
  el.textContent = format(0, spec);
  return spec;
}

function init() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = Array.from(document.querySelectorAll('[data-countup]'));
  if (!targets.length) return;

  // Pair each target with its reveal anchor (the closest .reveal ancestor, or
  // the element itself). When that anchor toggles .is-visible, fire.
  const entries = targets.map((el) => {
    const anchor = el.closest('.reveal') || el;
    const spec = arm(el);
    return spec ? { el, anchor, spec, fired: false } : null;
  }).filter(Boolean);

  function check() {
    let pending = false;
    entries.forEach((entry) => {
      if (entry.fired) return;
      if (entry.anchor.classList.contains('is-visible')) {
        entry.fired = true;
        animate(entry.el, entry.spec);
      } else {
        pending = true;
      }
    });
    return pending;
  }

  if (!check()) return;

  // Observer pattern: re-check when reveal observer dispatches its rescan,
  // and also on scroll/resize as a safety net.
  let pending = true;
  const recheck = () => { if (pending) pending = check(); };
  document.addEventListener('cc:reveal:rescan', recheck);
  window.addEventListener('scroll', recheck, { passive: true });
  window.addEventListener('resize', recheck);
  // Mutation observer on body for class changes on the reveal anchors.
  const mo = new MutationObserver(recheck);
  entries.forEach((e) => mo.observe(e.anchor, { attributes: true, attributeFilter: ['class'] }));
}

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
