'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useLikedProducts } from '../../../hooks/useLikedProducts';
import { ProductCard } from '@/components/common/ProductCard';
import api from '@/lib/api';


const INITIAL_DISPLAY = 12;
const LOAD_MORE_COUNT = 8;

const ProductsSection = () => {
    const { likedProducts, toggleLike } = useLikedProducts();
    const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY);
    const router = useRouter();

    const { data, isLoading } = useQuery({
        queryKey: ['popular-products'],
        queryFn: async () => {
            const res = await api.get('/products?limit=20&sort=-createdAt');
            return res.data.data.products;
        },
        staleTime: 2 * 60 * 1000,
    });

    const products = data || [];
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
            <div className="max-w-300 mx-auto px-4 md:px-0 flex flex-col items-center gap-12">
                <div className="text-center">
                    <h2 className="text-[#0B0F0E] text-4xl font-semibold leading-[140%] -tracking-[0.2px] sm:text-2xl">
                        Popular Products on Karughor
                    </h2>
                    <p className="text-[#818B9C] text-lg font-normal leading-[160%] mt-2 sm:text-base">
                        Discover the top trending handcrafted products
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-10 text-[#818B9C]">
                        No products yet. Add products from the admin panel.
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
                            {products.slice(0, visibleCount).map((product: any) => (
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
                                    stock={product.stock}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleLoadMore}
                            className="mt-5 px-4 py-2 border border-[#C85A3A] text-[#C85A3A] font-semibold text-lg rounded-lg transition-all hover:bg-[#C85A3A] hover:text-white sm:text-base sm:px-3 sm:py-2 cursor-pointer"
                        >
                            {allProductsVisible ? 'View All Products' : 'Load More'}
                        </button>
                    </>
                )}
            </div>
        </section>
    );
};

export default ProductsSection;