import axios from 'axios';
import { BASE_API_URL } from '@/config/env';
import { getAdminToken, getUserToken, removeAdminToken } from './authService';

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/admin/login') ||
      url.includes('/auth/register');
    
    if (isAuthRoute) return config;
    
    const token = getAdminToken() || getUserToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    
    if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAdminToken();
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        window.location.replace('/admin/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;