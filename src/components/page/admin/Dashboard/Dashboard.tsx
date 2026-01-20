'use client';

import React from 'react';
import {
    FaShoppingCart,
    FaDollarSign,
    FaMoneyBillWave,
    FaBoxOpen,
    FaExclamationTriangle,
    FaTruck,
    FaCheckCircle,
    FaTimes
} from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

interface StatCard {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: string;
        isUp: boolean;
    };
    bgColor: string;
    iconColor: string;
}

interface RecentOrder {
    id: string;
    customerName: string;
    phone: string;
    products: number;
    amount: number;
    status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    date: string;
}

const Dashboard = () => {
    // Mock data - replace with API calls
    const stats: StatCard[] = [
        {
            title: 'Total Orders',
            value: 245,
            icon: <FaShoppingCart className="w-6 h-6" />,
            trend: { value: '+12%', isUp: true },
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Total Revenue',
            value: '$45,280',
            icon: <FaDollarSign className="w-6 h-6" />,
            trend: { value: '+8%', isUp: true },
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
        },
        {
            title: 'Pending COD',
            value: 38,
            icon: <FaMoneyBillWave className="w-6 h-6" />,
            trend: { value: '-5%', isUp: false },
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
        },
        {
            title: "Today's Orders",
            value: 24,
            icon: <FaBoxOpen className="w-6 h-6" />,
            trend: { value: '+3', isUp: true },
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Low Stock Products',
            value: 12,
            icon: <FaExclamationTriangle className="w-6 h-6" />,
            bgColor: 'bg-red-50',
            iconColor: 'text-red-600',
        },
    ];

    const recentOrders: RecentOrder[] = [
        {
            id: 'ORD-001',
            customerName: 'Kamal Hassan',
            phone: '+880 1712-345678',
            products: 3,
            amount: 450,
            status: 'new',
            date: '2 min ago',
        },
        {
            id: 'ORD-002',
            customerName: 'Fatima Rahman',
            phone: '+880 1812-345678',
            products: 1,
            amount: 280,
            status: 'confirmed',
            date: '15 min ago',
        },
        {
            id: 'ORD-003',
            customerName: 'Ahmed Ali',
            phone: '+880 1912-345678',
            products: 2,
            amount: 189,
            status: 'shipped',
            date: '1 hour ago',
        },
        {
            id: 'ORD-004',
            customerName: 'Nusrat Jahan',
            phone: '+880 1612-345678',
            products: 4,
            amount: 620,
            status: 'delivered',
            date: '2 hours ago',
        },
        {
            id: 'ORD-005',
            customerName: 'Rakib Hasan',
            phone: '+880 1512-345678',
            products: 1,
            amount: 89,
            status: 'cancelled',
            date: '3 hours ago',
        },
    ];

    const getStatusBadge = (status: string) => {
        const badges = {
            new: 'bg-blue-100 text-blue-700',
            confirmed: 'bg-yellow-100 text-yellow-700',
            shipped: 'bg-purple-100 text-purple-700',
            delivered: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        return badges[status as keyof typeof badges] || badges.new;
    };

    const getStatusIcon = (status: string) => {
        const icons = {
            new: <FaShoppingCart className="w-3 h-3" />,
            confirmed: <FaCheckCircle className="w-3 h-3" />,
            shipped: <FaTruck className="w-3 h-3" />,
            delivered: <FaCheckCircle className="w-3 h-3" />,
            cancelled: <FaTimes className="w-3 h-3" />,
        };
        return icons[status as keyof typeof icons] || icons.new;
    };

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-6">
            <div className="max-w-300 mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Dashboard</h1>
                    <p className="text-[#818B9C]">Welcome back! Here's what's happening today.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white border border-[#E4E9EE] rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${stat.bgColor} p-3 rounded-lg ${stat.iconColor}`}>
                                    {stat.icon}
                                </div>
                                {stat.trend && (
                                    <div
                                        className={`flex items-center gap-1 text-sm font-semibold ${stat.trend.isUp ? 'text-green-600' : 'text-red-600'
                                            }`}
                                    >
                                        {stat.trend.isUp ? (
                                            <MdTrendingUp className="w-4 h-4" />
                                        ) : (
                                            <MdTrendingDown className="w-4 h-4" />
                                        )}
                                        {stat.trend.value}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-[#818B9C] text-sm font-medium mb-1">
                                {stat.title}
                            </h3>
                            <p className="text-2xl font-bold text-[#0B0F0E]">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Orders & Quick Actions */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Recent Orders */}
                    <div className="xl:col-span-2 bg-white border border-[#E4E9EE] rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[#0B0F0E]">Recent Orders</h2>
                            <a
                                href="/admin/orders"
                                className="text-[#C85A3A] hover:underline text-sm font-semibold"
                            >
                                View All
                            </a>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#E4E9EE]">
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#818B9C]">
                                            Order ID
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#818B9C]">
                                            Customer
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-[#818B9C]">
                                            Phone
                                        </th>
                                        <th className="text-center py-3 px-2 text-sm font-semibold text-[#818B9C]">
                                            Items
                                        </th>
                                        <th className="text-right py-3 px-2 text-sm font-semibold text-[#818B9C]">
                                            Amount
                                        </th>
                                        <th className="text-center py-3 px-2 text-sm font-semibold text-[#818B9C]">
                                            Status
                                        </th>
                                        <th className="text-right py-3 px-2 text-sm font-semibold text-[#818B9C]">
                                            Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-[#E4E9EE] hover:bg-[#F7F7F7] cursor-pointer transition-colors"
                                        >
                                            <td className="py-4 px-2">
                                                <span className="font-semibold text-[#0B0F0E]">
                                                    {order.id}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 text-[#0B0F0E]">
                                                {order.customerName}
                                            </td>
                                            <td className="py-4 px-2 text-[#818B9C] text-sm">
                                                {order.phone}
                                            </td>
                                            <td className="py-4 px-2 text-center text-[#0B0F0E]">
                                                {order.products}
                                            </td>
                                            <td className="py-4 px-2 text-right font-semibold text-[#C85A3A]">
                                                ${order.amount}
                                            </td>
                                            <td className="py-4 px-2">
                                                <div className="flex justify-center">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                                            order.status
                                                        )}`}
                                                    >
                                                        {getStatusIcon(order.status)}
                                                        {order.status.charAt(0).toUpperCase() +
                                                            order.status.slice(1)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 text-right text-[#818B9C] text-sm">
                                                {order.date}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6">
                        <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">
                            Today's Summary
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-[#818B9C] mb-1">New Orders</p>
                                    <p className="text-2xl font-bold text-blue-600">8</p>
                                </div>
                                <FaShoppingCart className="w-8 h-8 text-blue-600" />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-[#818B9C] mb-1">Delivered</p>
                                    <p className="text-2xl font-bold text-green-600">12</p>
                                </div>
                                <FaCheckCircle className="w-8 h-8 text-green-600" />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-[#818B9C] mb-1">Revenue Today</p>
                                    <p className="text-2xl font-bold text-orange-600">$1,840</p>
                                </div>
                                <FaDollarSign className="w-8 h-8 text-orange-600" />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-[#818B9C] mb-1">Cancelled</p>
                                    <p className="text-2xl font-bold text-red-600">2</p>
                                </div>
                                <FaTimes className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;