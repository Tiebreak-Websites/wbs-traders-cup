// BrainTrade Champions Cup — Shared UI primitives
// Exposed on window for use by layout files.

const TARGET_DATE = new Date("2026-06-14T15:00:00Z");

// -------------- Logo --------------
function BTLogo({ width = 168, variant = "navy" }) {
  const src = variant === "navy" ?
  "assets/braintrade-logo.svg" :
  "assets/braintrade-logo-light.svg";
  return (
    <img
      src={src}
      alt="BrainTrade"
      style={{ width, height: width * (41 / 200), display: "block" }} />);


}
// -------------- Lockup (icon + cup name) --------------
function BTCupLockup({ size = "md" }) {
  const scale = size === "lg" ? 1.15 : size === "sm" ? 0.78 : 1;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 * scale }}>
      <BTLogo width={150 * scale} variant="light" />
      <span style={{ width: 1, height: 28 * scale, background: "rgba(255,255,255,0.18)" }} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontSize: 10 * scale, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--bt-gold)" }}>Champions Cup</span>
        <span style={{ fontSize: 14 * scale, fontWeight: 600, color: "var(--bt-text-mid)", marginTop: 4 }}>Season 2026</span>
      </div>
    </div>);

}

// -------------- Countdown --------------
function useCountdown(target = TARGET_DATE) {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff % 86400000 / 3600000);
  const mins = Math.floor(diff % 3600000 / 60000);
  const secs = Math.floor(diff % 60000 / 1000);
  return { days, hours, mins, secs };
}

function BTCountdown({ compact = false, label = "Cup kicks off in" }) {
  const { days, hours, mins, secs } = useCountdown();
  const pad = (n) => String(n).padStart(2, "0");
  const cells = [
  { v: pad(days), l: "Days" },
  { v: pad(hours), l: "Hours" },
  { v: pad(mins), l: "Minutes" },
  { v: pad(secs), l: "Seconds" }];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
        <span className="bt-dot bt-dot-pulse" />
        <span className="bt-label">{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: compact ? 6 : 8 }}>
        {cells.map((c, i) =>
        <React.Fragment key={c.l}>
            <div className="bt-cd" style={compact ? { minWidth: 66, padding: "8px 10px 6px" } : null}>
              <span className="bt-cd-num bt-num" style={compact ? { fontSize: 32 } : null}>{c.v}</span>
              <span className="bt-cd-lbl">{c.l}</span>
            </div>
            {i < cells.length - 1 && <span className="bt-cd-sep" style={compact ? { fontSize: 26 } : null}>:</span>}
          </React.Fragment>
        )}
      </div>
    </div>);

}

// -------------- Tier card --------------
const TIERS = [
{
  key: "starters", num: "I", name: "Starters",
  deposit: "$500 – $4,999",
  award: "Premium courses",
  color: "var(--bt-tier-1)",
  desc: "Group stage. Build your foundation and qualify your tier with first deposit.",
  icon: "▢▢▢",
  seats: "Open"
},
{
  key: "contenders", num: "II", name: "Contenders",
  deposit: "$5,000 – $24,999",
  award: "1-on-1 coaching · Pro tools",
  color: "var(--bt-tier-2)",
  desc: "Knockouts. Trading volume decides who breaks through to the final tier.",
  icon: "◆◆◆",
  seats: "Filling"
},
{
  key: "champions", num: "III", name: "Champions",
  deposit: "$25,000+",
  award: "Capital allocation · Cup trophy",
  color: "var(--bt-tier-3)",
  desc: "Final stage. Top volume traders compete for the Champions Cup.",
  icon: "♛♛♛",
  seats: "Elite"
}];


function BTTierCard({ tier, active = false, onClick }) {
  return (
    <div
      className="bt-tier"
      onClick={onClick}
      role="button"
      style={active ? { borderColor: "rgba(255,117,50,0.55)", boxShadow: "0 0 0 1px rgba(255,117,50,0.3), 0 20px 50px -16px rgba(0,0,0,0.7)" } : null}>
      
      <span className="bt-tier-marker" style={{ color: tier.color }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <span className="bt-label" style={{ color: tier.color }}>Stage&nbsp;{tier.num}</span>
        <span className="bt-chip" style={{ color: tier.color, borderColor: "rgba(255,117,50,0.3)" }}>{tier.seats}</span>
      </div>
      <h3 className="bt-h2" style={{ color: "var(--bt-text-hi)", marginBottom: 4 }}>{tier.name}</h3>
      <p className="bt-body-sm" style={{ minHeight: 38 }}>{tier.desc}</p>
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span className="bt-body-sm" style={{ color: "var(--bt-text-dim)", whiteSpace: "nowrap" }}></span>
          <span className="bt-body-sm bt-num" style={{ color: "var(--bt-text-hi)", fontWeight: 600, whiteSpace: "nowrap" }}>{tier.deposit}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span className="bt-body-sm" style={{ color: "var(--bt-text-dim)", whiteSpace: "nowrap" }}>Deposit Reward</span>
          <span className="bt-body-sm" style={{ color: tier.color, fontWeight: 600, textAlign: "right" }}>{tier.award}</span>
        </div>
      </div>
    </div>);

}

// -------------- Leaderboard --------------
const LB_DATA = {
  champions: [
  { rank: 1, name: "Y***i K.", vol: 245000, region: "MEA", d: +4.2 },
  { rank: 2, name: "A***d M.", vol: 218500, region: "MEA", d: +2.1 },
  { rank: 3, name: "S***n T.", vol: 196300, region: "APAC", d: +1.4 },
  { rank: 4, name: "K***a R.", vol: 182900, region: "EU", d: +0.8 },
  { rank: 5, name: "M***i H.", vol: 171450, region: "APAC", d: -0.3 },
  { rank: 6, name: "O***n J.", vol: 159300, region: "EU", d: +0.9 },
  { rank: 7, name: "F***h W.", vol: 146820, region: "AMS", d: +1.7 }],

  contenders: [
  { rank: 1, name: "L***a B.", vol: 22480, region: "EU", d: +3.1 },
  { rank: 2, name: "P***l C.", vol: 19840, region: "AMS", d: +1.8 },
  { rank: 3, name: "R***s O.", vol: 17220, region: "MEA", d: +0.6 },
  { rank: 4, name: "G***v K.", vol: 16110, region: "APAC", d: -1.2 },
  { rank: 5, name: "N***a D.", vol: 14990, region: "EU", d: +0.4 },
  { rank: 6, name: "H***m S.", vol: 13740, region: "MEA", d: +2.0 },
  { rank: 7, name: "T***o F.", vol: 12580, region: "APAC", d: +0.1 }],

  starters: [
  { rank: 1, name: "E***y V.", vol: 4380, region: "AMS", d: +5.6 },
  { rank: 2, name: "J***s L.", vol: 3920, region: "EU", d: +2.7 },
  { rank: 3, name: "Z***i Q.", vol: 3510, region: "APAC", d: +1.5 },
  { rank: 4, name: "B***k N.", vol: 2980, region: "MEA", d: +0.9 },
  { rank: 5, name: "M***s P.", vol: 2640, region: "EU", d: -0.4 },
  { rank: 6, name: "A***h G.", vol: 2350, region: "AMS", d: +1.1 },
  { rank: 7, name: "I***l R.", vol: 2090, region: "MEA", d: +0.6 }]

};

function fmtUSD(n) {return "$" + n.toLocaleString("en-US");}

function BTLeaderboard({ rows = 5, state = "data", showHeader = true, showYourRank = true, you, compact = false, initialTab = "champions" }) {
  const [tab, setTab] = React.useState(initialTab);
  const data = LB_DATA[tab] || [];
  const visible = data.slice(0, rows);
  const tabs = [
  { id: "starters", label: "Starters", meta: "" },
  { id: "contenders", label: "Contenders", meta: "" },
  { id: "champions", label: "Champions", meta: "" }];

  return (
    <div className="bt-card" style={{ padding: compact ? 16 : 20 }}>
      {showHeader &&
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3 className="bt-h3" style={{ color: "var(--bt-text-hi)" }}>Live Leaderboard</h3>
            <span className="bt-chip bt-chip-live"><span className="bt-dot bt-dot-pulse" />Live</span>
          </div>
          <div role="tablist" className="bt-tabs">
            {tabs.map((t) =>
          <button key={t.id} role="tab" aria-selected={tab === t.id} className="bt-tab" onClick={() => setTab(t.id)}>
                <span>{t.label}</span>
                <span style={{ opacity: 0.65, fontSize: 11, fontWeight: 500 }}>{t.meta}</span>
              </button>
          )}
          </div>
        </div>
      }
      {/* column heads */}
      {state === "data" &&
      <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 130px 140px 110px", gap: 16, padding: "10px 18px", color: "var(--bt-text-dim)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          <span>Rank</span><span>Trader</span><span>Region</span><span style={{ textAlign: "right" }}>Volume</span><span style={{ textAlign: "right" }}>24h</span>
        </div>
      }
      {/* rows */}
      {state === "loading" &&
      <div style={{ padding: "8px 0" }}>
          {Array.from({ length: rows }).map((_, i) =>
        <div key={i} className="bt-lb-row" style={{ opacity: 0.6 }}>
              <span className="bt-rank" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ height: 12, width: "60%", background: "rgba(255,255,255,0.06)", borderRadius: 4 }} />
                <span style={{ height: 10, width: "30%", background: "rgba(255,255,255,0.04)", borderRadius: 4 }} />
              </div>
              <span style={{ height: 10, width: 70, background: "rgba(255,255,255,0.05)", borderRadius: 4 }} />
              <span style={{ height: 12, width: 100, background: "rgba(255,255,255,0.05)", borderRadius: 4, marginLeft: "auto" }} />
              <span style={{ height: 10, width: 50, background: "rgba(255,255,255,0.04)", borderRadius: 4, marginLeft: "auto" }} />
            </div>
        )}
        </div>
      }
      {state === "empty" &&
      <div style={{ padding: "44px 24px", textAlign: "center", color: "var(--bt-text-mid)" }}>
          <div style={{ fontSize: 28, marginBottom: 10, color: "var(--bt-gold)" }}>◇</div>
          <h4 className="bt-h3" style={{ color: "var(--bt-text-hi)", marginBottom: 6 }}>Cup hasn't started</h4>
          <p className="bt-body-sm" style={{ maxWidth: 360, margin: "0 auto" }}>The {tab} bracket opens when the countdown hits zero. Join early to lock your starting tier.</p>
        </div>
      }
      {state === "data" &&
      <div>
          {visible.map((r) =>
        <div key={r.rank} className={"bt-lb-row" + (you && r.rank === you.rank && tab === you.tab ? " is-you" : "")}>
              <span className={"bt-rank" + (r.rank <= 3 ? " bt-rank-" + r.rank : "")}>{r.rank}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ color: "var(--bt-text-hi)", fontWeight: 600, fontSize: 14 }}>{r.name}{you && r.rank === you.rank && tab === you.tab ? <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "var(--bt-orange)" }}>YOU</span> : null}</span>
                <span style={{ fontSize: 11, color: "var(--bt-text-dim)", letterSpacing: "0.04em" }}>Trader #{1000 + r.rank * 7}</span>
              </div>
              <span className="bt-chip" style={{ background: "rgba(255,255,255,0.025)" }}>{r.region}</span>
              <span className="bt-num" style={{ textAlign: "right", color: "var(--bt-text-hi)", fontWeight: 700, fontSize: 15 }}>{fmtUSD(r.vol)}</span>
              <span className="bt-num" style={{ textAlign: "right", color: r.d >= 0 ? "var(--bt-up)" : "var(--bt-down)", fontWeight: 600, fontSize: 13 }}>{r.d >= 0 ? "▲" : "▼"} {Math.abs(r.d).toFixed(1)}%</span>
            </div>
        )}
        </div>
      }
      {/* footer */}
      {state === "data" &&
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, padding: "0 6px", color: "var(--bt-text-dim)", fontSize: 11 }}>
          <span>Updated 12 sec ago · refreshes every 30 sec</span>
          <span style={{ color: "var(--bt-text-mid)", cursor: "pointer" }}>View full ranking →</span>
        </div>
      }
    </div>);

}

// -------------- Your Rank widget --------------
function BTYourRank({ rank = 142, vol = 8420, tier = "contenders", delta = +3 }) {
  return (
    <div className="bt-card-flat" style={{ padding: 14, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,117,50,0.12)", border: "1px solid rgba(255,117,50,0.35)", display: "grid", placeItems: "center", color: "var(--bt-orange)", fontWeight: 700 }}>YOU</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="bt-label">Your rank</span>
          <span style={{ fontSize: 11, color: "var(--bt-up)", fontWeight: 600 }}>▲ {delta}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
          <span className="bt-num" style={{ fontSize: 20, fontWeight: 700, color: "var(--bt-text-hi)" }}>#{rank}</span>
          <span className="bt-num bt-body-sm" style={{ color: "var(--bt-text-mid)" }}>{fmtUSD(vol)} vol</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: "var(--bt-text-dim)" }}>in {tier} · 1,247 above</div>
      </div>
    </div>);

}

// -------------- How It Works strip --------------
function BTHowItWorks({ compact = false }) {
  const steps = [
  { n: "01", t: "Join BrainTrade", d: "Free account in under a minute." },
  { n: "02", t: "Deposit & qualify tier", d: "Your deposit picks your starting stage." },
  { n: "03", t: "Trade to climb", d: "Volume determines your rank in real time." },
  { n: "04", t: "Win the Cup", d: "Top traders take the rewards." }];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: compact ? 8 : 12 }}>
      {steps.map((s, i) =>
      <div key={s.n} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: compact ? "10px 12px" : "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid var(--bt-bg-line)" }}>
          <span style={{ fontFamily: "var(--bt-mono)", fontSize: 11, color: "var(--bt-gold)", marginTop: 2, fontWeight: 600 }}>{s.n}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bt-text-hi)" }}>{s.t}</div>
            <div className="bt-body-sm" style={{ fontSize: 11, color: "var(--bt-text-mid)" }}>{s.d}</div>
          </div>
        </div>
      )}
    </div>);

}

// -------------- Compliance --------------
function BTCompliance({ short = false }) {
  return (
    <p style={{ fontSize: 10.5, color: "var(--bt-text-dim)", lineHeight: 1.55, letterSpacing: "0.01em", maxWidth: 920 }}>
      {short ?
      "Trading-volume competition with deposit-based tier qualification. Terms, eligibility & market rules apply." :
      "This is a trading-volume competition with deposit-based tier qualification. Terms, eligibility, and market-specific rules apply. Trading involves risk of loss; past performance is not indicative of future results."}
    </p>);

}

// -------------- Stat strip --------------
function BTStatStrip({ items }) {
  return (
    <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
      {items.map((it, i) =>
      <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="bt-label">{it.label}</span>
          <span className="bt-num" style={{ fontSize: 22, fontWeight: 700, color: it.color || "var(--bt-text-hi)" }}>{it.value}</span>
        </div>
      )}
    </div>);

}

Object.assign(window, {
  BTLogo, BTCupLockup, BTCountdown, BTTierCard, BTLeaderboard, BTYourRank,
  BTHowItWorks, BTCompliance, BTStatStrip, BT_TIERS: TIERS, BT_LB_DATA: LB_DATA,
  bt_fmtUSD: fmtUSD, useCountdown
});