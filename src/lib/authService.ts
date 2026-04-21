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

const USER_TOKEN_KEY = 'user_token';
const ADMIN_TOKEN_KEY = 'admin_token';

export const getUserToken = (): string | null =>
    typeof window !== 'undefined' ? localStorage.getItem(USER_TOKEN_KEY) : null;

export const getAdminToken = (): string | null =>
    typeof window !== 'undefined' ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;

export const setAdminToken = (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const removeAdminToken = () => {
    if (typeof window !== 'undefined') localStorage.removeItem(ADMIN_TOKEN_KEY);
};

const clearCookieFallback = (name: string) => {
    if (typeof document !== 'undefined') {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure`;
    }
};

export const adminAuthHeaders = (): Record<string, string> => {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authService = {
    register: async (data: RegisterData) => {
        const response = await api.post('/auth/register', data, { withCredentials: true });
        if (response.data.success) {
            useAuthStore.getState().setUser(response.data.data?.user);
        }
        return response.data;
    },

    login: async (data: LoginData) => {
        const response = await api.post('/auth/login', data, { withCredentials: true });
        const res = response.data;
        const token = res?.data?.token || res?.token;
        if (res.success && token) {
            localStorage.setItem(USER_TOKEN_KEY, token);
            useAuthStore.getState().setUser(res.data?.user || res.user);
        }
        return res;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout', {}, { withCredentials: true });
        } catch {
        } finally {
            localStorage.removeItem(USER_TOKEN_KEY);
            clearCookieFallback('user_token');
            useAuthStore.getState().logout();
        }
        return { success: true };
    },

    adminLogin: async (data: AdminLoginData) => {
        const response = await api.post('/auth/admin/login', data, { withCredentials: true });
        const res = response.data;
        const token = res?.data?.token;
        if (res.success && token) {
            localStorage.setItem(ADMIN_TOKEN_KEY, token);
            useAuthStore.getState().setAdmin(res.data.admin);
        }
        return res;
    },

    adminLogout: async () => {
        try {
            await api.post('/auth/admin/logout').catch(() => {});
        } finally {
            removeAdminToken();
            clearCookieFallback('admin_token');
            useAuthStore.getState().adminLogout();
        }
        return { success: true };
    },

    isAuthenticated: () => !!getUserToken(),
    isAdminAuthenticated: () => !!getAdminToken(),

    getUserToken,
    getAdminToken,
};