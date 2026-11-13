import type { Metadata } from "next";
import { Reveal } from "@/components/Motion";
import { Cta, FoundersBig, PageHead, SectionHead, Stats, Triangle, Why } from "@/components/Sections";

export const metadata: Metadata = { title: "About", description: "Medcloud is a leading healthcare service provider specializing in advanced radiology and pathology in tier 2 and tier 3 cities." };

const FIRSTS = [
  "Pioneering advanced diagnostics set up in tier 2 and tier 3 cities",
  "Medcloud offers holistic, affordable, and quality healthcare services",
  "First fetal imaging center in Mandya to conduct fetal interventions",
];

export default function AboutPage() {
  return (
    <>
      <PageHead shape="cell" eyebrow="About Medcloud" title="Advanced diagnostics, closer to home" lede="Medcloud is a leading Healthcare service provider in India, specializing in advanced radiology and pathology solutions equipped with state of the art facilities." />
      <Stats />

      <section className="block"><div className="wrap story-grid">
        <Reveal><p className="story-lead">We provide high-quality and accessible services that positively transform lives by providing easy access to vital comprehensive healthcare.</p></Reveal>
        <Reveal delay={120}><p className="story-body">Medcloud is a trusted choice among physicians and a preferred partner for continuous patient support throughout their healthcare journey. About 3000 cases and patients come through our four centres each month, looked after by 20 expert staff.</p></Reveal>
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="What sets us apart" title="Three things we did first" />
        <ol className="firsts">{FIRSTS.map((f, i) => <li key={f}><Reveal delay={i * 110}><span>{String(i + 1).padStart(2, "0")}</span><p>{f}</p></Reveal></li>)}</ol>
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Vision" title="The golden triangle of healthcare" lede="At Medcloud, we strive to integrate the golden triangle of healthcare standards by providing Affordability, Accessibility, and Quality." />
        <Triangle />
      </div></section>

      <section className="block"><div className="wrap mission">
        <Reveal><p className="eyebrow">Mission</p><p className="mission-text">Medcloud is a comprehensive healthcare provider, that equips its community with the benefits of the most advanced medical technologies combined with highly professional and qualified service providers.</p></Reveal>
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Founders" title="Meet the founders" />
        <FoundersBig />
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Why choose us" title="What you can expect at Medcloud" />
        <Why />
      </div></section>
      <Cta />
    </>
  );
}
