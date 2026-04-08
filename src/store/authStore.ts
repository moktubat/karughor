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

interface Admin {
    id: string;
    fullName: string;
    email: string;
    role: 'super_admin' | 'admin';
    profileImage?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
    admin: Admin | null;
    isAdminAuthenticated: boolean;
    setAdmin: (admin: Admin | null) => void;
    adminLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user_token');
                }
                set({ user: null, isAuthenticated: false });
            },

            admin: null,
            isAdminAuthenticated: false,
            setAdmin: (admin) => set({ admin, isAdminAuthenticated: !!admin }),
            adminLogout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('admin_token');
                }
                set({ admin: null, isAdminAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
