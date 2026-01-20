'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaCamera,
    FaEdit,
    FaBox,
    FaHeart,
} from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';

interface ProfileFormValues {
    fullName: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    area?: string;
}

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    items: number;
}

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        defaultValues: {
            fullName: 'Kamal Hassan',
            phone: '+880 1712-345678',
            email: 'kamal@example.com',
            address: 'House 12, Road 5',
            city: 'Dhaka',
            area: 'Dhanmondi',
        },
    });

    // Mock orders data
    const orders: Order[] = [
        {
            id: '1',
            orderNumber: 'ORD-001',
            date: '2024-01-20',
            status: 'delivered',
            total: 209,
            items: 2,
        },
        {
            id: '2',
            orderNumber: 'ORD-002',
            date: '2024-01-18',
            status: 'shipped',
            total: 89,
            items: 1,
        },
        {
            id: '3',
            orderNumber: 'ORD-003',
            date: '2024-01-15',
            status: 'delivered',
            total: 450,
            items: 3,
        },
    ];

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

    const onSubmit = (data: ProfileFormValues) => {
        console.log('Profile updated:', data);
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            new: 'bg-blue-100 text-blue-700',
            confirmed: 'bg-yellow-100 text-yellow-700',
            shipped: 'bg-purple-100 text-purple-700',
            delivered: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        return badges[status as keyof typeof badges] || badges.new;
    };

    return (
        <div className="bg-[#F7F7F7] w-full min-h-screen py-12 px-4">
            <div className="max-w-300 mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm md:text-base font-medium text-[#818B9C] select-none flex-wrap mb-8">
                    <a
                        href="/"
                        className="text-[#C85A3A] hover:underline transition-all duration-300"
                    >
                        Home
                    </a>
                    <MdKeyboardArrowRight className="text-[#818B9C]" />
                    <span className="text-[#0B0F0E] font-semibold">My Profile</span>
                </nav>

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
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="w-16 h-16 text-[#818B9C]" />
                                        )}
                                    </div>
                                    <label
                                        htmlFor="profile-upload"
                                        className="absolute bottom-0 right-0 w-10 h-10 bg-[#C85A3A] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#A84830] transition-all shadow-lg"
                                    >
                                        <FaCamera className="w-4 h-4" />
                                        <input
                                            type="file"
                                            id="profile-upload"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <h3 className="text-lg font-semibold text-[#0B0F0E] mt-4">
                                    Kamal Hassan
                                </h3>
                                <p className="text-sm text-[#818B9C]">+880 1712-345678</p>
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
                                    <span className="font-medium">My Profile</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'orders'
                                            ? 'bg-[#C85A3A] text-white'
                                            : 'text-[#0B0F0E] hover:bg-[#F7F7F7]'
                                        }`}
                                >
                                    <FaBox />
                                    <span className="font-medium">My Orders</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('wishlist')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'wishlist'
                                            ? 'bg-[#C85A3A] text-white'
                                            : 'text-[#0B0F0E] hover:bg-[#F7F7F7]'
                                        }`}
                                >
                                    <FaHeart />
                                    <span className="font-medium">Wishlist</span>
                                </button>
                            </nav>

                            {/* Logout */}
                            <button className="w-full mt-6 px-4 py-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-all">
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-[#0B0F0E]">
                                        Profile Information
                                    </h2>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="flex items-center gap-2 px-4 py-2 border border-[#C85A3A] text-[#C85A3A] rounded-lg hover:bg-[#C85A3A] hover:text-white transition-all"
                                    >
                                        <FaEdit />
                                        {isEditing ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Full Name */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaUser className="text-[#C85A3A]" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            {...register('fullName', {
                                                required: 'Full name is required',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 disabled:bg-[#F7F7F7] disabled:cursor-not-allowed"
                                        />
                                        {errors.fullName && (
                                            <span className="text-sm text-red-500">
                                                {errors.fullName.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaPhone className="text-[#C85A3A]" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            disabled={!isEditing}
                                            {...register('phone', {
                                                required: 'Phone is required',
                                            })}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 disabled:bg-[#F7F7F7] disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaEnvelope className="text-[#C85A3A]" />
                                            Email (Optional)
                                        </label>
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            {...register('email')}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 disabled:bg-[#F7F7F7] disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    {/* City & Area */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-base font-medium text-[#0B0F0E]">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                {...register('city')}
                                                className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 disabled:bg-[#F7F7F7] disabled:cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-base font-medium text-[#0B0F0E]">
                                                Area
                                            </label>
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                {...register('area')}
                                                className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 disabled:bg-[#F7F7F7] disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-[#C85A3A]" />
                                            Address
                                        </label>
                                        <textarea
                                            rows={3}
                                            disabled={!isEditing}
                                            {...register('address')}
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 resize-none disabled:bg-[#F7F7F7] disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    {isEditing && (
                                        <button
                                            type="submit"
                                            className="w-full md:w-auto px-8 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all"
                                        >
                                            Save Changes
                                        </button>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-6">
                                    My Orders
                                </h2>

                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="border border-[#E4E9EE] rounded-lg p-6 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-[#0B0F0E] mb-1">
                                                        Order {order.orderNumber}
                                                    </h3>
                                                    <p className="text-sm text-[#818B9C]">
                                                        Placed on {order.date}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status.charAt(0).toUpperCase() +
                                                        order.status.slice(1)}
                                                </span>
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex gap-6">
                                                    <div>
                                                        <p className="text-sm text-[#818B9C] mb-1">
                                                            Total Amount
                                                        </p>
                                                        <p className="text-lg font-bold text-[#C85A3A]">
                                                            ${order.total}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-[#818B9C] mb-1">
                                                            Items
                                                        </p>
                                                        <p className="text-lg font-semibold text-[#0B0F0E]">
                                                            {order.items}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button className="px-6 py-2 border border-[#C85A3A] text-[#C85A3A] rounded-lg font-medium hover:bg-[#C85A3A] hover:text-white transition-all">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-6">
                                    My Wishlist
                                </h2>
                                <div className="text-center py-12 text-[#818B9C]">
                                    <FaHeart className="w-16 h-16 mx-auto mb-4 text-[#E4E9EE]" />
                                    <p>Your wishlist is empty</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;