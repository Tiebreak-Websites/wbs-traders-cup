// Design strategy + phase notes — text artboards
function StrategyNotes() {
  const Note = ({ tag, title, children, color = "var(--bt-gold)" }) => (
    <div className="bt-card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="bt-label" style={{ color }}>{tag}</span>
      <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)" }}>{title}</h3>
      <div className="bt-body-sm" style={{ color: "var(--bt-text-mid)", lineHeight: 1.55 }}>{children}</div>
    </div>
  );
  return (
    <div className="bt" style={{ width: 1100, height: 1380, padding: 40, position: "relative" }}>
      <div className="bt-stage-bg" />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <span className="bt-label" style={{ color: "var(--bt-gold)" }}>Strategy · Phases 1–3</span>
          <h2 className="bt-h1" style={{ color: "var(--bt-text-hi)", marginTop: 8 }}>The page is a control center, not a landing page</h2>
          <p className="bt-body" style={{ color: "var(--bt-text-mid)", maxWidth: 760, marginTop: 6 }}>
            Visitors arrive from a promo banner, not search. They are already curious — the job is to confirm what the cup is, show urgency, prove it&apos;s real (leaderboard), and convert.
          </p>
        </div>

        {/* Phase 1 */}
        <section>
          <h3 className="bt-h2" style={{ color: "var(--bt-gold)" }}>Phase 1 · Design strategy</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <Note tag="Feel" title="A premium trading dashboard — quiet, focused, alive.">
              Dark navy chrome. Type does the heavy lifting. The only motion: countdown ticking and the live-dot pulse. No glassmorphism, no big sport hero illustration.
            </Note>
            <Note tag="First 3 seconds" title="User must read four things">
              <ol style={{ paddingLeft: 18, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                <li>This is the BrainTrade Champions Cup.</li>
                <li>It starts in X days (visible countdown).</li>
                <li>There are 3 stages, and traders are already competing.</li>
                <li>I can join with one button.</li>
              </ol>
            </Note>
            <Note tag="Hierarchy" title="One primary, one secondary, one supporting">
              <strong style={{ color: "var(--bt-text-hi)" }}>Primary:</strong> Leaderboard (proof). <br />
              <strong style={{ color: "var(--bt-text-hi)" }}>Secondary:</strong> Countdown (urgency). <br />
              <strong style={{ color: "var(--bt-text-hi)" }}>Supporting:</strong> Tier cards (mechanic). CTA repeats top &amp; mid.
            </Note>
            <Note tag="Above the fold" title="Everything except details & legal">
              On 1440×900 desktop: logo · headline · countdown · 3 tier cards · top 5 of leaderboard · CTA. How-it-works can sit just below the fold or as a thin strip.
            </Note>
            <Note tag="Hidden / minimised" title="One-liners, not paragraphs">
              Compliance reduced to a single small line; rules collapsed into &quot;Rules &amp; eligibility&quot; accordion. No founder story, no FAQ block.
            </Note>
            <Note tag="Premium without length" title="Restraint + craft, not size">
              Brass on navy, restrained palette, tabular numbers, hairline borders, real spacing (24/32px), one decorative motion only. Length kills premium feel.
            </Note>
          </div>
        </section>

        {/* Phase 2 */}
        <section>
          <h3 className="bt-h2" style={{ color: "var(--bt-gold)" }}>Phase 2 · Three layout directions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 }}>
            <Note tag="Option A" title="Centered Event Dashboard" color="var(--bt-tier-1)">
              <strong>Top:</strong> logo + headline centred · <strong>Countdown</strong> centred under headline · <strong>Tiers</strong> 3-col below · <strong>LB</strong> wide row · <strong>CTA</strong> right card.<br /><br />
              <strong>Pros:</strong> Iconic, poster-like, photographs well.<br />
              <strong>Cons:</strong> Centered layouts waste horizontal space on wide monitors.<br />
              <strong>Use when:</strong> Cup hasn&apos;t started — countdown is the star.
            </Note>
            <Note tag="Option B" title="Split-Screen Competition Hub" color="var(--bt-tier-2)">
              <strong>Left col:</strong> identity, headline, countdown, vertical tier list, CTA pinned bottom.<br />
              <strong>Right col:</strong> full-height leaderboard with stat strip.<br /><br />
              <strong>Pros:</strong> Both columns visible always; CTA sticky-feeling.<br />
              <strong>Cons:</strong> Visual axis split; harder to read on 1280-wide laptops.<br />
              <strong>Use when:</strong> Cup is live and ranking shifts hourly.
            </Note>
            <Note tag="Option C — RECOMMENDED" title="Leaderboard-First Control Center" color="var(--bt-gold)">
              <strong>Top bar:</strong> logo + inline countdown + CTA · <strong>Hero strip:</strong> headline + 5 stat tiles · <strong>Main grid:</strong> tier rail left, leaderboard right · <strong>Footer:</strong> how-it-works · compliance.<br /><br />
              <strong>Pros:</strong> Reads as a dashboard, not a landing page. Tier filters the LB.<br />
              <strong>Cons:</strong> Most components to build.<br />
              <strong>Use when:</strong> Always. This is the recommended direction.
            </Note>
          </div>
        </section>

        {/* Phase 3 */}
        <section>
          <h3 className="bt-h2" style={{ color: "var(--bt-gold)" }}>Phase 3 · Recommendation</h3>
          <div className="bt-card" style={{ padding: 22, marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <h4 className="bt-h3" style={{ color: "var(--bt-text-hi)" }}>Ship Option C — Leaderboard-First Control Center</h4>
            <p className="bt-body" style={{ color: "var(--bt-text-mid)" }}>
              Banner traffic arrives curious but skeptical. A dashboard layout proves the cup is <em>already running</em> within one glance — that&apos;s a stronger conversion lever than any hero copy. CTA repeats top-bar &amp; modal, so it&apos;s always one click away. Tier rail doubles as a leaderboard filter, eliminating a UI screen. 380px left rail + fluid right column collapses cleanly to stacked sections on mobile with no redesign.
            </p>
            <div className="bt-divider" />
            <span className="bt-label">Section order (top to bottom)</span>
            <ol className="bt-body-sm" style={{ paddingLeft: 18, margin: 0, color: "var(--bt-text)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <li>Top bar: logo · nav · sign-in · CTA</li>
              <li>Hero strip: countdown + headline + 5 stat tiles</li>
              <li>Tier rail (3 cards, click-to-filter)</li>
              <li>Leaderboard (tabs · live · top 6 · refresh)</li>
              <li>How it works (4-step strip)</li>
              <li>Your-rank widget (for signed-in users)</li>
              <li>Compliance footer</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}

function HandoffNotes() {
  const Block = ({ tag, title, children }) => (
    <div className="bt-card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="bt-label" style={{ color: "var(--bt-gold)" }}>{tag}</span>
      <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)" }}>{title}</h3>
      <div className="bt-body-sm" style={{ color: "var(--bt-text-mid)", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
  return (
    <div className="bt" style={{ width: 1100, height: 1480, padding: 40, position: "relative" }}>
      <div className="bt-stage-bg" />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <span className="bt-label" style={{ color: "var(--bt-gold)" }}>Phases 7–10 · Handoff</span>
          <h2 className="bt-h1" style={{ color: "var(--bt-text-hi)", marginTop: 8 }}>From Figma to Astro</h2>
        </div>

        {/* Phase 7 Mobile */}
        <section>
          <h3 className="bt-h2" style={{ color: "var(--bt-gold)" }}>Phase 7 · Mobile plan</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <Block tag="Stack order" title="Logo · name · countdown · CTA · tiers · LB · how">
              CTA appears <strong>before</strong> tier cards so the conversion option is reachable in one thumb scroll. CTA also persists in a thin sticky bar on scroll for ≥390 viewports.
            </Block>
            <Block tag="Cards" title="Tiers scroll horizontally with snap">
              On mobile, tier cards become 240px-wide horizontal snap cards (-mx-16 bleed). Avoids a tall 3-stack that pushes leaderboard off screen.
            </Block>
            <Block tag="Leaderboard" title="Grid → list">
              Region chip is dropped, sparkline removed, &quot;24h%&quot; right-aligned under volume in a 2-line stack. Tabs become a 3-segment pill across full width.
            </Block>
            <Block tag="Cut on mobile" title="Stat strip + footer compliance is enough">
              Removed: 5-stat strip (compress to 1 line), the &quot;Updated 12s ago&quot; helper, secondary nav links. Keep only the items that confirm the cup is real and let the user act.
            </Block>
          </div>
        </section>

        {/* Phase 8 Figma handoff */}
        <section>
          <h3 className="bt-h2" style={{ color: "var(--bt-gold)" }}>Phase 8 · Figma instructions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <Block tag="Frames" title="4 device frames + states">
              Desktop 1440×900 · Laptop 1280×800 · Tablet 768×1024 · Mobile 390×844. Plus a 1920-wide artboard for the navy "stage" radial extending beyond content.
            </Block>
            <Block tag="Components" title="Make these as Figma components with variants">
              <code>Logo</code>, <code>Countdown</code> (Variants: pre / live / ended), <code>TierCard</code> (Variants: default / active / locked), <code>LeaderboardRow</code> (Variants: rank-1, 2, 3, default, you), <code>Leaderboard</code> (Variants: data / loading / empty), <code>TabPill</code>, <code>StatTile</code>, <code>HowItWorksStep</code>, <code>CTAButton</code> (default / hover / pressed), <code>Accordion</code> (open / closed), <code>YourRankWidget</code>.
            </Block>
            <Block tag="Auto Layout" title="Vertical stacks + 12/16/24 gaps">
              Use Auto Layout for every component. Page-level frame uses vertical auto layout with 22px gap. Tier rail = 380px fixed, leaderboard = fill container.
            </Block>
            <Block tag="Naming" title="component.element/state">
              <code>tier-card/default</code>, <code>tier-card/active</code>, <code>leaderboard.row/rank-1</code>, <code>button.primary/hover</code>. Snake-case for tokens (<code>color.gold</code>, <code>space.6</code>).
            </Block>
            <Block tag="Export as SVG" title="Logo · brand icon · chevrons · stadium-light decoration">
              Inline SVG only for those. <strong>Not</strong> SVG: type, numbers, rank chips, buttons — keep as live HTML/CSS so they remain translatable & themeable.
            </Block>
            <Block tag="Spacing system" title="8-pt with named tokens">
              4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56. Card padding = 20, page padding = 40, gap between sections = 22.
            </Block>
          </div>
        </section>

        {/* Phase 9 Developer */}
        <section>
          <h3 className="bt-h2" style={{ color: "var(--bt-gold)" }}>Phase 9 · Developer handoff (Astro · vanilla JS · CSS)</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <Block tag="File tree" title="src/...">
              <pre style={{ margin: 0, fontSize: 11.5, fontFamily: "var(--bt-mono)", color: "var(--bt-text)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
{`pages/traders-cup-2026.astro
components/
  CompactHeader.astro
  CountdownTimer.astro
  TierStageCards.astro
  LeaderboardCard.astro
  HowItWorksMini.astro
  CTABox.astro
  DetailsAccordion.astro
data/leaderboard.json
scripts/
  countdown.js
  leaderboard.js
styles/traders-cup.css`}
              </pre>
            </Block>
            <Block tag="CSS tokens" title="Drop tokens.css at the top of styles/traders-cup.css">
              All colors / radii / spacing live in <code>:root</code> and read via <code>var(--bt-*)</code>. One file, no preprocessor needed. Provide a <code>[data-theme="contrast"]</code> override block if needed for accessibility.
            </Block>
            <Block tag="Vanilla JS — countdown" title="One requestAnimationFrame loop, write into 4 elements">
              <code>countdown.js</code> reads <code>data-target="2026-06-14T15:00:00Z"</code> off the wrapper, computes diff, writes <code>textContent</code> on the 4 number nodes. Switches to <code>data-state="ended"</code> at zero so CSS swaps the layout.
            </Block>
            <Block tag="Vanilla JS — leaderboard" title="Tab buttons swap a dataset key, render rows from JSON">
              <code>leaderboard.js</code> fetches <code>/data/leaderboard.json</code>, caches in memory, re-renders rows on tab click. Polls every 30s. Loading state = adds <code>data-state="loading"</code> to the host node; CSS does the skeleton.
            </Block>
            <Block tag="leaderboard.json" title="One file, three tier keys">
              <pre style={{ margin: 0, fontSize: 11.5, fontFamily: "var(--bt-mono)", color: "var(--bt-text)", lineHeight: 1.6 }}>
{`{
  "updated": "2026-05-14T...",
  "champions":  [{ "rank": 1, "alias": "Y***i K.", "vol": 245000, "region": "MEA", "delta24h": 4.2 }, …],
  "contenders": [...],
  "starters":   [...]
}`}
              </pre>
            </Block>
            <Block tag="Breakpoints" title="3 only — keep it simple">
              <code>≤640px</code> mobile · <code>641–1024px</code> tablet (2-col with tier rail above LB) · <code>≥1025px</code> desktop (recommended layout). Use container queries on the LB card if you want it adaptive in CMS contexts.
            </Block>
            <Block tag="Accessibility" title="Things to ship">
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                <li>All gold-on-navy text passes AA at ≥14px (gold #E0B872 on bg #05062E = 9.8:1).</li>
                <li>Countdown gets an SR-only "X days, Y hours until cup launch" updated every minute.</li>
                <li>Leaderboard is a real <code>&lt;table&gt;</code> in DOM, visually grid-styled.</li>
                <li>Live region: <code>aria-live="polite"</code> on the leaderboard tbody.</li>
                <li>Tab buttons use <code>role=tab</code> + <code>aria-selected</code> + arrow-key nav.</li>
                <li>No motion if <code>prefers-reduced-motion</code> — pulse dot becomes static.</li>
              </ul>
            </Block>
            <Block tag="Translation" title="Strings, no images of text">
              All copy is inline text. Numbers run through <code>Intl.NumberFormat</code> using the page <code>lang</code>. RTL handled via <code>dir="rtl"</code> — leaderboard grid auto-flips.
            </Block>
          </div>
        </section>

        {/* Phase 10 Checklist */}
        <section>
          <h3 className="bt-h2" style={{ color: "var(--bt-gold)" }}>Phase 10 · Pre-dev checklist</h3>
          <div className="bt-card" style={{ padding: 22, marginTop: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                "Brand consistency (navy #060751 + Urbanist matches braintrade.com)",
                "No trademark issues (no FIFA/UEFA/World Cup/national imagery)",
                "No betting/casino visual cues (no roulette wheels, dice, neon)",
                "Page fits 1440×900 above the fold (verified at zoom 100%)",
                "Countdown visible and live-ticking",
                "Leaderboard visible with at least top 5",
                "Primary CTA visible in 2 places (top bar + body or modal)",
                "Tier mechanic explained in ≤2 sentences (\"deposit qualifies, volume ranks\")",
                "Mobile readable at 390 width without zoom",
                "No text baked into images (all live HTML/CSS)",
                "All copy translatable (no concatenated strings, no \"$ + amount\")",
                "Astro/HTML/CSS only — no React runtime required",
                "Compliance note present, single line, real legal copy",
                "Reduced-motion path verified",
                "Leaderboard loading + empty states designed",
              ].map(item => (
                <label key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, color: "var(--bt-text)", fontSize: 13 }}>
                  <input type="checkbox" style={{ marginTop: 3, accentColor: "var(--bt-gold)" }} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { StrategyNotes, HandoffNotes });
