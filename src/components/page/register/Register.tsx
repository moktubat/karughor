'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { authService } from '@/lib/authService';

// ─── Schema ───────────────────────────────────────────────────────────────────

const registerSchema = z
    .object({
        fullName: z.string().min(3, 'Name must be at least 3 characters'),
        phone: z
            .string()
            .min(10, 'Phone must be at least 10 digits')
            .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
        email: z
            .string()
            .email('Invalid email address')
            .optional()
            .or(z.literal('')),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Must contain uppercase, lowercase, and a number'
            ),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type RegisterForm = z.infer<typeof registerSchema>;

// ─── Input class ──────────────────────────────────────────────────────────────

const inputCls =
    'px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20';

// ─── Component ────────────────────────────────────────────────────────────────

const Register = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterForm) => {
        setServerError('');
        try {
            await authService.register(data);
            router.push('/profile');
        } catch (err: any) {
            setServerError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="bg-white w-full min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-120 w-full">
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-8 md:p-10">
                    <h1 className="text-3xl md:text-4xl font-semibold text-[#0B0F0E] mb-8 text-center">
                        Create Account
                    </h1>

                    {serverError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
                        {/* Full Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-[#0B0F0E]">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                autoComplete="name"
                                {...register('fullName')}
                                className={inputCls}
                            />
                            {errors.fullName && (
                                <span className="text-sm text-red-500">
                                    {errors.fullName.message}
                                </span>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-[#0B0F0E]">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                autoComplete="tel"
                                {...register('phone')}
                                className={inputCls}
                            />
                            {errors.phone && (
                                <span className="text-sm text-red-500">
                                    {errors.phone.message}
                                </span>
                            )}
                        </div>

                        {/* Email (optional) */}
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-[#0B0F0E]">
                                Email Address{' '}
                                <span className="text-[#818B9C] font-normal">(Optional)</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email (optional)"
                                autoComplete="email"
                                {...register('email')}
                                className={inputCls}
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
                                    autoComplete="new-password"
                                    {...register('password')}
                                    className={`w-full pr-12 ${inputCls}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((p) => !p)}
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

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-[#0B0F0E]">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    {...register('confirmPassword')}
                                    className={`w-full pr-12 ${inputCls}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((p) => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#818B9C] hover:text-[#C85A3A]"
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-[#A84830] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(200,90,58,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
                        >
                            {isSubmitting ? 'Creating Account…' : 'Create Account'}
                        </button>

                        {/* Login link */}
                        <div className="text-center mt-2">
                            <span className="text-base text-[#818B9C]">
                                Already have an account?{' '}
                            </span>
                            <Link
                                href="/login"
                                className="text-base font-semibold text-[#C85A3A] hover:underline"
                            >
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;