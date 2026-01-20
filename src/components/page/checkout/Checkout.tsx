'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { FaMapMarkerAlt, FaPhone, FaUser, FaEnvelope } from 'react-icons/fa';

interface CheckoutFormValues {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    area: string;
    deliveryLocation: 'inside_dhaka' | 'outside_dhaka';
    notes?: string;
}

interface CartItem {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

const Checkout = () => {
    const [cartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: 'Logitech G502 Hero',
            image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
            price: 89,
            quantity: 1,
        },
        {
            id: 2,
            name: 'Gaming Keyboard',
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
            price: 120,
            quantity: 1,
        },
    ]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CheckoutFormValues>({
        defaultValues: {
            deliveryLocation: 'inside_dhaka',
        },
    });

    const deliveryLocation = watch('deliveryLocation');

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharge = deliveryLocation === 'inside_dhaka' ? 70 : 120;
    const total = subtotal + deliveryCharge;

    const onSubmit = (data: CheckoutFormValues) => {
        console.log('Order Data:', {
            ...data,
            items: cartItems,
            subtotal,
            deliveryCharge,
            total,
            paymentMethod: 'COD',
        });
        // API call to create order
        alert('Order placed successfully! Order will be confirmed via phone call.');
    };

    return (
        <div className="bg-white w-full min-h-screen py-12 px-4">
            <div className="max-w-[1200px] mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm md:text-base font-medium text-[#818B9C] select-none flex-wrap mb-8">
                    <a href="/" className="text-[#C85A3A] hover:underline transition-all duration-300">
                        Home
                    </a>
                    <MdKeyboardArrowRight className="text-[#818B9C]" />
                    <a href="/cart" className="text-[#C85A3A] hover:underline transition-all duration-300">
                        Cart
                    </a>
                    <MdKeyboardArrowRight className="text-[#818B9C]" />
                    <span className="text-[#0B0F0E] font-semibold">Checkout</span>
                </nav>

                <h1 className="text-3xl md:text-4xl font-bold text-[#0B0F0E] mb-8">Checkout</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Section - Delivery Information */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-xl md:text-2xl font-semibold text-[#0B0F0E] mb-6">
                                    Delivery Information
                                </h2>

                                <div className="space-y-6">
                                    {/* Full Name */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaUser className="text-[#C85A3A]" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            {...register('fullName', {
                                                required: 'Full name is required',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {errors.fullName && (
                                            <span className="text-sm text-red-500">
                                                {errors.fullName.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaPhone className="text-[#C85A3A]" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                            {...register('phone', {
                                                required: 'Phone number is required',
                                                pattern: {
                                                    value: /^[0-9+\-\s()]+$/,
                                                    message: 'Invalid phone number',
                                                },
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {errors.phone && (
                                            <span className="text-sm text-red-500">
                                                {errors.phone.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Email (Optional) */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaEnvelope className="text-[#C85A3A]" />
                                            Email <span className="text-[#818B9C] text-sm">(Optional)</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            {...register('email', {
                                                pattern: {
                                                    value: /^\S+@\S+$/i,
                                                    message: 'Invalid email',
                                                },
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {errors.email && (
                                            <span className="text-sm text-red-500">
                                                {errors.email.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Delivery Location */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-[#C85A3A]" />
                                            Delivery Location
                                        </label>
                                        <select
                                            {...register('deliveryLocation', {
                                                required: 'Please select delivery location',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base font-medium text-[#0B0F0E] bg-white cursor-pointer transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMS41TDYgNi41TDExIDEuNSIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-no-repeat bg-[right_12px_center] pr-10 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        >
                                            <option value="inside_dhaka">Inside Dhaka - $70</option>
                                            <option value="outside_dhaka">Outside Dhaka - $120</option>
                                        </select>
                                    </div>

                                    {/* City */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Dhaka"
                                            {...register('city', {
                                                required: 'City is required',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {errors.city && (
                                            <span className="text-sm text-red-500">
                                                {errors.city.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Area */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">
                                            Area
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Dhanmondi"
                                            {...register('area', {
                                                required: 'Area is required',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {errors.area && (
                                            <span className="text-sm text-red-500">
                                                {errors.area.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Full Address */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">
                                            Full Address
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="House/Flat number, Road, Block..."
                                            {...register('address', {
                                                required: 'Address is required',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 resize-none"
                                        />
                                        {errors.address && (
                                            <span className="text-sm text-red-500">
                                                {errors.address.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">
                                            Order Notes <span className="text-[#818B9C] text-sm">(Optional)</span>
                                        </label>
                                        <textarea
                                            rows={2}
                                            placeholder="Any special instructions..."
                                            {...register('notes')}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 sticky top-6">
                                <h2 className="text-xl md:text-2xl font-semibold text-[#0B0F0E] mb-6">
                                    Order Summary
                                </h2>

                                {/* Products */}
                                <div className="space-y-4 mb-6 pb-6 border-b border-[#E4E9EE]">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-16 h-16 bg-[#F6F6F6] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-contain"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-[#0B0F0E] mb-1">
                                                    {item.name}
                                                </h4>
                                                <p className="text-xs text-[#818B9C]">
                                                    Qty: {item.quantity}
                                                </p>
                                                <p className="text-sm font-semibold text-[#C85A3A] mt-1">
                                                    ${item.price * item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-base">
                                        <span className="text-[#818B9C]">Subtotal</span>
                                        <span className="font-semibold text-[#0B0F0E]">
                                            ${subtotal}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span className="text-[#818B9C]">Delivery Charge</span>
                                        <span className="font-semibold text-[#0B0F0E]">
                                            ${deliveryCharge}
                                        </span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center py-4 border-t border-[#E4E9EE] mb-6">
                                    <span className="text-xl font-semibold text-[#0B0F0E]">
                                        Total (COD)
                                    </span>
                                    <span className="text-2xl font-bold text-[#C85A3A]">
                                        ${total}
                                    </span>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-[#F7F7F7] p-4 rounded-lg mb-6">
                                    <p className="text-sm font-semibold text-[#0B0F0E] mb-2">
                                        Payment Method
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full border-2 border-[#C85A3A] flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-[#C85A3A]"></div>
                                        </div>
                                        <span className="text-[#0B0F0E] font-medium">
                                            Cash on Delivery (COD)
                                        </span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    type="submit"
                                    className="w-full px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-[#A84830] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(200,90,58,0.3)] focus-visible:outline-2 focus-visible:outline-[#C85A3A] focus-visible:outline-offset-2 active:translate-y-0"
                                >
                                    Place Order
                                </button>

                                <p className="text-xs text-center text-[#818B9C] mt-4">
                                    By placing your order, you agree to our terms and conditions
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;