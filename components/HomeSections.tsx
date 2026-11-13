"use client";

import { useState } from "react";
import Link from "next/link";
import { CONCERNS, DEPTS, DEPT_NAME, FAQS, MARQUEE, POPULAR, TESTS, deptFrom, deptTests, rupee, testHref, type Item } from "@/lib/data";
import { AddButton } from "./Buttons";
import { Reveal } from "./Motion";

export function Marquee() {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden}>{MARQUEE.map((m) => <li key={m}>{m}<i /></li>)}</ul>
  );
  return <div className="marquee" aria-label="What Medcloud offers"><div className="marquee-track">{row()}{row(true)}</div></div>;
}

/** Bento grid of the nine departments; radiology and biochemistry get the large tiles. */
export function DeptBento() {
  return (
    <div className="bento">
      {DEPTS.map((d, i) => {
        const n = deptTests(d.slug).length;
        const big = d.slug === "radiology" ? "b-xl" : ["biochemistry", "haematology", "serology", "hormone-assays"].includes(d.slug) ? "b-wide" : "";
        return (
          <Reveal key={d.slug} delay={(i % 4) * 70} className={`bento-cell ${big}`} kind="zoom">
            <Link href={`/tests/${d.slug}`} className={`tile ${d.slug === "radiology" ? "tile-dark" : ""}`}>
              <span className="tile-count">{n}</span>
              <span className="tile-body">
                <b>{d.name}</b>
                <span>{d.blurb}</span>
                {d.slug === "radiology" && <span className="tile-chips">{["CT", "Ultrasound", "X-Ray", "Mammography", "Echo"].map((c) => <em key={c}>{c}</em>)}</span>}
              </span>
              <span className="tile-foot"><span>{n} tests · from {rupee(deptFrom(d.slug))}</span><span className="arrow" aria-hidden="true">→</span></span>
              {d.slug === "radiology" && <span className="scanline" aria-hidden="true" />}
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

const TABS: { label: string; pick: () => Item[] }[] = [
  { label: "Most asked", pick: () => POPULAR.slice(0, 6) },
  { label: "Under ₹150", pick: () => TESTS.filter((t) => t.price! <= 150 && t.dept !== "radiology").sort((a, b) => a.price! - b.price!).slice(0, 6) },
  ...["Diabetes", "Heart", "Thyroid", "Pregnancy"].map((c) => ({ label: c, pick: () => TESTS.filter((t) => CONCERNS[c].test(t.key)).sort((a, b) => a.price! - b.price!).slice(0, 6) })),
];

export function PriceTabs() {
  const [tab, setTab] = useState(0);
  const items = TABS[tab].pick();
  const concern = tab > 1 ? TABS[tab].label : null;
  return (
    <div className="ptabs">
      <div className="ptabs-bar" role="tablist" aria-label="Test groups">
        {TABS.map((t, i) => <button key={t.label} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>{t.label}</button>)}
      </div>
      <ul className="pgrid" key={tab} role="tabpanel">
        {items.map((t, i) => (
          <li key={t.id} style={{ "--i": i } as React.CSSProperties}>
            <Link href={testHref(t)} className="pcard-main"><small>{t.dept !== "package" && DEPT_NAME[t.dept]}</small><b>{t.name}</b></Link>
            <span className="pcard-foot"><span className="price">{rupee(t.price!)}</span><AddButton id={t.id} /></span>
          </li>
        ))}
      </ul>
      <p className="ptabs-more"><Link className="sec-link" href={concern ? `/tests?concern=${concern}` : "/tests"}>{concern ? `See all ${concern.toLowerCase()} tests →` : `See all ${TESTS.length} tests →`}</Link></p>
    </div>
  );
}

export function Faq({ items = FAQS }: { items?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq">
      {items.map((f, i) => (
        <div key={f.q} className={`faq-item ${open === i ? "open" : ""}`}>
          <h3><button aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? null : i)}>{f.q}<span className="faq-plus" aria-hidden="true" /></button></h3>
          <div className="faq-panel" id={`faq-${i}`} role="region"><div><p>{f.a}</p></div></div>
        </div>
      ))}
    </div>
  );
}
