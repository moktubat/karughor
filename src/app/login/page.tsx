import { Suspense } from 'react';
import Login from '@/components/page/login/login';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login — Karughor',
    description: 'Log in to your Karughor account to track orders and manage your wishlist.',
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <Login />
        </Suspense>
    );
}
