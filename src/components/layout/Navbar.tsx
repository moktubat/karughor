'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaChevronDown, FaSearch, FaUser } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/lib/authService';
import { categoryService } from '@/lib/categoryService';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { useCartStore } from '@/store/cartStore';
import { MdOutlineShoppingCart } from 'react-icons/md';

// Shown instantly while the API warms up — replaced silently when real data arrives
const STATIC_CATEGORIES = [
    { _id: '1', name: 'Jute Rug', slug: 'jute-rug', icon: 'GiBasket', subCategories: [] },
    { _id: '2', name: "Ladies' Bags & Purses", slug: 'ladies-bags-purses', icon: 'FaShoppingBag', subCategories: [] },
    { _id: '3', name: 'Planter Baskets', slug: 'planter-baskets', icon: 'GiFlowerPot', subCategories: [] },
    { _id: '4', name: 'Laundry Baskets', slug: 'laundry-baskets', icon: 'MdLocalLaundryService', subCategories: [] },
    { _id: '5', name: 'Shotoronji', slug: 'shotoronji', icon: 'BsGrid3X2Gap', subCategories: [] },
    { _id: '6', name: 'Dining Placemats', slug: 'dining-placemats', icon: 'FaUtensils', subCategories: [] },
    { _id: '7', name: 'Wall Art', slug: 'wall-art', icon: 'MdWallpaper', subCategories: [] },
    { _id: '8', name: 'Three-Piece Sets', slug: 'three-piece-sets', icon: 'FaTshirt', subCategories: [] },
    { _id: '9', name: 'Bed Sheets', slug: 'bed-sheets', icon: 'FaBed', subCategories: [] },
    { _id: '10', name: 'Nakshi Kantha', slug: 'nakshi-kantha', icon: 'GiSewingNeedle', subCategories: [] },
];

const Navbar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout: logoutStore, admin, isAdminAuthenticated } = useAuthStore();

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const totalItems = useCartStore((s) => s.totalItems());

    const userMenuRef = useRef<HTMLDivElement | null>(null);
    const categoryMenuRef = useRef<HTMLDivElement | null>(null);

    const isAdminPage = pathname.startsWith('/admin');

    const { data: apiCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getAll,
        staleTime: 5 * 60 * 1000,
        enabled: !isAdminPage,
    });

    // Show static categories immediately; swap to real data when API responds
    const categories = (apiCategories && apiCategories.length > 0) ? apiCategories : STATIC_CATEGORIES;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
            if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
                setShowCategoryMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setShowUserMenu(false);
        setShowCategoryMenu(false);
    }, [pathname]);

    const handleLogoClick = useCallback(() => router.push('/'), [router]);

    const handleSearch = useCallback(
        (e?: React.FormEvent) => {
            e?.preventDefault();
            const q = searchQuery.trim();
            if (q) {
                router.push(`/products?search=${encodeURIComponent(q)}`);
                setSearchQuery('');
            }
        },
        [searchQuery, router]
    );

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            setShowUserMenu(false);
            if (isAdminPage) {
                await authService.adminLogout();
                window.location.href = '/admin/login';
            } else {
                await authService.logout();
                logoutStore();
                window.location.href = '/';
            }
        } catch {
            logoutStore();
            window.location.href = isAdminPage ? '/admin/login' : '/';
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleProfileClick = () => {
        setShowUserMenu(false);
        if (isAdminPage) router.push('/admin/profile');
        else if (isAuthenticated) router.push('/profile');
        else router.push('/login');
    };

    const currentUserName = isAdminPage ? (admin?.fullName || 'Guest User') : (user?.fullName || 'Guest User');
    const currentIsAuthenticated = isAdminPage ? isAdminAuthenticated : isAuthenticated;

    return (
        <nav className="bg-white w-full shadow-sm sticky top-0 z-50">
            <div className="max-w-300 mx-auto py-4 px-4 flex items-center justify-between gap-6 flex-wrap md:flex-nowrap">
                {/* Logo */}
                <div
                    onClick={handleLogoClick}
                    className="text-2xl font-bold whitespace-nowrap cursor-pointer text-[#0B0F0E]"
                >
                    Karughor
                </div>

                {/* Search Box */}
                {!isAdminPage && (
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2.5 flex-1 max-w-175 order-3 md:order-0 w-full md:w-auto"
                    >
                        {/* All Categories Dropdown */}
                        <div className="relative hidden md:block" ref={categoryMenuRef}>
                            <button
                                type="button"
                                onClick={() => setShowCategoryMenu((prev) => !prev)}
                                className="flex items-center gap-2 text-sm font-medium cursor-pointer whitespace-nowrap text-[#0B0F0E] hover:text-[#C85A3A] transition-colors"
                            >
                                All Categories
                                <FaChevronDown className={`w-3 h-3 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showCategoryMenu && (
                                <div className="absolute top-full left-0 mt-3 bg-white rounded-xl shadow-xl border border-[#E4E9EE] w-72 z-50 py-2 max-h-[70vh] overflow-y-auto">
                                    <div className="px-4 py-2 text-xs font-semibold text-[#818B9C] uppercase tracking-wider border-b border-[#E4E9EE]">
                                        Browse Categories
                                    </div>

                                    {categories.map((cat) => {
                                        const IconComponent = getCategoryIcon(cat.icon);
                                        return (
                                            <div key={cat._id}>
                                                <Link
                                                    href={`/products?category=${cat.slug}`}
                                                    onClick={() => setShowCategoryMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FFF5F2] hover:text-[#C85A3A] transition-colors group"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-[#F7F7F7] group-hover:bg-[#C85A3A]/10 flex items-center justify-center shrink-0">
                                                        <IconComponent className="w-4 h-4 text-[#818B9C] group-hover:text-[#C85A3A]" />
                                                    </div>
                                                    <span className="text-sm font-medium text-[#0B0F0E] group-hover:text-[#C85A3A] line-clamp-1">
                                                        {cat.name}
                                                    </span>
                                                </Link>

                                                {cat.subCategories && cat.subCategories.filter(s => s.isActive).length > 0 && (
                                                    <div className="pl-14 pb-1">
                                                        {cat.subCategories.filter(s => s.isActive).map((sub) => (
                                                            <Link
                                                                key={sub._id}
                                                                href={`/products?category=${cat.slug}&sub=${sub.slug}`}
                                                                onClick={() => setShowCategoryMenu(false)}
                                                                className="block text-xs text-[#818B9C] py-1 hover:text-[#C85A3A] transition-colors"
                                                            >
                                                                › {sub.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    <div className="border-t border-[#E4E9EE] mt-1 pt-1">
                                        <Link
                                            href="/products"
                                            onClick={() => setShowCategoryMenu(false)}
                                            className="flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-[#C85A3A] hover:bg-[#FFF5F2] transition-colors"
                                        >
                                            View All Products →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="hidden md:block w-px h-5 bg-gray-300" />

                        {/* Search Input */}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search on Karughor..."
                            className="flex-1 bg-transparent outline-none text-sm font-medium placeholder-gray-500"
                        />

                        <button
                            type="submit"
                            aria-label="Search"
                            className="text-gray-500 hover:text-[#C85A3A] transition-colors"
                        >
                            <FaSearch />
                        </button>
                    </form>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {!isAdminPage && (
                        <>
                            <Link href="/cart" className="relative">
                                <button className="p-2 text-[#0B0F0E] hover:text-[#C85A3A] transition-colors">
                                    <MdOutlineShoppingCart className="w-6 h-6" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C85A3A] text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {totalItems > 9 ? '9+' : totalItems}
                                        </span>
                                    )}
                                </button>
                            </Link>
                            <div className="w-px h-6 bg-gray-300" />
                        </>
                    )}

                    {/* User Menu */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setShowUserMenu((prev) => !prev)}
                            aria-label="User account"
                            className="hover:text-[#C85A3A] transition-colors cursor-pointer"
                        >
                            <FaUser className="w-6 h-6" />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-3 bg-white rounded-xl shadow-xl border border-[#E4E9EE] min-w-45 overflow-hidden z-50">
                                <div className="px-4 py-3 font-semibold border-b border-[#E4E9EE] text-[#0B0F0E]">
                                    {currentUserName}
                                    {isAdminPage && admin && (
                                        <span className="block text-xs text-[#818B9C] font-normal mt-0.5">
                                            {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                        </span>
                                    )}
                                </div>

                                {currentIsAuthenticated ? (
                                    <>
                                        <div onClick={handleProfileClick} className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 text-[#0B0F0E]">
                                            Profile
                                        </div>
                                        {!isAdminPage && (
                                            <div
                                                onClick={() => { setShowUserMenu(false); router.push('/profile?tab=orders'); }}
                                                className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 text-[#0B0F0E]"
                                            >
                                                My Orders
                                            </div>
                                        )}
                                        <div onClick={handleLogout} className="px-4 py-3 text-sm cursor-pointer text-red-500 hover:bg-red-50">
                                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            onClick={() => { setShowUserMenu(false); router.push(isAdminPage ? '/admin/login' : '/login'); }}
                                            className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 text-[#0B0F0E]"
                                        >
                                            Login
                                        </div>
                                        {!isAdminPage && (
                                            <div
                                                onClick={() => { setShowUserMenu(false); router.push('/register'); }}
                                                className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 text-[#0B0F0E]"
                                            >
                                                Register
                                            </div>
                                        )}
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