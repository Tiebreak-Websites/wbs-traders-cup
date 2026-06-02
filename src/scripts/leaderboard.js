// Ticket checker — type an account ID, click Check.
// Looks the ID up in public/data/leaderboard-default.json and shows either
// "no tickets" or the entrant's name + flag + deposit + ticket count.
// Names are masked in the source data; never expose raw PII.

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, '');
const BASE = `${BASE_URL}/data`;
const FLAGS = `${BASE_URL}/flags`;
const FEED = 'leaderboard-default.json';
const USD_PER_TICKET = 100;

const numLocale = 'en-US';
const fmt = {
  usd: (n) => '$' + Math.round(n).toLocaleString(numLocale),
  num: (n) => Math.round(n).toLocaleString(numLocale),
};
const ticketsFor = (r) => Math.floor((r.deposits_usd || 0) / USD_PER_TICKET);

const card = () => document.querySelector('.checker');
const t = (key, fallback) => (card()?.dataset?.[key]) || fallback;

let lookup = null; // Map<accountId, entry>, built on first check

async function loadLookup() {
  if (lookup) return lookup;
  const res = await fetch(`${BASE}/${FEED}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  lookup = new Map((data.leaderboard || []).map((r) => [String(r.account_id).trim().toLowerCase(), r]));
  return lookup;
}

function setResult(html) {
  const el = document.querySelector('[data-checker-result]');
  if (!el) return;
  el.innerHTML = html;
  document.dispatchEvent(new CustomEvent('cc:reveal:rescan'));
}

function foundHtml(r) {
  const code = (r.country || '').toLowerCase();
  const tickets = ticketsFor(r);
  const depLbl = t('depositLabel', 'Deposit');
  const ticLbl = t('ticketsLabel', 'Tickets');
  const msg = t('foundMsg', "You're in the draw!");
  return `
    <div class="checker__found">
      <div class="checker__found-status">${msg}</div>
      <div class="checker__stub">
        <div class="checker__stub-info">
          <div class="checker__person">
            <img class="checker__flag" src="${FLAGS}/${code}.svg" alt="" width="40" height="28" loading="lazy" />
            <div class="checker__person-info">
              <span class="checker__name">${r.name_masked}</span>
              <span class="checker__acct">#${r.account_id}</span>
            </div>
          </div>
          <div class="checker__deposit">
            <span class="checker__deposit-lbl">${depLbl}</span>
            <span class="checker__deposit-val bt-num">${fmt.usd(r.deposits_usd)}</span>
          </div>
        </div>
        <div class="checker__stub-tickets">
          <img class="checker__tic-ico" src="${BASE_URL}/ticket.png" alt="" width="56" height="32" />
          <span class="checker__tickets-num bt-num">${fmt.num(tickets)}</span>
          <span class="checker__tickets-lbl">${ticLbl}</span>
        </div>
      </div>
    </div>
  `;
}

function noneHtml() {
  const href = t('ctaHref', '#');
  const ctaLbl = t('notFoundCta', '');
  const cta = ctaLbl
    ? `<a class="checker__cta" href="${href}" target="_blank" rel="noopener noreferrer">${ctaLbl}</a>`
    : '';
  return `<div class="checker__none"><p>${t('notFound', "This ID doesn't have any tickets yet.")}</p>${cta}</div>`;
}

async function check() {
  const input = document.querySelector('[data-checker-input]');
  if (!input) return;
  const id = (input.value || '').trim().toLowerCase();
  if (!id) {
    setResult(`<p class="checker__hint">${t('empty', 'Enter an ID first.')}</p>`);
    return;
  }
  setResult(`<div class="checker__checking">${t('checking', 'Checking…')}</div>`);
  try {
    const map = await loadLookup();
    const r = map.get(id);
    if (r && ticketsFor(r) > 0) setResult(foundHtml(r));
    else setResult(noneHtml());
  } catch (err) {
    console.error('[checker] lookup failed', err);
    setResult(`<div class="checker__none"><p>${t('error', "Couldn't check right now. Try again.")}</p></div>`);
  }
}

function start() {
  const form = document.querySelector('[data-checker-form]');
  if (!form) return;
  const btn = form.querySelector('.checker__btn');
  const input = form.querySelector('[data-checker-input]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    check();
    if (btn) btn.classList.add('is-checked');   // turns the button non-orange
  });
  // Editing the ID resets the button back to its orange "ready" state.
  if (input) input.addEventListener('input', () => { if (btn) btn.classList.remove('is-checked'); });
}

if (document.readyState !== 'loading') start();
else document.addEventListener('DOMContentLoaded', start);
