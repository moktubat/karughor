'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

type AdminLoginFormValues = {
    email: string;
    password: string;
    rememberMe: boolean;
};

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AdminLoginFormValues>({
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const onSubmit = (data: AdminLoginFormValues) => {
        console.log('Admin login submitted', data);
        // Handle admin login - redirect to /admin/dashboard
    };

    return (
        <div className="bg-[#F7F7F7] w-full min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                {/* Admin Badge */}
                <div className="flex justify-center mb-8">
                    <div className="bg-[#C85A3A] text-white px-6 py-3 rounded-full flex items-center gap-2">
                        <FaShieldAlt className="w-5 h-5" />
                        <span className="font-semibold">Admin Access</span>
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-8 md:p-10 shadow-lg">
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#0B0F0E] mb-2 text-center">
                        Admin Login
                    </h1>
                    <p className="text-center text-[#818B9C] mb-8">
                        Access your admin dashboard
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-[#0B0F0E]">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="admin@store.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Invalid email address',
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

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-[#0B0F0E]">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    {...register('password', {
                                        required: 'Password is required',
                                    })}
                                    className="w-full px-4 py-3 pr-12 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#818B9C] hover:text-[#C85A3A]"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="text-sm text-red-500">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register('rememberMe')}
                                    className="w-4 h-4 accent-[#C85A3A]"
                                />
                                <span className="text-sm md:text-base">Remember me</span>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-[#A84830] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(200,90,58,0.3)]"
                        >
                            Login to Dashboard
                        </button>
                    </form>

                    {/* Back to Store */}
                    <div className="text-center mt-6">
                        <Link
                            href="/"
                            className="text-base text-[#818B9C] hover:text-[#C85A3A] transition-colors"
                        >
                            ← Back to Store
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;