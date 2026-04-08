'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';

const OrderSuccessPage = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId') || '';

    return (
        <div className="bg-white w-full min-h-screen flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full text-center">

                {/* Tick icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                        <FaCheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-[#0B0F0E] mb-3">
                    Order Placed! 🎉
                </h1>

                <p className="text-[#818B9C] text-base mb-2">
                    Thank you for shopping with Karughor. Your order has been received.
                </p>

                {orderId && orderId !== 'N/A' && (
                    <p className="text-sm text-[#818B9C] mb-8">
                        Order ID:{' '}
                        <span className="font-semibold text-[#0B0F0E] font-mono">
                            {orderId.slice(-8).toUpperCase()}
                        </span>
                    </p>
                )}

                {/* Info box */}
                <div className="bg-[#FFF5F2] border border-[#C85A3A]/20 rounded-lg p-5 mb-8 text-left">
                    <p className="text-sm font-semibold text-[#0B0F0E] mb-2">What happens next?</p>
                    <ul className="space-y-1.5 text-sm text-[#818B9C]">
                        <li>✅ We&apos;ll confirm your order via phone call</li>
                        <li>📦 Your order will be packed and dispatched</li>
                        <li>🚚 Delivery within 3–5 business days</li>
                        <li>💵 Pay cash on delivery</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <button className="flex items-center justify-center gap-2 px-6 py-3 border border-[#E4E9EE] text-[#0B0F0E] rounded-lg font-semibold hover:border-[#C85A3A] hover:text-[#C85A3A] transition-all w-full sm:w-auto">
                            <FaHome /> Go Home
                        </button>
                    </Link>
                    <Link href="/products">
                        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all w-full sm:w-auto">
                            <FaShoppingBag /> Shop More
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;