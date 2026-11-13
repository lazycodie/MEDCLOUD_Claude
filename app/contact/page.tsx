import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { Faq } from "@/components/HomeSections";
import { Reveal } from "@/components/Motion";
import { PageHead, SectionHead } from "@/components/Sections";
import { CENTRES, PHONE_DISPLAY, TEL, WHATSAPP } from "@/lib/data";

export const metadata: Metadata = { title: "Contact", description: "Call or WhatsApp Medcloud on +91 81508 15026, email hello@medcloudlabs.com, or visit a centre in Mandya, Malavalli, Kunigal or Ramanagara." };

export default function ContactPage() {
  return (
    <>
      <PageHead eyebrow="Contact" title="Send us a message" lede="Home collection in 30 minutes, call us now. Or leave your number and we’ll call you back." />
      <section className="block"><div className="wrap contact-grid">
        <Reveal><div className="paper contact-card"><ContactForm /></div></Reveal>
        <div className="contact-side">
          <Reveal kind="right"><a className="contact-row" href={TEL}><small>Call us</small><b>{PHONE_DISPLAY}</b><span className="arrow" aria-hidden="true">→</span></a></Reveal>
          <Reveal kind="right" delay={70}><a className="contact-row" href={WHATSAPP} target="_blank" rel="noopener"><small>WhatsApp</small><b>Chat with Medcloud</b><span className="arrow" aria-hidden="true">→</span></a></Reveal>
          <Reveal kind="right" delay={140}><a className="contact-row" href="mailto:hello@medcloudlabs.com"><small>Email us</small><b>hello@medcloudlabs.com</b><span className="arrow" aria-hidden="true">→</span></a></Reveal>
          <Reveal kind="right" delay={210}><a className="contact-row" href="mailto:marketing@medcloudlabs.com"><small>Partnerships</small><b>marketing@medcloudlabs.com</b><span className="arrow" aria-hidden="true">→</span></a></Reveal>
          <Reveal kind="right" delay={280}><Link className="contact-row" href="/centres"><small>Our locations</small><b>{CENTRES.map((c) => c.name).join(", ")}</b><span className="arrow" aria-hidden="true">→</span></Link></Reveal>
        </div>
      </div></section>
      <section className="block band"><div className="wrap faq-wrap">
        <SectionHead eyebrow="Questions" title="Before you book" />
        <Faq />
      </div></section>
    </>
  );
}
