import Image from "next/image";
import Link from "next/link";
import { PACKS, PHONE_DISPLAY, POPULAR, TEL, TUBES, WHATSAPP, rupee, type Tube } from "@/lib/data";
import { AddButton, AddPackageButton, BookButton } from "./Buttons";

export function PageHead({ eyebrow, title, lede, crumbs }: { eyebrow: string; title: string; lede?: string; crumbs?: { href: string; label: string }[] }) {
  return (
    <section className="page-head"><div className="wrap">
      {crumbs && <p className="crumbs"><Link href="/">Home</Link>{crumbs.map((c) => <span key={c.href}> / <Link href={c.href}>{c.label}</Link></span>)}</p>}
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {lede && <p>{lede}</p>}
    </div></section>
  );
}

export function PopularSlip() {
  return (
    <aside className="paper" aria-labelledby="pop-h">
      <div className="paper-head"><h2 id="pop-h">Popular tests</h2><span>Price list</span></div>
      <ul className="rows">
        {POPULAR.map((t) => <li key={t.id}><span className="nm">{t.name}</span><span className="price">{rupee(t.price!)}</span><AddButton id={t.id} /></li>)}
      </ul>
      <div className="paper-foot"><span>Tap + to add a test to your booking</span><Link href="/tests">All tests →</Link></div>
    </aside>
  );
}

export function Stats() {
  const stats = [["3000+", "patients each month"], ["350+", "referring doctors"], ["50+", "network hospitals"], ["4", "healthcare centres"]];
  return (
    <section className="stats" aria-label="Medcloud in numbers"><div className="wrap">
      {stats.map(([n, l]) => <div className="stat" key={l}><b>{n}</b><span>{l}</span></div>)}
    </div></section>
  );
}

export function PackageGrid() {
  return (
    <>
      <div className="pk-grid">
        {PACKS.map((p) => {
          const head = p.items.slice(0, 6), rest = p.items.slice(6);
          const tubes = [...new Set(p.items.map((i) => i.tube).filter((t): t is Tube => !!t))];
          const row = (it: (typeof p.items)[number]) => (
            <li key={it.name}><i style={it.tube ? ({ "--c": TUBES[it.tube].color } as React.CSSProperties) : undefined} />{it.name}{it.tube && <small>{TUBES[it.tube].label}</small>}</li>
          );
          return (
            <article key={p.id} className={`pk ${p.feature ? "feature" : ""}`}>
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
          );
        })}
      </div>
      <p className="pk-note">*Starting price as published by Medcloud. Final package price is confirmed when you book.</p>
    </>
  );
}

export function Services() {
  return (
    <div className="svc-grid">
      <article className="svc home">
        <h3>Home sample collection</h3>
        <p>Call us and a phlebotomist reaches you in 30 minutes. Give the sample at home and skip the trip to the centre.</p>
        <div className="pills"><span className="pill">30-minute pickup</span><span className="pill">Blood &amp; urine samples</span></div>
        <div><BookButton className="btn btn-amber" preset={{ mode: "home" }}>Request home collection</BookButton></div>
      </article>
      <article className="svc">
        <h3>Diagnostic lab</h3>
        <p>From a routine Complete Blood Count and blood glucose to infectious disease panels, cancer markers and hormone assays, run with advanced equipment and stringent quality control.</p>
        <div className="pills">{["Haematology", "Biochemistry", "Serology", "Microbiology", "Histopathology"].map((x) => <span className="pill" key={x}>{x}</span>)}</div>
        <Link className="more" href="/tests/haematology">See lab test prices →</Link>
      </article>
      <article className="svc">
        <h3>Imaging centres</h3>
        <p>3T MRI, MDCT and ultrasound, read by qualified and experienced radiologists. Medcloud runs the first fetal imaging centre in Mandya to conduct fetal interventions.</p>
        <div className="pills">{["3T MRI", "CT scan", "Ultrasound", "X-Ray", "Fetal imaging"].map((x) => <span className="pill" key={x}>{x}</span>)}</div>
        <Link className="more" href="/tests/radiology">See scan prices →</Link>
      </article>
      <article className="svc">
        <h3>Specialist consultation</h3>
        <p>Visiting specialists in ultrasound, radiology and fetal intervention consult at our centres, so the scan and the expert opinion happen in one visit.</p>
        <div className="pills">{["Radiology", "Fetal intervention", "Visiting specialties"].map((x) => <span className="pill" key={x}>{x}</span>)}</div>
        <a className="more" href={TEL}>Call {PHONE_DISPLAY} to book a consultation →</a>
      </article>
    </div>
  );
}

export function Steps() {
  return (
    <ol className="steps">
      <li><h3>Pick your tests</h3><p>Search the price list and add the tests or package you need. Your total updates as you go.</p></li>
      <li><h3>Choose home or centre</h3><p>Ask for home collection, or pick the Medcloud centre closest to you and a time that suits.</p></li>
      <li><h3>Send the request</h3><p>Your list goes to our team on WhatsApp. We call back to confirm the slot and any preparation.</p></li>
    </ol>
  );
}

export function About() {
  return (
    <div className="about">
      <div>
        <p className="eyebrow">About Medcloud</p>
        <h2 style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 800, marginTop: 10 }}>Affordable, accessible, quality diagnostics</h2>
        <p className="big">Medcloud is a trusted choice among physicians and a preferred partner for continuous patient support throughout the healthcare journey.</p>
        <ul className="ticks">
          <li>Pioneering advanced diagnostics set up in tier 2 and tier 3 cities</li>
          <li>Holistic, affordable, and quality healthcare services</li>
          <li>First fetal imaging center in Mandya to conduct fetal interventions</li>
          <li>A team of 20 expert staff across lab and imaging</li>
        </ul>
        <div className="mv">
          <div><h3>Mission</h3><p>Equip our community with the most advanced medical technologies, combined with highly professional and qualified service providers.</p></div>
          <div><h3>Vision</h3><p>Integrate the golden triangle of healthcare standards: Affordability, Accessibility, and Quality.</p></div>
        </div>
      </div>
      <div>
        <p className="eyebrow" style={{ marginBottom: 14 }}>Founders</p>
        <div className="founders">
          <div className="founder"><Image src="/founder-chandan.png" alt="Dr Chandan K." width={92} height={102} /><div><h3>Dr Chandan K.</h3><p>MBBS, DNB (RD), FIFM, (LLB)</p><span>Radiology</span></div></div>
          <div className="founder"><Image src="/founder-mala.jpg" alt="Dr Mala G R." width={92} height={102} /><div><h3>Dr Mala G R.</h3><p>MBBS, MD (Pathology)</p><span>Pathology</span></div></div>
        </div>
      </div>
    </div>
  );
}

export function Cta() {
  return (
    <section className="cta"><div className="wrap">
      <div><h2>Get one step ahead of disease</h2><p>Stay proactive with preventive measures and regular health checkups.</p></div>
      <div className="acts"><BookButton className="btn btn-amber">Book a test</BookButton><a className="btn btn-onnavy" href={WHATSAPP} target="_blank" rel="noopener">WhatsApp us</a></div>
    </div></section>
  );
}
