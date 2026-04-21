'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/common/ProductCard';
import { useLikedProducts } from '../../../hooks/useLikedProducts';
import api from '@/lib/api';

const NewArrivals = () => {
    const { likedProducts, toggleLike } = useLikedProducts();

    const { data, isLoading } = useQuery({
        queryKey: ['new-arrivals'],
        queryFn: async () => {
            const res = await api.get('/products?limit=4&sort=-createdAt');
            return res.data.data.products;
        },
        staleTime: 2 * 60 * 1000,
    });

    const products = data || [];

    return (
        <section className="bg-[#F7F7F7] py-12">
            <div className="max-w-300 mx-auto px-4 md:px-0">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-2xl font-bold text-[#0B0F0E]">New Arrivals</h2>
                    <Link href="/products">
                        <button className="bg-[#C85A3A] hover:bg-[#A84830] text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer">
                            View Products
                        </button>
                    </Link>
                </div>

                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                        ))
                        : products.length > 0
                            ? products.map((product: any) => (
                                <ProductCard
                                    key={product._id}
                                    id={product._id}
                                    name={product.name}
                                    image={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'}
                                    price={product.price}
                                    originalPrice={product.originalPrice}
                                    rating={product.rating}
                                    isLiked={likedProducts.has(product._id)}
                                    onToggleLike={toggleLike}
                                    stock={product.stock}
                                />
                            ))
                            : <div className="col-span-4 text-center py-10 text-[#818B9C]">
                                No products yet. Add products from the admin panel.
                            </div>
                    }
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;