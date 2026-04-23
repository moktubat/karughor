'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    FaSearch,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaEye,
    FaExclamationTriangle,
} from 'react-icons/fa';
import { adminAuthHeaders } from '@/lib/adminAuth';
import api from '@/lib/api';
import { useScrollLock } from '@/hooks/useScrollLock';

interface DerivedCustomer {
    phone: string;
    name: string;
    email?: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
    cancelledOrders: number;
    lastOrder: string;
}

const CustomersManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<DerivedCustomer | null>(null);
    useScrollLock(!!selectedCustomer);

    // Fetch all orders and derive customer data from them
    const { data: ordersRaw, isLoading } = useQuery({
        queryKey: ['admin-all-orders-for-customers'],
        queryFn: async () => {
            const res = await api.get('/orders/admin/all?limit=1000', {
                headers: adminAuthHeaders(),
            });
            return res.data.data.orders;
        },
        staleTime: 60_000,
    });

    // Derive customer list by grouping orders by phone number
    const customers: DerivedCustomer[] = useMemo(() => {
        if (!ordersRaw || ordersRaw.length === 0) return [];

        const map = new Map<string, DerivedCustomer>();

        ordersRaw.forEach((order: any) => {
            const phone = order.customer?.phone;
            if (!phone) return;

            const isCancelled = order.status === 'cancelled';
            const isDelivered = order.status === 'delivered';

            if (map.has(phone)) {
                const existing = map.get(phone)!;
                existing.totalOrders += 1;
                if (isDelivered) existing.totalSpent += order.total || 0;
                if (isCancelled) existing.cancelledOrders += 1;
                // Keep most recent order date
                if (new Date(order.orderDate || order.createdAt) > new Date(existing.lastOrder)) {
                    existing.lastOrder = order.orderDate || order.createdAt;
                }
            } else {
                map.set(phone, {
                    phone,
                    name: order.customer?.name || 'Unknown',
                    email: order.customer?.email || '',
                    address: [
                        order.customer?.address?.area,
                        order.customer?.address?.city,
                    ].filter(Boolean).join(', ') || 'N/A',
                    totalOrders: 1,
                    totalSpent: isDelivered ? (order.total || 0) : 0,
                    cancelledOrders: isCancelled ? 1 : 0,
                    lastOrder: order.orderDate || order.createdAt,
                });
            }
        });

        return Array.from(map.values()).sort((a, b) => b.totalOrders - a.totalOrders);
    }, [ordersRaw]);

    const filteredCustomers = useMemo(() => {
        if (!searchQuery.trim()) return customers;
        const q = searchQuery.toLowerCase();
        return customers.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.phone.includes(q) ||
                c.email?.toLowerCase().includes(q)
        );
    }, [customers, searchQuery]);

    const frequentCancellers = customers.filter((c) => c.cancelledOrders >= 3);

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-4">
            <div className="max-w-350 mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Customers Management</h1>
                    <p className="text-[#818B9C]">
                        {isLoading
                            ? 'Loading customer data from orders...'
                            : `${customers.length} unique customer${customers.length !== 1 ? 's' : ''} derived from orders`
                        }
                    </p>
                </div>

                {/* Frequent cancellers alert — only shown if there are any */}
                {!isLoading && frequentCancellers.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <FaExclamationTriangle className="text-orange-600 w-6 h-6" />
                            <h3 className="text-lg font-semibold text-orange-900">Frequent Cancellers</h3>
                        </div>
                        <p className="text-orange-700 mb-4">
                            {frequentCancellers.length} customer{frequentCancellers.length !== 1 ? 's' : ''} with 3+ cancelled orders
                        </p>
                        <div className="space-y-2">
                            {frequentCancellers.slice(0, 3).map((c) => (
                                <div key={c.phone} className="flex justify-between items-center text-sm">
                                    <span className="text-orange-900">{c.name}</span>
                                    <span className="font-semibold text-orange-600">{c.cancelledOrders} cancelled</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-4 mb-6">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#818B9C]" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-[#E4E9EE] rounded-lg focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                        />
                    </div>
                </div>

                {/* Loading skeleton */}
                {isLoading && (
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Empty state — no orders yet */}
                {!isLoading && customers.length === 0 && (
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-16 text-center">
                        <FaSearch className="w-12 h-12 mx-auto mb-4 text-[#E4E9EE]" />
                        <p className="font-semibold text-[#0B0F0E] mb-2">No customer data yet</p>
                        <p className="text-sm text-[#818B9C]">
                            Customer info will appear here automatically once orders are placed.
                        </p>
                    </div>
                )}

                {/* Customers table — only shown if there are customers */}
                {!isLoading && customers.length > 0 && (
                    <div className="bg-white border border-[#E4E9EE] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F7F7F7]">
                                    <tr>
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Customer</th>
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Contact</th>
                                        <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Orders</th>
                                        <th className="text-right py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Total Spent</th>
                                        <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Cancelled</th>
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Last Order</th>
                                        <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr
                                            key={customer.phone}
                                            className="border-t border-[#E4E9EE] hover:bg-[#F7F7F7] transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <p className="font-semibold text-[#0B0F0E]">{customer.name}</p>
                                                <p className="text-sm text-[#818B9C]">{customer.address}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FaPhone className="text-[#C85A3A] w-3 h-3 shrink-0" />
                                                        <span className="text-[#0B0F0E]">{customer.phone}</span>
                                                    </div>
                                                    {customer.email && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <FaEnvelope className="text-[#C85A3A] w-3 h-3 shrink-0" />
                                                            <span className="text-[#818B9C] truncate max-w-37.5">{customer.email}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center font-semibold text-[#0B0F0E]">
                                                {customer.totalOrders}
                                            </td>
                                            <td className="py-4 px-4 text-right font-bold text-[#C85A3A]">
                                                ৳{customer.totalSpent.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {customer.cancelledOrders > 0 ? (
                                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${customer.cancelledOrders >= 3
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-orange-100 text-orange-700'
                                                        }`}>
                                                        {customer.cancelledOrders}
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                                                        0
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-[#818B9C]">
                                                {new Date(customer.lastOrder).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    onClick={() => setSelectedCustomer(customer)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredCustomers.length === 0 && searchQuery && (
                            <div className="text-center py-12 text-[#818B9C]">
                                No customers match &quot;{searchQuery}&quot;
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Customer Detail Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">

                        <div className="sticky top-0 bg-white border-b border-[#E4E9EE] p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-[#0B0F0E]">Customer Details</h2>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="p-2 hover:bg-[#F7F7F7] rounded-lg transition-colors text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Personal Info */}
                            <div>
                                <h3 className="text-lg font-semibold text-[#0B0F0E] mb-4">Personal Information</h3>
                                <div className="space-y-3 bg-[#F7F7F7] p-4 rounded-lg">
                                    <p className="font-semibold text-[#0B0F0E]">{selectedCustomer.name}</p>
                                    <div className="flex items-center gap-2">
                                        <FaPhone className="text-[#C85A3A]" />
                                        <span className="text-[#0B0F0E]">{selectedCustomer.phone}</span>
                                    </div>
                                    {selectedCustomer.email && (
                                        <div className="flex items-center gap-2">
                                            <FaEnvelope className="text-[#C85A3A]" />
                                            <span className="text-[#0B0F0E]">{selectedCustomer.email}</span>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2">
                                        <FaMapMarkerAlt className="text-[#C85A3A] mt-1" />
                                        <span className="text-[#0B0F0E]">{selectedCustomer.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Statistics */}
                            <div>
                                <h3 className="text-lg font-semibold text-[#0B0F0E] mb-4">Order Statistics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-[#818B9C] mb-1">Total Orders</p>
                                        <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-sm text-[#818B9C] mb-1">Total Spent</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ৳{selectedCustomer.totalSpent.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-sm text-[#818B9C] mb-1">Cancelled</p>
                                        <p className="text-2xl font-bold text-red-600">{selectedCustomer.cancelledOrders}</p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <p className="text-sm text-[#818B9C] mb-1">Last Order</p>
                                        <p className="text-lg font-semibold text-purple-600">
                                            {new Date(selectedCustomer.lastOrder).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomersManagement;