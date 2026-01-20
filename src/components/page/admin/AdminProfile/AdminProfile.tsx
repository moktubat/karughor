'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaLock, FaStore, FaPhone, FaCamera } from 'react-icons/fa';

interface ProfileFormValues {
    fullName: string;
    email: string;
    phone: string;
}

interface StoreFormValues {
    storeName: string;
    storeEmail: string;
    storePhone: string;
    storeAddress: string;
}

interface PasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const AdminProfile = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'store' | 'password'>('profile');
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormValues>({
        defaultValues: {
            fullName: 'Admin User',
            email: 'admin@store.com',
            phone: '+880 1700-000000',
        },
    });

    const {
        register: registerStore,
        handleSubmit: handleSubmitStore,
        formState: { errors: storeErrors },
    } = useForm<StoreFormValues>({
        defaultValues: {
            storeName: 'My E-Commerce Store',
            storeEmail: 'support@store.com',
            storePhone: '+880 1800-000000',
            storeAddress: 'Dhaka, Bangladesh',
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        watch,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm<PasswordFormValues>();

    const newPassword = watch('newPassword');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmitProfile = (data: ProfileFormValues) => {
        console.log('Profile updated:', data);
        alert('Profile updated successfully!');
    };

    const onSubmitStore = (data: StoreFormValues) => {
        console.log('Store info updated:', data);
        alert('Store information updated successfully!');
    };

    const onSubmitPassword = (data: PasswordFormValues) => {
        console.log('Password changed');
        alert('Password changed successfully!');
        resetPassword();
    };

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-6">
            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Admin Profile</h1>
                    <p className="text-[#818B9C]">Manage your account and store settings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-[#E4E9EE] rounded-lg p-6">
                            {/* Profile Image */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-[#F6F6F6] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Admin"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="w-16 h-16 text-[#818B9C]" />
                                        )}
                                    </div>
                                    <label
                                        htmlFor="admin-profile-upload"
                                        className="absolute bottom-0 right-0 w-10 h-10 bg-[#C85A3A] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#A84830] transition-all shadow-lg"
                                    >
                                        <FaCamera className="w-4 h-4" />
                                        <input
                                            type="file"
                                            id="admin-profile-upload"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <h3 className="text-lg font-semibold text-[#0B0F0E] mt-4">
                                    Admin User
                                </h3>
                                <p className="text-sm text-[#818B9C]">Administrator</p>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile'
                                            ? 'bg-[#C85A3A] text-white'
                                            : 'text-[#0B0F0E] hover:bg-[#F7F7F7]'
                                        }`}
                                >
                                    <FaUser />
                                    <span className="font-medium">Personal Info</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('store')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'store'
                                            ? 'bg-[#C85A3A] text-white'
                                            : 'text-[#0B0F0E] hover:bg-[#F7F7F7]'
                                        }`}
                                >
                                    <FaStore />
                                    <span className="font-medium">Store Info</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'password'
                                            ? 'bg-[#C85A3A] text-white'
                                            : 'text-[#0B0F0E] hover:bg-[#F7F7F7]'
                                        }`}
                                >
                                    <FaLock />
                                    <span className="font-medium">Change Password</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Personal Info Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-6">
                                    Personal Information
                                </h2>

                                <form
                                    onSubmit={handleSubmitProfile(onSubmitProfile)}
                                    className="space-y-6"
                                >
                                    {/* Full Name */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaUser className="text-[#C85A3A]" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            {...registerProfile('fullName', {
                                                required: 'Full name is required',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {profileErrors.fullName && (
                                            <span className="text-sm text-red-500">
                                                {profileErrors.fullName.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaEnvelope className="text-[#C85A3A]" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            {...registerProfile('email', {
                                                required: 'Email is required',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {profileErrors.email && (
                                            <span className="text-sm text-red-500">
                                                {profileErrors.email.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaPhone className="text-[#C85A3A]" />
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            {...registerProfile('phone', {
                                                required: 'Phone is required',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-8 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all"
                                    >
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Store Info Tab */}
                        {activeTab === 'store' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-6">
                                    Store Information
                                </h2>

                                <form
                                    onSubmit={handleSubmitStore(onSubmitStore)}
                                    className="space-y-6"
                                >
                                    {/* Store Name */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">
                                            Store Name
                                        </label>
                                        <input
                                            type="text"
                                            {...registerStore('storeName', {
                                                required: 'Store name is required',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                    </div>

                                    {/* Store Email */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">
                                            Store Email
                                        </label>
                                        <input
                                            type="email"
                                            {...registerStore('storeEmail')}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                    </div>

                                    {/* Store Phone */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">
                                            Store Phone
                                        </label>
                                        <input
                                            type="tel"
                                            {...registerStore('storePhone')}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                    </div>

                                    {/* Store Address */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">
                                            Store Address
                                        </label>
                                        <textarea
                                            rows={3}
                                            {...registerStore('storeAddress')}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-8 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all"
                                    >
                                        Update Store Info
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Change Password Tab */}
                        {activeTab === 'password' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-6">
                                    Change Password
                                </h2>

                                <form
                                    onSubmit={handleSubmitPassword(onSubmitPassword)}
                                    className="space-y-6"
                                >
                                    {/* Current Password */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            {...registerPassword('currentPassword', {
                                                required: 'Current password is required',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {passwordErrors.currentPassword && (
                                            <span className="text-sm text-red-500">
                                                {passwordErrors.currentPassword.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* New Password */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            {...registerPassword('newPassword', {
                                                required: 'New password is required',
                                                minLength: {
                                                    value: 8,
                                                    message: 'Password must be at least 8 characters',
                                                },
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {passwordErrors.newPassword && (
                                            <span className="text-sm text-red-500">
                                                {passwordErrors.newPassword.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            {...registerPassword('confirmPassword', {
                                                required: 'Please confirm your password',
                                                validate: (value) =>
                                                    value === newPassword || 'Passwords do not match',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {passwordErrors.confirmPassword && (
                                            <span className="text-sm text-red-500">
                                                {passwordErrors.confirmPassword.message}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-8 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all"
                                    >
                                        Change Password
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;