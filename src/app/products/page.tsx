import { Suspense } from "react";
import Products from "@/components/page/products/Products";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'All Products — Karughor Handicrafts Marketplace',
    description: 'Browse our full collection of handicrafts Bangladeshi products — jute rugs, shotoronji, three-piece sets, wall art and more.',
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading products...</div>}>
            <Products />
        </Suspense>
    );
}