import Link from "next/link";
import { BookButton } from "@/components/Buttons";
import { HeroCanvas } from "@/components/Fx";
import HeroSearch from "@/components/HeroSearch";
import { DeptBento, Faq, Marquee, PriceTabs } from "@/components/HomeSections";
import { Reveal } from "@/components/Motion";
import { CentreStrip, Cta, FoundersBig, HomeCollectionBand, PackageTeaser, PriceTicker, SectionHead, Services, Stats, Steps, Why } from "@/components/Sections";
import { CONCERNS, PHONE_DISPLAY, TEL, TESTS } from "@/lib/data";

export default function Home() {
  return (
    <>
      <section className="hero3">
        <HeroCanvas />
        <span className="aurora a1" aria-hidden="true" /><span className="aurora a2" aria-hidden="true" /><span className="aurora a3" aria-hidden="true" />
        <div className="wrap">
          <p className="badge"><span className="pulse" />Home sample collection in 30 minutes</p>
          <h1>
            <span className="line"><span>Find your test.</span></span>
            <span className="line"><span>See the <em>price.</em></span></span>
            <span className="line"><span>Book in a minute.</span></span>
          </h1>
          <p className="lede">Medcloud brings advanced radiology and pathology to tier 2 and tier 3 cities. {TESTS.length} tests, every price upfront.</p>
          <HeroSearch />
          <div className="concerns">
            {Object.keys(CONCERNS).map((c) => <Link key={c} className="chip" href={`/tests?concern=${c}`}>{c}</Link>)}
          </div>
          <div className="hero-cta">
            <BookButton className="btn btn-primary" preset={{ mode: "home" }}>Book home collection</BookButton>
            <a className="btn btn-onnavy" href={TEL}>Call {PHONE_DISPLAY}</a>
          </div>
        </div>
        <PriceTicker />
      </section>
      <Stats />
      <Marquee />

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Departments" title="Nine departments, one price list" lede={`${TESTS.length} tests and scans, each with its price. Pick a department to see everything in it.`} action={<Link className="btn btn-ghost" href="/tests">Open full price list</Link>} />
        <DeptBento />
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Quick picks" title="What are you testing for?" lede="Common tests grouped the way patients ask for them." />
        <Reveal><PriceTabs /></Reveal>
      </div></section>

      <HomeCollectionBand />

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Health packages" title="Checkups, bundled" lede="Annual health packages start at ₹999*." action={<Link className="btn btn-ghost" href="/packages">See what each includes</Link>} />
        <PackageTeaser />
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Services" title="Lab tests, scans and specialists in one place" action={<Link className="btn btn-ghost" href="/services">All services</Link>} />
        <Services />
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="How booking works" title="Three steps, no account needed" />
        <Steps />
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Why Medcloud" title="Why patients and doctors choose us" />
        <Why />
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Centres" title="Four centres across south Karnataka" lede="Between Bengaluru and Mysuru, close to where our patients live." action={<Link className="btn btn-ghost" href="/centres">Map and directions</Link>} />
        <CentreStrip />
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Founders" title="Led by a radiologist and a pathologist" action={<Link className="btn btn-ghost" href="/about">About Medcloud</Link>} />
        <FoundersBig />
      </div></section>

      <section className="block"><div className="wrap faq-wrap">
        <SectionHead eyebrow="Questions" title="Before you book" lede="Still unsure? Call +91 81508 15026 and we’ll help." />
        <Faq />
      </div></section>
      <Cta />
    </>
  );
}
