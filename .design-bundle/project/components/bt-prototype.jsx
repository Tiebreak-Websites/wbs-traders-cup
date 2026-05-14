// =============================================================
//  Interactive prototype of the recommended layout.
//  Adds: tier selection drives leaderboard tab; "Join" opens a
//        modal; refresh animation on leaderboard; tier hover state.
// =============================================================
function BTPrototype() {
  const [tier, setTier] = React.useState("champions");
  const [joinOpen, setJoinOpen] = React.useState(false);
  const [lbState, setLbState] = React.useState("data"); // data | loading | empty
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [updatedSecs, setUpdatedSecs] = React.useState(12);

  React.useEffect(() => {
    const id = setInterval(() => setUpdatedSecs(s => s >= 30 ? 0 : s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  function refresh() {
    setLbState("loading");
    setTimeout(() => { setLbState("data"); setRefreshKey(k => k + 1); setUpdatedSecs(0); }, 900);
  }

  return (
    <div className="bt" style={{ width: 1440, height: 900, position: "relative", overflow: "hidden" }}>
      <div className="bt-stage-bg" />
      <div className="bt-pitch" style={{ opacity: 0.35, height: 380 }} />

      {/* top nav bar — minimal site chrome to feel like a sub-page */}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 40px", borderBottom: "1px solid var(--bt-bg-line)" }}>
        <BTLogo width={140} variant="light" />
        <nav style={{ display: "flex", gap: 28 }}>
          {["Platform","Academy","Pricing","Champions Cup"].map((n, i) => (
            <a key={n} style={{ fontSize: 13, fontWeight: 600, color: i === 3 ? "var(--bt-gold)" : "var(--bt-text-mid)", letterSpacing: "0.02em" }}>{n}</a>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="bt-btn bt-btn-ghost" style={{ height: 38, padding: "0 16px", fontSize: 13 }}>Sign in</button>
          <button className="bt-btn bt-btn-primary" style={{ height: 38, padding: "0 18px", fontSize: 13 }} onClick={() => setJoinOpen(true)}>Open Account</button>
        </div>
      </div>

      {/* hub header — countdown is the visual anchor */}
      <div style={{ position: "relative", padding: "26px 40px 16px", display: "grid", gridTemplateColumns: "1fr auto", gap: 28, alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ height: 1, width: 28, background: "rgba(255,117,50,0.6)" }} />
            <span className="bt-label" style={{ color: "var(--bt-gold)" }}>BrainTrade Champions Cup · Season 2026</span>
          </div>
          <h1 className="bt-h1" style={{ color: "var(--bt-text-hi)", maxWidth: 760 }}>
            Join BrainTrade. Start investing. <span style={{ color: "var(--bt-gold)" }}>Climb the Champions Cup.</span>
          </h1>
          <p className="bt-body" style={{ color: "var(--bt-text-mid)", marginTop: 8, maxWidth: 620 }}>
            Deposit qualifies your tier. Trading volume determines your rank.
          </p>
        </div>
        <BTCountdown />
      </div>

      {/* stat strip */}
      <div style={{ position: "relative", padding: "0 40px", display: "flex", gap: 36, borderBottom: "1px solid var(--bt-bg-line)", paddingBottom: 16 }}>
        <BTStatStrip items={[
          { label: "Prize Pool",          value: "$120,000", color: "var(--bt-gold)" },
          { label: "Participants",        value: "8,412" },
          { label: "Volume Traded",       value: "$12.4M" },
          { label: "Countries",           value: "64" },
          { label: "Average Tier Climb",  value: "+1.2" },
        ]} />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <button className="bt-btn bt-btn-ghost" style={{ height: 40, padding: "0 16px", fontSize: 13 }} onClick={refresh}>↻ Refresh</button>
          <button className="bt-btn bt-btn-primary" style={{ height: 40, padding: "0 18px", fontSize: 13 }} onClick={() => setJoinOpen(true)}>Join BrainTrade →</button>
        </div>
      </div>

      {/* main grid — tiers left, leaderboard right */}
      <div style={{ position: "relative", padding: "20px 40px 0", display: "grid", gridTemplateColumns: "380px 1fr", gap: 20 }}>
        {/* left rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span className="bt-label">Three stages</span>
            <span className="bt-body-sm" style={{ fontSize: 11 }}>Click a stage to filter</span>
          </div>
          {BT_TIERS.map(t => (
            <BTTierCard key={t.key} tier={t} active={tier === t.key} onClick={() => setTier(t.key)} />
          ))}
          <BTYourRank rank={142} vol={8420} tier="contenders" delta={+3} />
        </div>

        {/* leaderboard column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div key={refreshKey}>
            <BTLeaderboard rows={6} state={lbState} initialTab={tier} you={{ rank: 5, tab: "champions" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <BTHowItWorks compact />
          </div>
        </div>
      </div>

      {/* compliance */}
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
        <BTCompliance />
        <div style={{ display: "flex", gap: 6 }}>
          {["data","loading","empty"].map(s => (
            <button key={s} className="bt-chip" onClick={() => setLbState(s)} style={s === lbState ? { color: "var(--bt-gold)", borderColor: "rgba(255,117,50,0.4)" } : null}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {joinOpen && (
        <div onClick={() => setJoinOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", zIndex: 20 }}>
          <div onClick={(e) => e.stopPropagation()} className="bt-card" style={{ width: 460, padding: 28, position: "relative" }}>
            <button onClick={() => setJoinOpen(false)} style={{ position: "absolute", top: 14, right: 14, color: "var(--bt-text-mid)", fontSize: 18 }}>×</button>
            <BTLogo width={130} variant="light" />
            <h3 className="bt-h2" style={{ marginTop: 16, color: "var(--bt-text-hi)" }}>Open your BrainTrade account</h3>
            <p className="bt-body" style={{ color: "var(--bt-text-mid)", marginTop: 8 }}>Your first deposit picks your starting tier. You can move up by trading volume.</p>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <input placeholder="Email" style={{ height: 44, padding: "0 14px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--bt-bg-line-2)", borderRadius: 10, color: "var(--bt-text-hi)", fontFamily: "var(--bt-font)" }} />
              <input placeholder="Phone (optional)" style={{ height: 44, padding: "0 14px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--bt-bg-line-2)", borderRadius: 10, color: "var(--bt-text-hi)", fontFamily: "var(--bt-font)" }} />
              <button className="bt-btn bt-btn-primary" style={{ marginTop: 4, width: "100%", justifyContent: "center" }}>Continue →</button>
            </div>
            <p style={{ fontSize: 10.5, color: "var(--bt-text-dim)", marginTop: 14, lineHeight: 1.55 }}>By continuing you agree to BrainTrade's Terms. Trading involves risk of loss. Cup terms & eligibility apply.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================
//  Mobile layout — 390 x 844 (iPhone 14)
//  Order: logo · name · countdown · CTA · tiers · leaderboard · how
// =============================================================
function MobileLayout() {
  const [tab, setTab] = React.useState("champions");
  return (
    <div className="bt" style={{ width: 390, height: 844, position: "relative", overflowY: "auto" }}>
      <div className="bt-stage-bg" />
      <div style={{ position: "relative", padding: "18px 16px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* sticky top: logo + countdown */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <BTLogo width={108} variant="light" />
          <span className="bt-chip bt-chip-live"><span className="bt-dot bt-dot-pulse" />Live</span>
        </div>
        <div>
          <span className="bt-label" style={{ color: "var(--bt-gold)" }}>Champions Cup · S26</span>
          <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--bt-text-hi)", marginTop: 6 }}>
            Join BrainTrade. <span style={{ color: "var(--bt-gold)" }}>Climb the Cup.</span>
          </h1>
          <p className="bt-body-sm" style={{ marginTop: 6 }}>Deposit qualifies your tier. Volume sets your rank.</p>
        </div>
        <BTCountdown compact />
        <button className="bt-btn bt-btn-primary" style={{ width: "100%", justifyContent: "center" }}>Join BrainTrade →</button>
        {/* tiers — horizontal scroll, snap */}
        <div>
          <span className="bt-label">Three stages</span>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", marginLeft: -16, marginRight: -16, padding: "10px 16px", scrollSnapType: "x mandatory" }}>
            {BT_TIERS.map(t => (
              <div key={t.key} style={{ flex: "0 0 240px", scrollSnapAlign: "start" }}>
                <BTTierCard tier={t} />
              </div>
            ))}
          </div>
        </div>
        {/* leaderboard — card list, mobile style */}
        <div className="bt-card" style={{ padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)", fontSize: 16 }}>Leaderboard</h3>
            <span className="bt-chip bt-chip-live"><span className="bt-dot bt-dot-pulse" />Live</span>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 10, background: "rgba(255,255,255,0.04)", borderRadius: 999, padding: 4 }}>
            {[{id:"starters",l:"Start"},{id:"contenders",l:"Contend"},{id:"champions",l:"Champ"}].map(t => (
              <button key={t.id} className="bt-tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} style={{ flex: 1, justifyContent: "center", padding: "8px 0" }}>{t.l}</button>
            ))}
          </div>
          {BT_LB_DATA[tab].slice(0, 5).map(r => (
            <div key={r.rank} style={{ display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 10, alignItems: "center", padding: "10px 0", borderTop: r.rank > 1 ? "1px solid var(--bt-bg-line)" : null }}>
              <span className={"bt-rank" + (r.rank <= 3 ? " bt-rank-" + r.rank : "")} style={{ width: 32, height: 32, fontSize: 12 }}>{r.rank}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--bt-text-hi)" }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "var(--bt-text-dim)" }}>{r.region} · #{1000 + r.rank * 7}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="bt-num" style={{ fontSize: 13, fontWeight: 700, color: "var(--bt-text-hi)" }}>{bt_fmtUSD(r.vol)}</div>
                <div className="bt-num" style={{ fontSize: 11, color: r.d >= 0 ? "var(--bt-up)" : "var(--bt-down)" }}>{r.d >= 0 ? "▲" : "▼"} {Math.abs(r.d).toFixed(1)}%</div>
              </div>
            </div>
          ))}
          <button style={{ marginTop: 10, width: "100%", padding: "8px 0", border: "1px solid var(--bt-bg-line-2)", borderRadius: 10, color: "var(--bt-text-mid)", fontSize: 12, fontWeight: 600 }}>View full ranking →</button>
        </div>
        <BTYourRank />
        {/* how */}
        <div>
          <span className="bt-label">How it works</span>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["01","Open your account","Free, under a minute."],
              ["02","Deposit to qualify","Picks your starting tier."],
              ["03","Trade to climb","Volume sets your rank."],
              ["04","Win the Cup","Top traders take rewards."],
            ].map(([n,t,d]) => (
              <div key={n} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--bt-bg-line)", borderRadius: 10 }}>
                <span style={{ fontFamily: "var(--bt-mono)", fontSize: 11, color: "var(--bt-gold)", fontWeight: 600 }}>{n}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bt-text-hi)" }}>{t}</div>
                  <div className="bt-body-sm" style={{ fontSize: 11 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* collapsed details */}
        <details style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--bt-bg-line)", borderRadius: 10, padding: "10px 14px" }}>
          <summary style={{ cursor: "pointer", color: "var(--bt-text-hi)", fontSize: 13, fontWeight: 600 }}>Rules & eligibility</summary>
          <div className="bt-body-sm" style={{ marginTop: 8 }}>Volume measured in USD-equivalent across spot & derivatives. Deposit must clear before market close on launch day to qualify your tier. Wash trading is excluded. Full rules in T&Cs.</div>
        </details>
        <BTCompliance />
      </div>
    </div>
  );
}

Object.assign(window, { BTPrototype, MobileLayout });
