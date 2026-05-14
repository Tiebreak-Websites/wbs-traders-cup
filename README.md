# BrainTrade Champions Cup — Trader's Cup 2026

Promotional sub-page for the **BrainTrade Champions Cup** — a three-stage trading tournament running 1 June – 19 July 2026. Intended to live at **`https://thebraintrade.com/traders-cup-2026/`** as a sub-path of the main BrainTrade site.

Built with **Astro 4**, **vanilla JavaScript**, and **vanilla CSS** — no UI framework, no CSS framework, no client-side React.

---

## What's in the page

A short scrolling landing page, designed to feel like a tournament control center:

1. **Hero** — BrainTrade logo, eyebrow "Trader's Cup", live countdown to **19 Jul 2026 23:59 UTC**, and a primary "Open Account & Join" CTA.
2. **Three stage cards** — Starters / Contenders / Champions, with stage number, status chip, deposit band and reward.
3. **Live leaderboard** — Starters / Contenders / Champions tabs, top 5 rows visible, ranks 1–3 with medal styling, "YOU" highlight for the current user's row. Reads a static JSON feed and polls every 30 s.
4. **How it works** — 3 cards explaining the deposit → trade → finish mechanic.
5. **FAQ** — single-open accordion with 6 questions.
6. **Compliance footnote** — locked T&Cs framing required across all markets.

The page is single-screen on tall viewports (≥ 940 px), graceful on shorter heights, and stacks cleanly on mobile (≤ 960 px).

---

## Stack & dependencies

| | |
| --- | --- |
| Framework | [Astro 4](https://astro.build/) (static output) |
| Fonts | Urbanist + JetBrains Mono (Google Fonts) |
| Scripts | Vanilla JS — countdown + leaderboard polling, no third-party libraries |
| Assets | Inline SVG + BrainTrade logo SVG |
| Node | ≥ 18.17 / 20+ |

No bundler config, no Tailwind, no React on the client.

---

## Local development

```bash
npm install
npm run dev        # http://localhost:4321/traders-cup-2026/
```

Other scripts:

```bash
npm run build      # static output → dist/
npm run preview    # serve the built output locally
```

---

## Project structure

```
src/
  pages/
    index.astro                    # /traders-cup-2026/
  layouts/
    BaseLayout.astro               # <head>, fonts, OG/Twitter meta
  components/
    HeroPanel.astro                # logo + headline + subhead + countdown + CTA
    TierStageCards.astro           # 3 stage cards
    LeaderboardCard.astro          # leaderboard with tabs + footer
    HowItWorks.astro               # 3 steps
    FAQ.astro                      # accordion (single-open)
  styles/
    global.css                     # all design tokens + page CSS
  scripts/
    countdown.js                   # reads data-target on [data-countdown]
    leaderboard.js                 # fetch + 30 s polling + tab filter
  data/
    copy.en.json                   # ALL page copy (single source of truth)
public/
  data/
    leaderboard-default.json       # mock feed; matches production JSON shape
  braintrade-logo.svg              # dark variant
  braintrade-logo-light.svg        # light variant (used on dark hero)
  favicon.svg
astro.config.mjs
package.json
```

---

## Design tokens

Defined as CSS custom properties in `src/styles/global.css` (`:root`). The naming follows the design-handoff convention — `--bt-*`.

| Group | Highlights |
| --- | --- |
| Surfaces | `--bt-bg-0: #05062E` (page), `--bt-bg-1 / --bt-bg-2` (card stack) |
| Text | `--bt-text-hi: #F4EFE3` (headings), `--bt-text: #E6E1D2` (body), `--bt-text-mid: #9A9DB8`, `--bt-text-dim: #63657F` |
| Accent | `--bt-accent: #FF7532` (BrainTrade orange, primary CTA fill) |
| Trophy | `--bt-trophy: #E0B872` — reserved for the #1 rank medal only |
| Status | `--bt-up: #19B67B`, `--bt-down: #E25C1B` |
| Type | Urbanist (variable) for everything; JetBrains Mono for the eyebrow + step numerals |

To restyle a tier accent, change `--bt-tier-1 / --bt-tier-2 / --bt-tier-3`.

---

## Copy

All page copy lives in **[`src/data/copy.en.json`](src/data/copy.en.json)** — translators or copy editors can work entirely in JSON without touching markup. Schema groups: `hero`, `tiers[]`, `leaderboard`, `how_it_works`, `faq`, `compliance`.

To localize (JA / TH / MY etc.):

1. Copy `copy.en.json` → `copy.ja.json` (or appropriate locale).
2. Translate values only.
3. Add an Astro i18n route at `src/pages/[locale]/index.astro` that reads the matching JSON based on `Astro.params.locale`.

---

## Countdown

`src/scripts/countdown.js` reads the target date from a `data-target` attribute on the `[data-countdown]` element. The current target is set inside `src/data/copy.en.json` under `hero.target_date`:

```json
"target_date": "2026-07-19T23:59:00Z"
```

Change that single value to retune the countdown (e.g. for warm-up start `2026-05-25T00:00:00Z` or any of the interim snapshot dates).

The script ticks every second, zero-pads the digits, and freezes at `00:00:00:00` once the target passes.

---

## Leaderboard

`src/scripts/leaderboard.js` fetches `public/data/leaderboard-default.json` on load and polls every 30 seconds. Pauses polling when the tab is hidden.

To swap the static feed for a real backend, change one constant:

```js
// src/scripts/leaderboard.js
const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/data`;
const FEED = 'leaderboard-default.json';
```

Point `BASE` at your CDN (or rewrite `BASE + FEED` to a full URL). Per the original brief, the production cron job emits a per-market JSON file every 15 minutes.

### Expected feed shape

```jsonc
{
  "brand": "braintrade",
  "competition": "champions_cup_2026",
  "currency": "USD",
  "updated_at": "2026-06-15T09:30:00Z",
  "next_update_at": "2026-06-15T09:45:00Z",
  "current_user": {                  // optional — only present when authed
    "tier_key": "champions",
    "rank": 5
  },
  "tiers": [
    {
      "tier_key": "champions",
      "name": "Champions",
      "qualifying_count": 47,
      "entries": [
        { "rank": 1, "name": "Y***i K.", "trader_id": 1007,
          "region": "MEA", "volume_usd": 245000, "delta_pct": 4.2 }
        // … top 5–10 per tier
      ]
    }
    // … contenders, starters
  ]
}
```

Names are masked server-side. Never expose raw PII in the feed.

---

## Compliance framing

The page describes the Champions Cup as a **"trading-volume competition with deposit-based tier qualification"** — never as a deposit bonus or deposit-to-win promotion. The exact phrasing is in `src/data/copy.en.json` under `compliance`. Keep it verbatim — legal approves the wording across all markets.

---

## Responsive behaviour

| Width | Behaviour |
| --- | --- |
| ≥ 1280 px, ≥ 820 px height | Single-screen layout — hero, tiers, and top of leaderboard fit above the fold |
| ≥ 1280 px, < 940 px height | Hero compresses (52 px headline) |
| ≥ 1280 px, < 820 px height | Subhead hides (44 px headline) |
| ≤ 960 px | Tier cards stack, leaderboard collapses to rank+trader+volume, headline drops to 36 px and wraps |

---

## Deploy

`npm run build` outputs to `dist/`. Drop that on any static host (Cloudflare Pages, Vercel, Netlify, S3 + CloudFront, or the existing `thebraintrade.com` host). The page expects to be served under the path **`/traders-cup-2026/`** — controlled by the `base` option in `astro.config.mjs`. If you embed under a different path, update both `base` there and any anchor link hrefs that hard-code `/traders-cup-2026/`.

---

## License

Internal — © BrainTrade 2026. Not for redistribution.
