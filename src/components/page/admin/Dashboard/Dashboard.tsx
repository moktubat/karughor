'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
    FaShoppingCart, FaMoneyBillWave,
    FaBoxOpen, FaExclamationTriangle,
    FaTruck, FaCheckCircle, FaTimes,
} from 'react-icons/fa';
import api from '@/lib/api';


const fetcher = (url: string) =>
    api.get(url).then((r) => r.data.data);

const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
        new: 'bg-blue-100 text-blue-700',
        confirmed: 'bg-yellow-100 text-yellow-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };
    return badges[status] || badges.new;
};

const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
        new: <FaShoppingCart className="w-3 h-3" />,
        confirmed: <FaCheckCircle className="w-3 h-3" />,
        shipped: <FaTruck className="w-3 h-3" />,
        delivered: <FaCheckCircle className="w-3 h-3" />,
        cancelled: <FaTimes className="w-3 h-3" />,
    };
    return icons[status] || icons.new;
};

const StatSkeleton = () => (
    <div className="bg-white border border-[#E4E9EE] rounded-lg p-4 animate-pulse">
        <div className="flex justify-between mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div className="w-12 h-4 bg-gray-200 rounded" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
    </div>
);

const Dashboard = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: () => fetcher('/admin/dashboard/stats'),
        refetchInterval: 60_000,
    });

    const stats = data?.stats ?? {};
    const recentOrders = data?.recentOrders ?? [];

    const statCards = stats
        ? [
            {
                title: 'Total Orders',
                value: stats.totalOrders,
                icon: <FaShoppingCart className="w-6 h-6" />,
                bgColor: 'bg-blue-50',
                iconColor: 'text-blue-600',
            },
            {
                title: 'Total Revenue',
                value: `৳${stats.totalRevenue?.toLocaleString() || 0}`,
                icon: <FaMoneyBillWave className="w-6 h-6" />,
                bgColor: 'bg-green-50',
                iconColor: 'text-green-600',
            },
            {
                title: 'Pending COD',
                value: stats.pendingOrders,
                icon: <FaTruck className="w-6 h-6" />,
                bgColor: 'bg-orange-50',
                iconColor: 'text-orange-600',
            },
            {
                title: "Today's Orders",
                value: stats.todayOrders,
                icon: <FaBoxOpen className="w-6 h-6" />,
                bgColor: 'bg-purple-50',
                iconColor: 'text-purple-600',
            },
            {
                title: 'Low Stock',
                value: stats.lowStockProducts,
                icon: <FaExclamationTriangle className="w-6 h-6" />,
                bgColor: 'bg-red-50',
                iconColor: 'text-red-600',
            },
        ]
        : [];

    return (
        <div className="bg-[#F7F7F7] min-h-screen ps-4 py-4">
            <div className="max-w-300 mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Dashboard</h1>
                    <p className="text-[#818B9C]">Welcome back! Here&apos;s what&apos;s happening today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)
                        : statCards.map((stat, i) => (
                            <div
                                key={i}
                                className="bg-white border border-[#E4E9EE] rounded-lg p-4 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between mb-4">
                                    <div className={`${stat.bgColor} p-3 rounded-lg ${stat.iconColor}`}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <h3 className="text-[#818B9C] text-sm mb-1">{stat.title}</h3>
                                <p className="text-2xl font-bold text-[#0B0F0E]">{stat.value}</p>
                            </div>
                        ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="xl:col-span-2 bg-white border border-[#E4E9EE] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[#0B0F0E]">Recent Orders</h2>
                            <Link
                                href="/admin/orders"
                                className="text-[#C85A3A] hover:underline text-sm font-semibold"
                            >
                                View All
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                                ))}
                            </div>
                        ) : recentOrders.length === 0 ? (
                            <div className="text-center py-12 text-[#818B9C]">No orders yet</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[#E4E9EE]">
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-[#818B9C]">Order #</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-[#818B9C]">Customer</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-[#818B9C]">Phone</th>
                                            <th className="text-right py-3 px-2 text-sm font-semibold text-[#818B9C]">Amount</th>
                                            <th className="text-center py-3 px-2 text-sm font-semibold text-[#818B9C]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order: any) => (
                                            <tr
                                                key={order._id}
                                                className="border-b border-[#E4E9EE] hover:bg-[#F7F7F7] transition-colors"
                                            >
                                                <td className="py-4 px-2 text-sm font-mono text-[#818B9C]">
                                                    {order.orderNumber}
                                                </td>
                                                <td className="py-4 px-2 font-medium text-[#0B0F0E]">
                                                    {order.customer?.name}
                                                </td>
                                                <td className="py-4 px-2 text-[#818B9C] text-sm">
                                                    {order.customer?.phone}
                                                </td>
                                                <td className="py-4 px-2 text-right font-semibold text-[#C85A3A]">
                                                    ৳{order.total}
                                                </td>
                                                <td className="py-4 px-2">
                                                    <div className="flex justify-center">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-4">
                        <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">Today's Summary</h2>

                        {isLoading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-[#818B9C] mb-1">New Orders</p>
                                        <p className="text-2xl font-bold text-blue-600">{stats?.todayOrders ?? 0}</p>
                                    </div>
                                    <FaShoppingCart className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-[#818B9C] mb-1">Delivered</p>
                                        <p className="text-2xl font-bold text-green-600">{stats?.deliveredOrders ?? 0}</p>
                                    </div>
                                    <FaCheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-[#818B9C] mb-1">Total Revenue</p>
                                        <p className="text-2xl font-bold text-orange-600">৳{stats?.totalRevenue?.toLocaleString() ?? 0}</p>
                                    </div>
                                    <FaMoneyBillWave className="w-8 h-8 text-orange-600" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-[#818B9C] mb-1">Low Stock Items</p>
                                        <p className="text-2xl font-bold text-red-600">{stats?.lowStockProducts ?? 0}</p>
                                    </div>
                                    <FaExclamationTriangle className="w-8 h-8 text-red-600" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;