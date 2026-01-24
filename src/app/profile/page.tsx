import { Suspense } from 'react';
import UserProfile from '@/components/page/UserProfile/UserProfile';
import { AuthGuard } from '@/components/AuthGuard';

export default function Page() {
    return (
        <AuthGuard>
            <Suspense fallback={<div>Loading profile...</div>}>
                <UserProfile />
            </Suspense>
        </AuthGuard>
    );
}