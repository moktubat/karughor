'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUser, FaEnvelope, FaLock, FaStore, FaPhone, FaCamera, FaSpinner } from 'react-icons/fa';
import { adminAuthHeaders } from '@/lib/adminAuth';
import api from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

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
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'profile' | 'store' | 'password'>('profile');
    const { showSuccess, showError } = useToast();

    // ── Fetch admin profile ────────────────────────────────────────────────────
    const { data: adminData, isLoading } = useQuery({
        queryKey: ['admin-profile'],
        queryFn: async () => {
            const res = await api.get('/admin/profile', {
                headers: adminAuthHeaders(),
            });
            return res.data.data.admin;
        },
    });

    // ── Profile form ───────────────────────────────────────────────────────────
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormValues>();

    useEffect(() => {
        if (adminData) {
            resetProfile({
                fullName: adminData.fullName || '',
                email: adminData.email || '',
                phone: adminData.phone || '',
            });
        }
    }, [adminData, resetProfile]);

    const updateProfileMutation = useMutation({
        mutationFn: async (data: ProfileFormValues) => {
            const res = await api.put('/admin/profile', {
                fullName: data.fullName,
                phone: data.phone,
            }, {
                headers: adminAuthHeaders(),
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
            showSuccess('Profile updated successfully!');
        },
        onError: (err: any) => {
            showError(err.response?.data?.error?.message || 'Failed to update profile');
        },
    });

    // ── Store form ─────────────────────────────────────────────────────────────
    const {
        register: registerStore,
        handleSubmit: handleSubmitStore,
        reset: resetStore,
        formState: { errors: {} },
    } = useForm<StoreFormValues>();

    useEffect(() => {
        if (adminData?.storeInfo) {
            resetStore({
                storeName: adminData.storeInfo.name || '',
                storeEmail: adminData.storeInfo.email || '',
                storePhone: adminData.storeInfo.phone || '',
                storeAddress: adminData.storeInfo.address || '',
            });
        }
    }, [adminData, resetStore]);

    const updateStoreMutation = useMutation({
        mutationFn: async (data: StoreFormValues) => {
            const res = await api.put('/admin/profile', {
                storeInfo: {
                    name: data.storeName,
                    email: data.storeEmail,
                    phone: data.storePhone,
                    address: data.storeAddress,
                },
            },
                { headers: adminAuthHeaders(), }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
            showSuccess('Store info updated successfully!');
        },
        onError: (err: any) => {
            showError(err.response?.data?.error?.message || 'Failed to update store info');
        },
    });

    // ── Password form ──────────────────────────────────────────────────────────
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        watch,
        reset: resetPassword,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormValues>();

    const newPassword = watch('newPassword');

    const changePasswordMutation = useMutation({
        mutationFn: async (data: PasswordFormValues) => {
            const res = await api.put('/admin/profile/password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            }, {
                headers: adminAuthHeaders(),
            });
            return res.data;
        },
        onSuccess: () => {
            resetPassword();
            showSuccess('Password changed successfully!');
        },
        onError: (err: any) => {
            showError(err.response?.data?.error?.message || 'Failed to change password');
        },
    });


    if (isLoading) {
        return (
            <div className="bg-[#F7F7F7] min-h-screen flex items-center justify-center">
                <FaSpinner className="animate-spin w-8 h-8 text-[#C85A3A]" />
            </div>
        );
    }

    return (
        <div className="bg-[#F7F7F7] min-h-screen ps-4 py-4">
            <div className="max-w-300 mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Admin Profile</h1>
                    <p className="text-[#818B9C]">Manage your account and store settings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-[#E4E9EE] rounded-lg p-4">
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full bg-[#F6F6F6] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                        <FaUser className="w-16 h-16 text-[#818B9C]" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center cursor-not-allowed" title="Upload disabled">
                                        <FaCamera className="w-4 h-4" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-[#0B0F0E] mt-4">
                                    {adminData?.fullName || 'Admin'}
                                </h3>
                                <p className="text-sm text-[#818B9C]">{adminData?.email}</p>
                                <span className="mt-2 text-xs bg-[#C85A3A]/10 text-[#C85A3A] px-3 py-1 rounded-full font-semibold">
                                    {adminData?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                </span>
                            </div>

                            <nav className="space-y-2">
                                {[
                                    { id: 'profile', label: 'Personal Info', icon: FaUser },
                                    { id: 'store', label: 'Store Info', icon: FaStore },
                                    { id: 'password', label: 'Change Password', icon: FaLock },
                                ].map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id as any)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === id ? 'bg-[#C85A3A] text-white' : 'text-[#0B0F0E] hover:bg-[#F7F7F7]'}`}
                                    >
                                        <Icon />
                                        <span className="font-medium">{label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">

                        {/* Personal Info */}
                        {activeTab === 'profile' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-4">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-2">Personal Information</h2>
                                <p className="text-sm text-[#818B9C] mb-6">
                                    Your login email is <span className="font-semibold text-[#0B0F0E]">{adminData?.email}</span> — to change it, update it here and use the new email to log in next time.
                                </p>

                                <form onSubmit={handleSubmitProfile((d) => updateProfileMutation.mutate(d))} className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaUser className="text-[#C85A3A]" /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            {...registerProfile('fullName', { required: 'Full name is required' })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {profileErrors.fullName && <span className="text-sm text-red-500">{profileErrors.fullName.message}</span>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaEnvelope className="text-[#C85A3A]" /> Email
                                            <span className="text-xs text-[#818B9C] font-normal">(used for login)</span>
                                        </label>
                                        <input
                                            type="email"
                                            disabled
                                            {...registerProfile('email')}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base bg-[#F7F7F7] cursor-not-allowed"
                                        />
                                        <span className="text-xs text-[#818B9C]">Email cannot be changed from here for security reasons</span>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaPhone className="text-[#C85A3A]" /> Phone
                                        </label>
                                        <input
                                            type="tel"
                                            {...registerProfile('phone')}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={updateProfileMutation.isPending}
                                        className="w-full md:w-auto px-8 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {updateProfileMutation.isPending && <FaSpinner className="animate-spin" />}
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Store Info */}
                        {activeTab === 'store' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-6">Store Information</h2>

                                <form onSubmit={handleSubmitStore((d) => updateStoreMutation.mutate(d))} className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">Store Name</label>
                                        <input
                                            type="text"
                                            {...registerStore('storeName')}
                                            placeholder="e.g. Karughor"
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">Store Email</label>
                                        <input
                                            type="email"
                                            {...registerStore('storeEmail')}
                                            placeholder="support@karughor.com"
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">Store Phone</label>
                                        <input
                                            type="tel"
                                            {...registerStore('storePhone')}
                                            placeholder="+880 1XXXXXXXXX"
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">Store Address</label>
                                        <textarea
                                            rows={3}
                                            {...registerStore('storeAddress')}
                                            placeholder="Dhaka, Bangladesh"
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={updateStoreMutation.isPending}
                                        className="w-full md:w-auto px-8 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {updateStoreMutation.isPending && <FaSpinner className="animate-spin" />}
                                        Update Store Info
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Change Password */}
                        {activeTab === 'password' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-2">Change Password</h2>
                                <p className="text-sm text-[#818B9C] mb-6">
                                    Your new password will be used for all future logins at <span className="font-semibold text-[#0B0F0E]">/admin/login</span>.
                                </p>

                                <form onSubmit={handleSubmitPassword((d) => changePasswordMutation.mutate(d))} className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">Current Password</label>
                                        <input
                                            type="password"
                                            {...registerPassword('currentPassword', { required: 'Current password is required' })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {passwordErrors.currentPassword && <span className="text-sm text-red-500">{passwordErrors.currentPassword.message}</span>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">New Password</label>
                                        <input
                                            type="password"
                                            {...registerPassword('newPassword', {
                                                required: 'New password is required',
                                                minLength: { value: 8, message: 'Minimum 8 characters' },
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {passwordErrors.newPassword && <span className="text-sm text-red-500">{passwordErrors.newPassword.message}</span>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">Confirm New Password</label>
                                        <input
                                            type="password"
                                            {...registerPassword('confirmPassword', {
                                                required: 'Please confirm password',
                                                validate: (v) => v === newPassword || 'Passwords do not match',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                        {passwordErrors.confirmPassword && <span className="text-sm text-red-500">{passwordErrors.confirmPassword.message}</span>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={changePasswordMutation.isPending}
                                        className="w-full md:w-auto px-8 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {changePasswordMutation.isPending && <FaSpinner className="animate-spin" />}
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