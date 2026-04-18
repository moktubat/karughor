'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { authService, type AdminLoginData } from '@/lib/authService';
import { useRouter } from 'next/navigation';

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginData>({
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: AdminLoginData) => {
        try {
            setLoading(true);
            setError('');
            const response = await authService.adminLogin(data);
            if (response.success) {
                router.push('/admin/dashboard');
            } else {
                throw new Error('Login failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#F7F7F7] w-full min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="flex justify-center mb-8">
                    <div className="bg-[#C85A3A] text-white px-6 py-3 rounded-full flex items-center gap-2">
                        <FaShieldAlt className="w-5 h-5" />
                        <span className="font-semibold">Admin Access</span>
                    </div>
                </div>

                <div className="bg-white border border-[#E4E9EE] rounded-lg p-8 md:p-10 shadow-lg">
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#0B0F0E] mb-2 text-center">Admin Login</h1>
                    <p className="text-center text-[#818B9C] mb-8">Access your admin dashboard</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-[#0B0F0E]">Email Address</label>
                            <input
                                type="email"
                                placeholder="admin@karughor.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                                })}
                                className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                            />
                            {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-[#0B0F0E]">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    {...register('password', { required: 'Password is required' })}
                                    className="w-full px-4 py-3 pr-12 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#818B9C] hover:text-[#C85A3A]"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-[#A84830] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(200,90,58,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login to Dashboard'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <Link href="/" className="text-base text-[#818B9C] hover:text-[#C85A3A] transition-colors">
                            ← Back to Store
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;