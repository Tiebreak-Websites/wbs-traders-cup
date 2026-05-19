// Animate the hero prize: count from 0 → target on entry, then enable shimmer loop.
// Reads data attributes off the target element so locale/prefix/suffix come from
// server-rendered markup (kept in sync with the headline_prize JSON value).

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function format(value, locale, prefix, suffix) {
    return prefix + Math.round(value).toLocaleString(locale) + suffix;
  }

  function start(el) {
    const target = parseInt(el.dataset.countTarget, 10);
    const locale = el.dataset.countLocale || 'en-US';
    const prefix = el.dataset.countPrefix || '';
    const suffix = el.dataset.countSuffix || '';

    if (!Number.isFinite(target)) {
      el.classList.add('is-shimmering');
      return;
    }

    // Reduced motion: skip the count animation, go straight to shimmer.
    if (reducedMotion) {
      el.textContent = format(target, locale, prefix, suffix);
      el.classList.add('is-shimmering');
      return;
    }

    const duration = 1400;
    // Reset to start value immediately. The headline's .reveal class still has
    // opacity 0 at this point, so the flash from final → 0 is hidden.
    el.textContent = format(0, locale, prefix, suffix);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const t = Math.min(1, (Date.now() - startTime) / duration);
      // Ease-out cubic for a confident decelerate
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(target * eased, locale, prefix, suffix);
      if (t >= 1) {
        clearInterval(interval);
        // Snap to exact target then start the looping shimmer
        el.textContent = format(target, locale, prefix, suffix);
        el.classList.add('is-shimmering');
      }
    }, 32);
  }

  function init() {
    document.querySelectorAll('[data-count-target]').forEach(start);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
