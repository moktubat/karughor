'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { authService, type LoginData } from '@/lib/authService';
import { useAuthStore } from '@/store/authStore';

const Login = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser, user, isAuthenticated } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const redirectUrl = searchParams.get('redirect') || '/profile';

    useEffect(() => {
        if (isAuthenticated && user) router.replace(redirectUrl);
    }, [isAuthenticated, user, router, redirectUrl]);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
        defaultValues: { phone: '', password: '' },
    });

    const onSubmit = async (data: LoginData) => {
        try {
            setLoading(true);
            setError('');
            const response = await authService.login(data);
            if (response.success && response.data.user) {
                setUser(response.data.user);
                await new Promise(resolve => setTimeout(resolve, 100));
                router.replace(redirectUrl);
            } else {
                throw new Error('Login failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated && user) {
        return (
            <div className="bg-white w-full min-h-screen flex items-center justify-center">
                <div className="text-lg text-[#818B9C]">Redirecting...</div>
            </div>
        );
    }

    return (
        <div className="bg-white w-full min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-120 w-full">
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-8 md:p-10">
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#0B0F0E] mb-8 text-center">Login</h1>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-[#0B0F0E]">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                {...register('phone', { required: 'Phone is required' })}
                                className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                            />
                            {errors.phone && <span className="text-sm text-red-500">{errors.phone.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-[#0B0F0E]">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Minimum 6 characters' },
                                    })}
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

                        <div className="flex items-center justify-end">
                            <Link href="/forgot-password" className="text-sm md:text-base text-[#C85A3A] hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-[#A84830] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <div className="text-center">
                            <span className="text-base text-[#818B9C]">Don&apos;t have an account? </span>
                            <Link href="/register" className="text-base font-semibold text-[#C85A3A] hover:underline">Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;