import axios from 'axios';
import { BASE_API_URL } from '@/config/env';
import { getAdminToken, getUserToken, removeAdminToken } from './authService';

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const url = config.url || '';

    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/admin/login') ||
      url.includes('/auth/register');

    if (isAuthRoute) return config;

    // ✅ Always prefer admin token
    const token = getAdminToken() || getUserToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAdminToken();

      if (typeof window !== 'undefined') {
        const path = window.location.pathname;

        if (path.startsWith('/admin')) {
          window.location.replace('/admin/login');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;