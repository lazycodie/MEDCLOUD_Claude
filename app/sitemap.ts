import type { MetadataRoute } from "next";
import { DEPTS, SERVICES, TESTS } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://medcloud-v2.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/tests", "/packages", "/services", "/centres", "/about", "/contact",
    ...DEPTS.map((d) => `/tests/${d.slug}`), ...SERVICES.map((s) => `/services/${s.slug}`), ...TESTS.map((t) => `/tests/${t.id}`)];
  return paths.map((p) => ({ url: BASE + p }));
}
