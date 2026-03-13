import type { MetadataRoute } from "next";
import { recall } from "@/lib/memory";

/**
 * Dynamic Sitemap Generator
 * 
 * Queries the Pinecone God-Brain for all programmatic SEO pages
 * and generates a valid sitemap.xml for Google indexing.
 * This ensures every AI-generated local page gets crawled and ranked.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://omnia-os.vercel.app";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/demo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/portal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  // Dynamic programmatic SEO routes from the God-Brain
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const pages = await recall("PROGRAMMATIC_PAGE_DATA", 50);
    dynamicRoutes = pages
      .filter(p => p.entry.metadata.type === "programmatic-page" && p.entry.metadata.path)
      .map(p => ({
        url: `${baseUrl}${p.entry.metadata.path}`,
        lastModified: new Date(p.entry.metadata.timestamp || new Date().toISOString()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch (e) {
    console.error("[Sitemap] Failed to query God-Brain for dynamic routes:", e);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
