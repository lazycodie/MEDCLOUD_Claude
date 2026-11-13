import type { Metadata } from "next";
import { Cta, PageHead, Services, Stats } from "@/components/Sections";

export const metadata: Metadata = { title: "Services", description: "Home sample collection, diagnostic lab, imaging centres with 3T MRI, MDCT and ultrasound, and specialist consultation." };

export default function ServicesPage() {
  return (
    <>
      <PageHead eyebrow="Services" title="One place for lab tests, scans and specialists" lede="High-quality services focused on preventing and accurately detecting disease, with cutting-edge technology and stringent quality control." />
      <Stats />
      <section className="block"><div className="wrap"><Services /></div></section>
      <Cta />
    </>
  );
}
