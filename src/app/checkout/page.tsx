import { Suspense } from "react";
import Checkout from "@/components/page/checkout/Checkout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Checkout — Karughor',
    description: 'Complete your order. We deliver across Bangladesh with Cash on Delivery.',
};

const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Checkout />
        </Suspense>
    );
};

export default page;