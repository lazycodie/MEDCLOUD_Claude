import Link from "next/link";
import { BookButton } from "@/components/Buttons";
import Centres from "@/components/Centres";
import HeroSearch from "@/components/HeroSearch";
import { DeptBento, Faq, Marquee, PriceTabs } from "@/components/HomeSections";
import { Reveal, Spotlight } from "@/components/Motion";
import { About, Cta, HomeCollectionBand, PackageGrid, PopularSlip, SectionHead, Services, Stats, Steps, Why } from "@/components/Sections";
import { CONCERNS, PHONE_DISPLAY, TEL, TESTS } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Spotlight className="hero">
        <span className="hero-shape s1" aria-hidden="true" /><span className="hero-shape s2" aria-hidden="true" /><span className="hero-shape s3" aria-hidden="true" />
        <div className="wrap">
          <div className="hero-copy">
            <p className="eyebrow">Pathology · Radiology · Mandya, Malavalli, Kunigal, Ramanagara</p>
            <h1><span className="line"><span>Find your test.</span></span><span className="line"><span>See the price.</span></span><span className="line"><span><em>Book in a minute.</em></span></span></h1>
            <p className="lede">Medcloud brings advanced radiology and pathology to tier 2 and tier 3 cities. Every price is listed upfront, and we can collect your sample at home.</p>
            <HeroSearch />
            <div className="concerns">
              <span>Browse by concern</span>
              {Object.keys(CONCERNS).map((c) => <Link key={c} className="chip" href={`/tests?concern=${c}`}>{c}</Link>)}
            </div>
            <div className="hero-cta">
              <BookButton className="btn btn-amber" preset={{ mode: "home" }}>Book home collection</BookButton>
              <a className="btn btn-onnavy" href={TEL}>Call {PHONE_DISPLAY}</a>
            </div>
          </div>
          <div className="hero-side">
            <PopularSlip />
            <span className="float f1"><span className="pulse" />Home pickup in 30 min</span>
            <span className="float f2">3T MRI · MDCT · Ultrasound</span>
          </div>
        </div>
      </Spotlight>
      <Marquee />
      <Stats />

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Departments" title="Nine departments, one price list" lede={`${TESTS.length} tests and scans, each with its price. Pick a department to see everything in it.`} action={<Link className="btn btn-ghost" href="/tests">Open full price list</Link>} />
        <DeptBento />
      </div></section>

      <section className="block band"><div className="wrap">
        <SectionHead eyebrow="Quick picks" title="What are you testing for?" lede="Common tests grouped the way patients ask for them." />
        <Reveal><PriceTabs /></Reveal>
      </div></section>

      <HomeCollectionBand />

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Health packages" title="Checkups, bundled" lede="Annual health packages start at ₹999*. Call us for the current price of each package." action={<Link className="btn btn-ghost" href="/packages">Compare packages</Link>} />
        <PackageGrid />
      </div></section>

      <section className="block band"><div className="wrap">
        <SectionHead eyebrow="Services" title="One place for lab tests, scans and specialists" />
        <Services />
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="How booking works" title="Three steps, no account needed" />
        <Steps />
      </div></section>

      <section className="block band"><div className="wrap">
        <SectionHead eyebrow="Why Medcloud" title="Why patients and doctors choose us" />
        <Why />
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Centres" title="Four centres across south Karnataka" lede="Between Bengaluru and Mysuru, close to where our patients live." action={<Link className="btn btn-ghost" href="/centres">All centres</Link>} />
        <Reveal><Centres /></Reveal>
      </div></section>

      <section className="block band"><div className="wrap"><About /></div></section>

      <section className="block"><div className="wrap faq-wrap">
        <SectionHead eyebrow="Questions" title="Before you book" lede="Still unsure? Call +91 81508 15026 and we’ll help." />
        <Faq />
      </div></section>
      <Cta />
    </>
  );
}
