export interface OrderItem {
    productId: number;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface OrderCustomer {
    userId?: string;
    name: string;
    phone: string;
    email?: string;
    address: {
        street: string;
        area: string;
        city: string;
        deliveryLocation: 'inside_dhaka' | 'outside_dhaka';
    };
}

export interface Order {
    id: string;
    orderNumber: string;
    customer: OrderCustomer;
    items: OrderItem[];
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    total: number;
    paymentMethod: 'COD';
    paymentStatus: 'pending' | 'collected';
    status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    orderDate: string;
    confirmedAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
    customerNotes?: string;
    adminNotes?: string;
}