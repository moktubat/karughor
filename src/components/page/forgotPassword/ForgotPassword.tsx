'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaPhone, FaCheckCircle, FaSpinner, FaLock } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import api from '@/lib/api';


type Step = 'phone' | 'otp' | 'done';

type PhoneForm = { phone: string };
type ResetForm = { otp: string; newPassword: string; confirmPassword: string };

const ForgotPassword = () => {
    const router = useRouter();
    const [step, setStep] = useState<Step>('phone');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ── Step 1: Phone form ────────────────────────────────────────────────────
    const {
        register: rPhone,
        handleSubmit: handlePhone,
        formState: { errors: ePhone },
    } = useForm<PhoneForm>({ defaultValues: { phone: '' } });

    // ── Step 2: OTP + new password form ───────────────────────────────────────
    const {
        register: rReset,
        handleSubmit: handleReset,
        watch,
        formState: { errors: eReset },
    } = useForm<ResetForm>();

    const onPhoneSubmit = async (data: PhoneForm) => {
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/forgot-password', { phone: data.phone });
            setPhone(data.phone);
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const onResetSubmit = async (data: ResetForm) => {
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/reset-password', {
                phone,
                otp: data.otp,
                newPassword: data.newPassword,
            });
            setStep('done');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white w-full min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-120 w-full">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm font-medium text-[#818B9C] flex-wrap mb-8">
                    <Link href="/" className="text-[#C85A3A] hover:underline">Home</Link>
                    <MdKeyboardArrowRight />
                    <Link href="/login" className="text-[#C85A3A] hover:underline">Login</Link>
                    <MdKeyboardArrowRight />
                    <span className="text-[#0B0F0E] font-semibold">Forgot Password</span>
                </nav>

                {/* ── Step 1: Enter phone ────────────────────────────────────── */}
                {step === 'phone' && (
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-8 md:p-10">
                        <h1 className="text-3xl font-semibold text-[#0B0F0E] mb-4 text-center">
                            Forgot Password?
                        </h1>
                        <p className="text-center text-[#818B9C] mb-8 text-sm">
                            Enter your registered phone number. We'll send you a 6-digit OTP.
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handlePhone(onPhoneSubmit)} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                    <FaPhone className="text-[#C85A3A]" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="01XXXXXXXXX"
                                    {...rPhone('phone', {
                                        required: 'Phone number is required',
                                        pattern: { value: /^[0-9+\-\s()]+$/, message: 'Invalid phone format' },
                                        minLength: { value: 10, message: 'Must be at least 10 digits' },
                                    })}
                                    className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                />
                                {ePhone.phone && (
                                    <span className="text-sm text-red-500">{ePhone.phone.message}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold hover:bg-[#A84830] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                            >
                                {loading ? <><FaSpinner className="animate-spin" /> Sending...</> : 'Send OTP'}
                            </button>

                            <div className="text-center">
                                <Link href="/login" className="text-sm text-[#818B9C] hover:text-[#C85A3A] transition-all">
                                    ← Back to Login
                                </Link>
                            </div>
                        </form>
                    </div>
                )}

                {/* ── Step 2: Enter OTP + new password ──────────────────────── */}
                {step === 'otp' && (
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-8 md:p-10">
                        <h1 className="text-3xl font-semibold text-[#0B0F0E] mb-4 text-center">
                            Enter OTP
                        </h1>
                        <p className="text-center text-[#818B9C] mb-2 text-sm">
                            OTP sent to <span className="font-semibold text-[#0B0F0E]">{phone}</span>
                        </p>
                        <p className="text-center text-xs text-[#818B9C] mb-8">
                            OTP has been sent to your registered phone number.
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleReset(onResetSubmit)} className="flex flex-col gap-5">

                            {/* OTP */}
                            <div className="flex flex-col gap-2">
                                <label className="text-base font-medium text-[#0B0F0E]">6-Digit OTP</label>
                                <input
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    {...rReset('otp', {
                                        required: 'OTP is required',
                                        pattern: { value: /^\d{6}$/, message: 'OTP must be 6 digits' },
                                    })}
                                    className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base text-center tracking-widest font-mono focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                />
                                {eReset.otp && <span className="text-sm text-red-500">{eReset.otp.message}</span>}
                            </div>

                            {/* New Password */}
                            <div className="flex flex-col gap-2">
                                <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                    <FaLock className="text-[#C85A3A]" /> New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Minimum 6 characters"
                                    {...rReset('newPassword', {
                                        required: 'New password is required',
                                        minLength: { value: 6, message: 'Minimum 6 characters' },
                                    })}
                                    className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                />
                                {eReset.newPassword && (
                                    <span className="text-sm text-red-500">{eReset.newPassword.message}</span>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col gap-2">
                                <label className="text-base font-medium text-[#0B0F0E]">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Re-enter new password"
                                    {...rReset('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (val) =>
                                            val === watch('newPassword') || 'Passwords do not match',
                                    })}
                                    className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                />
                                {eReset.confirmPassword && (
                                    <span className="text-sm text-red-500">{eReset.confirmPassword.message}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold hover:bg-[#A84830] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                            >
                                {loading ? <><FaSpinner className="animate-spin" /> Resetting...</> : 'Reset Password'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setStep('phone'); setError(''); }}
                                className="w-full text-sm text-[#818B9C] hover:text-[#C85A3A] transition-all text-center"
                            >
                                ← Wrong number? Go back
                            </button>
                        </form>
                    </div>
                )}

                {/* ── Step 3: Done ───────────────────────────────────────────── */}
                {step === 'done' && (
                    <div className="bg-white border border-[#E4E9EE] rounded-lg p-8 md:p-10 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <FaCheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-semibold text-[#0B0F0E] mb-4">
                            Password Reset!
                        </h1>
                        <p className="text-[#818B9C] mb-8 text-sm">
                            Your password has been reset successfully. You can now log in with your new password.
                        </p>
                        <Link
                            href="/login"
                            className="block w-full px-8 py-4 bg-[#C85A3A] text-white rounded-lg text-lg font-semibold hover:bg-[#A84830] transition-all"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;