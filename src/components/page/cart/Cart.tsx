'use client';

import React, { useState } from 'react';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import Image from 'next/image';

interface CartItem {
    id: number;
    name: string;
    brand: string;
    image: string;
    price: number;
    quantity: number;
}

const DELIVERY_OPTIONS = [
    { value: 'inside_dhaka', label: 'Inside Dhaka', charge: 70 },
    { value: 'outside_dhaka', label: 'Outside Dhaka', charge: 120 },
];

const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: 'Logitech G435 Gaming Headset',
            brand: 'Gaming Jakarta',
            image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop',
            price: 280,
            quantity: 1,
        },
        {
            id: 2,
            name: 'Logitech G502 Hero',
            brand: 'Gaming Jakarta',
            image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
            price: 89,
            quantity: 1,
        },
        {
            id: 3,
            name: 'Logitech G303 Shroud Edition',
            brand: 'Gaming Jakarta',
            image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop',
            price: 46,
            quantity: 1,
        },
    ]);

    const [deliveryOption, setDeliveryOption] = useState(DELIVERY_OPTIONS[0].value);
    const [promoCode, setPromoCode] = useState('');
    
    // Admin controlled discount (if admin gives discount, set this to a number, otherwise null)
    const adminDiscount = null; // Change to a number like 50 to activate discount

    const updateQuantity = (id: number, increment: boolean) => {
        setCartItems((items) =>
            items.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity: increment
                              ? item.quantity + 1
                              : Math.max(1, item.quantity - 1),
                      }
                    : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    // Calculations
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const selectedDelivery = DELIVERY_OPTIONS.find((opt) => opt.value === deliveryOption);
    const deliveryCharge = selectedDelivery?.charge || 0;
    const discount = adminDiscount || 0;
    const totalBeforeDiscount = subtotal + deliveryCharge;
    const total = totalBeforeDiscount - discount;

    return (
        <div className="bg-white w-full min-h-screen py-12 px-4">
            <div className="max-w-[1200px] mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm md:text-base font-medium text-[#818B9C] select-none flex-wrap mb-8">
                    <a href="/" className="text-[#C85A3A] hover:underline transition-all duration-300">
                        Home
                    </a>
                    <MdKeyboardArrowRight className="text-[#818B9C]" />
                    <span className="text-[#0B0F0E] font-semibold">Cart</span>
                </nav>

                {/* Cart Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Section - Selected Products */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-[#E4E9EE] rounded-lg p-6">
                            <h2 className="text-xl md:text-2xl font-semibold text-[#0B0F0E] mb-6">
                                Selected Product
                            </h2>

                            <div className="flex flex-col gap-6">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 pb-6 border-b border-[#E4E9EE] last:border-b-0 last:pb-0"
                                    >
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="w-6 h-6 flex items-center justify-center bg-[#C85A3A] text-white rounded cursor-pointer hover:bg-[#A84830] transition-all duration-300"
                                            aria-label="Remove item"
                                        >
                                            <FaTrash className="w-3 h-3" />
                                        </button>

                                        {/* Product Image */}
                                        <div className="w-20 h-20 bg-[#F6F6F6] rounded-lg flex items-center justify-center flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-contain"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base md:text-lg font-semibold text-[#0B0F0E] mb-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-[#818B9C]">{item.brand}</p>
                                            <p className="text-lg font-semibold text-[#C85A3A] mt-2">
                                                ${item.price}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 border border-[#E4E9EE] rounded-lg px-3 py-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, false)}
                                                disabled={item.quantity === 1}
                                                className="w-6 h-6 flex items-center justify-center text-[#0B0F0E] hover:text-[#C85A3A] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                                aria-label="Decrease quantity"
                                            >
                                                <FaMinus className="w-3 h-3" />
                                            </button>
                                            <span className="text-base font-semibold text-[#0B0F0E] min-w-[20px] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, true)}
                                                className="w-6 h-6 flex items-center justify-center text-[#0B0F0E] hover:text-[#C85A3A] transition-colors duration-300"
                                                aria-label="Increase quantity"
                                            >
                                                <FaPlus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        {/* Delete Icon (mobile) */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="w-8 h-8 flex items-center justify-center text-[#818B9C] hover:text-[#C85A3A] transition-colors duration-300 lg:hidden"
                                            aria-label="Remove item"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Delivery Section */}
                            <div className="mt-8 pt-6 border-t border-[#E4E9EE]">
                                <h3 className="text-lg font-semibold text-[#0B0F0E] mb-4">
                                    Delivery
                                </h3>
                                <select
                                    value={deliveryOption}
                                    onChange={(e) => setDeliveryOption(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#E4E9EE] rounded-lg text-base font-medium text-[#0B0F0E] bg-white cursor-pointer transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMS41TDYgNi41TDExIDEuNSIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_12px_center] pr-10 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 hover:border-[#C85A3A]"
                                >
                                    {DELIVERY_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label} - ${option.charge}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Product Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 sticky top-6">
                            <h2 className="text-xl md:text-2xl font-semibold text-[#0B0F0E] mb-6">
                                Product Summary
                            </h2>

                            {/* Products List */}
                            <div className="flex flex-col gap-3 mb-6">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center text-sm text-[#818B9C]"
                                    >
                                        <span>{item.name}</span>
                                        <span className="font-semibold text-[#0B0F0E]">
                                            ${item.price * item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Pricing Details */}
                            <div className="flex flex-col gap-3 py-4 border-t border-[#E4E9EE]">
                                <div className="flex justify-between text-base">
                                    <span className="text-[#818B9C]">Total Price</span>
                                    <span className="font-semibold text-[#0B0F0E]">${subtotal}</span>
                                </div>
                                <div className="flex justify-between text-base">
                                    <span className="text-[#818B9C]">Delivery Charge</span>
                                    <span className="font-semibold text-[#0B0F0E]">
                                        ${deliveryCharge}
                                    </span>
                                </div>
                                {adminDiscount !== null && (
                                    <div className="flex justify-between text-base">
                                        <span className="text-[#818B9C]">Discount</span>
                                        <span className="font-semibold text-green-600">
                                            -${discount}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Total Price */}
                            <div className="flex justify-between items-center py-4 border-t border-[#E4E9EE] mb-6">
                                <span className="text-xl font-semibold text-[#0B0F0E]">
                                    Total Price
                                </span>
                                <span className="text-2xl font-bold text-[#C85A3A]">${total}</span>
                            </div>

                            {/* Promo Code */}
                            <button
                                disabled={adminDiscount === null}
                                className={`w-full flex items-center justify-between px-4 py-3 border border-[#E4E9EE] rounded-lg mb-4 transition-all duration-300 ${
                                    adminDiscount === null
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:border-[#C85A3A] cursor-pointer'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full border-2 border-[#C85A3A] flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-[#C85A3A]"></div>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-[#0B0F0E]">
                                            Use a Promo
                                        </p>
                                        <p className="text-xs text-[#818B9C]">
                                            Choose promo to use promo
                                        </p>
                                    </div>
                                </div>
                                <MdKeyboardArrowRight className="text-[#818B9C] w-6 h-6" />
                            </button>

                            {/* Checkout Button */}
                            <button
                                onClick={() => console.log('Checkout clicked')}
                                className="w-full px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-[#A84830] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(200,90,58,0.3)] focus-visible:outline-2 focus-visible:outline-[#C85A3A] focus-visible:outline-offset-2 active:translate-y-0"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;