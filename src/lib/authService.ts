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

// ================= TOKEN HELPERS =================
export const getUserToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem(USER_TOKEN_KEY) : null;

export const getAdminToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;

export const setAdminToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
    }
};

export const removeAdminToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
};

// ================= INTERCEPTOR (FIXED) =================
api.interceptors.request.use((config) => {
    const url = config.url || '';

    // ❌ NEVER attach token for login requests
    const isLoginRequest =
        url.includes('/auth/login') ||
        url.includes('/auth/admin/login');

    if (isLoginRequest) return config;

    const isAdminRequest = url.includes('/admin');

    const token = isAdminRequest
        ? getAdminToken()
        : getUserToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// ================= SERVICE =================
export const authService = {
    // ---------- USER ----------
    register: async (data: RegisterData) => {
        const response = await api.post('/auth/register', data, {
            withCredentials: true,
        });

        if (response.data.success) {
            const user = response.data.data?.user;
            useAuthStore.getState().setUser(user);
        }

        return response.data;
    },

    login: async (data: LoginData) => {
        const response = await api.post('/auth/login', data, {
            withCredentials: true,
        });

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
        } finally {
            localStorage.removeItem(USER_TOKEN_KEY);
            useAuthStore.getState().logout();
        }
        return { success: true };
    },

    // ---------- ADMIN ----------
    adminLogin: async (data: AdminLoginData) => {
        const response = await api.post('/auth/admin/login', data, {
            withCredentials: true,
        });

        const res = response.data;

        // SAFE TOKEN EXTRACTION (FIXED BUG)
        const token = res?.data?.token;

        if (res.success && token) {
            localStorage.setItem('admin_token', token);

            useAuthStore.getState().setAdmin(res.data.admin);
        }

        return res;
    },

    adminLogout: async () => {
        try {
            await api.post('/auth/admin/logout').catch(() => { });
        } finally {
            removeAdminToken();
            useAuthStore.getState().adminLogout();
        }
        return { success: true };
    },

    // ---------- HELPERS ----------
    isAuthenticated: () => !!getUserToken(),
    isAdminAuthenticated: () => !!getAdminToken(),

    getUserToken,
    getAdminToken,
};