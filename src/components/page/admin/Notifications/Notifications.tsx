'use client';

import React, { useState } from 'react';
import {
    FaBell,
    FaShoppingCart,
    FaExclamationTriangle,
    FaTimes,
    FaCheck,
    FaFilter,
} from 'react-icons/fa';

interface Notification {
    id: number;
    type: 'new_order' | 'low_stock' | 'cancellation' | 'system';
    title: string;
    message: string;
    time: string;
    isRead: boolean;
}

const Notifications = () => {
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: 1,
            type: 'new_order',
            title: 'New COD Order',
            message: 'Order #ORD-001 placed by Kamal Hassan - $209',
            time: '2 minutes ago',
            isRead: false,
        },
        {
            id: 2,
            type: 'low_stock',
            title: 'Low Stock Alert',
            message: 'Logitech G435 Headset has only 5 units left',
            time: '15 minutes ago',
            isRead: false,
        },
        {
            id: 3,
            type: 'cancellation',
            title: 'Order Cancelled',
            message: 'Order #ORD-005 cancelled by customer',
            time: '1 hour ago',
            isRead: false,
        },
        {
            id: 4,
            type: 'new_order',
            title: 'New COD Order',
            message: 'Order #ORD-002 placed by Fatima Rahman - $90',
            time: '2 hours ago',
            isRead: true,
        },
        {
            id: 5,
            type: 'low_stock',
            title: 'Out of Stock',
            message: 'Wireless Keyboard is now out of stock',
            time: '3 hours ago',
            isRead: true,
        },
        {
            id: 6,
            type: 'system',
            title: 'System Update',
            message: 'Your store settings have been updated',
            time: '1 day ago',
            isRead: true,
        },
    ]);

    const markAsRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
    };

    const deleteNotification = (id: number) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    const getIcon = (type: string) => {
        const icons = {
            new_order: <FaShoppingCart className="w-5 h-5" />,
            low_stock: <FaExclamationTriangle className="w-5 h-5" />,
            cancellation: <FaTimes className="w-5 h-5" />,
            system: <FaBell className="w-5 h-5" />,
        };
        return icons[type as keyof typeof icons];
    };

    const getIconBg = (type: string) => {
        const backgrounds = {
            new_order: 'bg-blue-50 text-blue-600',
            low_stock: 'bg-orange-50 text-orange-600',
            cancellation: 'bg-red-50 text-red-600',
            system: 'bg-purple-50 text-purple-600',
        };
        return backgrounds[type as keyof typeof backgrounds];
    };

    const filteredNotifications = notifications.filter((notif) => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notif.isRead;
        if (filter === 'read') return notif.isRead;
        return true;
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-6">
            <div className="max-w-[1000px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Notifications</h1>
                        <p className="text-[#818B9C]">
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all"
                        >
                            <FaCheck />
                            Mark All as Read
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-2 mb-6 inline-flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${filter === 'all'
                                ? 'bg-[#C85A3A] text-white'
                                : 'text-[#818B9C] hover:bg-[#F7F7F7]'
                            }`}
                    >
                        All ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${filter === 'unread'
                                ? 'bg-[#C85A3A] text-white'
                                : 'text-[#818B9C] hover:bg-[#F7F7F7]'
                            }`}
                    >
                        Unread ({unreadCount})
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${filter === 'read'
                                ? 'bg-[#C85A3A] text-white'
                                : 'text-[#818B9C] hover:bg-[#F7F7F7]'
                            }`}
                    >
                        Read ({notifications.length - unreadCount})
                    </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {filteredNotifications.length === 0 ? (
                        <div className="bg-white border border-[#E4E9EE] rounded-lg p-12 text-center">
                            <FaBell className="w-16 h-16 mx-auto mb-4 text-[#E4E9EE]" />
                            <p className="text-[#818B9C]">No notifications</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white border rounded-lg p-6 hover:shadow-md transition-all ${notification.isRead
                                        ? 'border-[#E4E9EE]'
                                        : 'border-[#C85A3A] bg-[#FFF9F7]'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div
                                        className={`p-3 rounded-lg flex-shrink-0 ${getIconBg(
                                            notification.type
                                        )}`}
                                    >
                                        {getIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="font-semibold text-[#0B0F0E]">
                                                {notification.title}
                                            </h3>
                                            {!notification.isRead && (
                                                <span className="w-3 h-3 bg-[#C85A3A] rounded-full flex-shrink-0"></span>
                                            )}
                                        </div>
                                        <p className="text-[#818B9C] mb-3">{notification.message}</p>
                                        <p className="text-sm text-[#818B9C]">{notification.time}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Mark as read"
                                            >
                                                <FaCheck />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;