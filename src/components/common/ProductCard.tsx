'use client';

import React from 'react';
import Link from 'next/link';
import { FaRegHeart, FaRegStar } from 'react-icons/fa';
import { FaCartPlus, FaHeart } from 'react-icons/fa6';
import Image from 'next/image';
import { MdOutlineRemoveRedEye } from 'react-icons/md';

interface ProductCardProps {
    id: number;
    name: string;
    image: string;
    originalPrice: string;
    salePrice: string;
    discount?: string;
    rating?: string;
    isLiked?: boolean;
    onToggleLike?: (id: number, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    image,
    originalPrice,
    salePrice,
    discount = '20% Off',
    rating = '4.8',
    isLiked = false,
    onToggleLike,
}) => {
    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleLike?.(id, e);
    };

    return (
        <div className="relative cursor-pointer border border-[#E4E9EE] rounded-lg overflow-hidden bg-white flex flex-col transition-transform hover:-translate-y-1">

            {/* Image Box */}
            <div className="relative bg-[#F6F6F6] p-12.5 rounded-t-md group overflow-hidden">

                {/* Discount Badge */}
                {discount && (
                    <div className="absolute top-4 left-0 bg-red-600 text-white px-3 py-1.5 rounded-r-lg text-lg z-10">
                        {discount}
                    </div>
                )}

                {/* Product Image */}
                <Image
                    src={image}
                    alt={name}
                    width={500}
                    height={500}
                    className="w-full h-auto block"
                />

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/30 opacity-0 transition-all duration-300 group-hover:opacity-100 rounded-lg pointer-events-none">

                    {/* Top-right: Like button */}
                    <div className="flex justify-end p-3">
                        <button
                            onClick={handleLikeClick}
                            aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                            className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 ${isLiked ? 'text-[#C85A3A]' : 'text-[#818B9C]'}`}
                        >
                            {isLiked ? <FaHeart /> : <FaRegHeart />}
                        </button>
                    </div>

                    {/* Centered Cart & View buttons */}
                    <div className="absolute inset-0 flex items-center justify-center gap-4">
                        <Link href={`/cart/${id}`}>
                            <button className="w-12 h-12 rounded-full bg-[#0B0F0E] text-white flex items-center justify-center transition-transform hover:scale-110">
                                <FaCartPlus className="w-4.5 h-4.5" />
                            </button>
                        </Link>
                        <Link href={`/products/${id}`}>
                            <button className="w-12 h-12 rounded-full bg-[#0B0F0E] text-white flex items-center justify-center transition-transform hover:scale-110">
                                <MdOutlineRemoveRedEye className="w-4.5 h-4.5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col grow justify-between">
                <h3 className="text-lg font-semibold text-[#0B0F0E] mb-2 leading-snug">{name}</h3>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-[#919EAB] line-through">{originalPrice}</span>
                        <span className="text-base font-semibold text-[#C85A3A]">{salePrice}</span>
                    </div>
                    <div className="flex items-center gap-1 text-base text-[#FFA500]">
                        <FaRegStar className="w-4 h-4" /> {rating}
                    </div>
                </div>
            </div>
        </div>
    );
};
