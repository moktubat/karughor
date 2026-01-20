'use client';

import React, { useState } from 'react';
import {
    FaDollarSign,
    FaCheckCircle,
    FaTimes,
    FaUndo,
    FaCalendarAlt,
    FaTruck,
} from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

interface RevenueStats {
    totalCodCollected: number;
    todayEarnings: number;
    thisMonthEarnings: number;
    deliveredOrders: number;
    cancelledOrders: number;
    returnedOrders: number;
    pendingCod: number;
}

interface DailySales {
    date: string;
    delivered: number;
    revenue: number;
}

const Revenue = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>(
        'month'
    );

    // Mock data
    const stats: RevenueStats = {
        totalCodCollected: 45280,
        todayEarnings: 1840,
        thisMonthEarnings: 12450,
        deliveredOrders: 245,
        cancelledOrders: 18,
        returnedOrders: 5,
        pendingCod: 3240,
    };

    const dailySales: DailySales[] = [
        { date: '2024-01-20', delivered: 12, revenue: 1840 },
        { date: '2024-01-19', delivered: 15, revenue: 2150 },
        { date: '2024-01-18', delivered: 10, revenue: 1520 },
        { date: '2024-01-17', delivered: 8, revenue: 980 },
        { date: '2024-01-16', delivered: 14, revenue: 2240 },
        { date: '2024-01-15', delivered: 11, revenue: 1680 },
        { date: '2024-01-14', delivered: 9, revenue: 1340 },
    ];

    const topProducts = [
        { name: 'Logitech G502 Hero', sold: 45, revenue: 4005 },
        { name: 'Gaming Keyboard', sold: 32, revenue: 3840 },
        { name: 'Wireless Headset', sold: 28, revenue: 7840 },
        { name: 'Gaming Mouse Pad', sold: 56, revenue: 1680 },
        { name: 'USB-C Cable', sold: 89, revenue: 890 },
    ];

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Revenue & Sales</h1>
                    <p className="text-[#818B9C]">COD-based revenue tracking (Delivered orders only)</p>
                </div>

                {/* Period Selector */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-2 mb-6 inline-flex gap-2">
                    {(['today', 'week', 'month', 'year'] as const).map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 capitalize ${selectedPeriod === period
                                    ? 'bg-[#C85A3A] text-white'
                                    : 'text-[#818B9C] hover:bg-[#F7F7F7]'
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>

                {/* Revenue Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-green-50 p-3 rounded-lg text-green-600">
                                <FaDollarSign className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                                <MdTrendingUp className="w-4 h-4" />
                                +15%
                            </div>
                        </div>
                        <h3 className="text-[#818B9C] text-sm font-medium mb-1">
                            Total COD Collected
                        </h3>
                        <p className="text-3xl font-bold text-[#0B0F0E]">${stats.totalCodCollected}</p>
                        <p className="text-xs text-[#818B9C] mt-2">All time</p>
                    </div>

                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                <FaCalendarAlt className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                                <MdTrendingUp className="w-4 h-4" />
                                +8%
                            </div>
                        </div>
                        <h3 className="text-[#818B9C] text-sm font-medium mb-1">Today's Earnings</h3>
                        <p className="text-3xl font-bold text-[#0B0F0E]">${stats.todayEarnings}</p>
                        <p className="text-xs text-[#818B9C] mt-2">From delivered orders</p>
                    </div>

                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                                <FaCheckCircle className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold text-purple-600">
                                <MdTrendingUp className="w-4 h-4" />
                                +12%
                            </div>
                        </div>
                        <h3 className="text-[#818B9C] text-sm font-medium mb-1">This Month</h3>
                        <p className="text-3xl font-bold text-[#0B0F0E]">
                            ${stats.thisMonthEarnings}
                        </p>
                        <p className="text-xs text-[#818B9C] mt-2">January 2024</p>
                    </div>

                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-orange-50 p-3 rounded-lg text-orange-600">
                                <FaTruck className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold text-orange-600">
                                <MdTrendingDown className="w-4 h-4" />
                                -5%
                            </div>
                        </div>
                        <h3 className="text-[#818B9C] text-sm font-medium mb-1">Pending COD</h3>
                        <p className="text-3xl font-bold text-[#0B0F0E]">${stats.pendingCod}</p>
                        <p className="text-xs text-[#818B9C] mt-2">Orders in transit</p>
                    </div>
                </div>

                {/* Order Status Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-green-50 p-4 rounded-lg text-green-600">
                                <FaCheckCircle className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm text-[#818B9C] mb-1">Delivered Orders</h3>
                                <p className="text-3xl font-bold text-green-600">
                                    {stats.deliveredOrders}
                                </p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-[#E4E9EE]">
                            <p className="text-sm text-[#818B9C]">
                                Payment collected: <span className="font-semibold text-green-600">${stats.totalCodCollected}</span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-red-50 p-4 rounded-lg text-red-600">
                                <FaTimes className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm text-[#818B9C] mb-1">Cancelled Orders</h3>
                                <p className="text-3xl font-bold text-red-600">
                                    {stats.cancelledOrders}
                                </p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-[#E4E9EE]">
                            <p className="text-sm text-[#818B9C]">
                                Cancellation rate: <span className="font-semibold text-red-600">
                                    {((stats.cancelledOrders / (stats.deliveredOrders + stats.cancelledOrders)) * 100).toFixed(1)}%
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-orange-50 p-4 rounded-lg text-orange-600">
                                <FaUndo className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm text-[#818B9C] mb-1">Returned Orders</h3>
                                <p className="text-3xl font-bold text-orange-600">
                                    {stats.returnedOrders}
                                </p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-[#E4E9EE]">
                            <p className="text-sm text-[#818B9C]">
                                Return rate: <span className="font-semibold text-orange-600">
                                    {((stats.returnedOrders / stats.deliveredOrders) * 100).toFixed(1)}%
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Daily Sales & Top Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Sales */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6">
                        <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">
                            Daily Sales (Last 7 Days)
                        </h2>
                        <div className="space-y-4">
                            {dailySales.map((day) => (
                                <div
                                    key={day.date}
                                    className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-lg hover:bg-[#E4E9EE] transition-colors"
                                >
                                    <div>
                                        <p className="font-semibold text-[#0B0F0E] mb-1">
                                            {new Date(day.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <p className="text-sm text-[#818B9C]">
                                            {day.delivered} orders delivered
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-[#C85A3A]">
                                            ${day.revenue}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-[#E4E9EE]">
                            <div className="flex justify-between items-center">
                                <span className="text-[#818B9C]">Weekly Total:</span>
                                <span className="text-2xl font-bold text-[#0B0F0E]">
                                    ${dailySales.reduce((sum, day) => sum + day.revenue, 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-6">
                        <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">Top Products</h2>
                        <div className="space-y-4">
                            {topProducts.map((product, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 bg-[#F7F7F7] rounded-lg"
                                >
                                    <div className="w-10 h-10 bg-[#C85A3A] text-white rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-[#0B0F0E] mb-1">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-[#818B9C]">
                                            {product.sold} units sold
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-[#C85A3A]">
                                            ${product.revenue}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Revenue;