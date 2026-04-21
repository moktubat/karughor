import { Suspense } from 'react';
import { Metadata } from 'next';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
    title: 'My Profile — Karughor',
    description: 'Manage your account, view orders and wishlist.',
};

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-[#818B9C]">Loading profile...</div>
            </div>
        }>
            <ProfileClient />
        </Suspense>
    );
}