'use client';

import { Suspense } from "react";
import Checkout from "@/components/page/checkout/Checkout";

const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Checkout />
        </Suspense>
    );
};

export default page;