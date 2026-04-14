import api from '@/lib/api';

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
        const res = await api.get('/categories');
        return res.data.data.categories;
    },

    getBySlug: async (slug: string): Promise<Category> => {
        const res = await api.get(`/categories/${slug}`);
        return res.data.data.category;
    },
};