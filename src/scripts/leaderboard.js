// Champion Points leaderboard — single flat board sorted by points.
// Reads from public/data/leaderboard-default.json. Polls every 30s.
// Names are masked server-side ("Ahmed A***i"). Never expose raw PII.
// If the current_user is outside the top N visible rows, render a
// divider + their pinned row below so they always see where they stand.

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, '');
const BASE = `${BASE_URL}/data`;
const FLAGS = `${BASE_URL}/flags`;
const FEED = 'leaderboard-default.json';
const POLL_MS = 30 * 1000;
const TOP_N = 10;            // rows per page

// Pagination state — page index is 0-based, starts at the top of the board.
let currentPage = 0;

const numLocale = 'en-US';
const ptsUnit = 'pts';
const fmt = {
  usd: (n) => '$' + Math.round(n).toLocaleString(numLocale),
  num: (n) => Math.round(n).toLocaleString(numLocale),
};

const state = { data: null, timer: null, filters: { name: '', id: '' } };
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
  // Each row gets its own animation delay (stagger), capped so late rows still feel snappy.
  const delay = Math.min((index || 0) * 60, 700);
  return `
    <div class="bt-lb-row reveal lb-row-anim${isMe ? ' is-you' : ''}" data-account-id="${r.account_id || ''}" style="--reveal-delay: ${delay}ms;">
      <span class="${rankCls}">${r.rank}</span>
      <div class="lb-trader-stack">
        <span class="lb-trader">${r.name_masked}${isMe ? `<span class="lb-you">${youLabel}</span>` : ''}</span>
        <span class="lb-trader-id">#${r.account_id || '—'}</span>
      </div>
      <span class="lb-country">
        <img class="lb-country__flag" src="${FLAGS}/${code}.svg" alt="" width="20" height="14" loading="lazy" />
        <span class="lb-country__code">${r.country}</span>
      </span>
      <span class="lb-deposit bt-num">${fmt.usd(r.deposits_usd)}</span>
      <span class="lb-trades bt-num">${fmt.num(r.trades)}</span>
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
    foot.textContent = `Updated ${seconds < 60 ? seconds + ' sec' : Math.floor(seconds / 60) + ' min'} ago · refreshes every 30 sec`;
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

  // Active search filters (name = substring on masked name, id = digits substring)
  const nameQ = state.filters.name.trim().toLowerCase();
  const idQ = state.filters.id.replace(/\D/g, '');

  if (nameQ || idQ) {
    const matches = all.filter((r) =>
      (!nameQ || (r.name_masked || '').toLowerCase().includes(nameQ)) &&
      (!idQ || String(r.account_id || '').includes(idQ))
    );

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
  const pageBtns = pages.map((p) => {
    if (p === '…') return `<span class="lb-page__ellipsis" aria-hidden="true">…</span>`;
    const active = p === page ? ' is-active' : '';
    return `<button class="lb-page${active}" data-lb-page="${p}" aria-label="Page ${p + 1}" aria-current="${active ? 'page' : 'false'}">${p + 1}</button>`;
  }).join('');
  return `
    <nav class="lb-pagination" aria-label="Leaderboard pagination">
      <button class="lb-page lb-page--nav" data-lb-page-prev ${prevDisabled ? 'disabled' : ''} aria-label="Previous page">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 4 L6 8 L10 12"/></svg>
      </button>
      <div class="lb-pagination__pages">${pageBtns}</div>
      <button class="lb-page lb-page--nav" data-lb-page-next ${nextDisabled ? 'disabled' : ''} aria-label="Next page">
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
    const res = await fetch(`${BASE}/${FEED}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.data = await res.json();
    renderRows();
  } catch (err) {
    console.error('[leaderboard] load failed', err);
    state.data = null;
    renderError();
  }
}

function bindFilters() {
  const nameInput = $('[data-lb-filter-name]');
  const idInput = $('[data-lb-filter-id]');
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      state.filters.name = nameInput.value;
      renderRows();
    });
  }
  if (idInput) {
    idInput.addEventListener('input', () => {
      state.filters.id = idInput.value;
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
