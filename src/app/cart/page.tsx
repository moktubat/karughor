import Cart from "@/components/page/cart/Cart";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Your Cart — Karughor',
    description: 'Review your selected handicrafts products and proceed to checkout.',
};

const page = () => {
    return (
        <div>
            <Cart /> 
        </div>
    );
};

export default page;