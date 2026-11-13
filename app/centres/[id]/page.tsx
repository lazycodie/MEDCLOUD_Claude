import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookButton } from "@/components/Buttons";
import { Reveal } from "@/components/Motion";
import { Cta, PageHead, SectionHead } from "@/components/Sections";
import { CENTRES, PHONE_DISPLAY, SERVICES, TEL, WHATSAPP } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => CENTRES.map((c) => ({ id: c.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const c = CENTRES.find((x) => x.id === id);
  return c ? { title: `Medcloud ${c.name} — diagnostic centre`, description: `Medcloud diagnostic centre in ${c.name}: ${c.address}. Directions, phone and booking.`, alternates: { canonical: `/centres/${c.id}` } } : {};
}

export default async function CentrePage({ params }: Props) {
  const { id } = await params;
  const c = CENTRES.find((x) => x.id === id);
  if (!c) notFound();
  return (
    <>
      <PageHead eyebrow={c.main ? "Main centre" : "Centre"} title={`Medcloud ${c.name}`} lede={c.address} crumbs={[{ href: "/centres", label: "Centres" }]}>
        <div className="head-acts">
          <a className="btn btn-primary" href={c.map} target="_blank" rel="noopener">Get directions</a>
          <BookButton className="btn btn-ghost" preset={{ mode: "centre", centre: c.id }}>Book at {c.name}</BookButton>
        </div>
      </PageHead>
      <section className="block"><div className="wrap">
        <dl className="facts">
          <Reveal><div className="fact"><dt>Address</dt><dd>{c.address}</dd></div></Reveal>
          <Reveal delay={60}><div className="fact"><dt>Phone</dt><dd><a className="sec-link" href={TEL}>{PHONE_DISPLAY}</a></dd></div></Reveal>
          <Reveal delay={120}><div className="fact"><dt>WhatsApp</dt><dd><a className="sec-link" href={WHATSAPP} target="_blank" rel="noopener">Chat with Medcloud</a></dd></div></Reveal>
          <Reveal delay={180}><div className="fact"><dt>Opening hours</dt><dd>Call to confirm today’s hours.</dd></div></Reveal>
          <Reveal delay={240}><div className="fact"><dt>Scans at this centre</dt><dd>Call to check which scans are offered here before you travel.</dd></div></Reveal>
          <Reveal delay={300}><div className="fact"><dt>Home collection</dt><dd>Available around {c.name}, subject to area and time of day.</dd></div></Reveal>
        </dl>
      </div></section>
      <section className="block tint"><div className="wrap">
        <SectionHead eyebrow="Services" title={<>What Medcloud <em>offers.</em></>} />
        <div className="link-cards four">
          {SERVICES.map((s, i) => <Reveal key={s.slug} delay={i * 70}><Link className="link-card" href={`/services/${s.slug}`}><b>{s.name}</b><span>{s.short}</span><span className="arrow" aria-hidden="true">→</span></Link></Reveal>)}
        </div>
      </div></section>
      <Cta />
    </>
  );
}
