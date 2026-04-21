import { Suspense } from 'react';
import ProductDetails from '@/components/page/productDetails/ProductDetails';
import ProductDetailsSkeleton from '@/components/page/productDetails/ProductDetailsSkeleton';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;  // <-- Must await params first!

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
            { next: { revalidate: 3600 } }
        );
        const data = await res.json();
        const product = data?.data?.product;

        if (!product) return { title: 'Product — Karughor' };

        return {
            title: product.name, 
            description: product.description?.slice(0, 160) ||
                'Handicrafts product from Bangladesh. Shop at Karughor.',
            openGraph: {
                title: product.name,
                description: product.description?.slice(0, 160),
                images: product.images?.[0] ? [{ url: product.images[0] }] : [],
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