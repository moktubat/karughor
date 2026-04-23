'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md';

type Lang = 'en' | 'bn';

const content = {
    en: {
        title: 'Frequently Asked Questions',
        subtitle: "Can't find an answer? Call or WhatsApp us directly.",
        callUs: '📞 Call Us',
        whatsapp: '💬 WhatsApp',
        stillQuestion: 'Still have questions?',
        reachOut: "We're happy to help. Reach out to us directly.",
        sections: [
            {
                category: 'Orders & Delivery',
                items: [
                    {
                        q: 'How long does delivery take?',
                        a: 'Inside Dhaka: 1–3 business days. Outside Dhaka: 3–5 business days. We will call you to confirm your order before dispatching.',
                    },
                    {
                        q: 'What are the delivery charges?',
                        a: 'Inside Dhaka: ৳70. Outside Dhaka: ৳120. Delivery charges are shown clearly before you place your order.',
                    },
                    {
                        q: 'How will I know my order is confirmed?',
                        a: 'We will call you on the phone number you provided to confirm your order before dispatching. Please keep your phone reachable.',
                    },
                    {
                        q: 'Can I change my delivery address after placing an order?',
                        a: 'Yes, please call us as soon as possible. If the order has not been dispatched yet, we can update your address.',
                    },
                    {
                        q: 'Can I cancel my order?',
                        a: 'Yes, you can cancel your order within 60 minutes of placing it from your profile page under "My Orders". After 60 minutes, please call us directly.',
                    },
                    {
                        q: 'Do you deliver outside Bangladesh?',
                        a: 'Currently we only deliver within Bangladesh. International shipping is coming soon.',
                    },
                    {
                        q: 'What if I am not home during delivery?',
                        a: 'Our delivery partner will call before arriving. If you are unavailable, they may attempt redelivery. Please make sure your phone is reachable on the delivery day.',
                    },
                ],
            },
            {
                category: 'Payment',
                items: [
                    {
                        q: 'What payment methods do you accept?',
                        a: 'We currently accept Cash on Delivery (COD) only. You pay when the product is delivered to your door — no advance payment required.',
                    },
                    {
                        q: 'Is there any extra charge for COD?',
                        a: 'No. You pay exactly the amount shown at checkout — product price plus delivery charge, nothing more.',
                    },
                    {
                        q: 'Do I need to pay anything in advance?',
                        a: 'Absolutely not. You only pay when you receive your product at your doorstep.',
                    },
                ],
            },
            {
                category: 'Products & Quality',
                items: [
                    {
                        q: 'Are the products really handmade?',
                        a: 'Yes. Every product on Karughor is handcrafted by skilled Bangladeshi artisans. Each piece may have slight natural variations — that is what makes it unique.',
                    },
                    {
                        q: 'What if I receive a damaged or wrong product?',
                        a: 'We are sorry if that happens. Please take a photo and contact us within 24 hours of delivery. We will arrange a replacement or refund immediately.',
                    },
                    {
                        q: 'Do product colors look the same in real life?',
                        a: 'We try our best to show accurate colors in photos. However, slight color variation may occur due to screen settings and the handmade nature of the products.',
                    },
                    {
                        q: 'How do I care for my product?',
                        a: 'Each product page has a Care Guide section with specific instructions. Generally, jute and fabric products should be spot-cleaned and kept away from prolonged sunlight.',
                    },
                ],
            },
            {
                category: 'Account & Returns',
                items: [
                    {
                        q: 'Do I need an account to order?',
                        a: 'No, you can place a guest order without creating an account. However, creating an account lets you track your orders, save a wishlist, and reorder easily.',
                    },
                    {
                        q: 'What is your return policy?',
                        a: 'If you receive a damaged or incorrect item, contact us within 24 hours with a photo. We will arrange a return and replacement at no cost to you.',
                    },
                ],
            },
        ],
    },
    bn: {
        title: 'সাধারণ জিজ্ঞাসা',
        subtitle: 'উত্তর না পেলে সরাসরি কল বা হোয়াটসঅ্যাপ করুন।',
        callUs: '📞 কল করুন',
        whatsapp: '💬 হোয়াটসঅ্যাপ',
        stillQuestion: 'আরও প্রশ্ন আছে?',
        reachOut: 'আমরা সাহায্য করতে প্রস্তুত। সরাসরি যোগাযোগ করুন।',
        sections: [
            {
                category: 'অর্ডার ও ডেলিভারি',
                items: [
                    {
                        q: 'ডেলিভারি পেতে কতদিন লাগবে?',
                        a: 'ঢাকার ভেতরে: ১–৩ কার্যদিবস। ঢাকার বাইরে: ৩–৫ কার্যদিবস। পাঠানোর আগে আমরা আপনাকে ফোন করে নিশ্চিত করব।',
                    },
                    {
                        q: 'ডেলিভারি চার্জ কত?',
                        a: 'ঢাকার ভেতরে: ৳৭০। ঢাকার বাইরে: ৳১২০। অর্ডার দেওয়ার আগেই চার্জ স্পষ্টভাবে দেখানো হয়।',
                    },
                    {
                        q: 'অর্ডার নিশ্চিত হয়েছে কিনা কীভাবে বুঝব?',
                        a: 'আপনার দেওয়া নম্বরে আমরা ফোন করে অর্ডার নিশ্চিত করব। তাই ফোন রিসিভ করার জন্য প্রস্তুত থাকুন।',
                    },
                    {
                        q: 'অর্ডার দেওয়ার পর ঠিকানা পরিবর্তন করা যাবে?',
                        a: 'হ্যাঁ, যত তাড়াতাড়ি সম্ভব আমাদের কল করুন। পণ্য পাঠানোর আগে হলে ঠিকানা পরিবর্তন করা যাবে।',
                    },
                    {
                        q: 'অর্ডার বাতিল করা যাবে?',
                        a: 'হ্যাঁ। অর্ডার দেওয়ার ৬০ মিনিটের মধ্যে "My Orders" থেকে বাতিল করা যাবে। এরপর সরাসরি কল করুন।',
                    },
                    {
                        q: 'বাংলাদেশের বাইরে ডেলিভারি দেন?',
                        a: 'এখন শুধু বাংলাদেশের ভেতরে ডেলিভারি দেওয়া হয়। আন্তর্জাতিক শিপিং শীঘ্রই আসছে।',
                    },
                    {
                        q: 'ডেলিভারির সময় বাসায় না থাকলে কী হবে?',
                        a: 'ডেলিভারি দেওয়ার আগে কল করা হবে। না পেলে পুনরায় ডেলিভারির চেষ্টা করা হতে পারে। ডেলিভারির দিন ফোন কাছে রাখুন।',
                    },
                ],
            },
            {
                category: 'পেমেন্ট',
                items: [
                    {
                        q: 'কীভাবে পেমেন্ট করতে হবে?',
                        a: 'আমরা শুধু ক্যাশ অন ডেলিভারি (COD) গ্রহণ করি। পণ্য হাতে পাওয়ার পর দরজায় টাকা দিতে হবে — আগে কোনো পেমেন্ট নেই।',
                    },
                    {
                        q: 'COD-এ কোনো বাড়তি চার্জ আছে?',
                        a: 'না। চেকআউটে যে মোট দেখানো হয় — পণ্যের দাম + ডেলিভারি চার্জ — শুধু সেটুকুই দিতে হবে।',
                    },
                    {
                        q: 'আগে কোনো টাকা দিতে হবে?',
                        a: 'একদম না। পণ্য হাতে পাওয়ার পরেই শুধু টাকা দিতে হবে।',
                    },
                ],
            },
            {
                category: 'পণ্য ও মান',
                items: [
                    {
                        q: 'পণ্যগুলো কি সত্যিই হাতে তৈরি?',
                        a: 'হ্যাঁ। কারুঘরের প্রতিটি পণ্য বাংলাদেশের দক্ষ কারিগরদের হাতে তৈরি। প্রতিটি পিসে সামান্য পার্থক্য থাকতে পারে — এটাই এর স্বতন্ত্রতা।',
                    },
                    {
                        q: 'নষ্ট বা ভুল পণ্য পেলে কী করব?',
                        a: 'দুঃখিত যদি এমন হয়। ডেলিভারির ২৪ ঘণ্টার মধ্যে ছবি তুলে আমাদের জানান। আমরা দ্রুত প্রতিস্থাপন বা রিফান্ডের ব্যবস্থা করব।',
                    },
                    {
                        q: 'ছবিতে দেখানো রং কি একদম সঠিক?',
                        a: 'আমরা সর্বোচ্চ চেষ্টা করি। তবে স্ক্রিন সেটিং ও হস্তশিল্পের প্রকৃতির কারণে সামান্য পার্থক্য হতে পারে।',
                    },
                    {
                        q: 'পণ্যের যত্ন কীভাবে নেব?',
                        a: 'প্রতিটি পণ্যের পেজে কেয়ার গাইড দেওয়া আছে। সাধারণত জুট ও ফেব্রিক পণ্য স্পট ক্লিন করুন এবং সরাসরি রোদ থেকে দূরে রাখুন।',
                    },
                ],
            },
            {
                category: 'অ্যাকাউন্ট ও রিটার্ন',
                items: [
                    {
                        q: 'অর্ডার দিতে অ্যাকাউন্ট লাগবে?',
                        a: 'না, অ্যাকাউন্ট ছাড়াও গেস্ট হিসেবে অর্ডার দেওয়া যাবে। তবে অ্যাকাউন্ট থাকলে অর্ডার ট্র্যাক করা, উইশলিস্ট ও সহজ রিঅর্ডার সুবিধা পাবেন।',
                    },
                    {
                        q: 'রিটার্ন পলিসি কী?',
                        a: 'নষ্ট বা ভুল পণ্য পেলে ২৪ ঘণ্টার মধ্যে ছবিসহ জানান। আমরা বিনামূল্যে রিটার্ন ও প্রতিস্থাপনের ব্যবস্থা করব।',
                    },
                ],
            },
        ],
    },
};

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
                    className={`w-6 h-6 text-[#818B9C] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <p className="text-[#818B9C] text-base leading-relaxed pb-5 -mt-1">{a}</p>
                </div>
            </div>
        </div>
    );
};

export default function FAQPage() {
    const [lang, setLang] = useState<Lang>('bn');
    const t = content[lang];

    return (
        <div className="bg-white w-full min-h-screen py-12 px-4">
            <div className="max-w-300 mx-auto">

                <nav className="flex items-center gap-2 text-sm font-medium text-[#818B9C] mb-6">
                    <Link href="/" className="text-[#C85A3A] hover:underline">Home</Link>
                    <MdKeyboardArrowRight />
                    <span className="text-[#0B0F0E] font-semibold">FAQ</span>
                </nav>

                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#0B0F0E] mb-2">{t.title}</h1>
                        <p className="text-[#818B9C]">{t.subtitle}</p>
                    </div>

                    {/* Language Toggle */}
                    <div className="flex items-center border border-[#E4E9EE] rounded-lg overflow-hidden">
                        <button
                            onClick={() => setLang('en')}
                            className={`px-4 py-2 text-sm font-semibold transition-all ${lang === 'en' ? 'bg-[#C85A3A] text-white' : 'text-[#818B9C] hover:bg-[#F7F7F7]'}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLang('bn')}
                            className={`px-4 py-2 text-sm font-semibold transition-all ${lang === 'bn' ? 'bg-[#C85A3A] text-white' : 'text-[#818B9C] hover:bg-[#F7F7F7]'}`}
                        >
                            বাংলা
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-10">
                    {t.sections.map((section) => (
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

                <div className="mt-14 bg-[#FFF5F2] border border-[#C85A3A]/20 rounded-xl p-8 text-center">
                    <h3 className="text-xl font-semibold text-[#0B0F0E] mb-2">{t.stillQuestion}</h3>
                    <p className="text-[#818B9C] mb-6">{t.reachOut}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:+8801XXXXXXXXX" className="px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-colors">
                            {t.callUs}
                        </a>
                        <a href="https://wa.me/8801XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-[#C85A3A] text-[#C85A3A] rounded-lg font-semibold hover:bg-[#C85A3A] hover:text-white transition-colors">
                            {t.whatsapp}
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}