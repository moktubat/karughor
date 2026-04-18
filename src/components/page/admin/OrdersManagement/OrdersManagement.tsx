'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    FaSearch, FaEye, FaPhone, FaMapMarkerAlt,
    FaTimes, FaSpinner,
} from 'react-icons/fa';
import api from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

// ─── constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
    { value: 'all', label: 'All Orders' },
    { value: 'new', label: 'New' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

const NEXT_STATUS: Record<string, string> = {
    new: 'confirmed',
    confirmed: 'shipped',
    shipped: 'delivered',
};

const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
        new: 'bg-blue-100 text-blue-700 border-blue-200',
        confirmed: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        shipped: 'bg-purple-100 text-purple-700 border-purple-200',
        delivered: 'bg-green-100 text-green-700 border-green-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200',
        returned: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return map[status] || map.new;
};

// ─── component ────────────────────────────────────────────────────────────────

const OrdersManagement = () => {
    const queryClient = useQueryClient();

    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const { showSuccess, showError } = useToast();

    // ── paginated orders ──────────────────────────────────────────────────────
    const { data, isLoading } = useQuery({
        queryKey: ['admin-orders', selectedStatus, searchQuery, page],
        queryFn: async () => {
            const params: Record<string, string> = {
                page: String(page),
                limit: '20',
            };
            if (selectedStatus !== 'all') params.status = selectedStatus;
            if (searchQuery) params.search = searchQuery;

            const res = await api.get('/orders/admin/all', { params });
            return res.data.data;
        },
    });

    const orders = data?.orders || [];
    const pagination = data?.pagination;
    const totalPages = pagination?.pages || 1;

    // ── all orders (for status-tab counts) ───────────────────────────────────
    const { data: allOrders } = useQuery({
        queryKey: ['admin-orders-counts'],
        queryFn: async () => {
            const res = await api.get('/orders/admin/all', {
                params: { limit: '1000' },
            });
            return res.data.data.orders as any[];
        },
        staleTime: 30_000,
    });

    const countByStatus = (status: string) =>
        status === 'all'
            ? (allOrders?.length ?? 0)
            : (allOrders?.filter((o: any) => o.status === status).length ?? 0);

    // ── status mutation ───────────────────────────────────────────────────────
    const { mutate: updateStatus } = useMutation({
        mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
            setUpdatingId(orderId);
            setUpdatingStatus(status);
            return api.patch(`/orders/${orderId}/status`, { status });
        },

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin-orders-counts'] });
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });

            setSelectedOrder(null);

            const formatStatus = (s: string) =>
                s.charAt(0).toUpperCase() + s.slice(1);

            showSuccess(`Order moved to ${formatStatus(variables.status)}`);
        },

        onError: () => {
            showError('Failed to update order status');
        },

        onSettled: () => {
            setUpdatingId(null);
            setUpdatingStatus(null);
        },
    });

    // ── search debounce ───────────────────────────────────────────────────────
    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearchChange = (val: string) => {
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => {
            setSearchQuery(val.trim());
            setPage(1);
        }, 400);
    };

    useEffect(() => () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); }, []);

    // ── render ────────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#F7F7F7] min-h-screen p-6">
            <div className="max-w-350 mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Orders Management</h1>
                    <p className="text-[#818B9C]">Manage all your COD orders</p>
                </div>

                {/* Status Tabs */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-2 mb-6 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => { setSelectedStatus(opt.value); setPage(1); }}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${selectedStatus === opt.value
                                    ? 'bg-[#C85A3A] text-white'
                                    : 'text-[#818B9C] hover:bg-[#F7F7F7]'
                                    }`}
                            >
                                {opt.label}
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${selectedStatus === opt.value
                                    ? 'bg-white/20 text-white'
                                    : 'bg-[#F7F7F7] text-[#818B9C]'
                                    }`}>
                                    {countByStatus(opt.value)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-4 mb-6">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#818B9C]" />
                        <input
                            disabled={isLoading}
                            type="text"
                            placeholder="Search by order #, customer, or phone..."
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-[#E4E9EE] rounded-lg text-sm focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#F7F7F7] border-b border-[#E4E9EE]">
                                <tr>
                                    {['Order #', 'Customer', 'Phone', 'Items', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                                        <th
                                            key={h}
                                            className={`py-4 px-4 text-sm font-semibold text-[#818B9C] ${h === 'Items' || h === 'Status' || h === 'Actions'
                                                ? 'text-center'
                                                : h === 'Total'
                                                    ? 'text-right'
                                                    : 'text-left'
                                                }`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading
                                    ? Array.from({ length: 8 }).map((_, i) => (
                                        <tr key={i} className="border-b border-[#E4E9EE]">
                                            {Array.from({ length: 8 }).map((_, j) => (
                                                <td key={j} className="py-4 px-4">
                                                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                    : orders.map((order: any) => (
                                        <tr
                                            key={order._id}
                                            className="border-b border-[#E4E9EE] hover:bg-[#F7F7F7] transition-colors"
                                        >
                                            <td className="py-4 px-4 font-mono text-sm text-[#818B9C]">
                                                {order.orderNumber}
                                            </td>
                                            <td className="py-4 px-4 font-medium text-[#0B0F0E]">
                                                {order.customer?.name}
                                            </td>
                                            <td className="py-4 px-4 text-[#818B9C] text-sm">
                                                {order.customer?.phone}
                                            </td>
                                            <td className="py-4 px-4 text-center text-[#0B0F0E]">
                                                {order.items?.length}
                                            </td>
                                            <td className="py-4 px-4 text-right font-semibold text-[#C85A3A]">
                                                ৳{order.total}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.status)}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-[#818B9C]">
                                                {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="p-2 text-[#818B9C] hover:text-[#C85A3A] hover:bg-[#FFF5F2] rounded-lg transition-all"
                                                        title="View details"
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                    </button>
                                                    {NEXT_STATUS[order.status] && (
                                                        <button
                                                            onClick={() => updateStatus({ orderId: order._id, status: NEXT_STATUS[order.status] })}
                                                            disabled={updatingId === order._id}
                                                            className="px-3 py-1.5 bg-[#C85A3A] text-white text-xs font-semibold rounded-lg hover:bg-[#A84830] transition-all disabled:opacity-50 whitespace-nowrap"
                                                        >
                                                            {updatingId === order._id
                                                                ? <FaSpinner className="animate-spin inline mr-1" />
                                                                : <span className="mr-1">→</span>
                                                            }
                                                            {NEXT_STATUS[order.status].charAt(0).toUpperCase() + NEXT_STATUS[order.status].slice(1)}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    {!isLoading && orders.length === 0 && (
                        <div className="text-center py-16 text-[#818B9C]">
                            <FaSearch className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p>No orders found</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-[#C85A3A] text-[#C85A3A] rounded-lg text-sm font-semibold hover:bg-[#C85A3A] hover:text-white transition-all disabled:opacity-40"
                        >
                            ← Prev
                        </button>
                        <span className="px-4 py-2 text-sm text-[#818B9C]">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-[#C85A3A] text-[#C85A3A] rounded-lg text-sm font-semibold hover:bg-[#C85A3A] hover:text-white transition-all disabled:opacity-40"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* ── Order Detail Modal ───────────────────────────────────────── */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

                        {/* Modal header */}
                        <div className="sticky top-0 bg-white border-b border-[#E4E9EE] p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#0B0F0E]">
                                    {selectedOrder.orderNumber}
                                </h2>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusBadge(selectedOrder.status)}`}>
                                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-[#F7F7F7] rounded-lg transition-colors"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">

                            {/* Customer */}
                            <div>
                                <h3 className="text-base font-semibold text-[#0B0F0E] mb-3">Customer</h3>
                                <div className="space-y-2 bg-[#F7F7F7] p-4 rounded-lg text-sm">
                                    <p className="font-semibold text-[#0B0F0E]">{selectedOrder.customer?.name}</p>
                                    <div className="flex items-center gap-2 text-[#818B9C]">
                                        <FaPhone className="text-[#C85A3A]" />
                                        {selectedOrder.customer?.phone}
                                    </div>
                                    {selectedOrder.customer?.email && (
                                        <p className="text-[#818B9C]">{selectedOrder.customer.email}</p>
                                    )}
                                    <div className="flex items-start gap-2 text-[#818B9C]">
                                        <FaMapMarkerAlt className="text-[#C85A3A] mt-0.5 shrink-0" />
                                        <span>
                                            {selectedOrder.customer?.address?.street},&nbsp;
                                            {selectedOrder.customer?.address?.area},&nbsp;
                                            {selectedOrder.customer?.address?.city}
                                            {' '}({selectedOrder.customer?.address?.deliveryLocation === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="text-base font-semibold text-[#0B0F0E] mb-3">Items</h3>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-[#F7F7F7] rounded-lg text-sm">
                                            <div>
                                                <p className="font-semibold text-[#0B0F0E]">
                                                    {item.productName || `Product ${i + 1}`}
                                                </p>
                                                <p className="text-[#818B9C]">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="font-semibold text-[#C85A3A]">
                                                ৳{item.price ? item.price * item.quantity : item.subtotal || '—'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="space-y-2 bg-[#F7F7F7] p-4 rounded-lg text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#818B9C]">Subtotal</span>
                                    <span className="font-semibold">৳{selectedOrder.subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#818B9C]">Delivery</span>
                                    <span className="font-semibold">৳{selectedOrder.deliveryCharge}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-[#E4E9EE]">
                                    <span className="font-semibold text-[#0B0F0E]">Total (COD)</span>
                                    <span className="font-bold text-[#C85A3A] text-lg">৳{selectedOrder.total}</span>
                                </div>
                            </div>

                            {/* Customer notes */}
                            {selectedOrder.customerNotes && (
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm">
                                    <p className="font-semibold text-[#0B0F0E] mb-1">Customer Note</p>
                                    <p className="text-[#818B9C]">{selectedOrder.customerNotes}</p>
                                </div>
                            )}

                            {/* Status actions */}
                            <div>
                                <h3 className="text-base font-semibold text-[#0B0F0E] mb-3">Update Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => updateStatus({ orderId: selectedOrder._id, status: s })}
                                            disabled={
                                                updatingId === selectedOrder._id ||
                                                selectedOrder.status === s ||
                                                selectedOrder.status === 'delivered' ||
                                                selectedOrder.status === 'cancelled'
                                            }
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${selectedOrder.status === s
                                                ? 'bg-[#C85A3A] text-white cursor-default'
                                                : 'border border-[#C85A3A] text-[#C85A3A] hover:bg-[#C85A3A] hover:text-white'
                                                }`}
                                        >
                                            {updatingStatus === s
                                                ? <FaSpinner className="animate-spin inline mr-1" />
                                                : null
                                            }
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersManagement;