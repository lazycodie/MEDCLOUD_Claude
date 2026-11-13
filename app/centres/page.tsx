import type { Metadata } from "next";
import Centres from "@/components/Centres";
import { Cta, PageHead } from "@/components/Sections";

export const metadata: Metadata = { title: "Centres", description: "Medcloud centres in Mandya, Malavalli, Kunigal and Ramanagara, with addresses and directions." };

export default function CentresPage() {
  return (
    <>
      <PageHead eyebrow="Centres" title="Four centres across south Karnataka" lede="Between Bengaluru and Mysuru, close to where our patients live. Or stay home and we collect your sample in 30 minutes." />
      <section className="block"><div className="wrap"><Centres /></div></section>
      <Cta />
    </>
  );
}
