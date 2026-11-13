import { Suspense } from "react";
import Link from "next/link";
import { BookButton } from "@/components/Buttons";
import Catalogue from "@/components/Catalogue";
import Centres from "@/components/Centres";
import HeroSearch from "@/components/HeroSearch";
import { About, Cta, PackageGrid, PopularSlip, Services, Stats, Steps } from "@/components/Sections";
import { CONCERNS, PHONE_DISPLAY, TEL } from "@/lib/data";

export default function Home() {
  return (
    <>
      <section className="hero"><div className="wrap">
        <div>
          <p className="eyebrow">Pathology · Radiology · Mandya, Malavalli, Kunigal, Ramanagara</p>
          <h1>Find your test.<br />See the price.<br /><em>Book in a minute.</em></h1>
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
        <PopularSlip />
      </div></section>
      <Stats />

      <section className="block"><div className="wrap">
        <div className="sec-head"><div>
          <p className="eyebrow">Tests &amp; prices</p>
          <h2>Every test, with its price</h2>
          <p>Pick a department or search by name. Add what your doctor prescribed and send us the list.</p>
        </div><Link className="btn btn-ghost" href="/tests">Open full price list</Link></div>
        <Suspense><Catalogue pageSize={8} /></Suspense>
      </div></section>

      <section className="block band"><div className="wrap">
        <div className="sec-head"><div>
          <p className="eyebrow">Health packages</p>
          <h2>Checkups, bundled</h2>
          <p>Annual health packages start at ₹999*. Call us for the current price of each package.</p>
        </div><a className="btn btn-ghost" href={TEL}>Call for package prices</a></div>
        <PackageGrid />
      </div></section>

      <section className="block"><div className="wrap">
        <div className="sec-head"><div><p className="eyebrow">Services</p><h2>One place for lab tests, scans and specialists</h2></div></div>
        <Services />
      </div></section>

      <section className="block band"><div className="wrap">
        <div className="sec-head"><div><p className="eyebrow">How booking works</p><h2>Three steps, no account needed</h2></div></div>
        <Steps />
      </div></section>

      <section className="block"><div className="wrap">
        <div className="sec-head"><div><p className="eyebrow">Centres</p><h2>Four centres across south Karnataka</h2><p>Between Bengaluru and Mysuru, close to where our patients live.</p></div></div>
        <Centres />
      </div></section>

      <section className="block band"><div className="wrap"><About /></div></section>
      <Cta />
    </>
  );
}
