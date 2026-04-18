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

interface ProductCardProps {
    id: string;
    name: string;
    image: string;
    originalPrice?: string;
    salePrice: string;
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

    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleLike?.(id, e);
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
            price: Number(salePrice.replace(/[^\d.]/g, '')),
            originalPrice: originalPrice
                ? Number(originalPrice.replace(/[^\d.]/g, ''))
                : undefined,
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

                {discount && (
                    <div className="absolute top-4 left-0 bg-red-600 text-white px-3 py-1.5 rounded-r-lg text-sm font-semibold z-10">
                        {discount}
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
                            className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform ${
                                isLiked ? 'text-[#C85A3A]' : 'text-[#818B9C]'
                            }`}
                        >
                            {isLiked ? <FaHeart /> : <FaRegHeart />}
                        </button>
                    </div>

                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                        <button
                            onClick={handleCartClick}
                            disabled={stock === 0}
                            className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-[#818B9C] hover:text-[#C85A3A] ${
                                stock === 0 ? 'opacity-40 cursor-not-allowed' : ''
                            }`}
                        >
                            <FaCartPlus />
                        </button>

                        <button
                            onClick={handleViewClick}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform text-[#818B9C] hover:text-[#C85A3A]"
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
                        {originalPrice && (
                            <span className="text-sm text-[#818B9C] line-through">
                                {originalPrice}
                            </span>
                        )}
                        <span className="text-base font-bold text-[#C85A3A]">
                            {salePrice}
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