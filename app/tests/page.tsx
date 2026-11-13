import type { Metadata } from "next";
import { Suspense } from "react";
import Catalogue from "@/components/Catalogue";
import { Cta, PageHead } from "@/components/Sections";
import { TESTS } from "@/lib/data";

export const metadata: Metadata = { title: "Tests & prices", description: `Price list for all ${TESTS.length} Medcloud pathology and radiology tests.` };

export default function TestsPage() {
  return (
    <>
      <PageHead shape="dna" eyebrow="Tests & prices" title="Every test, with its price" lede={`All ${TESTS.length} tests and scans Medcloud offers. Add what your doctor prescribed and send us the list.`} />
      <section className="block"><div className="wrap"><Suspense><Catalogue pageSize={25} /></Suspense></div></section>
      <Cta />
    </>
  );
}
