import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddButton, BookTestButton } from "@/components/Buttons";
import { Reveal } from "@/components/Motion";
import { Cta, SectionHead } from "@/components/Sections";
import { DEPTS, ITEMS, PHONE_DISPLAY, TEL, TESTS, relatedTests, rupee, testHref } from "@/lib/data";

type Props = { params: Promise<{ dept: string; test: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => TESTS.map((t) => { const [dept, test] = t.id.split("/"); return { dept, test }; });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dept, test } = await params;
  const t = ITEMS[`${dept}/${test}`];
  return t ? { title: `${t.name} — ${rupee(t.price!)}`, description: `${t.name} at Medcloud costs ${rupee(t.price!)}. Book online, by call or on WhatsApp.` } : {};
}

export default async function TestPage({ params }: Props) {
  const { dept, test } = await params;
  const t = ITEMS[`${dept}/${test}`];
  const d = DEPTS.find((x) => x.slug === dept);
  if (!t || !d) notFound();
  const scan = d.slug === "radiology";
  const related = relatedTests(t);
  return (
    <>
      <section className="page-head test-head"><div className="wrap">
        <div>
          <p className="crumbs"><Link href="/">Home</Link> / <Link href="/tests">Tests &amp; prices</Link> / <Link href={`/tests/${d.slug}`}>{d.name}</Link></p>
          <p className="eyebrow">{d.name}{t.mod && t.mod !== "Other" ? ` · ${t.mod}` : ""}</p>
          <h1>{t.name}</h1>
          <p>{d.blurb}</p>
        </div>
        <div className="paper price-card">
          <div className="paper-head"><h2>Price</h2><span>Medcloud</span></div>
          <p className="price-big price">{rupee(t.price!)}</p>
          <div className="price-acts">
            <BookTestButton id={t.id} className="btn btn-primary btn-block">Book this {scan ? "scan" : "test"}</BookTestButton>
            <div className="price-add"><span>Add to my tests</span><AddButton id={t.id} /></div>
          </div>
          <p className="fine">Pay at the centre or at collection. Confirm the price when you book.</p>
        </div>
      </div></section>

      <section className="block"><div className="wrap info-grid">
        <Reveal><div className="info"><h3>{scan ? "Where it is done" : "Where the sample is taken"}</h3><p>{scan ? "Scans are done at a Medcloud centre. Call to check which centre offers this scan and to fix a time." : "At any Medcloud centre, or at home. Call us for home collection in 30 minutes; we confirm if this test can be collected at home."}</p><Link className="sec-link" href="/centres">See centres →</Link></div></Reveal>
        <Reveal delay={90}><div className="info"><h3>How to book</h3><p>Add it to “My tests”, fill in your name and number, and send the request on WhatsApp. Our team calls back to confirm the slot and any preparation.</p><a className="sec-link" href={TEL}>Or call {PHONE_DISPLAY} →</a></div></Reveal>
        <Reveal delay={180}><div className="info"><h3>Prescribed with other tests?</h3><p>Add everything on your prescription to one list and book them together. A health package may cover several of them.</p><Link className="sec-link" href="/packages">See health packages →</Link></div></Reveal>
      </div></section>

      {related.length > 0 && (
        <section className="block band"><div className="wrap">
          <SectionHead eyebrow={d.name} title="Related tests" action={<Link className="btn btn-ghost" href={`/tests/${d.slug}`}>All {d.name.toLowerCase()} tests</Link>} />
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
