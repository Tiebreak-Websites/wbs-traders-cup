// Component spec artboards — states for handoff
function ComponentSpecs() {
  return (
    <div className="bt" style={{ width: 1200, height: 1400, padding: 40, position: "relative" }}>
      <div className="bt-stage-bg" />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <span className="bt-label" style={{ color: "var(--bt-gold)" }}>Component States</span>
          <h2 className="bt-h1" style={{ color: "var(--bt-text-hi)", marginTop: 8 }}>States to design in Figma</h2>
          <p className="bt-body" style={{ color: "var(--bt-text-mid)", maxWidth: 720, marginTop: 6 }}>
            Build each as a variant with Auto Layout. JS reuses the same DOM and just swaps a state class.
          </p>
        </div>

        {/* Countdown states */}
        <section>
          <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)", marginBottom: 12 }}>1. Countdown — pre-launch / live / ended</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <div className="bt-card" style={{ padding: 20 }}>
              <span className="bt-label" style={{ color: "var(--bt-gold)" }}>Pre-launch</span>
              <div style={{ marginTop: 12 }}><BTCountdown /></div>
              <p className="bt-body-sm" style={{ marginTop: 12 }}>Active state. dot pulses gold.</p>
            </div>
            <div className="bt-card" style={{ padding: 20 }}>
              <span className="bt-label" style={{ color: "var(--bt-up)" }}>Cup is live</span>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14 }}>
                <span className="bt-chip" style={{ color: "var(--bt-up)", borderColor: "rgba(25,182,123,0.4)", background: "rgba(25,182,123,0.08)" }}><span className="bt-dot bt-dot-pulse" style={{ background: "var(--bt-up)" }} />Trading window open</span>
                <span className="bt-num" style={{ fontSize: 22, fontWeight: 700, color: "var(--bt-text-hi)" }}>14d : 06h : 22m</span>
              </div>
              <p className="bt-body-sm" style={{ marginTop: 12 }}>Replaces big dial with single inline timer.</p>
            </div>
            <div className="bt-card" style={{ padding: 20 }}>
              <span className="bt-label" style={{ color: "var(--bt-text-dim)" }}>Ended</span>
              <div style={{ marginTop: 12 }}>
                <h4 className="bt-h2" style={{ color: "var(--bt-gold)" }}>Cup closed</h4>
                <p className="bt-body-sm" style={{ marginTop: 4 }}>See champions →</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tier states */}
        <section>
          <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)", marginBottom: 12 }}>2. Tier card — default / active / locked</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <div>
              <span className="bt-label" style={{ marginBottom: 8, display: "block" }}>Default</span>
              <BTTierCard tier={BT_TIERS[0]} />
            </div>
            <div>
              <span className="bt-label" style={{ marginBottom: 8, display: "block", color: "var(--bt-gold)" }}>Active / selected</span>
              <BTTierCard tier={BT_TIERS[1]} active />
            </div>
            <div>
              <span className="bt-label" style={{ marginBottom: 8, display: "block" }}>Locked (needs deposit)</span>
              <div style={{ filter: "grayscale(0.5)", opacity: 0.7 }}>
                <BTTierCard tier={{ ...BT_TIERS[2], seats: "Locked" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard states */}
        <section>
          <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)", marginBottom: 12 }}>3. Leaderboard — data / loading / empty</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <span className="bt-label" style={{ marginBottom: 8, display: "block" }}>With data (Champions)</span>
              <BTLeaderboard rows={4} compact />
            </div>
            <div>
              <span className="bt-label" style={{ marginBottom: 8, display: "block" }}>Loading skeleton</span>
              <BTLeaderboard rows={4} state="loading" compact />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <span className="bt-label" style={{ marginBottom: 8, display: "block" }}>Empty / pre-launch</span>
              <BTLeaderboard rows={4} state="empty" compact />
            </div>
            <div>
              <span className="bt-label" style={{ marginBottom: 8, display: "block" }}>Your-rank widget</span>
              <BTYourRank />
              <div style={{ marginTop: 10 }}><BTYourRank rank={1247} vol={2480} tier="starters" delta={-12} /></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { ComponentSpecs });
