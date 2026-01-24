'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/lib/authService';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        // Check if token exists
        const hasToken = authService.isAuthenticated();

        if (!hasToken && !isAuthenticated) {
            console.log('🔒 [AuthGuard] No auth, redirecting to login');
            router.replace('/login?redirect=/profile');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated && !authService.isAuthenticated()) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-600">Checking authentication...</div>
            </div>
        );
    }

    return <>{children}</>;
}