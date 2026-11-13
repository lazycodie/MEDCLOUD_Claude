import Link from "next/link";
import { PageHead } from "@/components/Sections";

export default function NotFound() {
  return (
    <>
      <PageHead eyebrow="Page not found" title="We couldn’t find that page" lede="The link may be old. The full price list and our centres are one tap away." />
      <section className="block"><div className="wrap" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link className="btn btn-primary" href="/tests">Browse tests &amp; prices</Link>
        <Link className="btn btn-ghost" href="/">Go to home</Link>
      </div></section>
    </>
  );
}
