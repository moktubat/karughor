import { Suspense } from 'react';
import ProductDetails from '@/components/page/productDetails/ProductDetails';
import ProductDetailsSkeleton from '@/components/page/productDetails/ProductDetailsSkeleton';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://karughor.vercel.app';

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
            { next: { revalidate: 3600 } }
        );
        const data = await res.json();
        const product = data?.data?.product;

        if (!product) return { title: 'Product — Karughor' };

        const description = product.description?.slice(0, 160) || 'Handicrafts product from Bangladesh. Shop at Karughor.';
        const image = product.images?.[0];

        return {
            title: product.name,
            description,
            openGraph: {
                title: `${product.name} — Karughor`,
                description,
                url: `${BASE_URL}/products/${id}`,
                siteName: 'Karughor',
                images: image ? [{ url: image, width: 800, height: 800, alt: product.name }] : [],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: product.name,
                description,
                images: image ? [image] : [],
            },
        };
    } catch {
        return { title: 'Product — Karughor' };
    }
}

export default function ProductDetailsPage() {
    return (
        <Suspense fallback={<ProductDetailsSkeleton />}>
            <ProductDetails />
        </Suspense>
    );
}