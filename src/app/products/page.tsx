import { Suspense } from "react";
import Products from "@/components/page/products/Products";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading products...</div>}>
            <Products />
        </Suspense>
    );
}