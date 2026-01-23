'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import {
    FaHeart,
    FaRegHeart,
    FaShoppingCart,
    FaStar,
    FaChevronLeft,
    FaChevronRight,
    FaCheck
} from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/common/ProductCard';
import { useLikedProducts } from '@/hooks/useLikedProducts';

interface ProductVariant {
    type: string;
    color: string;
}

interface Breadcrumb {
    label: string;
    href?: string;
    active?: boolean;
}

// Constants
const PRODUCT_IMAGES = [
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop',
] as const;

const RELATED_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Spy x Family Tshirt',
        brand: 'North Purwokerto',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        salePrice: '$26',
        originalPrice: '$32',
        discount: '-20%',
        rating: '4.8',
        sold: 1238,
    },
    {
        id: 2,
        name: 'Green Man Jacket',
        brand: 'North Purwokerto',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
        salePrice: '$49',
        originalPrice: '$65',
        discount: '-25%',
        rating: '4.8',
        sold: 1238,
    },
    {
        id: 3,
        name: 'iPhone 14 Pro Max',
        brand: 'North Purwokerto',
        image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=400&fit=crop',
        salePrice: '$1200',
        rating: '4.8',
        sold: 1238,
    },
    {
        id: 4,
        name: 'Oversized Tshirt',
        brand: 'North Purwokerto',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop',
        salePrice: '$48',
        originalPrice: '$60',
        discount: '-20%',
        rating: '4.8',
        sold: 1238,
    },
];

const BREADCRUMB_ITEMS: Breadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Electronic', href: '/electronic' },
    { label: 'Gaming Gear', href: '/electronic/gaming-gear' },
    { label: 'G502 X Lightspeed Wireless Gaming Mouse', active: true }
];

const PRODUCT_DETAILS = {
    name: 'G502 X Lightspeed Wireless Gaming Mouse',
    price: '$139.99',
    rating: 4.8,
    sold: 1238,
    description: 'G502 X LIGHTSPEED is the latest addition to legendary G502 lineage. Featuring our first-ever LIGHTFORCE hybrid optical-mechanical switches and updated LIGHTSPEED wireless protocol with 68% faster response rate.',
    specifications: [
        { label: 'Brand', value: 'Logitech' },
        { label: 'Type', value: 'Wireless' },
        { label: 'Resolution', value: '100 – 25600 DPI' },
        { label: 'Max Speed', value: '40G' },
        { label: 'Max Acceleration', value: '300 IPS' }
    ],
    inTheBox: [
        'Wireless Gaming Mouse',
        'USB-C Cable',
        'Receiver',
        'Documentation'
    ],
    systemRequirements: [
        'USB Port',
        'Windows 10 or later',
        'macOS 10.14+',
        'Internet Access'
    ]
};

const ProductDetails: React.FC = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { likedProducts, toggleLike } = useLikedProducts();
    const [variant, setVariant] = useState<ProductVariant>({
        type: 'Wireless',
        color: 'Black'
    });

    // Memoized handlers
    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % PRODUCT_IMAGES.length);
    }, []);

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length);
    }, []);

    const handleThumbnailClick = useCallback((index: number) => {
        setCurrentImageIndex(index);
    }, []);

    const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setVariant(prev => ({ ...prev, type: e.target.value }));
    }, []);

    const handleColorChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setVariant(prev => ({ ...prev, color: e.target.value }));
    }, []);

    const handleBuyNow = useCallback(() => {
        console.log('Buy now clicked', { variant });
    }, [variant]);

    const handleAddToCart = useCallback(() => {
        console.log('Add to cart clicked', { variant });
    }, [variant]);

    // Keyboard navigation for image gallery
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    }, [nextImage, prevImage]);

    return (
        <div className="bg-white w-full py-12 md:pt-10 md:pb-20">
            <div className="max-w-300 mx-auto px-4 md:px-0">
                {/* Breadcrumbs */}
                <nav
                    className="flex items-center gap-2 text-sm md:text-base font-medium text-[#818B9C] select-none flex-wrap"
                    aria-label="Breadcrumb navigation"
                >
                    {BREADCRUMB_ITEMS.map((crumb, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <MdKeyboardArrowRight className="text-[#818B9C]" aria-hidden="true" />
                            )}
                            {crumb.active ? (
                                <span
                                    className="text-[#0B0F0E] font-semibold cursor-default"
                                    aria-current="page"
                                >
                                    {crumb.label}
                                </span>
                            ) : (
                                <a
                                    href={crumb.href}
                                    className="text-[#C85A3A] hover:underline transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#C85A3A] focus-visible:outline-offset-2 focus-visible:rounded-sm"
                                >
                                    {crumb.label}
                                </a>
                            )}
                        </React.Fragment>
                    ))}
                </nav>

                {/* Product Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-8">
                    {/* Image Gallery */}
                    <div className="flex flex-col">
                        <div
                            className="flex flex-col gap-4"
                            role="region"
                            aria-label="Product images"
                            onKeyDown={handleKeyDown}
                            tabIndex={0}
                        >
                            {/* Main Image */}
                            <div className="relative w-full aspect-square bg-[#F6F6F6] rounded-lg flex items-center justify-center overflow-hidden">
                                <button
                                    onClick={prevImage}
                                    disabled={currentImageIndex === 0}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm border-0 flex items-center justify-center cursor-pointer text-[#0B0F0E] transition-all duration-300 z-10 hover:bg-white hover:text-[#C85A3A] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#C85A3A] focus-visible:outline-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Previous image"
                                >
                                    <FaChevronLeft className="w-5 h-5" />
                                </button>
                                <img
                                    src={PRODUCT_IMAGES[currentImageIndex]}
                                    alt={`${PRODUCT_DETAILS.name} - Image ${currentImageIndex + 1} of ${PRODUCT_IMAGES.length}`}
                                    className="max-w-[80%] max-h-[80%] object-contain select-none"
                                    loading="eager"
                                />
                                <button
                                    onClick={nextImage}
                                    disabled={currentImageIndex === PRODUCT_IMAGES.length - 1}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm border-0 flex items-center justify-center cursor-pointer text-[#0B0F0E] transition-all duration-300 z-10 hover:bg-white hover:text-[#C85A3A] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#C85A3A] focus-visible:outline-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Next image"
                                >
                                    <FaChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Thumbnails */}
                            <div className="grid grid-cols-4 gap-2 md:gap-3" role="list" aria-label="Product thumbnails">
                                {PRODUCT_IMAGES.map((img, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleThumbnailClick(index)}
                                        className={`aspect-square bg-[#F6F6F6] rounded-lg border-2 cursor-pointer overflow-hidden transition-all duration-300 relative hover:border-[#C85A3A] focus-visible:outline-2 focus-visible:outline-[#C85A3A] focus-visible:outline-offset-2 active:scale-95 ${index === currentImageIndex ? 'border-[#C85A3A]' : 'border-transparent'
                                            }`}
                                        role="listitem"
                                        aria-label={`View image ${index + 1}`}
                                        aria-current={index === currentImageIndex ? 'true' : undefined}
                                        tabIndex={0}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${PRODUCT_DETAILS.name} thumbnail ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover select-none"
                                            loading={index < 4 ? 'eager' : 'lazy'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight text-[#0B0F0E] m-0">
                            {PRODUCT_DETAILS.name}
                        </h1>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-[#FFA500]" aria-hidden="true">
                                <FaStar className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-semibold text-[#0B0F0E]" aria-label={`Rating: ${PRODUCT_DETAILS.rating} out of 5`}>
                                {PRODUCT_DETAILS.rating}
                            </span>
                            <span className="text-lg text-[#818B9C]" aria-label={`${PRODUCT_DETAILS.sold} units sold`}>
                                {PRODUCT_DETAILS.sold} Sold
                            </span>
                        </div>

                        <div className="text-3xl md:text-4xl font-semibold leading-normal tracking-tight text-[#C85A3A]" aria-label={`Price: ${PRODUCT_DETAILS.price}`}>
                            {PRODUCT_DETAILS.price}
                        </div>

                        <p className="text-base text-[#818B9C] leading-relaxed m-0">
                            {PRODUCT_DETAILS.description}
                        </p>

                        {/* Variants */}
                        <div className="flex flex-col gap-3 mt-2">
                            <h3 className="text-lg font-semibold leading-normal text-[#0B0F0E] m-0">
                                Product Variant:
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <label htmlFor="type-select" className="text-base font-medium text-[#0B0F0E]">
                                    Type
                                </label>
                                <label htmlFor="color-select" className="text-base font-medium text-[#0B0F0E]">
                                    Color
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    id="type-select"
                                    value={variant.type}
                                    onChange={handleTypeChange}
                                    className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base font-medium text-[#0B0F0E] bg-white cursor-pointer transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMS41TDYgNi41TDExIDEuNSIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_12px_center] pr-10 focus:outline-none focus:border-[#C85A3A] focus:shadow-[0_0_0_3px_rgba(200,90,58,0.1)] hover:border-[#C85A3A] disabled:opacity-60 disabled:cursor-not-allowed"
                                    aria-label="Select product type"
                                >
                                    <option value="Wireless">Wireless</option>
                                    <option value="Wired">Wired</option>
                                </select>
                                <select
                                    id="color-select"
                                    value={variant.color}
                                    onChange={handleColorChange}
                                    className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base font-medium text-[#0B0F0E] bg-white cursor-pointer transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMS41TDYgNi41TDExIDEuNSIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_12px_center] pr-10 focus:outline-none focus:border-[#C85A3A] focus:shadow-[0_0_0_3px_rgba(200,90,58,0.1)] hover:border-[#C85A3A] disabled:opacity-60 disabled:cursor-not-allowed"
                                    aria-label="Select product color"
                                >
                                    <option value="Black">Black</option>
                                    <option value="White">White</option>
                                    <option value="Red">Red</option>
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <button
                                onClick={handleBuyNow}
                                className="px-8 py-4 bg-[#C85A3A] text-white border-0 rounded-lg text-lg font-semibold leading-normal tracking-tight cursor-pointer transition-all duration-300 hover:bg-[#A84830] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(200,90,58,0.3)] focus-visible:outline-2 focus-visible:outline-[#C85A3A] focus-visible:outline-offset-2 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="px-8 py-4 bg-white text-[#C85A3A] border border-[#C85A3A] rounded-lg text-lg font-semibold leading-normal tracking-tight cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#C85A3A] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(200,90,58,0.3)] focus-visible:outline-2 focus-visible:outline-[#C85A3A] focus-visible:outline-offset-2 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <FaShoppingCart className="w-5 h-5" aria-hidden="true" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </section>

                {/* Product Details Tabs */}
                <section className="mt-16 md:mt-20">
                    <div className="py-8">
                        <h2 className="text-xl md:text-2xl font-semibold leading-normal tracking-tight text-[#0B0F0E] m-0 mb-4">
                            {PRODUCT_DETAILS.name}
                        </h2>
                        <p className="text-base text-[#818B9C] leading-relaxed m-0 mb-6">
                            {PRODUCT_DETAILS.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-between items-start w-full">
                            {/* Specifications */}
                            <div>
                                <h2 className="text-xl md:text-2xl font-semibold leading-normal tracking-tight text-[#0B0F0E] m-0 mb-4">
                                    Specifications
                                </h2>
                                <table className="w-full border-collapse mt-4">
                                    <tbody>
                                        {PRODUCT_DETAILS.specifications.map((spec, index) => (
                                            <tr key={index} className="border-b border-[#E4E9EE] last:border-b-0">
                                                <td className="py-3 md:py-4 text-sm md:text-base text-[#818B9C] w-32 md:w-48">
                                                    {spec.label}
                                                </td>
                                                <td className="py-3 md:py-4 text-sm md:text-base font-semibold text-[#0B0F0E]">
                                                    {spec.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* In The Box */}

                            <div>
                                <h2 className="text-xl md:text-2xl font-semibold leading-normal tracking-tight text-[#0B0F0E] m-0 mb-4">
                                    In The Box
                                </h2>
                                <ul className="list-none p-0 m-0 mt-4 mb-8 flex flex-col gap-3">
                                    {PRODUCT_DETAILS.inTheBox.map((item, index) => (
                                        <li key={index} className="flex items-center gap-3 text-sm md:text-base leading-relaxed text-[#0B0F0E]">
                                            <FaCheck className="text-[#C85A3A] flex-shrink-0" aria-hidden="true" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* System Requirements */}
                            <div>
                                <h2 className="text-xl md:text-2xl font-semibold leading-normal tracking-tight text-[#0B0F0E] m-0 mb-4">
                                    System Required
                                </h2>
                                <ul className="m-0 mt-4 pl-5 list-disc">
                                    {PRODUCT_DETAILS.systemRequirements.map((req, index) => (
                                        <li key={index} className="text-sm md:text-base leading-relaxed text-[#818B9C] mb-2">
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Related Products */}
                <section className="mt-16 md:mt-20">
                    <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
                        <h2 className="text-3xl md:text-4xl font-semibold leading-normal tracking-tight text-[#0B0F0E] m-0">
                            Related Product
                        </h2>
                        <a
                            href="/products"
                            className="px-4 py-2 md:px-4 md:py-2.5 bg-transparent text-[#C85A3A] border border-[#C85A3A] rounded-lg text-base md:text-lg font-semibold cursor-pointer transition-all duration-300 no-underline inline-block whitespace-nowrap hover:bg-[#C85A3A] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(200,90,58,0.3)] focus-visible:outline-2 focus-visible:outline-[#C85A3A] focus-visible:outline-offset-2 active:translate-y-0"
                        >
                            View Detail
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {RELATED_PRODUCTS.map((product) => (
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
                </section>
            </div>
        </div>
    );
};

export default ProductDetails;