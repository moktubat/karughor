'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaTachometerAlt,
    FaBox,
    FaShoppingCart,
    FaUsers,
    FaDollarSign,
    FaCog,
    FaBell,
    FaUser,
    FaBars,
    FaTimes,
    FaSignOutAlt,
} from 'react-icons/fa';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Don't show layout on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const menuItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: FaTachometerAlt },
        { name: 'Orders', href: '/admin/orders', icon: FaShoppingCart },
        { name: 'Products', href: '/admin/products', icon: FaBox },
        { name: 'Customers', href: '/admin/customers', icon: FaUsers },
        { name: 'Revenue', href: '/admin/revenue', icon: FaDollarSign },
        { name: 'Notifications', href: '/admin/notifications', icon: FaBell },
        { name: 'Settings', href: '/admin/settings', icon: FaCog },
        { name: 'Profile', href: '/admin/profile', icon: FaUser },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <div className="w-full min-h-screen bg-[#F7F7F7]">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-[#E4E9EE] px-4 py-4 flex items-center justify-between sticky top-0 z-50">
                <h1 className="text-xl font-bold text-[#0B0F0E]">Admin Panel</h1>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-[#F7F7F7] rounded-lg transition-colors"
                >
                    {sidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                </button>
            </div>

            <div className="flex max-w-300 mx-auto">
                {/* Sidebar */}
                <aside
                    className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-[#E4E9EE] transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                        } w-56`}
                >
                    <div className="h-full flex flex-col">
                        {/* Logo */}
                        <div className="p-4 border-b border-[#E4E9EE]">
                            <h1 className="text-2xl font-bold text-[#C85A3A]">Admin Panel</h1>
                            <p className="text-sm text-[#818B9C] mt-1">E-Commerce Dashboard</p>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto py-4 px-4">
                            <ul className="space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all ${isActive(item.href)
                                                    ? 'bg-[#C85A3A] text-white'
                                                    : 'text-[#0B0F0E] hover:bg-[#F7F7F7]'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{item.name}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* Logout */}
                        <div className="p-4 border-t border-[#E4E9EE]">
                            <button
                                onClick={() => {
                                    // Handle logout
                                    console.log('Logout clicked');
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                            >
                                <FaSignOutAlt className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;