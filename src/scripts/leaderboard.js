// Leaderboard — matches the design prototype's BTLeaderboard rendering.
// Reads from public/data/leaderboard-default.json. Polls every 30s (per design
// footer copy "refreshes every 30 sec"). Renders rows with .bt-lb-row +
// rank pill, trader name + id, region chip, volume, 24h delta.

const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/data`;
const FEED = 'leaderboard-default.json';
const POLL_MS = 30 * 1000;

const fmt = {
  usd: (n) => '$' + Math.round(n).toLocaleString('en-US'),
  delta: (d) => `${d >= 0 ? '▲' : '▼'} ${Math.abs(d).toFixed(1)}%`,
};

const state = { tier: 'champions', data: null, timer: null, rows: 5 };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const tierByKey = (k) => state.data ? state.data.tiers.find((t) => t.tier_key === k) : null;

function renderRows() {
  const body = $('[data-lb-body]');
  if (!body) return;

  if (!state.data) {
    body.innerHTML = `<div class="lb-card__loading">Loading leaderboard…</div>`;
    return;
  }

  const tier = tierByKey(state.tier);
  const rows = tier ? tier.entries.slice(0, state.rows) : [];
  const me = state.data.current_user || null;
  const meInThisTier = me && me.tier_key === state.tier;

  if (!rows.length) {
    body.innerHTML = `<div class="lb-card__empty">The leaderboard will appear here once the competition begins.</div>`;
    return;
  }

  body.innerHTML = rows.map((r) => {
    const isMe = meInThisTier && me.rank === r.rank;
    const rankCls = r.rank <= 3 ? `bt-rank bt-rank-${r.rank}` : 'bt-rank';
    const deltaCls = r.delta_pct >= 0 ? 'lb-delta--up' : 'lb-delta--down';
    return `
      <div class="bt-lb-row${isMe ? ' is-you' : ''}">
        <span class="${rankCls}">${r.rank}</span>
        <div class="lb-trader-stack">
          <span class="lb-trader">${r.name}${isMe ? '<span class="lb-you">YOU</span>' : ''}</span>
          <span class="lb-trader-id">Trader #${r.trader_id}</span>
        </div>
        <span class="bt-chip lb-region">${r.region}</span>
        <span class="lb-vol bt-num">${fmt.usd(r.volume_usd)}</span>
        <span class="lb-delta ${deltaCls} bt-num">${fmt.delta(r.delta_pct)}</span>
      </div>
    `;
  }).join('');
}

function renderError() {
  const body = $('[data-lb-body]');
  if (body) body.innerHTML = `<div class="lb-card__error">Couldn't load the leaderboard. Refresh to try again.</div>`;
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

function bind() {
  $$('[data-lb-tier]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.tier = btn.dataset.lbTier;
      $$('[data-lb-tier]').forEach((b) => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
      renderRows();
    });
    btn.addEventListener('keydown', (e) => {
      const tabs = $$('[data-lb-tier]');
      const idx = tabs.indexOf(btn);
      if (e.key === 'ArrowRight') tabs[(idx + 1) % tabs.length].click();
      if (e.key === 'ArrowLeft')  tabs[(idx - 1 + tabs.length) % tabs.length].click();
    });
  });
}

function start() {
  if (!$('[data-lb-body]')) return;
  bind();
  load();
  state.timer = setInterval(load, POLL_MS);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearInterval(state.timer); state.timer = null; }
    else if (!state.timer) { load(); state.timer = setInterval(load, POLL_MS); }
  });
}

if (document.readyState !== 'loading') start();
else document.addEventListener('DOMContentLoaded', start);
