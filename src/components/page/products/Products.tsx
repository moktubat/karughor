'use client';

import { ProductCard } from '@/components/common/ProductCard';
import { useLikedProducts } from '@/hooks/useLikedProducts';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MdKeyboardArrowRight, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/lib/categoryService';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://karughor-backend.onrender.com/api';
const ITEMS_PER_PAGE = 12;

// Shown instantly while the API warms up — replaced silently when real data arrives
const STATIC_CATEGORIES = [
    { _id: '1', name: 'Jute Rug', slug: 'jute-rug', icon: 'GiBasket' },
    { _id: '2', name: "Ladies' Bags & Purses", slug: 'ladies-bags-purses', icon: 'FaShoppingBag' },
    { _id: '3', name: 'Planter Baskets', slug: 'planter-baskets', icon: 'GiFlowerPot' },
    { _id: '4', name: 'Laundry Baskets', slug: 'laundry-baskets', icon: 'MdLocalLaundryService' },
    { _id: '5', name: 'Shotoronji', slug: 'shotoronji', icon: 'BsGrid3X2Gap' },
    { _id: '6', name: 'Dining Placemats', slug: 'dining-placemats', icon: 'FaUtensils' },
    { _id: '7', name: 'Wall Art', slug: 'wall-art', icon: 'MdWallpaper' },
    { _id: '8', name: 'Three-Piece Sets', slug: 'three-piece-sets', icon: 'FaTshirt' },
    { _id: '9', name: 'Bed Sheets', slug: 'bed-sheets', icon: 'FaBed' },
    { _id: '10', name: 'Nakshi Kantha', slug: 'nakshi-kantha', icon: 'GiSewingNeedle' },
];

const fetchProducts = async (params: Record<string, string>) => {
    const res = await axios.get(`${API_URL}/products?${new URLSearchParams(params).toString()}`);
    return res.data.data;
};

const Products = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { likedProducts, toggleLike } = useLikedProducts();

    const urlCategory = searchParams.get('category') || '';
    const urlSearch = searchParams.get('search') || '';

    const [activeCategory, setActiveCategory] = useState(urlCategory);
    const [sortBy, setSortBy] = useState('-createdAt');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setActiveCategory(searchParams.get('category') || '');
        setCurrentPage(1);
    }, [searchParams]);

    const apiParams: Record<string, string> = {
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
        sort: sortBy,
    };
    if (activeCategory) apiParams.category = activeCategory;
    if (urlSearch) apiParams.search = urlSearch;

    const { data: productsData, isLoading: productsLoading } = useQuery({
        queryKey: ['products', apiParams],
        queryFn: () => fetchProducts(apiParams),
    });

    const { data: apiCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getAll,
        staleTime: 5 * 60 * 1000,
    });

    // Show static categories immediately; swap to real data when API responds
    const categories = (apiCategories && apiCategories.length > 0) ? apiCategories : STATIC_CATEGORIES;

    const products = productsData?.products || [];
    const pagination = productsData?.pagination;
    const totalPages = pagination?.pages || 1;

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryClick = (slug: string) => {
        const params = new URLSearchParams();
        if (slug) params.set('category', slug);
        if (urlSearch) params.set('search', urlSearch);
        router.push(`/products?${params.toString()}`);
        setCurrentPage(1);
    };

    const activeCatLabel = categories.find(c => c.slug === activeCategory)?.name || '';
    const headingText = urlSearch
        ? `Showing results for "${urlSearch}"`
        : activeCatLabel
            ? `Showing products in "${activeCatLabel}"`
            : 'All Products';

    return (
        <div className="bg-white pt-4 md:pt-8 pb-10 md:pb-20">
            <div className="max-w-300 mx-auto px-4 md:px-0">

                <nav className="flex items-center gap-2 text-[#818B9C]" aria-label="Breadcrumb">
                    <Link href="/" className="text-[#C85A3A] font-medium hover:underline">Home</Link>
                    <MdKeyboardArrowRight className="text-[#818B9C]" />
                    {activeCategory ? (
                        <>
                            <Link href="/products" className="text-[#C85A3A] font-medium hover:underline">Products</Link>
                            <MdKeyboardArrowRight className="text-[#818B9C]" />
                            <span className="text-[#0B0F0E] font-semibold capitalize">
                                {activeCatLabel || activeCategory.replace(/-/g, ' ')}
                            </span>
                        </>
                    ) : (
                        <span className="text-[#0B0F0E] font-semibold">Products</span>
                    )}
                </nav>

                <div className="mt-1">
                    <h1 className="text-2xl font-semibold mb-0.5">{headingText}</h1>

                    <div className="flex justify-between gap-8 flex-wrap items-start">
                        <div className="flex-1 mt-3">
                            <div className="flex flex-wrap gap-y-3 gap-x-6">
                                <button
                                    onClick={() => handleCategoryClick('')}
                                    className={`text-sm font-medium transition-colors ${!activeCategory ? 'text-[#C85A3A] underline underline-offset-4' : 'text-[#0B0F0E] hover:text-[#C85A3A]'}`}
                                >
                                    All Products
                                    {!activeCategory && pagination && (
                                        <span className="text-[#818B9C] font-normal ml-1">({pagination.total})</span>
                                    )}
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleCategoryClick(cat.slug)}
                                        className={`text-sm font-medium transition-colors text-left ${activeCategory === cat.slug ? 'text-[#C85A3A] underline underline-offset-4' : 'text-[#0B0F0E] hover:text-[#C85A3A]'}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3 shrink-0">
                            <label htmlFor="sort-select" className="text-[#818B9C] text-sm whitespace-nowrap">Sort By:</label>
                            <select
                                id="sort-select"
                                value={sortBy}
                                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                                className="py-2.5 px-4 rounded-lg border border-[#E4E9EE] bg-white cursor-pointer focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 text-sm"
                            >
                                <option value="-createdAt">Newest First</option>
                                <option value="price">Price: Low to High</option>
                                <option value="-price">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    {productsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                                <div key={i} className="h-72 bg-gray-100 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-24 text-[#818B9C]">
                            <p className="text-5xl mb-4">🔍</p>
                            <p className="text-xl font-semibold text-[#0B0F0E]">No products found</p>
                            <p className="text-sm mt-2">Try a different category or search term</p>
                            <button
                                onClick={() => handleCategoryClick('')}
                                className="mt-6 px-6 py-2.5 bg-[#C85A3A] text-white rounded-lg text-sm font-medium hover:bg-[#A84830] transition-colors"
                            >
                                Browse all products
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                {products.map((product: any) => (
                                    <ProductCard
                                        key={product._id}
                                        id={product._id}
                                        name={product.name}
                                        image={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'}
                                        salePrice={`৳${product.price}`}
                                        originalPrice={product.originalPrice ? `৳${product.originalPrice}` : undefined}
                                        discount={
                                            product.originalPrice && product.price < product.originalPrice
                                                ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off`
                                                : undefined
                                        }
                                        rating={product.rating}
                                        isLiked={likedProducts.has(product._id)}
                                        onToggleLike={toggleLike}
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-12 flex justify-center items-center gap-3 select-none" aria-label="pagination">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        aria-label="Previous page"
                                        className="flex items-center justify-center p-1.5 w-8 h-8 bg-transparent border border-[#C85A3A] rounded-md cursor-pointer font-semibold text-sm transition-all duration-200 hover:bg-[#C85A3A] hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
                                    >
                                        <MdChevronLeft className="w-4 h-4" />
                                    </button>
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                aria-current={page === currentPage ? 'page' : undefined}
                                                className={`border border-[#C85A3A] rounded-md py-1.5 px-3 cursor-pointer font-semibold text-sm transition-all duration-200 hover:bg-[#C85A3A] hover:text-white ${page === currentPage ? 'bg-[#C85A3A] text-white' : 'bg-transparent text-[#0B0F0E]'}`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        aria-label="Next page"
                                        className="flex items-center justify-center p-1.5 w-8 h-8 bg-transparent border border-[#C85A3A] rounded-md cursor-pointer font-semibold text-sm transition-all duration-200 hover:bg-[#C85A3A] hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
                                    >
                                        <MdChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;