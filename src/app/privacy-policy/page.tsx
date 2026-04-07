import Link from 'next/link';
import { MdKeyboardArrowRight } from 'react-icons/md';

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-white w-full min-h-screen py-12 px-4">
            <div className="max-w-200 mx-auto">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm font-medium text-[#818B9C] mb-10">
                    <Link href="/" className="text-[#C85A3A] hover:underline">Home</Link>
                    <MdKeyboardArrowRight />
                    <span className="text-[#0B0F0E] font-semibold">Privacy Policy</span>
                </nav>

                <h1 className="text-3xl md:text-4xl font-bold text-[#0B0F0E] mb-2">
                    Privacy Policy
                </h1>
                <p className="text-[#818B9C] text-sm mb-10">Last updated: January 2025</p>

                <div className="prose prose-gray max-w-none space-y-8 text-[#0B0F0E]">

                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                        <p className="text-[#818B9C] leading-relaxed">
                            When you place an order on Karughor, we collect your name, phone number,
                            delivery address, and optionally your email address. We use this information
                            solely to process and deliver your order.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                        <p className="text-[#818B9C] leading-relaxed">
                            Your information is used to confirm your order via phone call, arrange delivery,
                            and communicate any updates about your order. We do not sell, rent, or share
                            your personal information with third parties for marketing purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Data Storage & Security</h2>
                        <p className="text-[#818B9C] leading-relaxed">
                            Your data is stored securely on our servers. We use industry-standard
                            encryption to protect your information. Access to your data is restricted
                            to authorized Karughor staff only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
                        <p className="text-[#818B9C] leading-relaxed">
                            We use essential cookies to keep you logged in and maintain your shopping
                            cart. These cookies do not track you across other websites. You may disable
                            cookies in your browser settings, but some features may not work correctly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                        <p className="text-[#818B9C] leading-relaxed">
                            You may request access to, correction of, or deletion of your personal
                            data at any time by contacting us. We will respond to your request within
                            7 business days.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Children&apos;s Privacy</h2>
                        <p className="text-[#818B9C] leading-relaxed">
                            Karughor is not intended for children under 13. We do not knowingly collect
                            personal information from children.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Changes to This Policy</h2>
                        <p className="text-[#818B9C] leading-relaxed">
                            We may update this privacy policy from time to time. We will notify you
                            of any significant changes by posting the new policy on this page with
                            an updated date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
                        <p className="text-[#818B9C] leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
                        <div className="mt-4 bg-[#F7F7F7] rounded-lg p-5 flex flex-col gap-2 text-[#818B9C]">
                            <p>📧 Email: <span className="text-[#0B0F0E] font-medium">support@karughor.com</span></p>
                            <p>📞 Phone: <span className="text-[#0B0F0E] font-medium">+880 1X-XXXX-XXXX</span></p>
                            <p>📍 Address: <span className="text-[#0B0F0E] font-medium">Dhaka, Bangladesh</span></p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}