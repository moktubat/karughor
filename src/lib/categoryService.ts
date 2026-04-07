import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://karughor-backend.onrender.com/api';

export interface SubCategory {
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    description?: string;
    isActive: boolean;
    sortOrder: number;
    subCategories: SubCategory[];
}

// Public
export const categoryService = {
    getAll: async (): Promise<Category[]> => {
        const res = await axios.get(`${API_URL}/categories`);
        return res.data.data.categories;
    },

    getBySlug: async (slug: string): Promise<Category> => {
        const res = await axios.get(`${API_URL}/categories/${slug}`);
        return res.data.data.category;
    },
};