import Link from "next/link";
import { BookButton } from "@/components/Buttons";
import Centres from "@/components/Centres";
import { Mosaic } from "@/components/Cinema";
import HeroSearch from "@/components/HeroSearch";
import { Faq, Marquee } from "@/components/HomeSections";
import { CountUp, Reveal } from "@/components/Motion";
import Orb from "@/components/Orb";
import { Cta, FoundersBig, PackageTeaser, PopularRows, SectionHead } from "@/components/Sections";
import { DEPTS, PHONE_DISPLAY, SERVICES, TEL, TESTS, deptFrom, deptTests, rupee } from "@/lib/data";

// where the 3D cell sits in each full-screen section: "x,y,scale" in viewport units
const STORY = [
  { slug: "diagnostic", shape: "dna", orb: "-0.42,0.02,0.95", side: "right", title: <>The lab behind<br />the <em>answer.</em></> },
  { slug: "imaging-centres", shape: "scanner", orb: "0.42,-0.04,1.05", side: "left", title: <>See what is<br /><em>beneath.</em></> },
  { slug: "specialist-consultation", shape: "cross", orb: "-0.4,0.06,0.85", side: "right", title: <>A specialist,<br />in the <em>same visit.</em></> },
  { slug: "home-collection", shape: "tube", orb: "0.4,0,1.1", side: "left", title: <>We come to you<br />in <em>30 minutes.</em></> },
] as const;

const TOP_DEPTS = ["radiology", "biochemistry", "haematology", "serology", "hormone-assays"] as const;

export default function Home() {
  return (
    <>
      <Orb />

      <section className="hero5" data-orb="0.5,0.02,1" data-shape="cell">
        <div className="wrap hero5-grid">
          <div className="hero5-copy">
            <p className="kicker">Welcome to Medcloud Diagnostics</p>
            <h1>
              <span className="l"><span>We’ll ensure you</span></span>
              <span className="l"><span>always get the</span></span>
              <span className="l"><span><em>best result.</em></span></span>
            </h1>
            <p className="lede">Advanced radiology and pathology with state of the art facilities. Find your test, see its price, and book in a minute.</p>
            <HeroSearch />
            <div className="hero-cta">
              <BookButton className="btn btn-primary" preset={{ mode: "home" }}>Book home collection</BookButton>
              <Link className="btn btn-ghost" href="/tests">See all {TESTS.length} prices <span className="arrow">→</span></Link>
            </div>
            <ul className="trust">
              <li><b><CountUp value="3000+" /></b>patients each month</li>
              <li><b><CountUp value="350+" /></b>referring doctors</li>
              <li><b><CountUp value="50+" /></b>network hospitals</li>
              <li><b>4</b>centres</li>
            </ul>
          </div>
          <div className="hero5-space" aria-hidden="true" />
        </div>
      </section>

      <Marquee />

      {STORY.map((st, i) => {
        const s = SERVICES.find((x) => x.slug === st.slug)!;
        return (
          <section key={s.slug} className={`story ${st.side}`} data-orb={st.orb} data-shape={st.shape}>
            <div className="wrap">
              <Reveal kind={st.side === "right" ? "left" : "right"} className="story-text">
                <span className="story-n">{String(i + 1).padStart(2, "0")}</span>
                <p className="kicker">{s.name}</p>
                <h2>{st.title}</h2>
                <p className="story-copy">{s.intro[0]}</p>
                <div className="story-pills">{s.pills.map((p) => <span key={p}>{p}</span>)}</div>
                <div className="story-acts">
                  <Link className="btn btn-primary" href={`/services/${s.slug}`}>Explore {s.name.toLowerCase()} <span className="arrow">↗</span></Link>
                  {s.dept && <Link className="story-link" href={`/tests/${s.dept}`}>See prices <span className="arrow">→</span></Link>}
                  {s.slug === "home-collection" && <a className="story-link" href={TEL}>Call {PHONE_DISPLAY} <span className="arrow">→</span></a>}
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      <section className="mosaic-sec">
        <Mosaic image="/field.jpg">
          <div className="m-card m-a" data-mask>
            <h3>{TESTS.length} tests</h3>
            <p>Every price listed upfront</p>
          </div>
          <div className="m-card m-b" data-mask>
            <p>Pick what your doctor prescribed,<br />add it to your list and send it to us.</p>
            <Link className="m-btn" href="/tests">Open the price list</Link>
          </div>
          <div className="m-card m-c" data-mask>
            <h2>Tests &amp;<br />prices</h2>
          </div>
          <div className="m-card m-d" data-mask>
            <div className="m-depts">
              {TOP_DEPTS.map((slug, i) => {
                const d = DEPTS.find((x) => x.slug === slug)!;
                return (
                  <Link key={slug} href={`/tests/${slug}`} className={`m-dept ${i === 0 ? "active" : ""}`}>
                    <span><b>{d.name}</b><small>{deptTests(slug).length} tests · from {rupee(deptFrom(slug))}</small></span>
                    <i>{String(i + 1).padStart(2, "0")}</i>
                  </Link>
                );
              })}
              <Link href="/tests" className="m-dept">
                <span><b>4 more departments</b><small>Clinical pathology, microbiology, histopathology, cytology</small></span>
                <i>→</i>
              </Link>
            </div>
          </div>
        </Mosaic>
      </section>

      <section className="block tint"><div className="wrap split">
        <SectionHead eyebrow="Popular tests" title={<>Small signals.<br /><em>Useful answers.</em></>} lede="The tests patients ask for most, with the price you pay." action={<Link className="btn btn-ghost" href="/tests">All {TESTS.length} tests <span className="arrow">→</span></Link>} />
        <PopularRows />
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Health packages" title={<>Choose a clearer<br /><em>starting point.</em></>} lede="Annual health packages start at ₹999*." action={<Link className="btn btn-ghost" href="/packages">Compare packages <span className="arrow">→</span></Link>} />
        <PackageTeaser />
      </div></section>

      <section className="block tint" id="centres"><div className="wrap">
        <SectionHead eyebrow="Find your centre" title={<>Care,<br /><em>closer to you.</em></>} lede="Four Medcloud centres across south Karnataka, between Bengaluru and Mysuru." action={<Link className="btn btn-ghost" href="/centres">All centres <span className="arrow">→</span></Link>} />
        <Reveal><Centres /></Reveal>
      </div></section>

      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Founders" title={<>Led by a radiologist<br />and a <em>pathologist.</em></>} action={<Link className="btn btn-ghost" href="/about">About Medcloud <span className="arrow">→</span></Link>} />
        <FoundersBig />
      </div></section>

      <section className="block"><div className="wrap faq-wrap">
        <SectionHead eyebrow="Questions" title={<>Before<br />you <em>book.</em></>} lede="Still unsure? Call +91 81508 15026 and we’ll help." />
        <Faq />
      </div></section>
      <Cta />
    </>
  );
}
