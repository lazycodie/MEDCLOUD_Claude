import type { MetadataRoute } from "next";
import { CENTRES, DEPTS, SERVICES, TESTS } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://medcloud-v2.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/tests", "/packages", "/services", "/centres", "/about", "/contact",
    ...DEPTS.map((d) => `/tests/${d.slug}`), ...SERVICES.map((s) => `/services/${s.slug}`), ...CENTRES.map((c) => `/centres/${c.id}`), ...TESTS.map((t) => `/tests/${t.id}`)];
  return paths.map((p) => ({ url: BASE + p }));
}
