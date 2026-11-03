import type { MetadataRoute } from "next";
import { readContent } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3007";
  const { projects } = await readContent();

  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/work`, changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((p) => ({
      url: `${base}/work/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
