import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://sovereign-matrix.com";

    // Static God-Brain structural routes
    const routes = [
        "",
        "/dashboard/onboarding",
        "/scan",
        "/docs"
    ];

    const sitemapData = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1.0 : 0.8,
    }));

    return sitemapData;
}
