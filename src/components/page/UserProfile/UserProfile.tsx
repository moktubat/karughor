'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt,
    FaCamera, FaEdit, FaBox, FaHeart, FaLock,
} from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useAuthStore } from '@/store/authStore';
import { userService, type UpdateProfileData } from '@/lib/userService';
import { authService } from '@/lib/authService';
import Image from 'next/image';
import axios from 'axios';

interface ProfileFormValues {
    fullName: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    area?: string;
}

interface PasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

type Tab = 'profile' | 'orders' | 'wishlist' | 'password';

const STATUS_BADGES: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const NAV_ITEMS = [
    { id: 'profile', label: 'My Profile', icon: FaUser },
    { id: 'orders', label: 'My Orders', icon: FaBox },
    { id: 'wishlist', label: 'Wishlist', icon: FaHeart },
    { id: 'password', label: 'Change Password', icon: FaLock },
] as const;

const inputCls = "px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20";
const disabledInputCls = `${inputCls} disabled:bg-[#F7F7F7] disabled:cursor-not-allowed`;

const UserProfile = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const { user, setUser, logout: logoutStore } = useAuthStore();

    const tabParam = searchParams.get('tab') as Tab | null;
    const [activeTab, setActiveTab] = useState<Tab>(tabParam || 'profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: userService.getProfile,
        enabled: !!user,
    });

    const { data: ordersData, isLoading: ordersLoading } = useQuery({
        queryKey: ['userOrders'],
        queryFn: () => userService.getUserOrders(1, 10),
        enabled: activeTab === 'orders' && !!user,
    });

    const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
        queryKey: ['userWishlist'],
        queryFn: userService.getWishlist,
        enabled: activeTab === 'wishlist' && !!user,
    });

    const updateProfileMutation = useMutation({
        mutationFn: userService.updateProfile,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            setUser(data.data.user);
            setIsEditing(false);
            alert('Profile updated successfully!');
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to update profile');
        },
    });

    const { register, handleSubmit, reset: resetProfile, formState: { errors } } = useForm<ProfileFormValues>({
        defaultValues: { fullName: '', phone: '', email: '', address: '', city: '', area: '' },
    });

    useEffect(() => {
        const src = profileData?.data?.user || user;
        if (!src) return;
        resetProfile({
            fullName: src.fullName || '',
            phone: (src as any).phone || '',
            email: src.email || '',
            address: src.address?.street || '',
            city: src.address?.city || '',
            area: src.address?.area || '',
        });
    }, [profileData, user, resetProfile]);

    const { register: registerPassword, handleSubmit: handleSubmitPassword, watch, reset: resetPassword, formState: { errors: passwordErrors } } = useForm<PasswordFormValues>();
    const newPassword = watch('newPassword');

    const onSubmitProfile = (data: ProfileFormValues) => {
        const updateData: UpdateProfileData = {
            fullName: data.fullName,
            email: data.email,
            address: { street: data.address, area: data.area, city: data.city },
        };
        updateProfileMutation.mutate(updateData);
    };

    const onSubmitPassword = async (data: PasswordFormValues) => {
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/users/change-password`,
                { currentPassword: data.currentPassword, newPassword: data.newPassword },
                { withCredentials: true }
            );
            alert('Password changed successfully!');
            resetPassword();
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to change password');
        }
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await authService.logout();
            logoutStore();
        } catch {
            logoutStore();
        } finally {
            window.location.href = '/';
        }
    };

    if (profileLoading) {
        return (
            <div className="bg-[#F7F7F7] w-full min-h-screen flex items-center justify-center">
                <div className="text-lg text-[#818B9C]">Loading profile...</div>
            </div>
        );
    }

    const currentUser = profileData?.data?.user || user;

    return (
        <div className="bg-[#F7F7F7] w-full min-h-screen py-12 px-4">
            <div className="max-w-300 mx-auto">
                <nav className="flex items-center gap-2 text-sm md:text-base font-medium text-[#818B9C] select-none flex-wrap mb-8">
                    <Link href="/" className="text-[#C85A3A] hover:underline transition-all duration-300">Home</Link>
                    <MdKeyboardArrowRight className="text-[#818B9C]" />
                    <span className="text-[#0B0F0E] font-semibold">My Profile</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-[#E4E9EE] rounded-lg p-6">
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full bg-[#F6F6F6] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                        {currentUser?.profileImage ? (
                                            <Image
                                                src={currentUser.profileImage}
                                                alt={currentUser.fullName}
                                                width={64}
                                                height={64}
                                                className="object-cover rounded-full"
                                                priority
                                            />
                                        ) : (
                                            <FaUser className="w-16 h-16 text-[#818B9C]" />
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center cursor-not-allowed">
                                        <FaCamera className="w-4 h-4" />
                                    </div>
                                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-3 py-2 rounded whitespace-nowrap z-10">
                                        Upload disabled
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-[#0B0F0E] mt-4">{currentUser?.fullName || 'User'}</h3>
                                <p className="text-sm text-[#818B9C]">{currentUser?.phone}</p>
                            </div>

                            <nav className="space-y-2">
                                {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === id ? 'bg-[#C85A3A] text-white' : 'text-[#0B0F0E] hover:bg-[#F7F7F7]'}`}
                                    >
                                        <Icon />
                                        <span className="font-medium">{label}</span>
                                    </button>
                                ))}
                            </nav>

                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full mt-6 px-4 py-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-[#0B0F0E]">Profile Information</h2>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="flex items-center gap-2 px-4 py-2 border border-[#C85A3A] text-[#C85A3A] rounded-lg hover:bg-[#C85A3A] hover:text-white transition-all"
                                    >
                                        <FaEdit />
                                        {isEditing ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaUser className="text-[#C85A3A]" /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            {...register('fullName', { required: 'Full name is required' })}
                                            className={disabledInputCls}
                                        />
                                        {errors.fullName && <span className="text-sm text-red-500">{errors.fullName.message}</span>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaPhone className="text-[#C85A3A]" /> Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            disabled
                                            {...register('phone')}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base bg-[#F7F7F7] cursor-not-allowed"
                                        />
                                        <span className="text-xs text-[#818B9C]">Phone number cannot be changed</span>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaEnvelope className="text-[#C85A3A]" /> Email (Optional)
                                        </label>
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            {...register('email')}
                                            className={disabledInputCls}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-base font-medium text-[#0B0F0E]">City</label>
                                            <input type="text" disabled={!isEditing} {...register('city')} className={disabledInputCls} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-base font-medium text-[#0B0F0E]">Area</label>
                                            <input type="text" disabled={!isEditing} {...register('area')} className={disabledInputCls} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-[#C85A3A]" /> Address
                                        </label>
                                        <textarea
                                            rows={3}
                                            disabled={!isEditing}
                                            {...register('address')}
                                            className={`${disabledInputCls} resize-none`}
                                        />
                                    </div>

                                    {isEditing && (
                                        <button
                                            type="submit"
                                            disabled={updateProfileMutation.isPending}
                                            className="w-full md:w-auto px-8 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-6">My Orders</h2>
                                {ordersLoading ? (
                                    <div className="text-center py-12 text-[#818B9C]">Loading orders...</div>
                                ) : ordersData?.data?.orders?.length > 0 ? (
                                    <div className="space-y-4">
                                        {ordersData.data.orders.map((order: any) => (
                                            <div key={order._id} className="border border-[#E4E9EE] rounded-lg p-6 hover:shadow-md transition-shadow">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-[#0B0F0E] mb-1">Order {order.orderNumber}</h3>
                                                        <p className="text-sm text-[#818B9C]">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${STATUS_BADGES[order.status] || STATUS_BADGES.new}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="flex gap-6">
                                                    <div>
                                                        <p className="text-sm text-[#818B9C] mb-1">Total Amount</p>
                                                        <p className="text-lg font-bold text-[#C85A3A]">৳{order.total}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-[#818B9C] mb-1">Items</p>
                                                        <p className="text-lg font-semibold text-[#0B0F0E]">{order.items.length}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-[#818B9C]">
                                        <FaBox className="w-16 h-16 mx-auto mb-4 text-[#E4E9EE]" />
                                        <p>No orders yet</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-6">My Wishlist</h2>
                                {wishlistLoading ? (
                                    <div className="text-center py-12 text-[#818B9C]">Loading wishlist...</div>
                                ) : wishlistData?.data?.wishlist?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <p className="text-[#818B9C]">Wishlist items will be displayed here</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-[#818B9C]">
                                        <FaHeart className="w-16 h-16 mx-auto mb-4 text-[#E4E9EE]" />
                                        <p>Your wishlist is empty</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-6">Change Password</h2>
                                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                                    {[
                                        { name: 'currentPassword' as const, label: 'Current Password', rules: { required: 'Current password is required' } },
                                        { name: 'newPassword' as const, label: 'New Password', rules: { required: 'New password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } } },
                                        { name: 'confirmPassword' as const, label: 'Confirm New Password', rules: { required: 'Please confirm your password', validate: (v: string) => v === newPassword || 'Passwords do not match' } },
                                    ].map(({ name, label, rules }) => (
                                        <div key={name} className="flex flex-col gap-2">
                                            <label className="text-base font-medium text-[#0B0F0E]">{label}</label>
                                            <input
                                                type="password"
                                                {...registerPassword(name, rules)}
                                                className={inputCls}
                                            />
                                            {passwordErrors[name] && <span className="text-sm text-red-500">{passwordErrors[name]?.message}</span>}
                                        </div>
                                    ))}
                                    <button type="submit" className="w-full md:w-auto px-8 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all">
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

export default UserProfile;