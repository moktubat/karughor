import { Suspense } from 'react';
import ProductDetails from '@/components/page/productDetails/ProductDetails';
import ProductDetailsSkeleton from '@/components/page/productDetails/ProductDetailsSkeleton';

export default function ProductDetailsPage() {
    return (
        <Suspense fallback={<ProductDetailsSkeleton />}>
            <ProductDetails />
        </Suspense>
    );
}