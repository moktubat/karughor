'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMinus, FaPlus, FaTrash, FaShoppingBag } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://karughor-backend.onrender.com/api';

const Cart = () => {
    const router = useRouter();
    const { items, removeItem, updateQuantity } = useCartStore();
    const [deliveryOption, setDeliveryOption] = useState('inside_dhaka');

    const { data: settingsData } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/settings`);
            return res.data.data.settings;
        },
        staleTime: 5 * 60_000,
    });

    const DELIVERY_OPTIONS = [
        { value: 'inside_dhaka', label: 'Inside Dhaka', charge: settingsData?.insideDhakaCharge ?? 70 },
        { value: 'outside_dhaka', label: 'Outside Dhaka', charge: settingsData?.outsideDhakaCharge ?? 120 },
    ];

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryCharge = DELIVERY_OPTIONS.find(o => o.value === deliveryOption)?.charge || 0;
    const total = subtotal + deliveryCharge;

    if (items.length === 0) {
        return (
            <div className="bg-white w-full min-h-screen py-12 px-4">
                <div className="max-w-300 mx-auto">
                    <nav className="flex items-center gap-2 text-sm font-medium text-[#818B9C] mb-8">
                        <Link href="/" className="text-[#C85A3A] hover:underline">Home</Link>
                        <MdKeyboardArrowRight />
                        <span className="text-[#0B0F0E] font-semibold">Cart</span>
                    </nav>
                    <div className="text-center py-24">
                        <FaShoppingBag className="w-16 h-16 text-[#E4E9EE] mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold text-[#0B0F0E] mb-2">Your cart is empty</h2>
                        <p className="text-[#818B9C] mb-8">Looks like you haven't added anything yet.</p>
                        <Link href="/products">
                            <button className="px-8 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-colors">
                                Browse Products
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white w-full min-h-screen py-12 px-4">
            <div className="max-w-300 mx-auto">
                <nav className="flex items-center gap-2 text-sm md:text-base font-medium text-[#818B9C] select-none flex-wrap mb-8">
                    <Link href="/" className="text-[#C85A3A] hover:underline transition-all duration-300">Home</Link>
                    <MdKeyboardArrowRight />
                    <span className="text-[#0B0F0E] font-semibold">Cart</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left — Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-[#E4E9EE] rounded-lg p-6">
                            <h2 className="text-xl md:text-2xl font-semibold text-[#0B0F0E] mb-6">
                                Selected Products ({items.length})
                            </h2>
                            <div className="flex flex-col gap-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 pb-6 border-b border-[#E4E9EE] last:border-b-0 last:pb-0">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="w-6 h-6 flex items-center justify-center bg-[#C85A3A] text-white rounded cursor-pointer hover:bg-[#A84830] transition-all shrink-0"
                                            aria-label="Remove item"
                                        >
                                            <FaTrash className="w-3 h-3" />
                                        </button>
                                        <div className="w-20 h-20 bg-[#F6F6F6] rounded-lg flex items-center justify-center shrink-0">
                                            <Image src={item.image} alt={item.name} width={64} height={64} className="object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base md:text-lg font-semibold text-[#0B0F0E] mb-1 line-clamp-1">{item.name}</h3>
                                            {item.originalPrice && <p className="text-sm text-[#818B9C] line-through">৳{item.originalPrice}</p>}
                                            <p className="text-lg font-semibold text-[#C85A3A] mt-1">৳{item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-3 border border-[#E4E9EE] rounded-lg px-3 py-2 shrink-0">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity === 1}
                                                className="w-6 h-6 flex items-center justify-center text-[#0B0F0E] hover:text-[#C85A3A] transition-colors disabled:opacity-30"
                                                aria-label="Decrease quantity"
                                            >
                                                <FaMinus className="w-3 h-3" />
                                            </button>
                                            <span className="text-base font-semibold text-[#0B0F0E] min-w-5 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center text-[#0B0F0E] hover:text-[#C85A3A] transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <FaPlus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="text-base font-bold text-[#0B0F0E] min-w-20 text-right shrink-0">৳{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-[#E4E9EE]">
                                <h3 className="text-lg font-semibold text-[#0B0F0E] mb-4">Delivery Location</h3>
                                <select
                                    value={deliveryOption}
                                    onChange={(e) => setDeliveryOption(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#E4E9EE] rounded-lg text-base font-medium text-[#0B0F0E] bg-white cursor-pointer transition-all focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 hover:border-[#C85A3A]"
                                >
                                    {DELIVERY_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label} — ৳{opt.charge}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right — Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 sticky top-6">
                            <h2 className="text-xl md:text-2xl font-semibold text-[#0B0F0E] mb-6">Order Summary</h2>
                            <div className="flex flex-col gap-3 mb-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm text-[#818B9C]">
                                        <span className="line-clamp-1 flex-1 mr-2">{item.name} ×{item.quantity}</span>
                                        <span className="font-semibold text-[#0B0F0E] shrink-0">৳{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-3 py-4 border-t border-[#E4E9EE]">
                                <div className="flex justify-between text-base">
                                    <span className="text-[#818B9C]">Subtotal</span>
                                    <span className="font-semibold text-[#0B0F0E]">৳{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-[#818B9C]">Delivery</span>
                                    <span className="font-semibold text-[#0B0F0E]">৳{deliveryCharge}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-4 border-t border-[#E4E9EE] mb-6">
                                <span className="text-xl font-semibold text-[#0B0F0E]">Total</span>
                                <span className="text-2xl font-bold text-[#C85A3A]">৳{total}</span>
                            </div>
                            <button
                                onClick={() => router.push(`/checkout?delivery=${deliveryOption}`)}
                                className="w-full px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold transition-all hover:bg-[#A84830] hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                Proceed to Checkout
                            </button>
                            <Link href="/products">
                                <button className="w-full mt-3 px-8 py-3 border border-[#E4E9EE] text-[#818B9C] rounded-lg text-base font-medium transition-all hover:border-[#C85A3A] hover:text-[#C85A3A]">
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;