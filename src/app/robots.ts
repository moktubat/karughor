import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/checkout', '/cart', '/profile', '/order-success'],
        },
        sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://karughor.vercel.app'}/sitemap.xml`,
        host: 'https://karughor.vercel.app',
    };
}