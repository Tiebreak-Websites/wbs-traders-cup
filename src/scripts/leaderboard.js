// Champion Points leaderboard — single flat board sorted by points.
// Data comes from the Plexop n8n webhook (brand=wb_s, lang=<page lang>).
// Names arrive already masked to initials ("E.C."). Never expose raw PII.
// Polls every 30s.

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, '');
const FLAGS = `${BASE_URL}/flags`;
const FEED_URL = 'https://n8n.plexop.dev/webhook/traders-cup';
const BRAND = 'wb_s';
const POLL_MS = 30 * 1000;
const TOP_N = 10;            // rows per page

// The lang query param mirrors the current page's <html lang> (hreflang).
function feedUrl() {
  const lang = (document.documentElement.getAttribute('lang') || 'en')
    .toLowerCase()
    .split('-')[0];
  const u = new URL(FEED_URL);
  u.searchParams.set('brand', BRAND);
  u.searchParams.set('lang', lang);
  return u.toString();
}

// Full country name (EN/ES/PT variants) → ISO-3166 alpha-2 (matches /flags/*.svg).
const COUNTRY_CODE = {
  argentina: 'ar', brazil: 'br', brasil: 'br', chile: 'cl', colombia: 'co',
  mexico: 'mx', peru: 'pe', uruguay: 'uy', venezuela: 've', ecuador: 'ec',
  spain: 'es', espana: 'es', portugal: 'pt',
  'united kingdom': 'gb', uk: 'gb', 'great britain': 'gb', england: 'gb',
  ireland: 'ie', france: 'fr', francia: 'fr', franca: 'fr',
  germany: 'de', alemania: 'de', alemanha: 'de', italy: 'it', italia: 'it',
  'united arab emirates': 'ae', uae: 'ae', bahrain: 'bh',
  egypt: 'eg', egipto: 'eg', egito: 'eg', jordan: 'jo', kuwait: 'kw',
  lebanon: 'lb', libano: 'lb', oman: 'om', qatar: 'qa',
  'saudi arabia': 'sa', 'arabia saudita': 'sa',
};
const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g');
const normalizeName = (s) => String(s || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(DIACRITICS, '');
const countryCode = (name) => COUNTRY_CODE[normalizeName(name)] || '';
const escapeHtml = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Map the n8n webhook rows (a flat array) → the internal leaderboard shape.
// Sort by points desc and assign sequential positions (1, 2, 3, … N) so each
// row is a distinct place and pages read 1–10, 11–20, etc.
function transform(rows) {
  const list = Array.isArray(rows) ? rows.slice() : [];
  list.sort((a, b) => (Number(b.Points) || 0) - (Number(a.Points) || 0));
  let lastUpdated = 0;
  const leaderboard = list.map((r, i) => {
    const points = Number(r.Points) || 0;
    const rank = i + 1;
    const ts = Date.parse(r.updatedAt || r.createdAt || '');
    if (ts && ts > lastUpdated) lastUpdated = ts;
    return {
      rank,
      account_id: String(r.Client_ID || r.LeadId || ''),
      name_masked: r.Client_Name || '',
      country_name: r.Country || '',
      country: countryCode(r.Country),   // ISO code → flag + pill label
      points,
    };
  });
  return {
    leaderboard,
    current_user: null,
    updated_at: lastUpdated ? new Date(lastUpdated).toISOString() : null,
  };
}

// Pagination state — page index is 0-based, starts at the top of the board.
let currentPage = 0;

const numLocale = 'en-US';
const fmt = {
  usd: (n) => '$' + Math.round(n).toLocaleString(numLocale),
  num: (n) => Math.round(n).toLocaleString(numLocale),
};

const state = { data: null, timer: null, filters: { q: '' } };

// Phase 2: remember each account's previous points so we can flash rows whose
// score changed between polls. Keyed by account_id → last known points value.
const prevPoints = new Map();
let firstRender = true;

const $ = (s, r = document) => r.querySelector(s);
const card = () => document.querySelector('.lb-card');
const t = (key, fallback) => (card()?.dataset?.[key]) || fallback;

function rowHtml(r, isMe, index) {
  const rankCls = r.rank <= 3 ? `bt-rank bt-rank-${r.rank}` : 'bt-rank';
  const code = (r.country || '').toLowerCase();
  const youLabel = t('youLabel', 'YOU');
  const ptsUnit = t('ptsUnit', 'pts');
  // Each row gets its own animation delay (stagger), capped so late rows still feel snappy.
  const delay = Math.min((index || 0) * 60, 700);
  // Names arrive pre-masked to initials; show them as-is (escaped).
  const flagImg = code
    ? `<img class="lb-country__flag" src="${FLAGS}/${code}.svg" alt="" width="20" height="14" loading="lazy" onerror="this.remove()" />`
    : '';
  const countryLabel = code ? code.toUpperCase() : escapeHtml(r.country_name || '');
  return `
    <div class="bt-lb-row reveal lb-row-anim${isMe ? ' is-you' : ''}" data-account-id="${r.account_id || ''}" style="--reveal-delay: ${delay}ms;">
      <span class="${rankCls}">${r.rank}</span>
      <div class="lb-trader-stack">
        <span class="lb-trader">${escapeHtml(r.name_masked)}${isMe ? `<span class="lb-you">${youLabel}</span>` : ''}</span>
        <span class="lb-trader-id">#${escapeHtml(r.account_id) || '—'}</span>
      </div>
      <span class="lb-country">
        ${flagImg}<span class="lb-country__code">${countryLabel}</span>
      </span>
      <span class="lb-points bt-num">${fmt.num(r.points)}<span class="lb-points__unit">${ptsUnit}</span></span>
    </div>
  `;
}


function updateFoot() {
  const foot = $('[data-lb-foot-left]');
  if (foot && state.data && state.data.updated_at) {
    const updated = new Date(state.data.updated_at);
    const now = Date.now();
    const seconds = Math.max(0, Math.floor((now - updated.getTime()) / 1000));
    const secShort = t('secondsShort', 'sec');
    const minShort = t('minutesShort', 'min');
    const timeStr = seconds < 60 ? `${seconds} ${secShort}` : `${Math.floor(seconds / 60)} ${minShort}`;
    const template = t('updatedTemplate', 'Updated {time} ago · refreshes every 30 sec');
    foot.textContent = template.replace('{time}', timeStr);
  }
}

function renderRows() {
  const body = $('[data-lb-body]');
  if (!body) return;

  if (!state.data) {
    body.innerHTML = `<div class="lb-card__loading">${t('loadingText', 'Loading leaderboard…')}</div>`;
    return;
  }

  const all = state.data.leaderboard || [];
  const me = state.data.current_user || null;
  const isMeRow = (r) => !!(me && r.account_id === me.account_id && r.rank === me.rank);

  // Combined search — matches by masked name, country, or account ID.
  const q = (state.filters.q || '').trim().toLowerCase();

  if (q) {
    const qDigits = q.replace(/\D/g, '');
    const matches = all.filter((r) => {
      const name = (r.name_masked || '').toLowerCase();
      const country = (r.country_name || '').toLowerCase();
      const id = String(r.account_id || '');
      return name.includes(q) || country.includes(q) || (!!qDigits && id.includes(qDigits));
    });

    if (!matches.length) {
      body.innerHTML = `<div class="lb-card__empty">${t('noResultsText', 'No traders match your search.')}</div>`;
      document.dispatchEvent(new CustomEvent('cc:reveal:rescan'));
      updateFoot();
      return;
    }

    body.innerHTML = matches.map((r, idx) => rowHtml(r, false, idx)).join('');
    document.dispatchEvent(new CustomEvent('cc:reveal:rescan'));
    updateFoot();
    return;
  }

  // Paginated view — slice the full board into pages of TOP_N rows.
  const totalPages = Math.max(1, Math.ceil(all.length / TOP_N));
  if (currentPage >= totalPages) currentPage = totalPages - 1;
  if (currentPage < 0) currentPage = 0;
  const start = currentPage * TOP_N;
  const rows = all.slice(start, start + TOP_N);
  const meInTop = me && rows.some((r) => r.rank === me.rank);

  if (!rows.length) {
    body.innerHTML = `<div class="lb-card__empty">${t('emptyText', 'The leaderboard will appear here once the championship begins.')}</div>`;
    return;
  }

  const rowsHtml = rows.map((r, idx) => rowHtml(r, meInTop && me.rank === r.rank, idx)).join('');
  const paginationHtml = paginationBlockHtml(currentPage, totalPages);

  body.innerHTML = rowsHtml + paginationHtml;
  bindPagination(body, totalPages);

  // Re-attach reveal observer to the newly inserted rows (and trigger the safety
  // fallback in case the observer doesn't fire in this environment).
  document.dispatchEvent(new CustomEvent('cc:reveal:rescan'));
  updateFoot();
  flashChangedRows(body);
}

// Pagination footer — prev/next + numbered page indicator. Uses a compact
// "windowed" page list (current ± 1, with ellipses to first/last) so pages
// in the hundreds still fit in the row width.
function paginationBlockHtml(page, total) {
  if (total <= 1) return '';
  const win = new Set([0, total - 1, page, page - 1, page + 1]);
  const sorted = Array.from(win).filter((n) => n >= 0 && n < total).sort((a, b) => a - b);
  const pages = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) pages.push('…');
    pages.push(sorted[i]);
  }
  const prevDisabled = page === 0;
  const nextDisabled = page === total - 1;
  const pageTpl = t('pageLabelTemplate', 'Page {n}');
  const paginationLbl = t('paginationLabel', 'Leaderboard pagination');
  const prevLbl = t('prevPageLabel', 'Previous page');
  const nextLbl = t('nextPageLabel', 'Next page');
  // With more than 6 pages the numbered list gets unwieldy — switch to a
  // compact "jump to page" input ( [ n ] / total ) instead.
  let middle;
  if (total > 6) {
    const ofLbl = t('pageOfLabel', 'of');
    middle = `
      <div class="lb-pagination__jump">
        <input class="lb-page__input bt-num" type="number" inputmode="numeric" min="1" max="${total}"
               value="${page + 1}" data-lb-page-input aria-label="${pageTpl.replace('{n}', '')}" />
        <span class="lb-page__of">${ofLbl} ${total}</span>
      </div>`;
  } else {
    const pageBtns = pages.map((p) => {
      if (p === '…') return `<span class="lb-page__ellipsis" aria-hidden="true">…</span>`;
      const active = p === page ? ' is-active' : '';
      const ariaLbl = pageTpl.replace('{n}', String(p + 1));
      return `<button class="lb-page${active}" data-lb-page="${p}" aria-label="${ariaLbl}" aria-current="${active ? 'page' : 'false'}">${p + 1}</button>`;
    }).join('');
    middle = `<div class="lb-pagination__pages">${pageBtns}</div>`;
  }
  return `
    <nav class="lb-pagination" aria-label="${paginationLbl}">
      <button class="lb-page lb-page--nav" data-lb-page-prev ${prevDisabled ? 'disabled' : ''} aria-label="${prevLbl}">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 4 L6 8 L10 12"/></svg>
      </button>
      ${middle}
      <button class="lb-page lb-page--nav" data-lb-page-next ${nextDisabled ? 'disabled' : ''} aria-label="${nextLbl}">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4 L10 8 L6 12"/></svg>
      </button>
    </nav>
  `;
}

function bindPagination(body, total) {
  body.querySelectorAll('[data-lb-page]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.dataset.lbPage, 10);
      if (Number.isFinite(p) && p !== currentPage) { currentPage = p; renderRows(); }
    });
  });
  const prev = body.querySelector('[data-lb-page-prev]');
  if (prev) prev.addEventListener('click', () => {
    if (currentPage > 0) { currentPage--; renderRows(); }
  });
  const next = body.querySelector('[data-lb-page-next]');
  if (next) next.addEventListener('click', () => {
    if (currentPage < total - 1) { currentPage++; renderRows(); }
  });
  // Jump-to-page input (shown when total > 6)
  const input = body.querySelector('[data-lb-page-input]');
  if (input) {
    const go = () => {
      let v = parseInt(input.value, 10);
      if (!Number.isFinite(v)) { input.value = currentPage + 1; return; }
      v = Math.min(total, Math.max(1, v)) - 1;
      if (v !== currentPage) { currentPage = v; renderRows(); }
      else input.value = currentPage + 1;
    };
    input.addEventListener('change', go);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); go(); }
    });
  }
}

// Phase 2: compare each row's points to the previous snapshot. Rows whose
// points moved get .is-updated for 1.4s (CSS plays the orange left-rule flash).
function flashChangedRows(body) {
  if (!state.data || !state.data.leaderboard) return;
  // Skip the very first render — every row is "new" on initial paint, so a
  // page-load flash would be a distraction, not a signal.
  if (firstRender) {
    state.data.leaderboard.forEach((r) => prevPoints.set(r.account_id, r.points));
    firstRender = false;
    return;
  }
  state.data.leaderboard.forEach((r) => {
    const prev = prevPoints.get(r.account_id);
    if (prev !== undefined && prev !== r.points) {
      const el = body.querySelector(`[data-account-id="${r.account_id}"]`);
      if (el) {
        el.classList.remove('is-updated');
        // eslint-disable-next-line no-unused-expressions
        void el.offsetWidth;
        el.classList.add('is-updated');
        setTimeout(() => el.classList.remove('is-updated'), 1500);
      }
    }
    prevPoints.set(r.account_id, r.points);
  });
}

function renderError() {
  const body = $('[data-lb-body]');
  if (body) body.innerHTML = `<div class="lb-card__error">${t('errorText', "Couldn't load the leaderboard. Refresh to try again.")}</div>`;
}

async function load() {
  try {
    const res = await fetch(feedUrl(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // An empty body is a valid "no entries yet" response — show the empty
    // state rather than an error.
    const text = (await res.text()).trim();
    state.data = transform(text ? JSON.parse(text) : []);
    renderRows();
  } catch (err) {
    console.error('[leaderboard] load failed', err);
    state.data = null;
    renderError();
  }
}

function bindFilters() {
  const qInput = $('[data-lb-filter-q]');
  if (qInput) {
    qInput.addEventListener('input', () => {
      state.filters.q = qInput.value;
      renderRows();
    });
  }
}

function start() {
  if (!$('[data-lb-body]')) return;
  bindFilters();
  load();
  state.timer = setInterval(load, POLL_MS);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearInterval(state.timer); state.timer = null; }
    else if (!state.timer) { load(); state.timer = setInterval(load, POLL_MS); }
  });
}

if (document.readyState !== 'loading') start();
else document.addEventListener('DOMContentLoaded', start);
