// Three desktop layout directions for the Champions Cup hub.
// Each is sized 1440 x 900 (the design viewport) and meant to fit
// the core info above the fold.

// =============================================================
//  LAYOUT A — Centered Event Dashboard
//  Logo + cup name centred at top. Countdown is the visual anchor.
//  Tiers sit on a 3-column row directly under the countdown.
//  Leaderboard occupies the lower half. CTA banner across bottom.
// =============================================================
function LayoutCenteredDashboard() {
  return (
    <div className="bt" style={{ width: 1440, height: 900, position: "relative", padding: "32px 56px 28px", display: "flex", flexDirection: "column", gap: 22 }}>
      <div className="bt-stage-bg" />
      <div className="bt-pitch" style={{ opacity: 0.4, top: -120, height: 520 }} />
      {/* header */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <BTLogo width={170} variant="light" />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ height: 1, width: 40, background: "rgba(255,117,50,0.55)" }} />
          <span className="bt-label" style={{ color: "var(--bt-gold)" }}>Champions Cup · Season 2026</span>
          <span style={{ height: 1, width: 40, background: "rgba(255,117,50,0.55)" }} />
        </div>
        <h1 className="bt-display" style={{ color: "var(--bt-text-hi)", textAlign: "center", maxWidth: 880 }}>
          Join BrainTrade. <span style={{ color: "var(--bt-gold)" }}>Climb</span> the Champions Cup.
        </h1>
        <p className="bt-body" style={{ color: "var(--bt-text-mid)", maxWidth: 620, textAlign: "center" }}>
          Deposit qualifies your tier. Trading volume determines your rank.
        </p>
      </div>
      {/* countdown centred */}
      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <BTCountdown />
      </div>
      {/* tier row */}
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {BT_TIERS.map((t) => <BTTierCard key={t.key} tier={t} />)}
      </div>
      {/* leaderboard mini + CTA */}
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <BTLeaderboard rows={4} compact />
        <div className="bt-card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, justifyContent: "space-between" }}>
          <div>
            <span className="bt-label" style={{ color: "var(--bt-gold)" }}>Take your seat</span>
            <h3 className="bt-h2" style={{ color: "var(--bt-text-hi)", marginTop: 6 }}>Start the Cup today</h3>
            <p className="bt-body-sm" style={{ marginTop: 6 }}>Account in 60 seconds. Deposit anytime before the countdown ends.</p>
          </div>
          <button className="bt-btn bt-btn-primary" style={{ width: "100%", justifyContent: "center" }}>Join BrainTrade →</button>
        </div>
      </div>
      <BTCompliance short />
    </div>);

}

// =============================================================
//  LAYOUT B — Split-Screen Competition Hub
//  Left column: identity, countdown, tier cards (vertical stack).
//  Right column: leaderboard fills full height. CTA at bottom-left.
// =============================================================
function LayoutSplitHub() {
  return (
    <div className="bt" style={{ width: 1440, height: 900, position: "relative" }}>
      <div className="bt-stage-bg" />
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "560px 1fr", gap: 0, height: "100%" }}>
        {/* LEFT */}
        <div style={{ padding: "36px 32px 24px 48px", display: "flex", flexDirection: "column", gap: 22, borderRight: "1px solid var(--bt-bg-line)" }}>
          <BTCupLockup />
          <div>
            <h1 className="bt-h1" style={{ maxWidth: 480, color: "rgb(255, 255, 255)" }}>
              Join BrainTrade.<br />
              Start investing.<br />
              <span style={{ color: "var(--bt-gold)" }}>Climb the Champions Cup.</span>
            </h1>
            <p className="bt-body" style={{ color: "var(--bt-text-mid)", maxWidth: 460, marginTop: 12 }}>
              Deposit qualifies your tier. Trading volume determines your rank.
            </p>
          </div>
          <BTCountdown />
          {/* tier stack — vertical */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {BT_TIERS.map((t) =>
            <div key={t.key} className="bt-card-flat" style={{ padding: 14, display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 14, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.04)", color: t.color, display: "grid", placeItems: "center", fontWeight: 700, border: "1px solid var(--bt-bg-line)" }}>{t.num}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontWeight: 700, color: "var(--bt-text-hi)" }}>{t.name}</span>
                    <span className="bt-body-sm" style={{ color: "var(--bt-text-dim)" }}>· {t.deposit}</span>
                  </div>
                  <div className="bt-body-sm" style={{ fontSize: 12, color: t.color }}>{t.award}</div>
                </div>
                <span className="bt-chip" style={{ color: t.color }}>{t.seats}</span>
              </div>
            )}
          </div>
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="bt-btn bt-btn-primary" style={{ width: "100%", justifyContent: "center", color: "rgb(255, 255, 255)" }}>Join BrainTrade →</button>
            <BTCompliance short />
          </div>
        </div>
        {/* RIGHT */}
        <div style={{ padding: "36px 48px 24px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h2 className="bt-h2" style={{ color: "var(--bt-text-hi)" }}>Live Leaderboard</h2>
              <span className="bt-chip bt-chip-live"><span className="bt-dot bt-dot-pulse" />Live · 30s</span>
            </div>
            <BTStatStrip items={[
            { label: "Prize Pool", value: "$120K" },
            { label: "Participants", value: "8,412" },
            { label: "Countries", value: "64" }]
            } />
          </div>
          <BTLeaderboard rows={7} showHeader={false} compact />
          <BTHowItWorks compact />
        </div>
      </div>
    </div>);

}

// =============================================================
//  LAYOUT C — Leaderboard-First Control Center (recommended)
//  Compact top bar (logo + countdown inline + CTA).
//  Left rail: tier cards. Right: huge leaderboard with tabs.
//  Strip footer: how it works.
// =============================================================
function LayoutLeaderboardFirst({ activeTier, onTier }) {
  const [tier, setTier] = React.useState(activeTier || "champions");
  const set = onTier || setTier;
  return (
    <div className="bt" style={{ width: 1440, height: 900, position: "relative" }}>
      <div className="bt-stage-bg" />
      {/* compact top bar */}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid var(--bt-bg-line)", background: "rgba(5,6,46,0.6)", backdropFilter: "blur(10px)" }}>
        <BTCupLockup />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span className="bt-chip bt-chip-live"><span className="bt-dot bt-dot-pulse" />Registration open</span>
          <BTCountdown compact label="Kicks off in" />
          <button className="bt-btn bt-btn-primary">Join BrainTrade →</button>
        </div>
      </div>
      {/* hero strip */}
      <div style={{ position: "relative", padding: "22px 40px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
        <div style={{ maxWidth: 720 }}>
          <h1 className="bt-h1" style={{ color: "var(--bt-text-hi)" }}>
            Join BrainTrade. Start investing. <span style={{ color: "var(--bt-gold)" }}>Climb the Champions Cup.</span>
          </h1>
          <p className="bt-body" style={{ color: "var(--bt-text-mid)", marginTop: 8 }}>
            Deposit qualifies your tier. Trading volume determines your rank.
          </p>
        </div>
        <BTStatStrip items={[
        { label: "Prize Pool", value: "$120K", color: "var(--bt-gold)" },
        { label: "Participants", value: "8,412" },
        { label: "Volume Traded", value: "$12.4M" }]
        } />
      </div>
      {/* main grid */}
      <div style={{ position: "relative", padding: "22px 40px", display: "grid", gridTemplateColumns: "380px 1fr", gap: 20, height: 580 }}>
        {/* left rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="bt-label">Three stages</span>
          {BT_TIERS.map((t) =>
          <BTTierCard key={t.key} tier={t} active={tier === t.key} onClick={() => set(t.key)} />
          )}
        </div>
        {/* leaderboard */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <BTLeaderboard rows={6} initialTab={tier} you={{ rank: 5, tab: "champions" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12 }}>
            <BTHowItWorks compact />
            <BTYourRank />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 16 }}>
        <BTCompliance short />
      </div>
    </div>);

}

Object.assign(window, { LayoutCenteredDashboard, LayoutSplitHub, LayoutLeaderboardFirst });