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
        try {
            const response = await api.post('/auth/register', data);
            if (response.data.success && response.data.data.user) {
                useAuthStore.getState().setUser(response.data.data.user);
            }
            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    // User Login
    login: async (data: LoginData) => {
        try {
            const response = await api.post('/auth/login', data);
            if (response.data.success && response.data.data.user) {
                useAuthStore.getState().setUser(response.data.data.user);
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // User Logout - Fixed version
    logout: async () => {
        try {
            // Try to call logout endpoint, but don't wait for it
            api.post('/auth/logout').catch(err => {
                console.log('Logout API call failed (non-critical):', err);
            });

            // Clear local state immediately
            useAuthStore.getState().logout();

            // Clear cookies manually
            document.cookie = 'user_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            return { success: true };
        } catch (error) {
            // Even if API call fails, clear local state
            useAuthStore.getState().logout();
            document.cookie = 'user_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            throw error;
        }
    },

    // Admin Login
    adminLogin: async (data: AdminLoginData) => {
        try {
            const response = await api.post('/auth/admin/login', data);
            return response.data;
        } catch (error) {
            console.error('Admin login error:', error);
            throw error;
        }
    },

    // Admin Logout - Fixed version
    adminLogout: async () => {
        try {
            // Try to call logout endpoint, but don't wait for it
            api.post('/auth/admin/logout').catch(err => {
                console.log('Admin logout API call failed (non-critical):', err);
            });

            // Clear cookies manually
            document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            return { success: true };
        } catch (error) {
            document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            throw error;
        }
    },
};