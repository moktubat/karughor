'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
    FaDollarSign,
    FaCheckCircle,
    FaTimes,
    FaUndo,
    FaCalendarAlt,
    FaTruck,
} from 'react-icons/fa';


type Period = 'today' | 'week' | 'month' | 'year';

type DailySale = {
    _id: string;
    orders: number;
    revenue: number;
};

type TopProduct = {
    _id: string;
    name: string;
    sold: number;
    revenue: number;
};

const Revenue = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');

    const { data, isLoading } = useQuery({
        queryKey: ['admin-revenue', selectedPeriod],
        queryFn: async () => {
            const res = await api.get(`/admin/revenue/stats?period=${selectedPeriod}`);
            return res.data.data;
        },
    });

    // Also fetch order counts for delivered/cancelled/returned
    const { data: ordersData } = useQuery({
        queryKey: ['admin-orders-summary'],
        queryFn: async () => {
            const res = await api.get(`/orders/admin/all?limit=1000`);
            const orders = res.data.data.orders as any[];

            return {
                delivered: orders.filter(o => o.status === 'delivered').length,
                cancelled: orders.filter(o => o.status === 'cancelled').length,
                returned: orders.filter(o => o.status === 'returned').length,
                pending: orders.filter(o =>
                    ['new', 'confirmed', 'shipped'].includes(o.status)
                ).length,
            };
        },
        staleTime: 60_000,
    });

    const revenue = data?.revenue;
    const dailySales: DailySale[] = data?.dailySales || [];
    const topProducts: TopProduct[] = data?.topProducts || [];

    const totalRevenue = revenue?.total || 0;
    const pendingCod = ordersData
        ? (ordersData.pending * (totalRevenue / Math.max((ordersData.delivered || 1), 1)) * 0.3)
        : 0;

    const cancellationRate = ordersData && (ordersData.delivered + ordersData.cancelled) > 0
        ? ((ordersData.cancelled / (ordersData.delivered + ordersData.cancelled)) * 100).toFixed(1)
        : null;

    const returnRate = ordersData && ordersData.delivered > 0
        ? ((ordersData.returned / ordersData.delivered) * 100).toFixed(1)
        : null;

    const weeklyTotal = dailySales.reduce((sum, d) => sum + (d.revenue || 0), 0);

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-4">
            <div className="max-w-350 mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Revenue & Sales</h1>
                    <p className="text-[#818B9C]">COD-based revenue tracking (Delivered orders only)</p>
                </div>

                {/* Period Selector */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-2 mb-6 inline-flex gap-2">
                    {(['today', 'week', 'month', 'year'] as Period[]).map((period) => (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                    {/* Total Revenue */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-green-50 p-3 rounded-lg text-green-600">
                                <FaDollarSign className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-[#818B9C] text-sm font-medium mb-1">Total Revenue</h3>
                        {isLoading
                            ? <div className="h-8 bg-gray-100 rounded animate-pulse w-1/2" />
                            : <p className="text-3xl font-bold text-[#0B0F0E]">৳{totalRevenue.toLocaleString()}</p>
                        }
                        <p className="text-xs text-[#818B9C] mt-2 capitalize">{selectedPeriod}</p>
                    </div>

                    {/* Orders Count */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                <FaCalendarAlt className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-[#818B9C] text-sm font-medium mb-1">Orders Delivered</h3>
                        {isLoading
                            ? <div className="h-8 bg-gray-100 rounded animate-pulse w-1/2" />
                            : <p className="text-3xl font-bold text-[#0B0F0E]">{revenue?.count || 0}</p>
                        }
                        <p className="text-xs text-[#818B9C] mt-2">From this period</p>
                    </div>

                    {/* Delivered Orders */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                                <FaCheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-[#818B9C] text-sm font-medium mb-1">Total Delivered</h3>
                        {isLoading || !ordersData
                            ? <div className="h-8 bg-gray-100 rounded animate-pulse w-1/2" />
                            : <p className="text-3xl font-bold text-[#0B0F0E]">{ordersData.delivered}</p>
                        }
                        <p className="text-xs text-[#818B9C] mt-2">All time</p>
                    </div>

                    {/* Pending COD */}
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-orange-50 p-3 rounded-lg text-orange-600">
                                <FaTruck className="w-6 h-6" />
                            </div>
                        </div>

                        <h3 className="text-[#818B9C] text-sm font-medium mb-1">
                            Pending Orders
                        </h3>

                        {isLoading || !ordersData ? (
                            <div className="h-8 bg-gray-100 rounded animate-pulse w-1/2" />
                        ) : (
                            <p className="text-3xl font-bold text-[#0B0F0E]">
                                {ordersData.pending}
                            </p>
                        )}

                        {isLoading || !ordersData ? (
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3 mt-2" />
                        ) : (
                            <p className="text-sm text-[#818B9C] mt-1">
                                Est. COD: ৳{pendingCod.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                        )}

                        <p className="text-xs text-[#818B9C] mt-2">In transit</p>
                    </div>
                </div>

                {/* Order Status Overview — only show if ordersData has data */}
                {ordersData && (ordersData.delivered > 0 || ordersData.cancelled > 0 || ordersData.returned > 0) && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                        {ordersData.delivered > 0 && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-green-50 p-4 rounded-lg text-green-600">
                                        <FaCheckCircle className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm text-[#818B9C] mb-1">Delivered Orders</h3>
                                        <p className="text-3xl font-bold text-green-600">{ordersData.delivered}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-[#E4E9EE]">
                                    <p className="text-sm text-[#818B9C]">
                                        Revenue collected:{' '}
                                        <span className="font-semibold text-green-600">
                                            ৳{totalRevenue.toLocaleString()}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {ordersData.cancelled > 0 && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-red-50 p-4 rounded-lg text-red-600">
                                        <FaTimes className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm text-[#818B9C] mb-1">Cancelled Orders</h3>
                                        <p className="text-3xl font-bold text-red-600">{ordersData.cancelled}</p>
                                    </div>
                                </div>
                                {cancellationRate && (
                                    <div className="pt-4 border-t border-[#E4E9EE]">
                                        <p className="text-sm text-[#818B9C]">
                                            Cancellation rate:{' '}
                                            <span className="font-semibold text-red-600">{cancellationRate}%</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {ordersData.returned > 0 && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-orange-50 p-4 rounded-lg text-orange-600">
                                        <FaUndo className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm text-[#818B9C] mb-1">Returned Orders</h3>
                                        <p className="text-3xl font-bold text-orange-600">{ordersData.returned}</p>
                                    </div>
                                </div>
                                {returnRate && (
                                    <div className="pt-4 border-t border-[#E4E9EE]">
                                        <p className="text-sm text-[#818B9C]">
                                            Return rate:{' '}
                                            <span className="font-semibold text-orange-600">{returnRate}%</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Daily Sales & Top Products — only shown if data exists */}
                {!isLoading && (dailySales.length > 0 || topProducts.length > 0) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Daily Sales */}
                        {dailySales.length > 0 && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-4">
                                <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">Daily Sales</h2>
                                <div className="space-y-4">
                                    {dailySales.map((day) => (
                                        <div
                                            key={day._id}
                                            className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-lg hover:bg-[#E4E9EE] transition-colors"
                                        >
                                            <div>
                                                <p className="font-semibold text-[#0B0F0E] mb-1">
                                                    {new Date(day._id).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                                <p className="text-sm text-[#818B9C]">
                                                    {day.orders} order{day.orders !== 1 ? 's' : ''} delivered
                                                </p>
                                            </div>
                                            <p className="text-2xl font-bold text-[#C85A3A]">
                                                ৳{(day.revenue || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {weeklyTotal > 0 && (
                                    <div className="mt-6 pt-6 border-t border-[#E4E9EE]">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#818B9C]">Period Total:</span>
                                            <span className="text-2xl font-bold text-[#0B0F0E]">
                                                ৳{weeklyTotal.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Top Products */}
                        {topProducts.length > 0 && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-4">
                                <h2 className="text-xl font-bold text-[#0B0F0E] mb-6">Top Products</h2>
                                <div className="space-y-4">
                                    {topProducts.map((product, index) => (
                                        <div
                                            key={product._id || index}
                                            className="flex items-center gap-4 p-4 bg-[#F7F7F7] rounded-lg"
                                        >
                                            <div className="w-10 h-10 bg-[#C85A3A] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-[#0B0F0E] mb-1 line-clamp-1">
                                                    {product.name || 'Unknown Product'}
                                                </p>
                                                <p className="text-sm text-[#818B9C]">
                                                    {product.sold} units sold
                                                </p>
                                            </div>
                                            <p className="text-lg font-bold text-[#C85A3A] shrink-0">
                                                ৳{(product.revenue || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Loading state for bottom section */}
                {isLoading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[0, 1].map(i => (
                            <div key={i} className="bg-white border border-[#E4E9EE] rounded-lg p-6">
                                <div className="h-6 bg-gray-100 rounded animate-pulse w-1/3 mb-6" />
                                {[0, 1, 2, 3].map(j => (
                                    <div key={j} className="h-16 bg-gray-100 rounded animate-pulse mb-3" />
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state — only shown after loading with no data */}
                {!isLoading && dailySales.length === 0 && topProducts.length === 0 && (
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-16 text-center">
                        <FaDollarSign className="w-12 h-12 mx-auto mb-4 text-[#E4E9EE]" />
                        <p className="text-[#818B9C]">No revenue data for this period yet.</p>
                        <p className="text-sm text-[#818B9C] mt-1">Sales will appear here once orders are delivered.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Revenue;