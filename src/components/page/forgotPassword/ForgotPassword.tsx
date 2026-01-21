'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaPhone, FaCheckCircle } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';

type ForgotPasswordFormValues = {
    phone: string;
};

const ForgotPassword = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        defaultValues: {
            phone: '',
        },
    });

    const onSubmit = (data: ForgotPasswordFormValues) => {
        console.log('Forgot password submitted', data);
        // Handle password reset request
        setIsSubmitted(true);
    };

    return (
        <div className="bg-white w-full min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-[480px] w-full">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm md:text-base font-medium text-[#818B9C] select-none flex-wrap mb-8">
                    <Link
                        href="/"
                        className="text-[#C85A3A] hover:underline transition-all duration-300"
                    >
                        Home
                    </Link>
                    <MdKeyboardArrowRight className="text-[#818B9C]" />
                    <Link
                        href="/login"
                        className="text-[#C85A3A] hover:underline transition-all duration-300"
                    >
                        Login
                    </Link>
                    <MdKeyboardArrowRight className="text-[#818B9C]" />
                    <span className="text-[#0B0F0E] font-semibold">Forgot Password</span>
                </nav>

                {!isSubmitted ? (
                    /* Forgot Password Form */
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-8 md:p-10">
                        <h1 className="text-3xl md:text-4xl font-semibold text-[#0B0F0E] mb-4 text-center">
                            Forgot Password?
                        </h1>
                        <p className="text-center text-[#818B9C] mb-8">
                            Enter your phone number and we'll send you a verification code to reset
                            your password
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                            {/* Phone Number */}
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
                                            message: 'Invalid phone number format',
                                        },
                                        minLength: {
                                            value: 10,
                                            message: 'Phone number must be at least 10 digits',
                                        },
                                    })}
                                    className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 hover:border-[#C85A3A] placeholder:text-[#818B9C]"
                                />
                                {errors.phone && (
                                    <span className="text-sm text-red-500">
                                        {errors.phone.message}
                                    </span>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-[#C85A3A] text-white border-0 rounded-lg text-lg font-semibold leading-normal tracking-tight cursor-pointer transition-all duration-300 hover:bg-[#A84830] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(200,90,58,0.3)] focus-visible:outline-2 focus-visible:outline-[#C85A3A] focus-visible:outline-offset-2 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            >
                                Send Verification Code
                            </button>

                            {/* Back to Login */}
                            <div className="text-center mt-2">
                                <Link
                                    href="/login"
                                    className="text-base text-[#818B9C] hover:text-[#C85A3A] transition-all duration-300"
                                >
                                    ← Back to Login
                                </Link>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* Success Message */
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-8 md:p-10 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <FaCheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-semibold text-[#0B0F0E] mb-4">
                            Check Your Phone
                        </h1>
                        <p className="text-[#818B9C] mb-8">
                            We've sent a verification code to your phone number. Please check your
                            messages and follow the instructions to reset your password.
                        </p>
                        <div className="space-y-4">
                            <Link
                                href="/login"
                                className="block w-full px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-[#A84830]"
                            >
                                Back to Login
                            </Link>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="w-full px-8 py-4 bg-white border border-[#E4E9EE] text-[#818B9C] rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-[#F7F7F7]"
                            >
                                Resend Code
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;