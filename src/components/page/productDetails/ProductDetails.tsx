'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
    FaShoppingCart, FaStar,
    FaChevronLeft, FaChevronRight, FaCheck,
} from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { ProductCard } from '@/components/common/ProductCard';
import { useLikedProducts } from '@/hooks/useLikedProducts';
import { useCartStore } from '@/store/cartStore';
import categoryDefaults from '@/lib/categoryDefaults';
import Link from 'next/link';


// ── Moved OUTSIDE ProductDetails to prevent remount on every render ──────────
type ProductDetailsTabsProps = {
    specifications: Record<string, string>;
    inTheBox: string[];
    careInstructions: string[];
    highlights: string[];
};

const ProductDetailsTabs: React.FC<ProductDetailsTabsProps> = ({
    specifications,
    inTheBox,
    careInstructions,
    highlights,
}) => {
    const tabs = [
        { id: 'specs', label: 'Specifications', show: Object.keys(specifications).length > 0 },
        { id: 'inbox', label: 'In The Box', show: inTheBox.length > 0 },
        { id: 'care', label: 'Care Guide', show: careInstructions.length > 0 },
        { id: 'highlights', label: 'Highlights', show: highlights.length > 0 },
    ].filter(t => t.show);

    const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'specs');

    return (
        <section className="mt-16 md:mt-20">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0B0F0E] mb-6">
                Product Details
            </h2>
            <div className="flex gap-1 border-b border-[#E4E9EE] mb-0">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-3 text-sm font-semibold rounded-t-lg transition-all -mb-px border border-b-0 ${activeTab === tab.id
                            ? 'bg-white border-[#E4E9EE] text-[#C85A3A]'
                            : 'bg-transparent border-transparent text-[#818B9C] hover:text-[#0B0F0E]'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="border border-[#E4E9EE] rounded-b-xl rounded-tr-xl bg-white p-6 md:p-8">
                {activeTab === 'specs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                        {Object.entries(specifications).map(([key, val], i) => (
                            <div key={key} className={`flex items-start gap-4 py-4 ${i < Object.keys(specifications).length - (Object.keys(specifications).length % 2 === 0 ? 2 : 1)
                                ? 'border-b border-[#F0F0F0]'
                                : ''
                                }`}>
                                <span className="text-sm text-[#818B9C] w-36 shrink-0 pt-0.5">{key.replace(/_/g, ' ')}</span>
                                <span className="text-sm font-semibold text-[#0B0F0E]">{val}</span>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'inbox' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {inTheBox.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-[#F7F7F7] rounded-lg px-4 py-3">
                                <div className="w-6 h-6 rounded-full bg-[#C85A3A]/10 flex items-center justify-center shrink-0">
                                    <FaCheck className="text-[#C85A3A] w-3 h-3" />
                                </div>
                                <span className="text-sm font-medium text-[#0B0F0E]">{item}</span>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'care' && (
                    <div className="flex flex-col gap-3">
                        {careInstructions.map((item, i) => (
                            <div key={i} className="flex items-start gap-4 py-3 border-b border-[#F0F0F0] last:border-0">
                                <div className="w-7 h-7 rounded-full bg-[#C85A3A]/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-[#C85A3A]">{i + 1}</span>
                                </div>
                                <span className="text-sm text-[#0B0F0E] leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'highlights' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {highlights.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-[#E4E9EE] hover:border-[#C85A3A]/30 hover:bg-[#C85A3A]/5 transition-all">
                                <div className="w-2 h-2 rounded-full bg-[#C85A3A] shrink-0 mt-1.5" />
                                <span className="text-sm text-[#0B0F0E] leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
// ─────────────────────────────────────────────────────────────────────────────

const ProductDetails: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const { likedProducts, toggleLike } = useLikedProducts();
    const addItem = useCartStore((s) => s.addItem);

    const { data: productData, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get(`/products/${id}`);
            return res.data.data.product;
        },
        enabled: !!id,
    });

    const { data: relatedData } = useQuery({
        queryKey: ['related-products', productData?.category],
        queryFn: async () => {
            const res = await api.get(
                `/products?category=${productData.category}&limit=4`
            );
            return res.data.data.products.filter((p: any) => p._id !== id);
        },
        enabled: !!productData?.category,
    });

    const product = productData;

    const categorySlug = product?.category
        ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : null;
    const fallback = categorySlug ? categoryDefaults[categorySlug] ?? null : null;

    const specifications =
        product?.specifications && Object.keys(product.specifications).length > 0
            ? product.specifications
            : fallback?.specifications ?? {};

    const inTheBox =
        product?.inTheBox && product.inTheBox.length > 0
            ? product.inTheBox
            : fallback?.inTheBox ?? [];

    const careInstructions =
        product?.careInstructions && product.careInstructions.length > 0
            ? product.careInstructions
            : fallback?.careInstructions ?? [];

    const highlights =
        product?.highlights && product.highlights.length > 0
            ? product.highlights
            : fallback?.highlights ?? [];

    const images: string[] = useMemo(() => {
        if (product?.images?.length > 0) return product.images;
        return ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'];
    }, [product?.images]);

    const relatedProducts = useMemo(() => relatedData ?? [], [relatedData]);

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') prevImage();
        else if (e.key === 'ArrowRight') nextImage();
    }, [nextImage, prevImage]);

    const handleAddToCart = useCallback(() => {
        if (!product) return;
        addItem({
            id: product._id,
            name: product.name,
            image: images[0],
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category,
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    }, [product, images, addItem]);

    const handleBuyNow = useCallback(() => {
        if (!product) return;
        addItem({
            id: product._id,
            name: product.name,
            image: images[0],
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category,
        });
        router.push('/checkout');
    }, [product, images, addItem, router]);

    if (isLoading) {
        return (
            <div className="bg-white w-full py-12">
                <div className="max-w-300 mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
                        <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
                        <div className="flex flex-col gap-4">
                            <div className="h-8 bg-gray-100 rounded animate-pulse w-3/4" />
                            <div className="h-5 bg-gray-100 rounded animate-pulse w-1/4" />
                            <div className="h-10 bg-gray-100 rounded animate-pulse w-1/3" />
                            <div className="h-24 bg-gray-100 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="bg-white w-full py-32 text-center">
                <p className="text-4xl mb-4">😕</p>
                <p className="text-xl font-semibold text-[#0B0F0E]">Product not found</p>
                <button
                    onClick={() => router.push('/products')}
                    className="mt-6 px-6 py-2.5 bg-[#C85A3A] text-white rounded-lg text-sm font-medium hover:bg-[#A84830] transition-colors"
                >
                    Browse Products
                </button>
            </div>
        );
    }

    const salePrice = product.price;
    const originalPrice = product.originalPrice;
    const discount = originalPrice && salePrice < originalPrice
        ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
        : null;

    return (
        <div className="bg-white w-full py-12 md:pt-10 md:pb-20">
            <div className="max-w-300 mx-auto px-4 md:px-0">

                <nav className="flex items-center gap-2 text-sm md:text-base font-medium text-[#818B9C] select-none flex-wrap">
                    <Link href="/" className="text-[#C85A3A] hover:underline">Home</Link>
                    <MdKeyboardArrowRight />
                    <Link href="/products" className="text-[#C85A3A] hover:underline">Products</Link>
                    {product.category && (
                        <>
                            <MdKeyboardArrowRight />
                            <Link
                                href={`/products?category=${product.category}`}
                                className="text-[#C85A3A] hover:underline capitalize"
                            >
                                {product.category.replace(/-/g, ' ')}
                            </Link>
                        </>
                    )}
                    <MdKeyboardArrowRight />
                    <span className="text-[#0B0F0E] font-semibold line-clamp-1">{product.name}</span>
                </nav>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-8">
                    <div
                        className="flex flex-col gap-4"
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                        role="region"
                        aria-label="Product images"
                    >
                        <div className="relative w-full aspect-square bg-[#F6F6F6] rounded-lg flex items-center justify-center overflow-hidden">
                            {images.length > 1 && (
                                <button
                                    onClick={prevImage}
                                    disabled={currentImageIndex === 0}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center cursor-pointer z-10 hover:text-[#C85A3A] hover:shadow-md transition-all disabled:opacity-30"
                                    aria-label="Previous image"
                                >
                                    <FaChevronLeft />
                                </button>
                            )}
                            <Image
                                src={images[currentImageIndex]}
                                alt={product.name}
                                fill
                                className="object-contain select-none"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            {discount && (
                                <div className="absolute top-4 left-0 bg-red-600 text-white px-3 py-1.5 rounded-r-lg text-sm font-semibold">
                                    {discount}% Off
                                </div>
                            )}
                            {product.stock === 0 && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                                    <span className="bg-white text-[#0B0F0E] font-semibold px-4 py-2 rounded-lg">
                                        Out of Stock
                                    </span>
                                </div>
                            )}
                            {images.length > 1 && (
                                <button
                                    onClick={nextImage}
                                    disabled={currentImageIndex === images.length - 1}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center cursor-pointer z-10 hover:text-[#C85A3A] hover:shadow-md transition-all disabled:opacity-30"
                                    aria-label="Next image"
                                >
                                    <FaChevronRight />
                                </button>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-2 md:gap-3 w-full overflow-hidden">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`relative flex-1 min-w-0 aspect-square bg-[#F6F6F6] rounded-lg border-2 cursor-pointer overflow-hidden transition-all ${index === currentImageIndex
                                            ? 'border-[#C85A3A]'
                                            : 'border-transparent hover:border-[#C85A3A]'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-[#0B0F0E]">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-2">
                            <FaStar className="text-[#FFA500] w-5 h-5" />
                            <span className="text-lg font-semibold text-[#0B0F0E]">4.8</span>
                            <span className="text-[#818B9C]">·</span>
                            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl md:text-4xl font-semibold text-[#C85A3A]">
                                ৳{salePrice}
                            </span>
                            {originalPrice && (
                                <span className="text-xl text-[#818B9C] line-through">৳{originalPrice}</span>
                            )}
                            {discount && (
                                <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded">
                                    {discount}% OFF
                                </span>
                            )}
                        </div>
                        <p className="text-base text-[#818B9C] leading-relaxed">{product.description}</p>
                        {product.brand && (
                            <p className="text-sm text-[#818B9C]">
                                Brand: <span className="font-semibold text-[#0B0F0E]">{product.brand}</span>
                            </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold transition-all hover:bg-[#A84830] hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${addedToCart
                                    ? 'bg-green-500 text-white border border-green-500'
                                    : 'bg-white text-[#C85A3A] border border-[#C85A3A] hover:bg-[#C85A3A] hover:text-white'
                                    }`}
                            >
                                {addedToCart ? <><FaCheck /> Added!</> : <><FaShoppingCart /> Add to Cart</>}
                            </button>
                        </div>
                    </div>
                </section>

                {(Object.keys(specifications).length > 0 || inTheBox.length > 0 || careInstructions.length > 0 || highlights.length > 0) && (
                    <ProductDetailsTabs
                        key={product._id}
                        specifications={specifications}
                        inTheBox={inTheBox}
                        careInstructions={careInstructions}
                        highlights={highlights}
                    />
                )}

                {relatedProducts.length > 0 && (
                    <section className="mt-16 md:mt-20">
                        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
                            <h2 className="text-3xl md:text-4xl font-semibold text-[#0B0F0E]">Related Products</h2>
                            <Link
                                href={`/products?category=${product.category}`}
                                className="px-4 py-2 bg-transparent text-[#C85A3A] border border-[#C85A3A] rounded-lg text-base font-semibold hover:bg-[#C85A3A] hover:text-white transition-all"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p: any) => (
                                <ProductCard
                                    key={p._id}
                                    id={p._id}
                                    name={p.name}
                                    image={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'}
                                    salePrice={`৳${p.price}`}
                                    originalPrice={p.originalPrice ? `৳${p.originalPrice}` : undefined}
                                    discount={
                                        p.originalPrice && p.price < p.originalPrice
                                            ? `${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% Off`
                                            : undefined
                                    }
                                    isLiked={likedProducts.has(p._id)}
                                    onToggleLike={toggleLike}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;