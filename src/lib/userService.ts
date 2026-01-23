import api from './api';

export interface UpdateProfileData {
    fullName: string;
    email?: string;
    address?: {
        street?: string;
        area?: string;
        city?: string;
        deliveryLocation?: 'inside_dhaka' | 'outside_dhaka';
    };
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const userService = {
    // Get user profile
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // Update profile
    updateProfile: async (data: UpdateProfileData) => {
        const response = await api.put('/users/profile', data);
        return response.data;
    },

    // Get wishlist
    getWishlist: async () => {
        const response = await api.get('/users/wishlist');
        return response.data;
    },

    // Add to wishlist
    addToWishlist: async (productId: string) => {
        const response = await api.post(`/users/wishlist/${productId}`);
        return response.data;
    },

    // Remove from wishlist
    removeFromWishlist: async (productId: string) => {
        const response = await api.delete(`/users/wishlist/${productId}`);
        return response.data;
    },

    // Get user orders
    getUserOrders: async (page = 1, limit = 10) => {
        const response = await api.get('/orders/my-orders', {
            params: { page, limit },
        });
        return response.data;
    },
};