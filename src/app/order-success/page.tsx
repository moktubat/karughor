import { Suspense } from "react";
import OrderSuccessPage from "./OrderSuccessPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Order Confirmed — Karughor',
    description: 'Your order has been placed successfully. Thank you for shopping handicrafts from Bangladesh.',
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading order...</div>}>
            <OrderSuccessPage />
        </Suspense>
    );
}