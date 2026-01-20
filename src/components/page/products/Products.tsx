'use client';

import { ProductCard } from '@/components/common/ProductCard';
import { useLikedProducts } from '@/hooks/useLikedProducts';
import { useState } from 'react';
import { MdKeyboardArrowRight, MdChevronLeft, MdChevronRight } from 'react-icons/md';

// Sample products
const products = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    name: `T-shirt Model ${i + 1}`,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    originalPrice: '$30',
    salePrice: '$26',
}));

const categories = [
    { name: 'Electronics', count: 128 },
    { name: 'Fashion', count: 256 },
    { name: 'Home & Living', count: 89 },
    { name: 'Sports', count: 64 },
    { name: 'Books', count: 145 },
];

const ITEMS_PER_PAGE = 12;

const Products = () => {
    const { likedProducts, toggleLike } = useLikedProducts();
    const [sortBy, setSortBy] = useState('relevant');
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination logic
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Get current page items
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const displayedProducts = products.slice(startIndex, endIndex);

    return (
        <div className="bg-white py-10 md:py-20">
            <div className="max-w-[1200px] mx-auto px-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[#818B9C]" aria-label="Breadcrumb">
                    <span className="text-[#C85A3A] font-medium">Home</span>
                    <MdKeyboardArrowRight className="text-[#818B9C]" />
                    <span className="text-[#C85A3A] font-medium">Electronic</span>
                    <MdKeyboardArrowRight className="text-[#818B9C]" />
                    <span className="text-[#0B0F0E] font-semibold">T-shirt</span>
                </nav>

                {/* Header */}
                <div className="mt-0.5">
                    <h1 className="text-2xl font-semibold mb-0.5">
                        Showing product for "T-shirt"
                    </h1>

                    <div className="flex justify-between gap-8 flex-wrap">
                        {/* Filters */}
                        <div className="max-w-[70%]">
                            <div className="mt-3">
                                <div className="flex flex-wrap gap-y-4 gap-x-6">
                                    {categories.map((cat) => (
                                        <label
                                            key={cat.name}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <span>{cat.name}</span>
                                            <span className="text-[#818B9C]">({cat.count})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort-select" className="text-[#818B9C]">
                                Sort By:
                            </label>
                            <select
                                id="sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="py-2.5 px-4 rounded-lg border border-[#E4E9EE] bg-white cursor-pointer focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                            >
                                <option value="relevant">Relevant Products</option>
                                <option value="priceLowHigh">Price: Low to High</option>
                                <option value="priceHighLow">Price: High to Low</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="mt-8">
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {displayedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    image={product.image}
                                    originalPrice={product.originalPrice}
                                    salePrice={product.salePrice}
                                    isLiked={likedProducts.has(product.id)}
                                    onToggleLike={toggleLike}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div
                            className="mt-12 flex justify-center items-center gap-3 select-none"
                            aria-label="pagination"
                        >
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                                className="flex items-center justify-center p-1.5 w-8 h-8 bg-transparent border border-[#C85A3A] rounded-md cursor-pointer font-semibold text-sm transition-all duration-200 hover:bg-[#C85A3A] hover:text-white disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#0B0F0E]"
                            >
                                <MdChevronLeft
                                    className="w-4 h-4"
                                    style={{
                                        stroke: currentPage === 1 ? '#ccc' : '#0b0f0e',
                                        strokeWidth: 2
                                    }}
                                />
                            </button>

                            {Array.from({ length: totalPages }).map((_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        aria-current={page === currentPage ? 'page' : undefined}
                                        className={`border border-[#C85A3A] rounded-md py-1.5 px-3 cursor-pointer font-semibold text-sm transition-all duration-200 hover:bg-[#C85A3A] hover:text-white disabled:cursor-default disabled:opacity-50 ${page === currentPage
                                                ? 'bg-[#C85A3A] text-white'
                                                : 'bg-transparent text-[#0B0F0E]'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                                className="flex items-center justify-center p-1.5 w-8 h-8 bg-transparent border border-[#C85A3A] rounded-md cursor-pointer font-semibold text-sm transition-all duration-200 hover:bg-[#C85A3A] hover:text-white disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#0B0F0E]"
                            >
                                <MdChevronRight
                                    className="w-4 h-4"
                                    style={{
                                        stroke: currentPage === totalPages ? '#ccc' : '#0b0f0e',
                                        strokeWidth: 2
                                    }}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;