import axios from 'axios';
import { BASE_API_URL } from '@/config/env';

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor (keep simple for now)
api.interceptors.request.use(
  (config) => {
    // You can attach token here later if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (NO redirect here)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 🔥 Only detect — DO NOT redirect
      console.warn('⚠️ Unauthorized request (401)');

      // Optional: you can emit event / clear store here later
      // Example:
      // useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default api;