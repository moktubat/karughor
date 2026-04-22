'use client';

import { ProductCard } from '@/components/common/ProductCard';
import { useLikedProducts } from '@/hooks/useLikedProducts';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MdKeyboardArrowRight, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FaTimes } from 'react-icons/fa';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/lib/categoryService';
import { STATIC_CATEGORIES } from '@/lib/staticCategories';
import Link from 'next/link';
import api from '@/lib/api';

// ─── Constants ─────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12;
const SORT_OPTIONS = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
];

export const productKeys = {
    all: ['products'] as const,
    list: (params: Record<string, string>) =>
        [...productKeys.all, 'list', params] as const,
};

// ─── Fetchers ──────────────────────────────────────────────────────────────────

async function fetchProducts(params: Record<string, string>) {
    const res = await api.get('/products', { params });
    return res.data.data as {
        products: any[];
        pagination: { page: number; limit: number; total: number; pages: number };
    };
}

async function fetchCategoryCounts(): Promise<Record<string, number>> {
    try {
        const res = await api.get('/categories/counts');
        return res.data.data.counts as Record<string, number>;
    } catch {
        return {};
    }
}

// ─── Component ─────────────────────────────────────────────────────────────────

const Products = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { likedProducts, toggleLike } = useLikedProducts();

    const urlCategory = searchParams.get('category') || '';
    const urlSearch = searchParams.get('search') || '';
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    const urlSort = searchParams.get('sort') || '-createdAt';

    const [sortBy, setSortBy] = useState(urlSort);

    useEffect(() => {
        setSortBy(urlSort);
    }, [urlSort]);

    const apiParams = useMemo<Record<string, string>>(() => {
        const p: Record<string, string> = {
            page: String(urlPage),
            limit: String(ITEMS_PER_PAGE),
            sort: sortBy,
        };
        if (urlCategory) p.category = urlCategory;
        if (urlSearch) p.search = urlSearch;
        return p;
    }, [urlPage, sortBy, urlCategory, urlSearch]);

    const { data: productsData, isLoading: productsLoading, isFetching } = useQuery({
        queryKey: productKeys.list(apiParams),
        queryFn: () => fetchProducts(apiParams),
        staleTime: 60_000,
        placeholderData: (prev) => prev,
    });

    const { data: apiCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getAll,
        staleTime: 5 * 60_000,
    });

    const { data: categoryCountsMap } = useQuery({
        queryKey: ['category-counts'],
        queryFn: fetchCategoryCounts,
        staleTime: 5 * 60_000,
    });

    const totalPages = productsData?.pagination?.pages || 1;

    // Prefetch next page — runs only when apiParams or pagination actually changes
    useEffect(() => {
        if (urlPage < totalPages) {
            const nextParams = { ...apiParams, page: String(urlPage + 1) };
            queryClient.prefetchQuery({
                queryKey: productKeys.list(nextParams),
                queryFn: () => fetchProducts(nextParams),
                staleTime: 60_000,
            });
        }
    }, [urlPage, totalPages, apiParams, queryClient]);

    const categories =
        apiCategories && apiCategories.length > 0 ? apiCategories : STATIC_CATEGORIES;
    const products = productsData?.products || [];

    const totalAll = categoryCountsMap
        ? Object.values(categoryCountsMap).reduce((sum, n) => sum + n, 0)
        : 0;

    const getCategoryCount = useCallback(
        (slug: string): number => {
            if (!categoryCountsMap) return 0;
            const cat = categories.find((c: any) => c.slug === slug);
            if (!cat) return 0;
            const nameKey = cat.name.toLowerCase();
            const slugKey = slug.toLowerCase().replace(/-/g, ' ');
            return categoryCountsMap[nameKey] ?? categoryCountsMap[slugKey] ?? 0;
        },
        [categories, categoryCountsMap]
    );

    // ── URL update helper ──────────────────────────────────────────────────────

    const pushUrl = useCallback(
        (overrides: Record<string, string | undefined>) => {
            const params = new URLSearchParams();
            const merged: Record<string, string> = {
                category: urlCategory,
                search: urlSearch,
                page: String(urlPage),
                sort: sortBy,
                ...overrides,
            };
            Object.entries(merged).forEach(([k, v]) => {
                if (v) params.set(k, v);
            });
            router.push(`/products?${params.toString()}`);
        },
        [router, urlCategory, urlSearch, urlPage, sortBy]
    );

    const handleCategoryClick = useCallback(
        (slug: string) => {
            pushUrl({ category: slug || undefined, page: '1' });
        },
        [pushUrl]
    );

    const handleSortChange = useCallback(
        (sort: string) => {
            setSortBy(sort);
            const params = new URLSearchParams();
            if (urlCategory) params.set('category', urlCategory);
            if (urlSearch) params.set('search', urlSearch);
            params.set('sort', sort);
            params.set('page', '1');
            router.push(`/products?${params.toString()}`);
        },
        [router, urlCategory, urlSearch]
    );

    const handleClearSearch = useCallback(() => {
        pushUrl({ search: undefined, page: '1' });
    }, [pushUrl]);

    const goToPage = useCallback(
        (page: number) => {
            if (page < 1 || page > totalPages) return;
            pushUrl({ page: String(page) });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        [pushUrl, totalPages]
    );

    const activeCatLabel =
        categories.find((c: any) => c.slug === urlCategory)?.name || '';
    const headingText = urlSearch
        ? `Results for "${urlSearch}"`
        : activeCatLabel
            ? `${activeCatLabel}`
            : 'All Products';

    return (
        <div className="bg-white pt-4 md:pt-8 pb-10 md:pb-20">
            <div className="max-w-300 mx-auto px-4 md:px-0">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[#818B9C]" aria-label="Breadcrumb">
                    <Link href="/" className="text-[#C85A3A] font-medium hover:underline">
                        Home
                    </Link>
                    <MdKeyboardArrowRight className="text-[#818B9C]" />
                    {urlCategory ? (
                        <>
                            <Link href="/products" className="text-[#C85A3A] font-medium hover:underline">
                                Products
                            </Link>
                            <MdKeyboardArrowRight className="text-[#818B9C]" />
                            <span className="text-[#0B0F0E] font-semibold capitalize">
                                {activeCatLabel || urlCategory.replace(/-/g, ' ')}
                            </span>
                        </>
                    ) : (
                        <span className="text-[#0B0F0E] font-semibold">Products</span>
                    )}
                </nav>

                <div className="mt-1">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-semibold mb-0.5">
                                {headingText}
                                {isFetching && !productsLoading && (
                                    <span className="ml-3 text-sm font-normal text-[#818B9C] animate-pulse">
                                        Refreshing…
                                    </span>
                                )}
                            </h1>

                            {urlSearch && (
                                <button
                                    onClick={handleClearSearch}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#C85A3A] border border-[#C85A3A] rounded-full hover:bg-[#C85A3A] hover:text-white transition-all group"
                                    aria-label="Clear search"
                                >
                                    <FaTimes className="w-3 h-3" />
                                    Clear search
                                </button>
                            )}
                        </div>

                        {productsData?.pagination && (
                            <p className="text-sm text-[#818B9C]">
                                {productsData.pagination.total} products
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between gap-8 flex-wrap items-start mt-3">
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-y-3 gap-x-6">
                                <button
                                    onClick={() => handleCategoryClick('')}
                                    className={`text-sm font-medium transition-colors ${!urlCategory
                                        ? 'text-[#C85A3A] underline underline-offset-4'
                                        : 'text-[#0B0F0E] hover:text-[#C85A3A]'
                                        }`}
                                >
                                    All Products
                                    {totalAll > 0 && (
                                        <span className="text-[#818B9C] font-normal ml-1">
                                            ({totalAll})
                                        </span>
                                    )}
                                </button>

                                {categories.map((cat: any) => {
                                    const count = getCategoryCount(cat.slug);
                                    return (
                                        <button
                                            key={cat._id}
                                            onClick={() => handleCategoryClick(cat.slug)}
                                            className={`text-sm font-medium transition-colors text-left ${urlCategory === cat.slug
                                                ? 'text-[#C85A3A] underline underline-offset-4'
                                                : 'text-[#0B0F0E] hover:text-[#C85A3A]'
                                                }`}
                                        >
                                            {cat.name}
                                            {count > 0 && (
                                                <span className="text-[#818B9C] font-normal ml-1">
                                                    ({count})
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <label htmlFor="sort-select" className="text-[#818B9C] text-sm whitespace-nowrap">
                                Sort By:
                            </label>
                            <select
                                id="sort-select"
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="py-2.5 px-4 rounded-lg border border-[#E4E9EE] bg-white cursor-pointer focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 text-sm"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product grid */}
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
                            <p className="text-sm mt-2">
                                {urlSearch
                                    ? `No results for "${urlSearch}"`
                                    : 'Try a different category or search term'}
                            </p>
                            <div className="flex gap-3 justify-center mt-6 flex-wrap">
                                {urlSearch && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="flex items-center gap-2 px-6 py-2.5 border border-[#C85A3A] text-[#C85A3A] rounded-lg text-sm font-medium hover:bg-[#C85A3A] hover:text-white transition-colors"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                        Clear search
                                    </button>
                                )}
                                <button
                                    onClick={() => handleCategoryClick('')}
                                    className="px-6 py-2.5 bg-[#C85A3A] text-white rounded-lg text-sm font-medium hover:bg-[#A84830] transition-colors"
                                >
                                    Browse all products
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div
                                className={`grid grid-cols-1 md:grid-cols-4 gap-5 transition-opacity duration-200 ${isFetching && !productsLoading ? 'opacity-60' : 'opacity-100'
                                    }`}
                            >
                                {products.map((product: any) => (
                                    <ProductCard
                                        key={product._id}
                                        id={product._id}
                                        name={product.name}
                                        image={
                                            product.images?.[0] ||
                                            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
                                        }
                                        price={product.price}
                                        originalPrice={product.originalPrice}
                                        rating={product.rating}
                                        isLiked={likedProducts.has(product._id)}
                                        onToggleLike={toggleLike}
                                        stock={product.stock}
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-12 flex justify-center items-center gap-3 select-none" aria-label="pagination">
                                    <button
                                        onClick={() => goToPage(urlPage - 1)}
                                        disabled={urlPage === 1}
                                        aria-label="Previous page"
                                        className="flex items-center justify-center p-1.5 w-8 h-8 bg-transparent border border-[#C85A3A] rounded-md cursor-pointer font-semibold text-sm transition-all duration-200 hover:bg-[#C85A3A] hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:text-[#C85A3A]"
                                    >
                                        <MdChevronLeft className="w-4 h-4" />
                                    </button>

                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1;
                                        const isNearCurrent = Math.abs(page - urlPage) <= 1;
                                        const isEdge = page === 1 || page === totalPages;
                                        if (!isNearCurrent && !isEdge) {
                                            if (page === 2 || page === totalPages - 1) {
                                                return <span key={page} className="text-[#818B9C] text-sm">…</span>;
                                            }
                                            return null;
                                        }
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                aria-current={page === urlPage ? 'page' : undefined}
                                                className={`border border-[#C85A3A] rounded-md py-1.5 px-3 cursor-pointer font-semibold text-sm transition-all duration-200 hover:bg-[#C85A3A] hover:text-white ${page === urlPage ? 'bg-[#C85A3A] text-white' : 'bg-transparent text-[#0B0F0E]'}`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => goToPage(urlPage + 1)}
                                        disabled={urlPage === totalPages}
                                        aria-label="Next page"
                                        className="flex items-center justify-center p-1.5 w-8 h-8 bg-transparent border border-[#C85A3A] rounded-md cursor-pointer font-semibold text-sm transition-all duration-200 hover:bg-[#C85A3A] hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:text-[#C85A3A]"
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