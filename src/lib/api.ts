import axios from 'axios';
import { BASE_API_URL } from '@/config/env';
import { getAdminToken, removeAdminToken } from './authService';

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true, // ✅ keep this (for cookies)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = getAdminToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 🔥 IMPORTANT
    }

    console.log('📤 Request:', config.url);
    console.log('🔑 Token:', token);

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);

    // 🔥 Handle unauthorized
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized → removing token');

      removeAdminToken();

      // Optional: redirect to login (client side only)
      if (typeof window !== 'undefined') {
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;