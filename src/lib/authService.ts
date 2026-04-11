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

const TOKEN_KEY = 'user_token';
const ADMIN_TOKEN_KEY = 'admin_token';

const setToken = (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
};
const getToken = (): string | null => {
    if (typeof window !== 'undefined') return localStorage.getItem(TOKEN_KEY);
    return null;
};
const removeToken = () => {
    if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
};
const setAdminToken = (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(ADMIN_TOKEN_KEY, token);
};
const getAdminToken = (): string | null => {
    if (typeof window !== 'undefined') return localStorage.getItem(ADMIN_TOKEN_KEY);
    return null;
};
const removeAdminToken = () => {
    if (typeof window !== 'undefined') localStorage.removeItem(ADMIN_TOKEN_KEY);
};

api.interceptors.request.use(
    (config) => {
        const isAdminRoute = config.url?.includes('/admin');
        const token = isAdminRoute ? getAdminToken() : getToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    register: async (data: RegisterData) => {
        const response = await api.post('/auth/register', data);
        if (response.data.success && response.data.data.user && response.data.data.token) {
            setToken(response.data.data.token);
            useAuthStore.getState().setUser(response.data.data.user);
        }
        return response.data;
    },

    login: async (data: LoginData) => {
        const response = await api.post('/auth/login', data);
        if (response.data.success && response.data.data.user && response.data.data.token) {
            setToken(response.data.data.token);
            useAuthStore.getState().setUser(response.data.data.user);
        }
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout').catch(() => {});
        } finally {
            removeToken();
            useAuthStore.getState().logout();
        }
        return { success: true };
    },

    adminLogin: async (data: AdminLoginData) => {
        const response = await api.post('/auth/admin/login', data);
        if (response.data.success && response.data.data.token && response.data.data.admin) {
            setAdminToken(response.data.data.token);
            useAuthStore.getState().setAdmin(response.data.data.admin);
        }
        return response.data;
    },

    adminLogout: async () => {
        try {
            await api.post('/auth/admin/logout').catch(() => {});
        } finally {
            removeAdminToken();
            useAuthStore.getState().adminLogout();
        }
        return { success: true };
    },

    isAuthenticated: (): boolean => !!getToken(),
    isAdminAuthenticated: (): boolean => !!getAdminToken(),
    getToken,
    getAdminToken,
};