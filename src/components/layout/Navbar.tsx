'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaChevronDown, FaSearch, FaUser } from 'react-icons/fa';
import { FaCartPlus } from 'react-icons/fa6';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/lib/authService';

const Navbar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout: logoutStore } = useAuthStore();

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const userMenuRef = useRef<HTMLDivElement | null>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setShowUserMenu(false);
    }, [pathname]);

    const handleLogoClick = useCallback(() => {
        router.push('/');
    }, [router]);

    const handleCartClick = useCallback(() => {
        router.push('/cart');
    }, [router]);

    const handleUserClick = useCallback(() => {
        setShowUserMenu((prev) => !prev);
    }, []);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            setShowUserMenu(false);

            // Logout and clear state
            await authService.logout();
            logoutStore();

            // Force reload to home page
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if API fails, still clear local state and redirect
            logoutStore();
            window.location.href = '/';
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleProfileClick = () => {
        setShowUserMenu(false);
        if (isAuthenticated) {
            router.push('/profile');
        } else {
            router.push('/login');
        }
    };

    return (
        <nav className="bg-white w-full shadow-sm">
            <div className="max-w-300 mx-auto py-4 flex items-center justify-between gap-6 flex-wrap md:flex-nowrap">
                {/* Logo */}
                <div
                    onClick={handleLogoClick}
                    className="text-2xl font-bold whitespace-nowrap cursor-pointer"
                >
                    Karughor
                </div>

                {/* Search Box */}
                <div className="flex items-center gap-4 bg-gray-100 rounded-lg px-4 py-3 flex-1 max-w-175 order-3 md:order-0 w-full md:w-auto">
                    {/* Category */}
                    <div className="hidden md:flex items-center gap-2 text-sm font-medium cursor-pointer whitespace-nowrap">
                        All Categories
                        <FaChevronDown />
                    </div>

                    <div className="hidden md:block w-px h-6 bg-gray-300" />

                    {/* Input */}
                    <input
                        type="text"
                        placeholder="Search on Karughor..."
                        className="flex-1 bg-transparent outline-none text-sm font-medium placeholder-gray-500"
                    />

                    {/* Search Button */}
                    <button className="text-gray-500 hover:text-gray-900 transition">
                        <FaSearch />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 relative">
                    {/* Cart */}
                    <button
                        onClick={handleCartClick}
                        aria-label="Shopping cart"
                        className="hover:opacity-70 transition cursor-pointer"
                    >
                        <FaCartPlus className="w-6 h-6" />
                    </button>

                    <div className="w-px h-6 bg-gray-300" />

                    {/* User */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={handleUserClick}
                            aria-label="User account"
                            className="hover:opacity-70 transition cursor-pointer"
                        >
                            <FaUser className="w-6 h-6" />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg min-w-50 overflow-hidden z-50">
                                <div className="px-4 py-3 font-semibold border-b">
                                    {isAuthenticated ? user?.fullName : 'Guest User'}
                                </div>

                                {isAuthenticated ? (
                                    <>
                                        <div
                                            onClick={handleProfileClick}
                                            className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-100"
                                        >
                                            Profile
                                        </div>

                                        <div
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                router.push('/profile?tab=orders');
                                            }}
                                            className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-100"
                                        >
                                            My Orders
                                        </div>

                                        <div
                                            onClick={handleLogout}
                                            className="px-4 py-3 text-sm cursor-pointer text-red-500 hover:bg-red-50"
                                        >
                                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                router.push('/login');
                                            }}
                                            className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-100"
                                        >
                                            Login
                                        </div>

                                        <div
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                router.push('/register');
                                            }}
                                            className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-100"
                                        >
                                            Register
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;