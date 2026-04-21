'use client';

import ForgotPassword from "@/components/page/forgotPassword/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Forgot Password — Karughor',
    description: 'Reset your Karughor account password.',
};

const page = () => {
    return (
        <div>
            <ForgotPassword />
        </div>
    );
};

export default page;