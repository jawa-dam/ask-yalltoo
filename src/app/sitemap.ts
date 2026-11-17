import type { MetadataRoute } from "next";
import { getAllDocuments } from "@/lib/knowledge";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ask.yalltoo.com";

  const docs = getAllDocuments();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0, changeFrequency: "weekly" },
    { url: `${baseUrl}/library`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${baseUrl}/methodology`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/knowledge-map`, lastModified: new Date(), priority: 0.8, changeFrequency: "monthly" },
  ];

  const docPages: MetadataRoute.Sitemap = docs.map((doc) => ({
    url: `${baseUrl}/library/${doc.slug}`,
    lastModified: doc.lastUpdated !== "unknown" ? new Date(doc.lastUpdated) : new Date(),
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...docPages];
}
