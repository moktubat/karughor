import Register from "@/components/page/register/Register";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Create Account — Karughor',
    description: 'Join Karughor and start shopping authentic handicrafts products from Bangladesh.',
};

const page = () => {
    return (
        <div>
            <Register />
        </div>
    );
};

export default page;