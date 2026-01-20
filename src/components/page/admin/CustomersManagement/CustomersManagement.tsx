'use client';

import React, { useState } from 'react';
import {
    FaSearch,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaBan,
    FaCheckCircle,
    FaEye,
    FaExclamationTriangle,
} from 'react-icons/fa';

interface Customer {
    id: number;
    name: string;
    phone: string;
    email?: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
    cancelledOrders: number;
    isBlocked: boolean;
    joinDate: string;
    lastOrder: string;
}

const CustomersManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showCustomerDetails, setShowCustomerDetails] = useState(false);

    const [customers, setCustomers] = useState<Customer[]>([
        {
            id: 1,
            name: 'Kamal Hassan',
            phone: '+880 1712-345678',
            email: 'kamal@example.com',
            address: 'House 12, Road 5, Dhanmondi, Dhaka-1205',
            totalOrders: 12,
            totalSpent: 2450,
            cancelledOrders: 1,
            isBlocked: false,
            joinDate: '2024-01-10',
            lastOrder: '2024-01-20',
        },
        {
            id: 2,
            name: 'Fatima Rahman',
            phone: '+880 1812-345678',
            email: 'fatima@example.com',
            address: 'Flat 3B, Building 7, Bashundhara R/A, Dhaka',
            totalOrders: 8,
            totalSpent: 1890,
            cancelledOrders: 0,
            isBlocked: false,
            joinDate: '2024-01-05',
            lastOrder: '2024-01-19',
        },
        {
            id: 3,
            name: 'Ahmed Ali',
            phone: '+880 1912-345678',
            address: 'Village: Savar, District: Dhaka',
            totalOrders: 5,
            totalSpent: 650,
            cancelledOrders: 3,
            isBlocked: false,
            joinDate: '2023-12-20',
            lastOrder: '2024-01-18',
        },
        {
            id: 4,
            name: 'Spam User',
            phone: '+880 1512-999999',
            address: 'Unknown',
            totalOrders: 10,
            totalSpent: 0,
            cancelledOrders: 10,
            isBlocked: true,
            joinDate: '2024-01-01',
            lastOrder: '2024-01-15',
        },
    ]);

    const toggleBlock = (id: number) => {
        setCustomers((prev) =>
            prev.map((c) => (c.id === id ? { ...c, isBlocked: !c.isBlocked } : c))
        );
    };

    const handleViewDetails = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowCustomerDetails(true);
    };

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.includes(searchQuery) ||
            customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const frequentCancellers = customers.filter(
        (c) => c.cancelledOrders >= 3 && !c.isBlocked
    );
    const blockedCustomers = customers.filter((c) => c.isBlocked);

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">
                        Customers Management
                    </h1>
                    <p className="text-[#818B9C]">Manage your customer base and track behavior</p>
                </div>

                {/* Alert Cards */}
                {(frequentCancellers.length > 0 || blockedCustomers.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {frequentCancellers.length > 0 && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaExclamationTriangle className="text-orange-600 w-6 h-6" />
                                    <h3 className="text-lg font-semibold text-orange-900">
                                        Frequent Cancellers
                                    </h3>
                                </div>
                                <p className="text-orange-700 mb-4">
                                    {frequentCancellers.length} customer(s) with 3+ cancelled orders
                                </p>
                                <div className="space-y-2">
                                    {frequentCancellers.slice(0, 3).map((customer) => (
                                        <div
                                            key={customer.id}
                                            className="flex justify-between items-center text-sm"
                                        >
                                            <span className="text-orange-900">{customer.name}</span>
                                            <span className="font-semibold text-orange-600">
                                                {customer.cancelledOrders} cancelled
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {blockedCustomers.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaBan className="text-red-600 w-6 h-6" />
                                    <h3 className="text-lg font-semibold text-red-900">
                                        Blocked Customers
                                    </h3>
                                </div>
                                <p className="text-red-700 mb-4">
                                    {blockedCustomers.length} customer(s) currently blocked
                                </p>
                                <div className="space-y-2">
                                    {blockedCustomers.slice(0, 3).map((customer) => (
                                        <div key={customer.id} className="text-sm text-red-900">
                                            {customer.name} - {customer.phone}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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

                {/* Customers Table */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#F7F7F7]">
                                <tr>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Customer
                                    </th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Contact
                                    </th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Total Orders
                                    </th>
                                    <th className="text-right py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Total Spent
                                    </th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Cancelled
                                    </th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Status
                                    </th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="border-t border-[#E4E9EE] hover:bg-[#F7F7F7] transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-semibold text-[#0B0F0E]">
                                                    {customer.name}
                                                </p>
                                                <p className="text-sm text-[#818B9C]">
                                                    Joined: {customer.joinDate}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaPhone className="text-[#C85A3A] w-3 h-3" />
                                                    <span className="text-[#0B0F0E]">
                                                        {customer.phone}
                                                    </span>
                                                </div>
                                                {customer.email && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FaEnvelope className="text-[#C85A3A] w-3 h-3" />
                                                        <span className="text-[#818B9C]">
                                                            {customer.email}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center font-semibold text-[#0B0F0E]">
                                            {customer.totalOrders}
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-[#C85A3A]">
                                            ${customer.totalSpent}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${customer.cancelledOrders >= 3
                                                        ? 'bg-red-100 text-red-700'
                                                        : customer.cancelledOrders > 0
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : 'bg-green-100 text-green-700'
                                                    }`}
                                            >
                                                {customer.cancelledOrders}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${customer.isBlocked
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-green-100 text-green-700'
                                                        }`}
                                                >
                                                    {customer.isBlocked ? 'Blocked' : 'Active'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(customer)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => toggleBlock(customer.id)}
                                                    className={`p-2 rounded-lg transition-colors ${customer.isBlocked
                                                            ? 'text-green-600 hover:bg-green-50'
                                                            : 'text-red-600 hover:bg-red-50'
                                                        }`}
                                                    title={
                                                        customer.isBlocked
                                                            ? 'Unblock Customer'
                                                            : 'Block Customer'
                                                    }
                                                >
                                                    {customer.isBlocked ? (
                                                        <FaCheckCircle />
                                                    ) : (
                                                        <FaBan />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredCustomers.length === 0 && (
                        <div className="text-center py-12 text-[#818B9C]">
                            No customers found
                        </div>
                    )}
                </div>

                {/* Customer Details Modal */}
                {showCustomerDetails && selectedCustomer && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-[#E4E9EE] p-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-[#0B0F0E]">
                                    Customer Details
                                </h2>
                                <button
                                    onClick={() => setShowCustomerDetails(false)}
                                    className="p-2 hover:bg-[#F7F7F7] rounded-lg transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-[#0B0F0E] mb-4">
                                        Personal Information
                                    </h3>
                                    <div className="space-y-3 bg-[#F7F7F7] p-4 rounded-lg">
                                        <div>
                                            <span className="text-sm text-[#818B9C]">Name:</span>
                                            <p className="font-semibold text-[#0B0F0E]">
                                                {selectedCustomer.name}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaPhone className="text-[#C85A3A]" />
                                            <span className="text-[#0B0F0E]">
                                                {selectedCustomer.phone}
                                            </span>
                                        </div>
                                        {selectedCustomer.email && (
                                            <div className="flex items-center gap-2">
                                                <FaEnvelope className="text-[#C85A3A]" />
                                                <span className="text-[#0B0F0E]">
                                                    {selectedCustomer.email}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-2">
                                            <FaMapMarkerAlt className="text-[#C85A3A] mt-1" />
                                            <span className="text-[#0B0F0E]">
                                                {selectedCustomer.address}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Statistics */}
                                <div>
                                    <h3 className="text-lg font-semibold text-[#0B0F0E] mb-4">
                                        Order Statistics
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-sm text-[#818B9C] mb-1">
                                                Total Orders
                                            </p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {selectedCustomer.totalOrders}
                                            </p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-[#818B9C] mb-1">Total Spent</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                ${selectedCustomer.totalSpent}
                                            </p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <p className="text-sm text-[#818B9C] mb-1">Cancelled</p>
                                            <p className="text-2xl font-bold text-red-600">
                                                {selectedCustomer.cancelledOrders}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <p className="text-sm text-[#818B9C] mb-1">Last Order</p>
                                            <p className="text-lg font-semibold text-purple-600">
                                                {selectedCustomer.lastOrder}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => toggleBlock(selectedCustomer.id)}
                                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${selectedCustomer.isBlocked
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                    >
                                        {selectedCustomer.isBlocked
                                            ? 'Unblock Customer'
                                            : 'Block Customer'}
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

export default CustomersManagement;