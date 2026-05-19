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
const TOP_N = 10;

const isAr = document.documentElement.lang === 'ar';
const locale = isAr ? 'ar-EG' : 'en-US';
const fmt = {
  usd: (n) => isAr
    ? Math.round(n).toLocaleString(locale) + '$'
    : '$' + Math.round(n).toLocaleString(locale),
  num: (n) => Math.round(n).toLocaleString(locale),
};

const state = { data: null, timer: null };

const $ = (s, r = document) => r.querySelector(s);
const card = () => document.querySelector('.lb-card');
const t = (key, fallback) => (card()?.dataset?.[key]) || fallback;

function rowHtml(r, isMe, index) {
  const rankCls = r.rank <= 3 ? `bt-rank bt-rank-${r.rank}` : 'bt-rank';
  const code = (r.country || '').toLowerCase();
  const youLabel = t('youLabel', 'YOU');
  const joinedLabel = t('joinedLabel', 'Joined');
  // Each row gets its own animation delay (stagger), capped so late rows still feel snappy.
  const delay = Math.min((index || 0) * 60, 700);
  return `
    <div class="bt-lb-row reveal lb-row-anim${isMe ? ' is-you' : ''}" style="--reveal-delay: ${delay}ms;">
      <span class="${rankCls}">${r.rank}</span>
      <div class="lb-trader-stack">
        <span class="lb-trader">${r.name_masked}${isMe ? `<span class="lb-you">${youLabel}</span>` : ''}</span>
        <span class="lb-trader-id">${joinedLabel} ${r.joined_month || '—'}</span>
      </div>
      <span class="lb-country">
        <img class="lb-country__flag" src="${FLAGS}/${code}.svg" alt="" width="20" height="14" loading="lazy" />
        <span class="lb-country__code">${r.country}</span>
      </span>
      <span class="lb-deposit bt-num">${fmt.usd(r.deposits_usd)}</span>
      <span class="lb-trades bt-num">${fmt.num(r.trades)}</span>
      <span class="lb-points bt-num">${fmt.num(r.points)}</span>
    </div>
  `;
}

function renderRows() {
  const body = $('[data-lb-body]');
  if (!body) return;

  if (!state.data) {
    body.innerHTML = `<div class="lb-card__loading">${t('loadingText', 'Loading leaderboard…')}</div>`;
    return;
  }

  const rows = (state.data.leaderboard || []).slice(0, TOP_N);
  const me = state.data.current_user || null;
  const meInTop = me && rows.some((r) => r.rank === me.rank);

  if (!rows.length) {
    body.innerHTML = `<div class="lb-card__empty">${t('emptyText', 'The leaderboard will appear here once the championship begins.')}</div>`;
    return;
  }

  const topHtml = rows.map((r, idx) => rowHtml(r, meInTop && me.rank === r.rank, idx)).join('');

  let youHtml = '';
  if (me && !meInTop) {
    youHtml = rowHtml({ ...me, name_masked: me.name_masked || 'You' }, true, rows.length);
  }

  body.innerHTML = topHtml + youHtml;

  // Re-attach reveal observer to the newly inserted rows (and trigger the safety
  // fallback in case the observer doesn't fire in this environment).
  document.dispatchEvent(new CustomEvent('cc:reveal:rescan'));

  // Update footer timestamp
  const foot = $('[data-lb-foot-left]');
  if (foot && state.data.updated_at) {
    const t = new Date(state.data.updated_at);
    const now = Date.now();
    const seconds = Math.max(0, Math.floor((now - t.getTime()) / 1000));
    foot.textContent = `Updated ${seconds < 60 ? seconds + ' sec' : Math.floor(seconds / 60) + ' min'} ago · refreshes every 30 sec`;
  }
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

function start() {
  if (!$('[data-lb-body]')) return;
  load();
  state.timer = setInterval(load, POLL_MS);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearInterval(state.timer); state.timer = null; }
    else if (!state.timer) { load(); state.timer = setInterval(load, POLL_MS); }
  });
}

if (document.readyState !== 'loading') start();
else document.addEventListener('DOMContentLoaded', start);
