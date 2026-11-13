import type { Metadata } from "next";
import { Cta, PackageGrid, PageHead, SectionHead, Steps } from "@/components/Sections";
import { PACKS } from "@/lib/data";

export const metadata: Metadata = { title: "Health packages", description: "Annual Health Checkup, Essential Package and Major Surgical Profile at Medcloud. Annual health packages start at ₹999*." };

const norm = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const ALIAS: Record<string, string> = { "complete blood picture": "complete blood count", "glucose fasting": "fasting blood sugar", "erythrocyte sedimentation rate": "esr", "creatinine": "serum creatinine", "complete urine examination": "complete urine analysis" };
const keyOf = (s: string) => ALIAS[norm(s)] ?? norm(s);

export default function PackagesPage() {
  const rows = new Map<string, { label: string; in: Set<string> }>();
  PACKS.forEach((p) => p.items.forEach((it) => {
    const k = keyOf(it.name);
    if (!rows.has(k)) rows.set(k, { label: it.name, in: new Set() });
    rows.get(k)!.in.add(p.id);
  }));
  return (
    <>
      <PageHead shape="tube" eyebrow="Health packages" title="Checkups, bundled" lede="Annual health packages start at ₹999*. Call +91 81508 15026 for the current price of each package." />
      <section className="block"><div className="wrap"><PackageGrid /></div></section>
      <section className="block"><div className="wrap">
        <SectionHead eyebrow="Compare" title="What each package includes" />
        <div className="cmp-scroll"><table className="cmp">
          <thead><tr><th scope="col">Test</th>{PACKS.map((p) => <th scope="col" key={p.id}>{p.name}</th>)}</tr></thead>
          <tbody>{[...rows.values()].map((r) => (
            <tr key={r.label}><th scope="row">{r.label}</th>{PACKS.map((p) => <td key={p.id}>{r.in.has(p.id) ? <span className="yes" aria-label="Included">✓</span> : <span className="no" aria-label="Not included">–</span>}</td>)}</tr>
          ))}</tbody>
        </table></div>
      </div></section>
      <section className="block"><div className="wrap">
        <SectionHead eyebrow="How booking works" title="Three steps, no account needed" />
        <Steps />
      </div></section>
      <Cta />
    </>
  );
}
