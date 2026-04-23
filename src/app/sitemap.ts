import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://karughor.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ];

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products?limit=200`,
            { next: { revalidate: 3600 } }
        );
        const data = await res.json();
        const products: MetadataRoute.Sitemap = (data?.data?.products || []).map((p: any) => ({
            url: `${BASE_URL}/products/${p._id}`,
            lastModified: new Date(p.updatedAt || p.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        return [...staticRoutes, ...products];
    } catch {
        return staticRoutes;
    }
}