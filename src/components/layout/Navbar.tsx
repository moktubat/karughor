"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaSearch, FaUser } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";

const Navbar: React.FC = () => {
    const router = useRouter();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogoClick = useCallback(() => {
        router.push("/");
    }, [router]);

    const handleCartClick = useCallback(() => {
        router.push("/cart");
    }, [router]);

    const handleUserClick = useCallback(() => {
        setShowUserMenu((prev) => !prev);
    }, []);

    return (
        <nav className="bg-white w-full shadow-sm">
            <div className="max-w-300 mx-auto px-6 py-4 flex items-center justify-between gap-6 flex-wrap md:flex-nowrap">
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
                        className="hover:opacity-70 transition"
                    >
                        <FaCartPlus className="w-6 h-6" />
                    </button>

                    <div className="w-px h-6 bg-gray-300" />

                    {/* User */}
                    <div className="relative">
                        <button
                            onClick={handleUserClick}
                            aria-label="User account"
                            className="hover:opacity-70 transition"
                        >
                            <FaUser className="w-6 h-6" />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg min-w-50 overflow-hidden z-50">
                                <div className="px-4 py-3 font-semibold border-b">
                                    Guest User
                                </div>
                                <div
                                    onClick={() => router.push("/profile")}
                                    className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-100"
                                >
                                    Profile
                                </div>
                                <div
                                    onClick={() => router.push("/orders")}
                                    className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-100"
                                >
                                    My Orders
                                </div>
                                <div
                                    onClick={() => router.push("/login")}
                                    className="px-4 py-3 text-sm cursor-pointer text-red-500 hover:bg-red-50"
                                >
                                    Login
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
