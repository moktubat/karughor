'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/lib/authService';
import api from '@/lib/api';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const { admin } = useAuthStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('admin_token');

                if (!token) {
                    router.replace('/admin/login');
                    return;
                }

                await api.get('/auth/admin/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAuthChecked(true);
            } catch (err) {
                router.replace('/admin/login');
            }
        };

        if (mounted && pathname !== '/admin/login') {
            checkAuth();
        }
    }, [mounted, pathname, router]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
                <div className="text-[#818B9C]">Loading...</div>
            </div>
        );
    }

    if (!authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
                <div className="text-[#818B9C]">Verifying access...</div>
            </div>
        );
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

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await authService.adminLogout();
        } finally {
            window.location.href = '/admin/login';
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#F7F7F7]">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-[#E4E9EE] px-4 py-4 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-xl font-bold text-[#0B0F0E]">Admin Panel</h1>
                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            <div className="flex max-w-350 mx-auto">
                {/* Sidebar */}
                <aside
                    className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-[#E4E9EE] transition-transform duration-300 z-40 w-56
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                >
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-[#E4E9EE]">
                            <h1 className="text-2xl font-bold text-[#C85A3A]">Admin Panel</h1>
                            <p className="text-sm text-[#818B9C] mt-1">
                                {admin?.fullName || 'Administrator'}
                            </p>
                        </div>

                        <nav className="flex-1 py-4 px-4 overflow-y-auto">
                            <ul className="space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive(item.href)
                                                    ? 'bg-[#C85A3A] text-white'
                                                    : 'text-[#0B0F0E] hover:bg-[#F7F7F7]'
                                                    }`}
                                            >
                                                <Icon />
                                                {item.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <div className="p-4 border-t border-[#E4E9EE]">
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg"
                            >
                                <FaSignOutAlt />
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main */}
                <main className="flex-1 min-h-screen">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;