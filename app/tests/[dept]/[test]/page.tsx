import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddButton, BookTestButton } from "@/components/Buttons";
import { Reveal } from "@/components/Motion";
import { Cta, SectionHead } from "@/components/Sections";
import { CENTRES, DEPTS, ITEMS, PHONE_DISPLAY, TEL, TESTS, relatedTests, rupee, testHref, testInfo } from "@/lib/data";

type Props = { params: Promise<{ dept: string; test: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => TESTS.map((t) => { const [dept, test] = t.id.split("/"); return { dept, test }; });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dept, test } = await params;
  const t = ITEMS[`${dept}/${test}`];
  if (!t) return {};
  const info = testInfo(t);
  return {
    title: `${t.name} — ${rupee(t.price!)}`,
    description: `${t.name} at Medcloud costs ${rupee(t.price!)}. ${info.about ?? ""} ${info.sample}. Book online, by call or on WhatsApp.`.replace(/\s+/g, " "),
    alternates: { canonical: `/tests/${t.id}` },
  };
}

export default async function TestPage({ params }: Props) {
  const { dept, test } = await params;
  const t = ITEMS[`${dept}/${test}`];
  const d = DEPTS.find((x) => x.slug === dept);
  if (!t || !d) notFound();
  const scan = d.slug === "radiology";
  const info = testInfo(t);
  const related = relatedTests(t);
  const facts: [string, string][] = [
    ["Sample", info.sample],
    ["Preparation", info.prep],
    ["Home collection", info.home ? "Available. We confirm coverage for your area on call." : "Not available. This is done at a centre."],
    ["Where", info.where],
    ["Report time", "Confirmed when you book."],
    ["Prescription", scan ? "Bring your doctor’s prescription for the scan." : "Bring or share your prescription if you have one."],
  ];
  return (
    <>
      <section className="page-head test-head"><div className="wrap">
        <div>
          <p className="crumbs"><Link href="/">Home</Link> / <Link href="/tests">Tests &amp; prices</Link> / <Link href={`/tests/${d.slug}`}>{d.name}</Link></p>
          <p className="eyebrow">{d.name}{t.mod && t.mod !== "Other" ? ` · ${t.mod}` : ""}{info.abbr ? ` · also called ${info.abbr}` : ""}</p>
          <h1>{t.name}</h1>
          <p>{info.about ?? `${t.name} is a ${d.name.toLowerCase()} ${scan ? "scan" : "test"} at Medcloud. Ask your doctor or our team what it checks for in your case.`}</p>
        </div>
        <div className="paper price-card">
          <div className="paper-head"><h2>Price</h2><span>Medcloud</span></div>
          <p className="price-big price">{rupee(t.price!)}</p>
          <div className="price-acts">
            <BookTestButton id={t.id} className="btn btn-primary btn-block">Book this {scan ? "scan" : "test"}</BookTestButton>
            <div className="price-add"><span>Add to my tests</span><AddButton id={t.id} /></div>
          </div>
          <p className="fine">Pay at the centre or at collection. The price is confirmed when you book.</p>
        </div>
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Before you book" title={<>What to <em>know.</em></>} />
        <dl className="facts">
          {facts.map(([k, v], i) => <Reveal key={k} delay={i * 60}><div className="fact"><dt>{k}</dt><dd>{v}</dd></div></Reveal>)}
        </dl>
        {info.packages.length > 0 && (
          <p className="fact-note">Included in {info.packages.map((p, i) => <span key={p.id}>{i > 0 && " and "}<Link className="sec-link" href="/packages">{p.name}</Link></span>)}. Ask about the package price when you book.</p>
        )}
        <p className="fact-note muted">General information, not medical advice. Your doctor and the Medcloud team will guide you. Or call <a className="sec-link" href={TEL}>{PHONE_DISPLAY}</a>.</p>
      </div></section>

      <section className="block tint"><div className="wrap">
        <SectionHead eyebrow="Where to go" title={<>Four <em>centres.</em></>} action={<Link className="btn btn-ghost" href="/centres">Map and directions</Link>} />
        <ul className="centre-chips">{CENTRES.map((c) => <li key={c.id}><Link href={`/centres/${c.id}`}><b>{c.name}</b><span>{c.address}</span></Link></li>)}</ul>
      </div></section>

      {related.length > 0 && (
        <section className="block"><div className="wrap">
          <SectionHead eyebrow={d.name} title={<>Related <em>tests.</em></>} action={<Link className="btn btn-ghost" href={`/tests/${d.slug}`}>All {d.name.toLowerCase()} tests</Link>} />
          <ul className="pgrid static">
            {related.map((r) => (
              <li key={r.id}>
                <Link href={testHref(r)} className="pcard-main"><small>{d.name}{r.mod && r.mod !== "Other" ? ` · ${r.mod}` : ""}</small><b>{r.name}</b></Link>
                <span className="pcard-foot"><span className="price">{rupee(r.price!)}</span><AddButton id={r.id} /></span>
              </li>
            ))}
          </ul>
        </div></section>
      )}
      <Cta />
    </>
  );
}
