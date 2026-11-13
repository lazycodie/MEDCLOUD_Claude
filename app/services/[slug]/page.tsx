import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookButton } from "@/components/Buttons";
import Catalogue from "@/components/Catalogue";
import { Reveal } from "@/components/Motion";
import { Cta, PageHead, SectionHead } from "@/components/Sections";
import { DEPT_NAME, PHONE_DISPLAY, SERVICES, TEL } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  return s ? { title: s.name, description: s.short } : {};
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) notFound();
  const others = SERVICES.filter((x) => x.slug !== s.slug);
  return (
    <>
      <PageHead eyebrow="Service" title={s.name} lede={s.short} crumbs={[{ href: "/services", label: "Services" }]}>
        <div className="head-acts">
          <BookButton className="btn btn-amber" preset={{ mode: s.slug === "home-collection" ? "home" : s.dept === "radiology" ? "centre" : undefined }}>{s.cta}</BookButton>
          <a className="btn btn-onnavy" href={TEL}>Call {PHONE_DISPLAY}</a>
        </div>
      </PageHead>

      <section className="block"><div className="wrap prose-grid">
        <Reveal className="prose">
          {s.intro.map((p) => <p key={p}>{p}</p>)}
          <div className="pills">{s.pills.map((x) => <span className="pill" key={x}>{x}</span>)}</div>
        </Reveal>
        <ol className={`parts ${s.slug === "home-collection" ? "numbered" : ""}`}>
          {s.parts.map((p, i) => <li key={p.title}><Reveal delay={i * 100} kind="right"><h3>{p.title}</h3><p>{p.body}</p></Reveal></li>)}
        </ol>
      </div></section>

      {s.dept && (
        <section className="block band"><div className="wrap">
          <SectionHead eyebrow="Prices" title={`${DEPT_NAME[s.dept]} price list`} action={<Link className="btn btn-ghost" href="/tests">All departments</Link>} />
          <Suspense><Catalogue dept={s.dept} pageSize={8} /></Suspense>
        </div></section>
      )}

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="More from Medcloud" title="Other services" />
        <div className="link-cards">
          {others.map((o, i) => <Reveal key={o.slug} delay={i * 80}><Link className="link-card" href={`/services/${o.slug}`}><b>{o.name}</b><span>{o.short}</span><span className="arrow" aria-hidden="true">→</span></Link></Reveal>)}
        </div>
      </div></section>
      <Cta />
    </>
  );
}
