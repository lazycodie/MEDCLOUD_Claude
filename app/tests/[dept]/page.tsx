import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Catalogue from "@/components/Catalogue";
import { Cta, PageHead } from "@/components/Sections";
import { DEPTS, TESTS } from "@/lib/data";

type Props = { params: Promise<{ dept: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => DEPTS.map((d) => ({ dept: d.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dept } = await params;
  const d = DEPTS.find((x) => x.slug === dept);
  return d ? { title: `${d.name} tests & prices`, description: d.blurb } : {};
}

export default async function DeptPage({ params }: Props) {
  const { dept } = await params;
  const d = DEPTS.find((x) => x.slug === dept);
  if (!d) notFound();
  const count = TESTS.filter((t) => t.dept === d.slug).length;
  return (
    <>
      <PageHead eyebrow={`${count} tests`} title={d.name} lede={d.blurb} crumbs={[{ href: "/tests", label: "Tests & prices" }]} />
      <section className="block"><div className="wrap"><Suspense><Catalogue dept={d.slug} pageSize={25} /></Suspense></div></section>
      <Cta />
    </>
  );
}
