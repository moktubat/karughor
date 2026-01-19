"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-[#F7F7F7] text-black w-[98%] mx-auto rounded-[20px] py-20">
            {/* Main content */}
            <div className="max-w-300 mx-auto px-6 py-6 border-t-2 border-b-2 border-[#333] flex flex-wrap items-center justify-between gap-6">
                {/* Brand */}
                <div className="font-bold text-2xl tracking-widest select-none flex items-center gap-2">
                    Karughor
                </div>

                {/* Footer links */}
                <div className="flex gap-4 text-base">
                    <Link
                        href="/faq"
                        className="hover:text-[#f42222] transition-colors duration-300"
                    >
                        FAQ
                    </Link>
                    <Link
                        href="/privacy-policy"
                        className="hover:text-[#f42222] transition-colors duration-300"
                    >
                        Privacy Policy
                    </Link>
                </div>

                {/* Social links */}
                <div className="text-base">
                    <span className="font-semibold mr-2">Social links:</span>

                    <Link
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 hover:text-[#f42222] transition-colors duration-300"
                    >
                        Facebook
                    </Link>

                    <Link
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 hover:text-[#f42222] transition-colors duration-300"
                    >
                        Instagram
                    </Link>
                </div>
            </div>

            {/* Bottom text */}
            <div className="text-center text-sm text-[#333] mt-4">
                © {new Date().getFullYear()} Karughor. All Rights Reserved.
            </div>

            {/* Credit */}
            <div className="text-center text-sm text-[#666] italic mt-3">
                Developed by Moktubat
            </div>
        </footer>
    );
};

export default Footer;
