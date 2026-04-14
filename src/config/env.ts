const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ NEXT_PUBLIC_API_URL not set. Using fallback.');
    } else {
        throw new Error('❌ NEXT_PUBLIC_API_URL is required in production');
    }
}

export const BASE_API_URL =
    API_URL || 'https://karughor-backend.onrender.com/api';