'use client';

import { AuthGuard } from '@/components/AuthGuard';
import UserProfile from '@/components/page/UserProfile/UserProfile';

export default function ProfileClient() {
    return (
        <AuthGuard>
            <UserProfile />
        </AuthGuard>
    );
}