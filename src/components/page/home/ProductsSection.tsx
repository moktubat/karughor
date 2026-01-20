'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLikedProducts } from '../../../hooks/useLikedProducts';
import { ProductCard } from '@/components/common/ProductCard';

const products = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    name: 'Spy x Family Tshirt',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    discount: '20% Off',
    originalPrice: '$30',
    salePrice: '$26',
    rating: '4.8',
}));

const INITIAL_DISPLAY = 12;
const LOAD_MORE_COUNT = 8;

const ProductsSection = () => {
    const { likedProducts, toggleLike } = useLikedProducts();
    const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY);
    const router = useRouter();

    const allProductsVisible = visibleCount >= products.length;

    const handleLoadMore = () => {
        if (allProductsVisible) {
            router.push('/products');
        } else {
            setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
        }
    };

    return (
        <section className="bg-white w-full py-16 sm:py-12">
            <div className="max-w-300 mx-auto px-6 sm:px-4 flex flex-col items-center gap-12">
                {/* Section Header */}
                <div className="text-center">
                    <h2 className="text-[#0B0F0E] text-4xl font-semibold leading-[140%] -tracking-[0.2px] sm:text-2xl">
                        Popular Product on Karughor
                    </h2>
                    <p className="text-[#818B9C] text-lg font-normal leading-[160%] mt-2 sm:text-base">
                        Discover the top trending products handpicked for you
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {products.slice(0, visibleCount).map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            image={product.image}
                            originalPrice={product.originalPrice}
                            salePrice={product.salePrice}
                            discount={product.discount}
                            rating={product.rating}
                            isLiked={likedProducts.has(product.id)}
                            onToggleLike={toggleLike}
                        />
                    ))}
                </div>

                {/* Load More Button */}
                <button
                    onClick={handleLoadMore}
                    className="mt-5 px-4 py-2 border border-[#C85A3A] text-[#C85A3A] font-semibold text-lg rounded-lg transition-all hover:bg-[#C85A3A] hover:text-white sm:text-base sm:px-3 sm:py-2 cursor-pointer"
                >
                    {allProductsVisible ? 'View All Products' : 'Load More'}
                </button>
            </div>
        </section>
    );
};

export default ProductsSection;
