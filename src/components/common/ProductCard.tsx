'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaRegHeart, FaRegStar } from 'react-icons/fa';
import { FaCartPlus, FaHeart } from 'react-icons/fa6';
import Image from 'next/image';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/providers/ToastProvider';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

interface ProductCardProps {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    salePrice?: string;
    discount?: string;
    rating?: string;
    isLiked?: boolean;
    onToggleLike?: (id: string, e: React.MouseEvent) => void;
    stock?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    image,
    price,
    originalPrice,
    salePrice,
    discount,
    rating = '4.8',
    isLiked = false,
    onToggleLike,
    stock,
}) => {
    const { showError, showSuccess } = useToast();
    const router = useRouter();
    const { addItem, items } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const numericPrice = price;
    const numericOriginalPrice = originalPrice;

    const displayPrice = salePrice ?? `৳${numericPrice}`;
    const displayOriginalPrice = numericOriginalPrice ? `৳${numericOriginalPrice}` : undefined;
    const displayDiscount = discount ?? (
        numericOriginalPrice && numericPrice < numericOriginalPrice
            ? `${Math.round(((numericOriginalPrice - numericPrice) / numericOriginalPrice) * 100)}% Off`
            : undefined
    );

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        onToggleLike?.(id, e);

        if (isAuthenticated) {
            try {
                if (isLiked) {
                    await api.delete(`/users/wishlist/${id}`, { withCredentials: true });
                } else {
                    await api.post(`/users/wishlist/${id}`, {}, { withCredentials: true });
                }
            } catch (err: any) {
                const msg = err?.response?.data?.message || '';
                if (!msg.includes('already')) {
                    showError('Could not update wishlist');
                }
            }
        }
    };

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (stock !== undefined) {
            const existingItem = items.find((item) => item.id === id);
            const currentQty = existingItem?.quantity || 0;

            if (stock === 0) {
                showError('Product is out of stock');
                return;
            }

            if (currentQty >= stock) {
                showError('Stock limit reached');
                return;
            }
        }

        addItem({
            id,
            name,
            image,
            price: numericPrice,
            originalPrice: numericOriginalPrice,
            category: '',
        });

        showSuccess('Added to cart');
    };

    const handleViewClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/products/${id}`);
    };

    return (
        <Link
            href={`/products/${id}`}
            className="relative cursor-pointer border border-[#E4E9EE] rounded-lg overflow-hidden bg-white flex flex-col h-full transition-transform hover:-translate-y-1"
        >
            <div className="relative bg-[#F6F6F6] w-full aspect-square group overflow-hidden">

                {stock === 0 && (
                    <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-20">
                        Out of stock
                    </span>
                )}

                {displayDiscount && (
                    <div className="absolute top-4 left-0 bg-red-600 text-white px-3 py-1.5 rounded-r-lg text-sm font-semibold z-10">
                        {displayDiscount}
                    </div>
                )}

                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg">
                    <div className="flex justify-end p-3">
                        <button
                            onClick={handleLikeClick}
                            className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform ${isLiked ? 'text-[#C85A3A]' : 'text-[#818B9C]'
                                }`}
                            aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            {isLiked ? <FaHeart /> : <FaRegHeart />}
                        </button>
                    </div>

                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                        <button
                            onClick={handleCartClick}
                            disabled={stock === 0}
                            className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-[#818B9C] hover:text-[#C85A3A] ${stock === 0 ? 'opacity-40 cursor-not-allowed' : ''
                                }`}
                            aria-label="Add to cart"
                        >
                            <FaCartPlus />
                        </button>

                        <button
                            onClick={handleViewClick}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-[#818B9C] hover:text-[#C85A3A]"
                            aria-label="View product"
                        >
                            <MdOutlineRemoveRedEye />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-1 p-4 gap-2">
                <p className="text-base font-semibold text-[#0B0F0E] line-clamp-2 flex-1">
                    {name}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        {displayOriginalPrice && (
                            <span className="text-sm text-[#818B9C] line-through">
                                {displayOriginalPrice}
                            </span>
                        )}
                        <span className="text-base font-bold text-[#C85A3A]">
                            {displayPrice}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                        <FaRegStar className="w-4 h-4" />
                        <span className="text-sm text-[#818B9C]">{rating}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};