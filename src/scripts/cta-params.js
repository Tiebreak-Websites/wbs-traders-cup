// Forward incoming URL query params (utm_*, gclid, fbclid, ref, etc.) onto the
// outbound CTA links so we can track where a visitor came from after they
// click through to the register page.
//
// "Keep both" policy:
//   - Each CTA's built-in identity (which button) is preserved in a dedicated
//     `cta` param, taken from the link's data-cta-track value. So even when a
//     visitor's own utm_source overrides the default, we still know whether the
//     hero button ("landing") or the floating bar ("sticky_bar") converted.
//   - All incoming params are then forwarded; on a key collision the visitor's
//     value wins (e.g. utm_source becomes the real traffic source).
//
// Incoming params are persisted to sessionStorage so they also survive internal
// navigation (e.g. visiting /terms and coming back).
(function () {
  var KEY = 'wbsCtaParams';

  // Return the query string to forward: prefer the live URL, otherwise fall
  // back to whatever we stored earlier this session.
  function getStoredSearch() {
    var search = (window.location.search || '').replace(/^\?/, '');
    if (search) {
      try { sessionStorage.setItem(KEY, search); } catch (e) {}
      return search;
    }
    try { return sessionStorage.getItem(KEY) || ''; } catch (e) { return ''; }
  }

  function apply() {
    var raw = getStoredSearch();
    var incoming = raw ? new URLSearchParams(raw) : null;
    var links = document.querySelectorAll('a[data-cta-track]');

    Array.prototype.forEach.call(links, function (a) {
      var href = a.getAttribute('href');
      if (!href) return;

      var url;
      try { url = new URL(href, window.location.href); } catch (e) { return; }

      // Preserve which button was clicked.
      var buttonId = a.getAttribute('data-cta-track');
      if (buttonId) url.searchParams.set('cta', buttonId);

      // Forward all incoming params; visitor's real source wins on conflict.
      if (incoming) {
        incoming.forEach(function (value, key) {
          url.searchParams.set(key, value);
        });
      }

      a.setAttribute('href', url.toString());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
