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

export const authService = {
    // User Registration
    register: async (data: RegisterData) => {
        const response = await api.post('/auth/register', data);
        if (response.data.success && response.data.data.user) {
            useAuthStore.getState().setUser(response.data.data.user);
        }
        return response.data;
    },

    // User Login
    login: async (data: LoginData) => {
        const response = await api.post('/auth/login', data);
        if (response.data.success && response.data.data.user) {
            useAuthStore.getState().setUser(response.data.data.user);
        }
        return response.data;
    },

    // User Logout
    logout: async () => {
        const response = await api.post('/auth/logout');
        useAuthStore.getState().logout();
        return response.data;
    },

    // Admin Login
    adminLogin: async (data: AdminLoginData) => {
        const response = await api.post('/auth/admin/login', data);
        return response.data;
    },

    // Admin Logout
    adminLogout: async () => {
        const response = await api.post('/auth/admin/logout');
        return response.data;
    },
};