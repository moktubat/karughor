'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/common/ProductCard';
import { useLikedProducts } from '../../../hooks/useLikedProducts';

// Sample 4 products
const products = Array.from({ length: 4 }).map((_, i) => ({
    id: i,
    name: `T-shirt Model ${i + 1}`,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    originalPrice: '$30',
    salePrice: '$26',
    discount: '20% Off',
    rating: '4.8',
}));

const NewArrivals = () => {
    const { likedProducts, toggleLike } = useLikedProducts();

    return (
        <section className="bg-[#F7F7F7] py-12">
            <div className="max-w-300 mx-auto px-6 sm:px-4">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-2xl font-bold text-[#0B0F0E]">New Arrivals</h2>
                    <Link href="/products">
                        <button className="bg-[#C85A3A] hover:bg-[#A84830] text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer">
                            View Products
                        </button>
                    </Link>
                </div>

                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
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
            </div>
        </section>
    );
};

export default NewArrivals;
