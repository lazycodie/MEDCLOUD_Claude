import type { Metadata } from "next";
import { About, Cta, PageHead, SectionHead, Stats, Why } from "@/components/Sections";

export const metadata: Metadata = { title: "About", description: "Medcloud is a leading healthcare service provider specializing in advanced radiology and pathology in tier 2 and tier 3 cities." };

export default function AboutPage() {
  return (
    <>
      <PageHead eyebrow="About" title="Advanced diagnostics, closer to home" lede="Medcloud is a leading Healthcare service provider in India, specializing in advanced radiology and pathology solutions equipped with state of the art facilities." />
      <Stats />
      <section className="block"><div className="wrap"><About /></div></section>
      <section className="block band"><div className="wrap">
        <SectionHead eyebrow="Why choose us" title="What you can expect at Medcloud" />
        <Why />
      </div></section>
      <Cta />
    </>
  );
}
