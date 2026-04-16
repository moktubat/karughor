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

    // ❌ NEVER attach token for login routes
    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/admin/login') ||
      url.includes('/auth/register');

    if (isAuthRoute) {
      console.log('📤 Auth route (no token attached):', url);
      return config;
    }

    // 🔥 Decide token type
    const isAdminRoute = url.includes('/admin');

    const token = isAdminRoute
      ? getAdminToken()
      : getUserToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('📤 Request:', url);
    console.log('🔑 Token:', token || 'NO TOKEN');

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);

    // 🔥 Handle unauthorized globally
    if (error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized');

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