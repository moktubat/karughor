export interface Product {
    id: number;
    name: string;
    brand?: string;
    category?: string;
    image: string;
    price?: number;
    originalPrice?: string;
    salePrice: string;
    discount?: string;
    rating?: string;
    sold?: number;
    stock?: number;
    description?: string;
    specifications?: {
        label: string;
        value: string;
    }[];
    inTheBox?: string[];
    systemRequirements?: string[];
}