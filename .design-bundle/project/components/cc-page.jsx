// Champions Cup page — single-screen Option A hero with
// compact expandable sections (How it works + FAQ) below.

function CCHero({ onJoin }) {
  return (
    <section className="cc-hero">
      <div className="bt-hero-bg" />
      <div className="cc-hero__inner">
        <BTLogo width={180} variant="light" />
        <h1 className="cc-headline" style={{ whiteSpace: "nowrap" }}>
          Trader's Cup
        </h1>
        <p className="cc-subhead">
          A three-stage trading tournament. Deposit qualifies your tier — trading volume sets your rank.
        </p>
        <BTCountdown label="Cup kicks off in" />
        <button className="bt-btn bt-btn-primary" onClick={onJoin} style={{ marginTop: 4 }}>Open Account & Join →</button>
      </div>
    </section>);

}

function CCTiers() {
  return (
    <section className="cc-tiers">
      <div className="cc-wrap">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {BT_TIERS.map((t) => <BTTierCard key={t.key} tier={t} />)}
        </div>
      </div>
    </section>);

}

function CCLeaderboardSection() {
  return (
    <section className="cc-leaderboard">
      <div className="cc-wrap">
        <BTLeaderboard rows={5} you={{ rank: 5, tab: "champions" }} />
      </div>
    </section>);

}

function CCHowItWorks() {
  const steps = [
  {
    n: "01",
    t: "Deposit to qualify",
    d: "Your total deposit places you into a tier: Starters, Contenders, or Champions."
  },
  {
    n: "02",
    t: "Trade to rank",
    d: "Inside your tier, your trading volume determines your leaderboard position."
  },
  {
    n: "03",
    t: "Finish at the top",
    d: "Top-ranked traders in each tier qualify for prizes: ranks 1–3 get top prizes, and ranks 4–10 get runner-up prizes."
  }];

  return (
    <section className="cc-how" style={{ padding: "50.4px 0px 16.7999px" }}>
      <div className="cc-wrap">
        <div className="cc-section-head">
          <span className="bt-eyebrow bt-eyebrow--left">How it works</span>
          <h2 className="cc-section-title">Three steps to the Cup.</h2>
        </div>
        <div className="cc-how__grid">
          {steps.map((s, i) =>
          <div key={s.n} className="cc-how__card">
              <div className="cc-how__num">{s.n}</div>
              <h3 className="cc-how__t">{s.t}</h3>
              <p className="cc-how__d">{s.d}</p>
              {i < steps.length - 1 && <div className="cc-how__connector" aria-hidden="true" />}
            </div>
          )}
        </div>
      </div>
    </section>);

}

function CCFAQ() {
  const faq = [
  { t: "Is the Cup free to enter?", d: "Yes — opening a BrainTrade account is free. To qualify for a tier you'll need to make a first deposit; the amount picks your starting tier. You can deposit anytime before the countdown ends." },
  { t: "What if I'm new to trading?", d: "The Starters tier is built exactly for that. You'll get access to BrainTrade Academy courses on day one, and the leaderboard there is full of people in the same boat." },
  { t: "Can I move tiers during the Cup?", d: "You can only move up. Climbing happens automatically when your total deposit passes the next tier's threshold. You never drop back down once qualified." },
  { t: "How is trading volume calculated?", d: "USD-equivalent of every executed trade, summed across spot and derivatives. Self-matching and wash trading are detected and excluded." },
  { t: "When are prizes paid out?", d: "Cash settles to your verified withdrawal method within 14 days of cup close. Coaching slots are scheduled within 30 days. Capital allocations begin the following quarter." },
  { t: "Is this gambling?", d: "No. It's a trading-volume competition using your real account against your own market view. Trading carries risk; the Cup doesn't change that." }];

  const [openIdx, setOpenIdx] = React.useState(0);
  return (
    <section className="cc-faq" style={{ padding: "64px 0px 55.2px" }}>
      <div className="cc-wrap cc-faq__wrap">
        <div className="cc-section-head cc-section-head--center">
          <span className="bt-eyebrow">Frequently asked</span>
          <h2 className="cc-section-title">Questions, answered.</h2>
        </div>
        <div className="cc-faq__list">
          {faq.map((it, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className={"cc-faq__item" + (isOpen ? " is-open" : "")}>
                <button
                  className="cc-faq__head"
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  aria-expanded={isOpen}>
                  
                  <span className="cc-faq__q">{it.t}</span>
                  <span className="cc-faq__icon" aria-hidden="true">
                    <span /><span />
                  </span>
                </button>
                <div className="cc-faq__panel">
                  <div className="cc-faq__body">{it.d}</div>
                </div>
              </div>);

          })}
        </div>
      </div>
    </section>);

}

function CCJoinModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", zIndex: 100, padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="bt-card" style={{ width: 460, maxWidth: "100%", padding: 28, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, color: "var(--bt-text-mid)", fontSize: 22, lineHeight: 1, padding: 4 }}>×</button>
        <BTLogo width={130} variant="light" />
        <h3 className="bt-h2" style={{ marginTop: 16, color: "var(--bt-text-hi)" }}>Open your BrainTrade account</h3>
        <p className="bt-body" style={{ color: "var(--bt-text-mid)", marginTop: 8 }}>Your first deposit picks your starting stage. You can climb by trading volume.</p>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <input placeholder="Email" style={{ height: 44, padding: "0 14px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--bt-bg-line-2)", borderRadius: 10, color: "var(--bt-text-hi)", fontFamily: "var(--bt-font)" }} />
          <input placeholder="Phone (optional)" style={{ height: 44, padding: "0 14px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--bt-bg-line-2)", borderRadius: 10, color: "var(--bt-text-hi)", fontFamily: "var(--bt-font)" }} />
          <button className="bt-btn bt-btn-primary" style={{ marginTop: 4, width: "100%", justifyContent: "center" }} onClick={onClose}>Continue →</button>
        </div>
        <p style={{ fontSize: 10.5, color: "var(--bt-text-dim)", marginTop: 14, lineHeight: 1.55 }}>
          By continuing you agree to BrainTrade's Terms. Trading involves risk of loss. Cup terms &amp; eligibility apply.
        </p>
      </div>
    </div>);

}

function ChampionsCupPage() {
  const [open, setOpen] = React.useState(false);
  const join = () => setOpen(true);
  return (
    <div className="bt cc-page">
      <CCHero onJoin={join} />
      <CCTiers />
      <CCLeaderboardSection />
      <CCHowItWorks />
      <CCFAQ />
      <div className="cc-foot">
        <BTCompliance />
      </div>
      <CCJoinModal open={open} onClose={() => setOpen(false)} />
    </div>);

}

Object.assign(window, { ChampionsCupPage });