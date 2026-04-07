'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md';

const faqs = [
    {
        category: 'Orders & Delivery',
        items: [
            {
                q: 'How long does delivery take?',
                a: 'Inside Dhaka: 1-3 business days. Outside Dhaka: 3-5 business days. We will call you to confirm before dispatching.',
            },
            {
                q: 'What are the delivery charges?',
                a: 'Inside Dhaka: ৳70. Outside Dhaka: ৳120. Delivery charges are shown clearly before you place your order.',
            },
            {
                q: 'Can I change my delivery address after placing an order?',
                a: 'Yes, please call us as soon as possible. If the order has not been dispatched yet, we can update your address.',
            },
            {
                q: 'Do you deliver outside Bangladesh?',
                a: 'Currently we only deliver within Bangladesh. International shipping is coming soon.',
            },
        ],
    },
    {
        category: 'Payment',
        items: [
            {
                q: 'What payment methods do you accept?',
                a: 'We currently accept Cash on Delivery (COD) only. You pay when the product is delivered to your door.',
            },
            {
                q: 'Is there any extra charge for COD?',
                a: 'No. You pay exactly the amount shown at checkout — product price plus delivery charge, nothing more.',
            },
        ],
    },
    {
        category: 'Products',
        items: [
            {
                q: 'Are all products handmade?',
                a: 'Yes. All Karughor products are handcrafted by skilled artisans from Bangladesh. Each piece is unique and may have slight natural variations.',
            },
            {
                q: 'Can I place a custom order?',
                a: 'Yes! We accept custom orders for most of our products including nakshi kantha, bed sheets, and bags. Contact us via phone or WhatsApp.',
            },
            {
                q: 'How do I care for my jute products?',
                a: 'Jute products should be kept dry. Spot clean with a damp cloth. Avoid prolonged exposure to direct sunlight. Do not machine wash.',
            },
        ],
    },
    {
        category: 'Returns & Refunds',
        items: [
            {
                q: 'What is your return policy?',
                a: 'We accept returns within 7 days of delivery if the product is damaged or significantly different from what was described. Contact us with photos.',
            },
            {
                q: 'How do I return a product?',
                a: 'Call or WhatsApp us with your order ID and photos of the issue. We will arrange a pickup and process your replacement or refund.',
            },
        ],
    },
];

const FaqItem = ({ q, a }: { q: string; a: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-[#E4E9EE] last:border-b-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center py-5 text-left gap-4 group"
            >
                <span className="text-base font-semibold text-[#0B0F0E] group-hover:text-[#C85A3A] transition-colors">
                    {q}
                </span>
                <MdKeyboardArrowDown
                    className={`w-6 h-6 text-[#818B9C] shrink-0 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>
            {open && (
                <p className="text-[#818B9C] text-base leading-relaxed pb-5 -mt-1">{a}</p>
            )}
        </div>
    );
};

export default function FAQPage() {
    return (
        <div className="bg-white w-full min-h-screen py-12 px-4">
            <div className="max-w-200 mx-auto">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm font-medium text-[#818B9C] mb-10">
                    <Link href="/" className="text-[#C85A3A] hover:underline">Home</Link>
                    <MdKeyboardArrowRight />
                    <span className="text-[#0B0F0E] font-semibold">FAQ</span>
                </nav>

                <h1 className="text-3xl md:text-4xl font-bold text-[#0B0F0E] mb-2">
                    Frequently Asked Questions
                </h1>
                <p className="text-[#818B9C] mb-12">
                    Can&apos;t find an answer? Call us or WhatsApp us directly.
                </p>

                <div className="flex flex-col gap-10">
                    {faqs.map((section) => (
                        <div key={section.category}>
                            <h2 className="text-lg font-bold text-[#C85A3A] mb-2 uppercase tracking-wide">
                                {section.category}
                            </h2>
                            <div className="bg-white border border-[#E4E9EE] rounded-lg px-6">
                                {section.items.map((item) => (
                                    <FaqItem key={item.q} q={item.q} a={item.a} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions */}
                <div className="mt-14 bg-[#FFF5F2] border border-[#C85A3A]/20 rounded-xl p-8 text-center">
                    <h3 className="text-xl font-semibold text-[#0B0F0E] mb-2">Still have questions?</h3>
                    <p className="text-[#818B9C] mb-6">We&apos;re happy to help. Reach out to us directly.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:+8801XXXXXXXXX"
                            className="px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-colors"
                        >
                            📞 Call Us
                        </a>
                        <a
                            href="https://wa.me/8801XXXXXXXXX"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 border border-[#C85A3A] text-[#C85A3A] rounded-lg font-semibold hover:bg-[#C85A3A] hover:text-white transition-colors"
                        >
                            💬 WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}