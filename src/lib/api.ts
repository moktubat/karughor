import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://karughor-backend.onrender.com/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const isLoginPage = path === '/login' || path === '/admin/login';
        if (!isLoginPage) {
          const isAdminRoute = path.startsWith('/admin');
          window.location.href = isAdminRoute ? '/admin/login' : '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;