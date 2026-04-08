import { Suspense } from "react";
import OrderSuccessPage from "./OrderSuccessPage";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading order...</div>}>
            <OrderSuccessPage />
        </Suspense>
    );
}