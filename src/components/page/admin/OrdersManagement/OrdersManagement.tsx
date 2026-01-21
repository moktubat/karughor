'use client';

import React, { useState } from 'react';
import {
    FaSearch,
    FaFilter,
    FaEye,
    FaPrint,
    FaCheckCircle,
    FaTruck,
    FaTimes,
    FaPhone,
    FaMapMarkerAlt,
} from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    phone: string;
    address: string;
    products: {
        name: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    deliveryCharge: number;
    status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    paymentMethod: 'COD';
    orderDate: string;
    deliveryDate?: string;
    notes?: string;
}

const OrdersManagement = () => {
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    // Mock data
    const orders: Order[] = [
        {
            id: '1',
            orderNumber: 'ORD-001',
            customerName: 'Kamal Hassan',
            phone: '+880 1712-345678',
            address: 'House 12, Road 5, Dhanmondi, Dhaka-1205',
            products: [
                { name: 'Logitech G502 Hero', quantity: 1, price: 89 },
                { name: 'Gaming Keyboard', quantity: 1, price: 120 },
            ],
            totalAmount: 209,
            deliveryCharge: 70,
            status: 'new',
            paymentMethod: 'COD',
            orderDate: '2024-01-20 10:30 AM',
        },
        {
            id: '2',
            orderNumber: 'ORD-002',
            customerName: 'Fatima Rahman',
            phone: '+880 1812-345678',
            address: 'Flat 3B, Building 7, Bashundhara R/A, Dhaka',
            products: [{ name: 'Wireless Mouse', quantity: 2, price: 45 }],
            totalAmount: 90,
            deliveryCharge: 70,
            status: 'confirmed',
            paymentMethod: 'COD',
            orderDate: '2024-01-20 09:15 AM',
            notes: 'Customer requested morning delivery',
        },
        {
            id: '3',
            orderNumber: 'ORD-003',
            customerName: 'Ahmed Ali',
            phone: '+880 1912-345678',
            address: 'Village: Savar, District: Dhaka',
            products: [{ name: 'Headphone Stand', quantity: 1, price: 25 }],
            totalAmount: 25,
            deliveryCharge: 120,
            status: 'shipped',
            paymentMethod: 'COD',
            orderDate: '2024-01-19 02:45 PM',
        },
    ];

    const statusOptions = [
        { value: 'all', label: 'All Orders', count: orders.length },
        { value: 'new', label: 'New', count: orders.filter((o) => o.status === 'new').length },
        {
            value: 'confirmed',
            label: 'Confirmed',
            count: orders.filter((o) => o.status === 'confirmed').length,
        },
        {
            value: 'shipped',
            label: 'Shipped',
            count: orders.filter((o) => o.status === 'shipped').length,
        },
        {
            value: 'delivered',
            label: 'Delivered',
            count: orders.filter((o) => o.status === 'delivered').length,
        },
        {
            value: 'cancelled',
            label: 'Cancelled',
            count: orders.filter((o) => o.status === 'cancelled').length,
        },
    ];

    const getStatusBadge = (status: string) => {
        const badges = {
            new: 'bg-blue-100 text-blue-700 border-blue-200',
            confirmed: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            shipped: 'bg-purple-100 text-purple-700 border-purple-200',
            delivered: 'bg-green-100 text-green-700 border-green-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200',
            returned: 'bg-gray-100 text-gray-700 border-gray-200',
        };
        return badges[status as keyof typeof badges] || badges.new;
    };

    const handleStatusChange = (orderId: string, newStatus: string) => {
        console.log(`Changing order ${orderId} to ${newStatus}`);
        // Implement status change logic
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handlePrintInvoice = (order: Order) => {
        console.log('Printing invoice for', order.orderNumber);
        // Implement print logic
    };

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.phone.includes(searchQuery);
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Orders Management</h1>
                    <p className="text-[#818B9C]">Manage all your COD orders</p>
                </div>

                {/* Status Tabs */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-2 mb-6 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setSelectedStatus(option.value)}
                                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${selectedStatus === option.value
                                        ? 'bg-[#C85A3A] text-white'
                                        : 'text-[#818B9C] hover:bg-[#F7F7F7]'
                                    }`}
                            >
                                {option.label} ({option.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#818B9C]" />
                            <input
                                type="text"
                                placeholder="Search by order number, customer name, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-[#E4E9EE] rounded-lg focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 border border-[#E4E9EE] rounded-lg hover:bg-[#F7F7F7] transition-colors">
                            <FaFilter />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#F7F7F7]">
                                <tr>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Order #
                                    </th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Customer
                                    </th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Phone
                                    </th>
                                    <th className="text-right py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Amount
                                    </th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Status
                                    </th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Date
                                    </th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-t border-[#E4E9EE] hover:bg-[#F7F7F7] transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <span className="font-semibold text-[#C85A3A]">
                                                {order.orderNumber}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-[#0B0F0E]">
                                            {order.customerName}
                                        </td>
                                        <td className="py-4 px-4 text-[#818B9C] text-sm">
                                            {order.phone}
                                        </td>
                                        <td className="py-4 px-4 text-right font-semibold text-[#0B0F0E]">
                                            ${order.totalAmount + order.deliveryCharge}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-center">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(order.id, e.target.value)
                                                    }
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer ${getStatusBadge(
                                                        order.status
                                                    )}`}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="returned">Returned</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-[#818B9C] text-sm">
                                            {order.orderDate}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(order)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => handlePrintInvoice(order)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Print Invoice"
                                                >
                                                    <FaPrint />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12 text-[#818B9C]">
                            No orders found
                        </div>
                    )}
                </div>

                {/* Order Details Modal */}
                {showOrderDetails && selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-[#E4E9EE] p-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-[#0B0F0E]">
                                    Order Details - {selectedOrder.orderNumber}
                                </h2>
                                <button
                                    onClick={() => setShowOrderDetails(false)}
                                    className="p-2 hover:bg-[#F7F7F7] rounded-lg transition-colors"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-[#0B0F0E] mb-4">
                                        Customer Information
                                    </h3>
                                    <div className="space-y-3 bg-[#F7F7F7] p-4 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-[#0B0F0E]">
                                                Name:
                                            </span>
                                            <span className="text-[#818B9C]">
                                                {selectedOrder.customerName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaPhone className="text-[#C85A3A]" />
                                            <span className="text-[#0B0F0E]">
                                                {selectedOrder.phone}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FaMapMarkerAlt className="text-[#C85A3A] mt-1" />
                                            <span className="text-[#0B0F0E]">
                                                {selectedOrder.address}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Products */}
                                <div>
                                    <h3 className="text-lg font-semibold text-[#0B0F0E] mb-4">
                                        Products
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedOrder.products.map((product, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center p-4 bg-[#F7F7F7] rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-semibold text-[#0B0F0E]">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-sm text-[#818B9C]">
                                                        Quantity: {product.quantity}
                                                    </p>
                                                </div>
                                                <span className="font-semibold text-[#C85A3A]">
                                                    ${product.price * product.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div>
                                    <h3 className="text-lg font-semibold text-[#0B0F0E] mb-4">
                                        Order Summary
                                    </h3>
                                    <div className="space-y-3 bg-[#F7F7F7] p-4 rounded-lg">
                                        <div className="flex justify-between">
                                            <span className="text-[#818B9C]">Subtotal:</span>
                                            <span className="font-semibold">
                                                ${selectedOrder.totalAmount}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#818B9C]">
                                                Delivery Charge:
                                            </span>
                                            <span className="font-semibold">
                                                ${selectedOrder.deliveryCharge}
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-3 border-t border-[#E4E9EE]">
                                            <span className="font-semibold text-[#0B0F0E]">
                                                Total (COD):
                                            </span>
                                            <span className="font-bold text-[#C85A3A] text-xl">
                                                $
                                                {selectedOrder.totalAmount +
                                                    selectedOrder.deliveryCharge}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedOrder.notes && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#0B0F0E] mb-4">
                                            Notes
                                        </h3>
                                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                            <p className="text-[#0B0F0E]">{selectedOrder.notes}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => handlePrintInvoice(selectedOrder)}
                                        className="flex-1 px-6 py-3 bg-white border border-[#C85A3A] text-[#C85A3A] rounded-lg font-semibold hover:bg-[#C85A3A] hover:text-white transition-all"
                                    >
                                        <FaPrint className="inline mr-2" />
                                        Print Invoice
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleStatusChange(selectedOrder.id, 'delivered');
                                            setShowOrderDetails(false);
                                        }}
                                        className="flex-1 px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all"
                                    >
                                        <FaCheckCircle className="inline mr-2" />
                                        Mark as Delivered
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersManagement;