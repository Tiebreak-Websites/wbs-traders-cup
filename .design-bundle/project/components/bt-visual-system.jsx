// Visual system reference artboard — colors, type, buttons, etc.
function VisualSystem() {
  const swatch = (name, val, label) => (
    <div key={name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ height: 64, borderRadius: 10, background: val, border: "1px solid var(--bt-bg-line)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
        <span style={{ color: "var(--bt-text-hi)", fontWeight: 600 }}>{name}</span>
        <span className="bt-num" style={{ color: "var(--bt-text-dim)", fontFamily: "var(--bt-mono)" }}>{label}</span>
      </div>
    </div>
  );

  return (
    <div className="bt" style={{ width: 1200, height: 1180, padding: 40, position: "relative" }}>
      <div className="bt-stage-bg" />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <span className="bt-label" style={{ color: "var(--bt-gold)" }}>Visual System</span>
          <h2 className="bt-h1" style={{ color: "var(--bt-text-hi)", marginTop: 8 }}>Deep navy, brass accent, off-white type</h2>
          <p className="bt-body" style={{ color: "var(--bt-text-mid)", maxWidth: 720, marginTop: 6 }}>
            Built on the BrainTrade brand navy (rgb 6,7,81) with a tournament brass accent. Off-white type, no pure white. BrainTrade orange is preserved as a tiny secondary brand touch.
          </p>
        </div>

        {/* Surface */}
        <section>
          <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)", marginBottom: 10 }}>Surface — navy stack</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
            {swatch("bg-0",    "#05062E", "#05062E")}
            {swatch("bg-1",    "#080A3A", "#080A3A")}
            {swatch("bg-2",    "#0C0F4A", "#0C0F4A")}
            {swatch("bg-3",    "#141968", "#141968")}
            {swatch("Brand",   "#060751", "#060751")}
            {swatch("Line",    "rgba(255,255,255,0.07)", "rgba 0.07")}
          </div>
        </section>

        {/* Accent */}
        <section>
          <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)", marginBottom: 10 }}>Accent — brass</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
            {swatch("Gold 50",   "#FBF1D9", "#FBF1D9")}
            {swatch("Gold 100",  "#F1DA9C", "#F1DA9C")}
            {swatch("Gold",      "#E0B872", "#E0B872")}
            {swatch("Gold Deep", "#C9A35A", "#C9A35A")}
            {swatch("Bronze",    "#B07F3B", "#B07F3B")}
            {swatch("BT Orange", "#FF7532", "#FF7532")}
          </div>
        </section>

        {/* Text + status */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)", marginBottom: 10 }}>Text</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {swatch("Hi",   "#F4EFE3", "off-white")}
              {swatch("Body", "#E6E1D2", "warm")}
              {swatch("Mid",  "#9A9DB8", "muted")}
              {swatch("Dim",  "#63657F", "footnote")}
            </div>
          </div>
          <div>
            <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)", marginBottom: 10 }}>Status</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {swatch("Up",        "#19B67B", "gain")}
              {swatch("Down",      "#E25C1B", "loss")}
              {swatch("Tier I",    "#6C7DB0", "steel")}
              {swatch("Tier III",  "#F1DA9C", "pale gold")}
            </div>
          </div>
        </section>

        {/* Type */}
        <section>
          <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)", marginBottom: 12 }}>Type · Urbanist</h3>
          <div className="bt-card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span className="bt-label" style={{ width: 120 }}>Display · 56/700</span>
              <span className="bt-display" style={{ color: "var(--bt-text-hi)" }}>Champions Cup</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span className="bt-label" style={{ width: 120 }}>H1 · 36/700</span>
              <span className="bt-h1" style={{ color: "var(--bt-text-hi)" }}>Climb the Cup</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span className="bt-label" style={{ width: 120 }}>H2 · 24/700</span>
              <span className="bt-h2" style={{ color: "var(--bt-text-hi)" }}>Live Leaderboard</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span className="bt-label" style={{ width: 120 }}>H3 · 18/600</span>
              <span className="bt-h3" style={{ color: "var(--bt-text-hi)" }}>Three Stages</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span className="bt-label" style={{ width: 120 }}>Body · 15/400</span>
              <span className="bt-body" style={{ color: "var(--bt-text-hi)" }}>Deposit qualifies your tier. Trading volume determines your rank.</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span className="bt-label" style={{ width: 120 }}>Number · tnum</span>
              <span className="bt-num" style={{ fontSize: 32, fontWeight: 700, color: "var(--bt-gold)" }}>$245,000.00</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span className="bt-label" style={{ width: 120 }}>Label · 11/600</span>
              <span className="bt-label" style={{ color: "var(--bt-gold)" }}>CHAMPIONS CUP · SEASON 2026</span>
            </div>
          </div>
        </section>

        {/* Buttons & chips */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)", marginBottom: 12 }}>Buttons</h3>
            <div className="bt-card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
              <button className="bt-btn bt-btn-primary">Join BrainTrade →</button>
              <button className="bt-btn bt-btn-ghost">Sign in</button>
              <button className="bt-btn bt-btn-ghost" style={{ height: 38, padding: "0 16px", fontSize: 13 }}>Small ghost</button>
            </div>
          </div>
          <div>
            <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)", marginBottom: 12 }}>Chips & dot</h3>
            <div className="bt-card" style={{ padding: 24, display: "flex", flexWrap: "wrap", gap: 10 }}>
              <span className="bt-chip">Default</span>
              <span className="bt-chip bt-chip-gold">Gold</span>
              <span className="bt-chip bt-chip-live"><span className="bt-dot bt-dot-pulse" />Live</span>
              <span className="bt-chip" style={{ color: "var(--bt-tier-1)" }}>Open</span>
              <span className="bt-chip" style={{ color: "var(--bt-tier-2)" }}>Filling</span>
              <span className="bt-chip" style={{ color: "var(--bt-tier-3)" }}>Elite</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { VisualSystem });
