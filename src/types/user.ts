export interface User {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    profileImage?: string;
    address?: {
        street: string;
        area: string;
        city: string;
        deliveryLocation: 'inside_dhaka' | 'outside_dhaka';
    };
    isGuest: boolean;
    wishlist: number[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Admin {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    profileImage?: string;
    role: 'super_admin' | 'admin';
    storeInfo?: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}