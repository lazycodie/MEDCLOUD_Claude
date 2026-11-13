import type { Metadata } from "next";
import { Cta, PackageGrid, PageHead, Steps } from "@/components/Sections";

export const metadata: Metadata = { title: "Health packages", description: "Annual Health Checkup, Essential Package and Major Surgical Profile at Medcloud. Annual health packages start at ₹999*." };

export default function PackagesPage() {
  return (
    <>
      <PageHead eyebrow="Health packages" title="Checkups, bundled" lede="Annual health packages start at ₹999*. Call +91 81508 15026 for the current price of each package." />
      <section className="block"><div className="wrap"><PackageGrid /></div></section>
      <section className="block band"><div className="wrap">
        <div className="sec-head"><div><p className="eyebrow">How booking works</p><h2>Three steps, no account needed</h2></div></div>
        <Steps />
      </div></section>
      <Cta />
    </>
  );
}
