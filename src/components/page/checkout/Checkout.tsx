'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { FaMapMarkerAlt, FaPhone, FaUser, FaEnvelope, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import api from '@/lib/api';


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

const inputCls = "px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20";

const Checkout = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { items, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const rawDelivery = searchParams.get('delivery');
    const defaultDelivery: 'inside_dhaka' | 'outside_dhaka' =
        rawDelivery === 'inside_dhaka' || rawDelivery === 'outside_dhaka'
            ? rawDelivery
            : 'inside_dhaka';

    const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormValues>({
        defaultValues: { deliveryLocation: defaultDelivery },
    });

    const { data: settingsData } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const res = await api.get('/settings');
            return res.data.data.settings;
        },
        staleTime: 5 * 60_000,
    });

    const deliveryLocation = watch('deliveryLocation');
    const DELIVERY_CHARGES: Record<string, number> = {
        inside_dhaka: settingsData?.insideDhakaCharge ?? 70,
        outside_dhaka: settingsData?.outsideDhakaCharge ?? 120,
    };
    const deliveryCharge = DELIVERY_CHARGES[deliveryLocation] || 70;
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const total = subtotal + deliveryCharge;

    if (items.length === 0) {
        return (
            <div className="bg-white w-full min-h-screen flex flex-col items-center justify-center gap-6 px-4">
                <p className="text-xl font-semibold text-[#0B0F0E]">Your cart is empty</p>
                <Link href="/products">
                    <button className="px-8 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-colors">
                        Browse Products
                    </button>
                </Link>
            </div>
        );
    }

    const onSubmit = async (data: CheckoutFormValues) => {
        setLoading(true);
        setError('');

        try {
            const res = await api.post(
                '/orders/guest',
                {
                    customer: {
                        name: data.fullName,
                        phone: data.phone,
                        email: data.email || '',
                        address: {
                            street: data.address,
                            area: data.area,
                            city: data.city,
                            deliveryLocation: data.deliveryLocation,
                        },
                    },
                    items: items.map(i => ({
                        productId: i.id,
                        quantity: i.quantity,
                    })),
                    notes: data.notes || '',
                },
            );

            const orderNumber =
                res.data?.data?.order?.orderNumber || '';

            clearCart();

            router.push(`/order-success?orderNumber=${orderNumber}`);

        } catch (err: any) {
            setError(
                err.response?.data?.error?.message ||
                err.response?.data?.message ||
                'Failed to place order. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white w-full min-h-screen py-12 px-4">
            <div className="max-w-300 mx-auto">
                <nav className="flex items-center gap-2 text-sm md:text-base font-medium text-[#818B9C] select-none flex-wrap mb-8">
                    <Link href="/" className="text-[#C85A3A] hover:underline">Home</Link>
                    <MdKeyboardArrowRight />
                    <Link href="/cart" className="text-[#C85A3A] hover:underline">Cart</Link>
                    <MdKeyboardArrowRight />
                    <span className="text-[#0B0F0E] font-semibold">Checkout</span>
                </nav>

                <h1 className="text-3xl md:text-4xl font-bold text-[#0B0F0E] mb-8">Checkout</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left — Delivery Info */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-xl font-semibold text-[#0B0F0E] mb-6">Delivery Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaUser className="text-[#C85A3A]" /> Full Name
                                        </label>
                                        <input type="text" placeholder="Your full name" {...register('fullName', { required: 'Name is required' })} className={inputCls} />
                                        {errors.fullName && <span className="text-sm text-red-500">{errors.fullName.message}</span>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaPhone className="text-[#C85A3A]" /> Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                            {...register('phone', {
                                                required: 'Phone is required',
                                                validate: (val) => {
                                                    const stripped = val.replace(/^(\+?880)/, '');
                                                    return /^01[3-9]\d{8}$/.test(stripped) || 'Enter a valid BD number (e.g. 01712345678)';
                                                },
                                            })}
                                            className={inputCls}
                                        />
                                        {errors.phone && <span className="text-sm text-red-500">{errors.phone.message}</span>}
                                    </div>

                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaEnvelope className="text-[#C85A3A]" /> Email <span className="text-[#818B9C] text-sm">(Optional)</span>
                                        </label>
                                        <input type="email" placeholder="your@email.com" {...register('email')} className={inputCls} />
                                    </div>

                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-[#C85A3A]" /> Delivery Location
                                        </label>
                                        <select
                                            {...register('deliveryLocation', { required: true })}
                                            className={`${inputCls} font-medium text-[#0B0F0E] bg-white cursor-pointer`}
                                        >
                                            <option value="inside_dhaka">Inside Dhaka — ৳{DELIVERY_CHARGES.inside_dhaka}</option>
                                            <option value="outside_dhaka">Outside Dhaka — ৳{DELIVERY_CHARGES.outside_dhaka}</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">City</label>
                                        <input type="text" placeholder="e.g., Dhaka" {...register('city', { required: 'City is required' })} className={inputCls} />
                                        {errors.city && <span className="text-sm text-red-500">{errors.city.message}</span>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">Area / Thana</label>
                                        <input type="text" placeholder="e.g., Dhanmondi" {...register('area', { required: 'Area is required' })} className={inputCls} />
                                        {errors.area && <span className="text-sm text-red-500">{errors.area.message}</span>}
                                    </div>

                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">Full Address</label>
                                        <textarea rows={3} placeholder="House/Flat no., Road, Block..." {...register('address', { required: 'Address is required' })} className={`${inputCls} resize-none`} />
                                        {errors.address && <span className="text-sm text-red-500">{errors.address.message}</span>}
                                    </div>

                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">
                                            Order Notes <span className="text-[#818B9C] text-sm">(Optional)</span>
                                        </label>
                                        <textarea rows={2} placeholder="Any special instructions..." {...register('notes')} className={`${inputCls} resize-none`} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right — Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 sticky top-6">
                                <h2 className="text-xl font-semibold text-[#0B0F0E] mb-6">Order Summary</h2>
                                <div className="space-y-4 mb-6 pb-6 border-b border-[#E4E9EE]">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="w-14 h-14 bg-[#F6F6F6] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Image src={item.image} alt={item.name} width={40} height={40} className="object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-[#0B0F0E] line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-[#818B9C]">Qty: {item.quantity}</p>
                                                <p className="text-sm font-semibold text-[#C85A3A]">৳{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-base">
                                        <span className="text-[#818B9C]">Subtotal</span>
                                        <span className="font-semibold text-[#0B0F0E]">৳{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span className="text-[#818B9C]">Delivery</span>
                                        <span className="font-semibold text-[#0B0F0E]">৳{deliveryCharge}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-4 border-t border-[#E4E9EE] mb-4">
                                    <span className="text-xl font-semibold text-[#0B0F0E]">Total (COD)</span>
                                    <span className="text-2xl font-bold text-[#C85A3A]">৳{total}</span>
                                </div>
                                <div className="bg-[#F7F7F7] p-4 rounded-lg mb-6">
                                    <p className="text-sm font-semibold text-[#0B0F0E] mb-2">Payment Method</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full border-2 border-[#C85A3A] flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-[#C85A3A]" />
                                        </div>
                                        <span className="text-[#0B0F0E] font-medium text-sm">Cash on Delivery (COD)</span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold transition-all hover:bg-[#A84830] hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? <><FaSpinner className="animate-spin" /> Placing Order...</> : 'Place Order'}
                                </button>
                                <p className="text-xs text-center text-[#818B9C] mt-4">
                                    By placing your order you agree to our terms and conditions
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