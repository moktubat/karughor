import api from './api';
import { useAuthStore } from '@/store/authStore';

export interface RegisterData {
    fullName: string;
    phone: string;
    email?: string;
    password: string;
    confirmPassword: string;
}

export interface LoginData {
    phone: string;
    password: string;
}

export interface AdminLoginData {
    email: string;
    password: string;
}

// Token storage utilities
const TOKEN_KEY = 'user_token';
const ADMIN_TOKEN_KEY = 'admin_token';

const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
};

const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
    }
};

const setAdminToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
    }
};

const getAdminToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(ADMIN_TOKEN_KEY);
    }
    return null;
};

const removeAdminToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
};

// Add token to all requests
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        const adminToken = getAdminToken();

        // Use admin token for admin routes, user token for others
        const isAdminRoute = config.url?.includes('/admin');
        const authToken = isAdminRoute ? adminToken : token;

        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    // User Registration
    register: async (data: RegisterData) => {
        console.log('🟡 [authService] Register started', { phone: data.phone });
        try {
            const response = await api.post('/auth/register', data);
            console.log('🟢 [authService] Register response:', response.data);

            if (response.data.success && response.data.data.user && response.data.data.token) {
                setToken(response.data.data.token);
                useAuthStore.getState().setUser(response.data.data.user);
            }
            return response.data;
        } catch (error: any) {
            console.error('❌ [authService] Register error:', error);
            throw error;
        }
    },

    // User Login
    login: async (data: LoginData) => {
        console.log('🟡 [authService] Login started', { phone: data.phone });

        try {
            const response = await api.post('/auth/login', data);
            console.log('🟢 [authService] Login response:', response.data);

            if (response.data.success && response.data.data.user && response.data.data.token) {
                console.log('🟡 [authService] Storing token and user...');
                setToken(response.data.data.token);
                useAuthStore.getState().setUser(response.data.data.user);
                console.log('✅ [authService] Token and user stored');
            }

            return response.data;
        } catch (error: any) {
            console.error('❌ [authService] Login error:', error);
            throw error;
        }
    },

    // User Logout
    logout: async () => {
        console.log('🟡 [authService] Logout started');
        try {
            await api.post('/auth/logout').catch(() => { });
            removeToken();
            useAuthStore.getState().logout();
            console.log('✅ [authService] Logout complete');
            return { success: true };
        } catch (error: any) {
            console.error('❌ [authService] Logout error:', error);
            removeToken();
            useAuthStore.getState().logout();
            throw error;
        }
    },

    // Admin Login
    adminLogin: async (data: AdminLoginData) => {
        console.log('🟡 [authService] Admin login started', { email: data.email });

        try {
            const response = await api.post('/auth/admin/login', data);
            console.log('🟢 [authService] Admin login response:', response.data);

            if (response.data.success && response.data.data.token && response.data.data.admin) {
                setAdminToken(response.data.data.token);
                useAuthStore.getState().setAdmin(response.data.data.admin);
                console.log('✅ [authService] Admin token and admin stored');
            }

            return response.data;
        } catch (error: any) {
            console.error('❌ [authService] Admin login error:', error);
            throw error;
        }
    },

    // Admin Logout
    adminLogout: async () => {
        console.log('🟡 [authService] Admin logout started');
        try {
            await api.post('/auth/admin/logout').catch(() => { });
            removeAdminToken();
            useAuthStore.getState().adminLogout();
            console.log('✅ [authService] Admin logout complete');
            return { success: true };
        } catch (error: any) {
            console.error('❌ [authService] Admin logout error:', error);
            removeAdminToken();
            useAuthStore.getState().adminLogout();
            throw error;
        }
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        return !!getToken();
    },

    // Check if admin is authenticated
    isAdminAuthenticated: (): boolean => {
        return !!getAdminToken();
    },

    // Get current token
    getToken,
    getAdminToken,
};