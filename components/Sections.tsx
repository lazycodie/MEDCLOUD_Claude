import Image from "next/image";
import Link from "next/link";
import { CENTRES, PACKS, PHONE_DISPLAY, POPULAR, SERVICES, TEL, TUBES, WHATSAPP, WHY, rupee, testHref, type Tube } from "@/lib/data";
import { AddButton, AddPackageButton, BookButton } from "./Buttons";
import { CountUp, Reveal } from "./Motion";

export function PageHead({ eyebrow, title, lede, crumbs, children }: { eyebrow: string; title: string; lede?: string; crumbs?: { href: string; label: string }[]; children?: React.ReactNode }) {
  return (
    <section className="page-head"><div className="wrap">
      {crumbs && <p className="crumbs"><Link href="/">Home</Link>{crumbs.map((c) => <span key={c.href}> / <Link href={c.href}>{c.label}</Link></span>)}</p>}
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {lede && <p>{lede}</p>}
      {children}
    </div></section>
  );
}

export function SectionHead({ eyebrow, title, lede, action }: { eyebrow: string; title: string; lede?: string; action?: React.ReactNode }) {
  return (
    <Reveal className="sec-head"><div>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {lede && <p>{lede}</p>}
    </div>{action}</Reveal>
  );
}

export function PopularSlip() {
  return (
    <aside className="paper hero-slip" aria-labelledby="pop-h">
      <div className="paper-head"><h2 id="pop-h">Popular tests</h2><span>Price list</span></div>
      <ul className="rows">
        {POPULAR.map((t, i) => (
          <li key={t.id} style={{ "--i": i } as React.CSSProperties}>
            <Link className="nm" href={testHref(t)}>{t.name}</Link><span className="price">{rupee(t.price!)}</span><AddButton id={t.id} />
          </li>
        ))}
      </ul>
      <div className="paper-foot"><span>Tap + to add a test to your booking</span><Link href="/tests">All tests →</Link></div>
    </aside>
  );
}

export function Stats() {
  const stats = [["3000+", "patients each month"], ["350+", "referring doctors"], ["50+", "network hospitals"], ["4", "healthcare centres"]];
  return (
    <section className="stats" aria-label="Medcloud in numbers"><div className="wrap">
      {stats.map(([n, l]) => <div className="stat" key={l}><b><CountUp value={n} /></b><span>{l}</span></div>)}
    </div></section>
  );
}

export function PackageGrid() {
  return (
    <>
      <div className="pk-grid">
        {PACKS.map((p, i) => {
          const head = p.items.slice(0, 6), rest = p.items.slice(6);
          const tubes = [...new Set(p.items.map((x) => x.tube).filter((t): t is Tube => !!t))];
          const row = (it: (typeof p.items)[number]) => (
            <li key={it.name}><i style={it.tube ? ({ "--c": TUBES[it.tube].color } as React.CSSProperties) : undefined} />{it.name}{it.tube && <small>{TUBES[it.tube].label}</small>}</li>
          );
          return (
            <Reveal key={p.id} delay={i * 90}>
              <article className={`pk glow ${p.feature ? "feature" : ""}`}>
                <div className="meta">
                  <span className="tag g">{p.feature ? "From ₹999*" : "Price on call"}</span>
                  {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                </div>
                <h3>{p.name}</h3>
                <p className="for">{p.forWho}</p>
                <ul>{head.map(row)}</ul>
                {rest.length > 0 && <details><summary>+ {rest.length} more included</summary><ul>{rest.map(row)}</ul></details>}
                {tubes.length > 0 && <div className="legend">{tubes.map((k) => <span key={k}><i style={{ "--c": TUBES[k].color } as React.CSSProperties} />{TUBES[k].label}</span>)}</div>}
                <AddPackageButton id={p.id} primary={p.feature} />
              </article>
            </Reveal>
          );
        })}
      </div>
      <p className="pk-note">*Starting price as published by Medcloud. Final package price is confirmed when you book.</p>
    </>
  );
}

/** Bento of the four services; home collection is the large dark tile. */
export function Services() {
  return (
    <div className="svc-grid">
      {SERVICES.map((s, i) => (
        <Reveal key={s.slug} delay={i * 80} className={i === 0 ? "svc-first" : ""}>
          <article className={`svc glow ${i === 0 ? "home" : ""}`}>
            <h3>{s.name}</h3>
            <p>{s.short}</p>
            <div className="pills">{s.pills.map((x) => <span className="pill" key={x}>{x}</span>)}</div>
            <div className="svc-acts">
              {i === 0 && <BookButton className="btn btn-amber" preset={{ mode: "home" }}>Request home collection</BookButton>}
              <Link className="more" href={`/services/${s.slug}`}>Learn more <span className="arrow" aria-hidden="true">→</span></Link>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function Steps() {
  const steps = [
    ["Pick your tests", "Search the price list and add the tests or package you need. Your total updates as you go."],
    ["Choose home or centre", "Ask for home collection, or pick the Medcloud centre closest to you and a time that suits."],
    ["Send the request", "Your list goes to our team on WhatsApp. We call back to confirm the slot and any preparation."],
  ];
  return (
    <ol className="steps">
      {steps.map(([t, b], i) => <li key={t}><Reveal delay={i * 140}><h3>{t}</h3><p>{b}</p></Reveal></li>)}
    </ol>
  );
}

/** "30 minutes" band with an animated dial. */
export function HomeCollectionBand() {
  return (
    <section className="hc"><div className="wrap">
      <Reveal kind="zoom" className="hc-dial">
        <svg viewBox="0 0 220 220" role="img" aria-label="30 minute home collection">
          <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10" />
          <circle className="hc-arc" cx="110" cy="110" r="96" fill="none" stroke="#2bb685" strokeWidth="10" strokeLinecap="round" strokeDasharray="603" strokeDashoffset="302" transform="rotate(-90 110 110)" />
          <g className="hc-ticks" stroke="rgba(255,255,255,.35)" strokeWidth="2">{Array.from({ length: 12 }, (_, i) => <line key={i} x1="110" y1="30" x2="110" y2="38" transform={`rotate(${i * 30} 110 110)`} />)}</g>
          <text x="110" y="118" textAnchor="middle" className="hc-num">30</text>
          <text x="110" y="146" textAnchor="middle" className="hc-unit">MINUTES</text>
        </svg>
      </Reveal>
      <Reveal kind="left">
        <p className="eyebrow">Home sample collection</p>
        <h2>We come to you, in 30 minutes</h2>
        <p>Call us or send your test list on WhatsApp. Give the sample at home and skip the trip to the centre.</p>
        <div className="hc-acts">
          <BookButton className="btn btn-amber" preset={{ mode: "home" }}>Request home collection</BookButton>
          <a className="btn btn-onnavy" href={TEL}>Call {PHONE_DISPLAY}</a>
        </div>
      </Reveal>
    </div></section>
  );
}

export function Why() {
  return (
    <div className="why">
      {WHY.map((w, i) => <Reveal key={w.title} delay={i * 80}><div className="why-card glow"><span className="why-n">{String(i + 1).padStart(2, "0")}</span><h3>{w.title}</h3><p>{w.body}</p></div></Reveal>)}
    </div>
  );
}

export function Founders() {
  return (
    <div className="founders">
      <Reveal><div className="founder"><Image src="/founder-chandan.png" alt="Dr Chandan K." width={92} height={102} /><div><h3>Dr Chandan K.</h3><p>MBBS, DNB (RD), FIFM, (LLB)</p><span>Radiology</span></div></div></Reveal>
      <Reveal delay={100}><div className="founder"><Image src="/founder-mala.jpg" alt="Dr Mala G R." width={92} height={102} /><div><h3>Dr Mala G R.</h3><p>MBBS, MD (Pathology)</p><span>Pathology</span></div></div></Reveal>
    </div>
  );
}

export function About() {
  return (
    <div className="about">
      <Reveal>
        <p className="eyebrow">About Medcloud</p>
        <h2 className="h-sec">Affordable, accessible, quality diagnostics</h2>
        <p className="big">Medcloud is a trusted choice among physicians and a preferred partner for continuous patient support throughout the healthcare journey.</p>
        <ul className="ticks">
          <li>Pioneering advanced diagnostics set up in tier 2 and tier 3 cities</li>
          <li>Holistic, affordable, and quality healthcare services</li>
          <li>First fetal imaging center in Mandya to conduct fetal interventions</li>
        </ul>
        <div className="mv">
          <div><h3>Mission</h3><p>Equip our community with the most advanced medical technologies, combined with highly professional and qualified service providers.</p></div>
          <div><h3>Vision</h3><p>Integrate the golden triangle of healthcare standards: Affordability, Accessibility, and Quality.</p></div>
        </div>
      </Reveal>
      <div>
        <p className="eyebrow" style={{ marginBottom: 14 }}>Founders</p>
        <Founders />
      </div>
    </div>
  );
}

export function Cta() {
  return (
    <section className="cta"><div className="wrap">
      <Reveal><h2>Get one step ahead of disease</h2><p>Stay proactive with preventive measures and regular health checkups.</p></Reveal>
      <div className="acts"><BookButton className="btn btn-amber">Book a test</BookButton><a className="btn btn-onnavy" href={WHATSAPP} target="_blank" rel="noopener">WhatsApp us</a></div>
    </div></section>
  );
}

/* ---------- v3 sections ---------- */

/** Auto-scrolling row of real prices under the hero; pauses on hover so + can be tapped. */
export function PriceTicker() {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden}>
      {POPULAR.map((t) => (
        <li key={t.id} className="tick">
          <Link href={testHref(t)} tabIndex={hidden ? -1 : 0}><small>Popular test</small><b>{t.name}</b></Link>
          <span><span className="price">{rupee(t.price!)}</span>{!hidden && <AddButton id={t.id} />}</span>
        </li>
      ))}
    </ul>
  );
  return <div className="ticker" aria-label="Popular test prices"><div className="ticker-track">{row()}{row(true)}</div></div>;
}

export function PackageTeaser() {
  return (
    <div className="pkt">
      {PACKS.map((p, i) => (
        <Reveal key={p.id} delay={i * 90}>
          <Link href="/packages" className={`pkt-card glow ${p.feature ? "feature" : ""}`}>
            <span className="pkt-n">{p.items.length}<small>tests &amp; scans</small></span>
            <b>{p.name}</b>
            <span>{p.forWho}</span>
            <span className="pkt-foot"><span className="tag g">{p.feature ? "From ₹999*" : "Price on call"}</span><span className="arrow" aria-hidden="true">→</span></span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function CentreStrip() {
  return (
    <div className="cstrip">
      {CENTRES.map((c, i) => (
        <Reveal key={c.id} delay={i * 80}>
          <Link href="/centres" className="cstrip-card glow">
            <span className="cstrip-n">{String(i + 1).padStart(2, "0")}</span>
            <b>{c.name}</b>
            <span>{c.address}</span>
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

/** About page: the "golden triangle" from Medcloud's vision statement. */
export function Triangle() {
  const pts = [
    { k: "Affordability", d: "Holistic, affordable healthcare. Every price on this site is listed upfront.", x: 200, y: 44 },
    { k: "Accessibility", d: "Advanced diagnostics set up in tier 2 and tier 3 cities, plus home collection in 30 minutes.", x: 52, y: 300 },
    { k: "Quality", d: "State of the art facilities, stringent quality control and qualified specialists.", x: 348, y: 300 },
  ];
  return (
    <div className="tri">
      <Reveal kind="zoom">
        <svg viewBox="0 0 400 350" role="img" aria-label="The golden triangle: Affordability, Accessibility, Quality">
          <defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#35e0a6" /><stop offset="1" stopColor="#7db1ff" /></linearGradient></defs>
          <path className="tri-line" d="M200 44 L52 300 L348 300 Z" fill="rgba(53,224,166,.06)" stroke="url(#tg)" strokeWidth="2.5" strokeLinejoin="round" />
          <circle className="tri-orbit" cx="200" cy="215" r="58" fill="none" stroke="rgba(255,255,255,.18)" strokeDasharray="3 7" />
          <text x="200" y="210" textAnchor="middle" className="tri-mid">GOLDEN</text>
          <text x="200" y="230" textAnchor="middle" className="tri-mid">TRIANGLE</text>
          {pts.map((p) => <g key={p.k}><circle cx={p.x} cy={p.y} r="16" fill="rgba(53,224,166,.18)" /><circle cx={p.x} cy={p.y} r="7" fill="#35e0a6" /></g>)}
        </svg>
      </Reveal>
      <ol className="tri-list">
        {pts.map((p, i) => <li key={p.k}><Reveal delay={i * 110} kind="left"><h3>{p.k}</h3><p>{p.d}</p></Reveal></li>)}
      </ol>
    </div>
  );
}

export function FoundersBig() {
  const f = [
    { img: "/founder-chandan.png", name: "Dr Chandan K.", deg: "MBBS, DNB (RD), FIFM, (LLB)", role: "Radiology" },
    { img: "/founder-mala.jpg", name: "Dr Mala G R.", deg: "MBBS, MD (Pathology)", role: "Pathology" },
  ];
  return (
    <div className="fbig">
      {f.map((x, i) => (
        <Reveal key={x.name} delay={i * 120}>
          <div className="fbig-card glow">
            <Image src={x.img} alt={x.name} width={212} height={234} />
            <div><span className="tag g">{x.role}</span><h3>{x.name}</h3><p>{x.deg}</p></div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Services index: large numbered rows instead of the home page's cards. */
export function ServiceRows() {
  return (
    <div className="srows">
      {SERVICES.map((s, i) => (
        <Reveal key={s.slug} delay={i * 70}>
          <Link href={`/services/${s.slug}`} className="srow">
            <span className="srow-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="srow-main"><b>{s.name}</b><span>{s.short}</span></span>
            <span className="srow-pills">{s.pills.slice(0, 3).map((p) => <em key={p}>{p}</em>)}</span>
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
