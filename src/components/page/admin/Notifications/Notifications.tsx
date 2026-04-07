'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    FaBell, FaShoppingCart, FaExclamationTriangle, FaTimes, FaCheck, FaSpinner,
} from 'react-icons/fa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://karughor-backend.onrender.com/api';

function getAdminToken() {
    if (typeof window === 'undefined') return '';
    try { return localStorage.getItem('admin_token') || ''; } catch { return ''; }
}

interface Notification {
    id: string;
    type: 'new_order' | 'low_stock' | 'cancellation';
    title: string;
    message: string;
    time: string;
    rawDate: Date;
    isRead: boolean;
}

function timeAgo(date: Date): string {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
}

const Notifications = () => {
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

    // Fetch recent orders
    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ['admin-notifications-orders'],
        queryFn: async () => {
            const token = getAdminToken();
            const res = await axios.get(`${API_URL}/orders/admin/all?limit=50&sort=-createdAt`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                withCredentials: true,
            });
            return res.data.data.orders as any[];
        },
        refetchInterval: 60_000,
    });

    // Fetch low stock products
    const { data: lowStockData, isLoading: stockLoading } = useQuery({
        queryKey: ['admin-notifications-stock'],
        queryFn: async () => {
            const token = getAdminToken();
            const res = await axios.get(`${API_URL}/products?limit=200`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                withCredentials: true,
            });
            const products = res.data.data.products as any[];
            return products.filter((p: any) => p.stock <= 10);
        },
        staleTime: 2 * 60_000,
    });

    // Derive notifications from real data
    const notifications: Notification[] = useMemo(() => {
        const list: Notification[] = [];

        // New orders (last 20)
        (ordersData || []).slice(0, 20).forEach((order: any) => {
            const date = new Date(order.orderDate || order.createdAt);
            list.push({
                id: `order-${order._id}`,
                type: 'new_order',
                title: order.status === 'new' ? 'New COD Order' : `Order ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`,
                message: `Order ${order.orderNumber} by ${order.customer?.name} — ৳${order.total}`,
                time: timeAgo(date),
                rawDate: date,
                isRead: false,
            });
        });

        // Cancellations (separate highlight)
        (ordersData || []).filter((o: any) => o.status === 'cancelled').slice(0, 5).forEach((order: any) => {
            const date = new Date(order.cancelledAt || order.updatedAt);
            const id = `cancel-${order._id}`;
            // Avoid duplicating if already in the new_order list
            if (!list.find(n => n.id === id)) {
                list.push({
                    id,
                    type: 'cancellation',
                    title: 'Order Cancelled',
                    message: `Order ${order.orderNumber} was cancelled by the customer`,
                    time: timeAgo(date),
                    rawDate: date,
                    isRead: false,
                });
            }
        });

        // Low stock
        (lowStockData || []).forEach((product: any) => {
            list.push({
                id: `stock-${product._id}`,
                type: 'low_stock',
                title: product.stock === 0 ? 'Out of Stock' : 'Low Stock Alert',
                message: product.stock === 0
                    ? `"${product.name}" is out of stock`
                    : `"${product.name}" has only ${product.stock} units left`,
                time: 'Now',
                rawDate: new Date(),
                isRead: false,
            });
        });

        // Sort by date desc, remove deleted
        return list
            .filter(n => !deletedIds.has(n.id))
            .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime())
            .map(n => ({ ...n, isRead: readIds.has(n.id) }));
    }, [ordersData, lowStockData, readIds, deletedIds]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filtered = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'read') return n.isRead;
        return true;
    });

    const markAsRead = (id: string) => setReadIds(prev => new Set([...prev, id]));
    const markAllAsRead = () => setReadIds(new Set(notifications.map(n => n.id)));
    const deleteNotif = (id: string) => setDeletedIds(prev => new Set([...prev, id]));

    const getIconBg = (type: string) => ({
        new_order: 'bg-blue-50 text-blue-600',
        low_stock: 'bg-orange-50 text-orange-600',
        cancellation: 'bg-red-50 text-red-600',
    }[type] || 'bg-gray-50 text-gray-600');

    const getIcon = (type: string) => ({
        new_order: <FaShoppingCart className="w-5 h-5" />,
        low_stock: <FaExclamationTriangle className="w-5 h-5" />,
        cancellation: <FaTimes className="w-5 h-5" />,
    }[type] || <FaBell className="w-5 h-5" />);

    const isLoading = ordersLoading || stockLoading;

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-6">
            <div className="max-w-250 mx-auto">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Notifications</h1>
                        <p className="text-[#818B9C]">
                            {isLoading ? 'Loading...' : `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all"
                        >
                            <FaCheck /> Mark All as Read
                        </button>
                    )}
                </div>

                {/* Filter tabs */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-2 mb-6 inline-flex gap-2">
                    {(['all', 'unread', 'read'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-md font-medium transition-all capitalize ${filter === f ? 'bg-[#C85A3A] text-white' : 'text-[#818B9C] hover:bg-[#F7F7F7]'}`}
                        >
                            {f} {f === 'all' ? `(${notifications.length})` : f === 'unread' ? `(${unreadCount})` : `(${notifications.length - unreadCount})`}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <FaSpinner className="animate-spin w-8 h-8 text-[#C85A3A]" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-16 text-center">
                        <FaBell className="w-16 h-16 mx-auto mb-4 text-[#E4E9EE]" />
                        <p className="text-[#818B9C]">No notifications</p>
                        {(ordersData?.length === 0 && lowStockData?.length === 0) && (
                            <p className="text-sm text-[#818B9C] mt-2">Notifications appear automatically when orders are placed or stock runs low.</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(n => (
                            <div
                                key={n.id}
                                className={`bg-white border rounded-lg p-6 hover:shadow-md transition-all ${n.isRead ? 'border-[#E4E9EE]' : 'border-[#C85A3A] bg-[#FFF9F7]'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg shrink-0 ${getIconBg(n.type)}`}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-1">
                                            <h3 className="font-semibold text-[#0B0F0E]">{n.title}</h3>
                                            {!n.isRead && <span className="w-3 h-3 bg-[#C85A3A] rounded-full shrink-0 mt-1" />}
                                        </div>
                                        <p className="text-[#818B9C] mb-2">{n.message}</p>
                                        <p className="text-sm text-[#818B9C]">{n.time}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {!n.isRead && (
                                            <button
                                                onClick={() => markAsRead(n.id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Mark as read"
                                            >
                                                <FaCheck />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotif(n.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Dismiss"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;