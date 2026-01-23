import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    profileImage?: string;
    address?: {
        street?: string;
        area?: string;
        city?: string;
        deliveryLocation?: 'inside_dhaka' | 'outside_dhaka';
    };
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

