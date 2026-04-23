'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdKeyboardArrowRight } from 'react-icons/md';

type Lang = 'en' | 'bn';

const content = {
    en: {
        breadcrumb: 'Privacy Policy',
        title: 'Privacy Policy',
        updated: 'Last updated: January 2025',
        sections: [
            {
                heading: '1. Information We Collect',
                body: 'When you place an order on Karughor, we collect your name, phone number, delivery address, and optionally your email address. We use this information solely to process and deliver your order.',
            },
            {
                heading: '2. How We Use Your Information',
                body: 'Your information is used to confirm your order via phone call, arrange delivery, and communicate any updates about your order. We do not sell, rent, or share your personal information with third parties for marketing purposes.',
            },
            {
                heading: '3. Data Storage & Security',
                body: 'Your data is stored securely on our servers. We use industry-standard encryption to protect your information. Access to your data is restricted to authorized Karughor staff only.',
            },
            {
                heading: '4. Cookies',
                body: 'We use essential cookies to keep you logged in and maintain your shopping cart. We also use Google Analytics and Meta Pixel to understand how visitors use our website — this helps us improve your experience. These tools may collect anonymized usage data. You may disable cookies in your browser settings, but some features may not work correctly.',
            },
            {
                heading: '5. Third-Party Services',
                body: 'We use Google Analytics to analyze website traffic and Meta Pixel to measure the effectiveness of our advertisements. These services may collect data according to their own privacy policies. We do not share your personal order information with these services.',
            },
            {
                heading: '6. Your Rights',
                body: 'You may request access to, correction of, or deletion of your personal data at any time by contacting us. We will respond to your request within 7 business days.',
            },
            {
                heading: '7. Children\'s Privacy',
                body: 'Karughor is not intended for children under 13. We do not knowingly collect personal information from children.',
            },
            {
                heading: '8. Changes to This Policy',
                body: 'We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date.',
            },
            {
                heading: '9. Contact Us',
                body: null,
                contact: true,
            },
        ],
    },
    bn: {
        breadcrumb: 'গোপনীয়তা নীতি',
        title: 'গোপনীয়তা নীতি',
        updated: 'সর্বশেষ আপডেট: জানুয়ারি ২০২৫',
        sections: [
            {
                heading: '১. আমরা কী তথ্য সংগ্রহ করি',
                body: 'কারুঘরে অর্ডার দেওয়ার সময় আমরা আপনার নাম, ফোন নম্বর, ডেলিভারি ঠিকানা এবং ঐচ্ছিকভাবে ইমেইল ঠিকানা সংগ্রহ করি। এই তথ্য শুধুমাত্র আপনার অর্ডার প্রক্রিয়া ও ডেলিভারির জন্য ব্যবহার করা হয়।',
            },
            {
                heading: '২. আমরা তথ্য কীভাবে ব্যবহার করি',
                body: 'আপনার তথ্য ফোন কলের মাধ্যমে অর্ডার নিশ্চিত করতে, ডেলিভারি সাজাতে এবং অর্ডার সম্পর্কিত আপডেট জানাতে ব্যবহার করা হয়। আমরা বিপণনের উদ্দেশ্যে তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রি, ভাড়া বা শেয়ার করি না।',
            },
            {
                heading: '৩. তথ্য সংরক্ষণ ও নিরাপত্তা',
                body: 'আপনার তথ্য আমাদের সার্ভারে নিরাপদে সংরক্ষিত থাকে। শিল্পমানের এনক্রিপশন ব্যবহার করে তথ্য সুরক্ষিত রাখা হয়। শুধুমাত্র অনুমোদিত কারুঘর কর্মীরা আপনার তথ্য অ্যাক্সেস করতে পারেন।',
            },
            {
                heading: '৪. কুকিজ',
                body: 'আমরা আপনাকে লগইন রাখতে এবং শপিং কার্ট বজায় রাখতে প্রয়োজনীয় কুকিজ ব্যবহার করি। এছাড়া আমরা Google Analytics এবং Meta Pixel ব্যবহার করি যা আমাদের ওয়েবসাইট উন্নত করতে সাহায্য করে। এই টুলগুলো বেনামে ব্যবহারের তথ্য সংগ্রহ করতে পারে। ব্রাউজার সেটিংস থেকে কুকিজ বন্ধ করা যাবে, তবে কিছু ফিচার কাজ নাও করতে পারে।',
            },
            {
                heading: '৫. তৃতীয় পক্ষের সেবা',
                body: 'আমরা ওয়েবসাইট ট্রাফিক বিশ্লেষণের জন্য Google Analytics এবং বিজ্ঞাপনের কার্যকারিতা পরিমাপের জন্য Meta Pixel ব্যবহার করি। এই সেবাগুলো তাদের নিজস্ব গোপনীয়তা নীতি অনুযায়ী তথ্য সংগ্রহ করতে পারে। আমরা আপনার ব্যক্তিগত অর্ডার তথ্য এই সেবাগুলোর সাথে শেয়ার করি না।',
            },
            {
                heading: '৬. আপনার অধিকার',
                body: 'যেকোনো সময় আপনার ব্যক্তিগত তথ্য দেখা, সংশোধন বা মুছে ফেলার অনুরোধ করতে পারেন। আমরা ৭ কার্যদিবসের মধ্যে সাড়া দেব।',
            },
            {
                heading: '৭. শিশুদের গোপনীয়তা',
                body: 'কারুঘর ১৩ বছরের কম বয়সীদের জন্য নয়। আমরা সচেতনভাবে শিশুদের কাছ থেকে কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না।',
            },
            {
                heading: '৮. নীতি পরিবর্তন',
                body: 'আমরা সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। যেকোনো গুরুত্বপূর্ণ পরিবর্তন আপডেট তারিখসহ এই পেজে প্রকাশ করা হবে।',
            },
            {
                heading: '৯. যোগাযোগ',
                body: null,
                contact: true,
            },
        ],
    },
};

export default function PrivacyPolicyPage() {
    const [lang, setLang] = useState<Lang>('bn');
    const t = content[lang];

    return (
        <div className="bg-white w-full min-h-screen py-12 px-4">
            <div className="max-w-300 mx-auto">

                <nav className="flex items-center gap-2 text-sm font-medium text-[#818B9C] mb-6">
                    <Link href="/" className="text-[#C85A3A] hover:underline">Home</Link>
                    <MdKeyboardArrowRight />
                    <span className="text-[#0B0F0E] font-semibold">{t.breadcrumb}</span>
                </nav>

                <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#0B0F0E] mb-2">{t.title}</h1>
                        <p className="text-[#818B9C] text-sm">{t.updated}</p>
                    </div>

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

                <div className="space-y-8 text-[#0B0F0E]">
                    {t.sections.map((section) => (
                        <section key={section.heading}>
                            <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
                            {section.contact ? (
                                <div className="mt-4 bg-[#F7F7F7] rounded-lg p-5 flex flex-col gap-2 text-[#818B9C]">
                                    <p>📧 Email: <span className="text-[#0B0F0E] font-medium">support@karughor.com</span></p>
                                    <p>📞 Phone: <span className="text-[#0B0F0E] font-medium">+880 1X-XXXX-XXXX</span></p>
                                    <p>📍 Address: <span className="text-[#0B0F0E] font-medium">Dhaka, Bangladesh</span></p>
                                </div>
                            ) : (
                                <p className="text-[#818B9C] leading-relaxed">{section.body}</p>
                            )}
                        </section>
                    ))}
                </div>

            </div>
        </div>
    );
}