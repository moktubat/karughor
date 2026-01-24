import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('🔵 [API] Initializing API client', {
  baseURL,
  environment: process.env.NODE_ENV
});

const api = axios.create({
  baseURL,
  withCredentials: true, // CRITICAL for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    console.log('📤 [API] Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      withCredentials: config.withCredentials,
      cookies: typeof document !== 'undefined' ? document.cookie : 'SSR'
    });
    return config;
  },
  (error) => {
    console.error('❌ [API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('📥 [API] Response:', {
      status: response.status,
      url: response.config.url,
      setCookie: response.headers['set-cookie'],
      cookies: typeof document !== 'undefined' ? document.cookie : 'SSR'
    });
    return response;
  },
  (error) => {
    console.error('❌ [API] Response Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      console.warn('⚠️ [API] 401 Unauthorized');
      if (typeof window !== 'undefined') {
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        const redirectUrl = isAdminRoute ? '/admin/login' : '/login';
        window.location.href = redirectUrl;
      }
    }

    return Promise.reject(error);
  }
);

export default api;