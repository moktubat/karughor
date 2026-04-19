'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt,
    FaCamera, FaEdit, FaBox, FaHeart, FaLock,
    FaTimesCircle,
} from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useAuthStore } from '@/store/authStore';
import { type UpdateProfileData } from '@/lib/userService';
import { authService } from '@/lib/authService';
import Image from 'next/image';
import api from '@/lib/api';
import { ProductCard } from '@/components/common/ProductCard';
import { useToast } from '@/providers/ToastProvider';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    phone: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    address: z.string().optional(),
    city: z.string().optional(),
    area: z.string().optional(),
});

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_BADGES: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const CANCELLABLE_STATUSES = ['new', 'confirmed'];
const CANCEL_WINDOW_MINUTES = 60;

const NAV_ITEMS = [
    { id: 'profile', label: 'My Profile', icon: FaUser },
    { id: 'orders', label: 'My Orders', icon: FaBox },
    { id: 'wishlist', label: 'Wishlist', icon: FaHeart },
    { id: 'password', label: 'Change Password', icon: FaLock },
] as const;

type Tab = (typeof NAV_ITEMS)[number]['id'];

const inputCls =
    'px-4 py-3 border border-[#E4E9EE] rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20';
const disabledInputCls = `${inputCls} disabled:bg-[#F7F7F7] disabled:cursor-not-allowed`;

function canCancelOrder(order: any): boolean {
    if (!CANCELLABLE_STATUSES.includes(order.status)) return false;
    const placed = new Date(order.orderDate || order.createdAt).getTime();
    return (Date.now() - placed) / 60000 <= CANCEL_WINDOW_MINUTES;
}

function minutesLeft(order: any): number {
    const placed = new Date(order.orderDate || order.createdAt).getTime();
    return Math.max(0, Math.round(CANCEL_WINDOW_MINUTES - (Date.now() - placed) / 60000));
}

// ─── Component ────────────────────────────────────────────────────────────────

const UserProfile = () => {
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const { user, setUser, logout: logoutStore } = useAuthStore();
    const { showSuccess, showError } = useToast();

    const tabParam = searchParams.get('tab') as Tab | null;
    const [activeTab, setActiveTab] = useState<Tab>(tabParam || 'profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

    // ── Queries ────────────────────────────────────────────────────────────────

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const res = await api.get('/users/profile', { withCredentials: true });
            return res.data;
        },
        enabled: !!user,
        retry: 1,
    });

    const {
        data: ordersData,
        isLoading: ordersLoading,
        error: ordersError,
        refetch: refetchOrders,
    } = useQuery({
        queryKey: ['userOrders'],
        queryFn: async () => {
            const res = await api.get('/orders/my-orders', {
                params: { page: 1, limit: 50 },
                withCredentials: true,
            });
            return res.data;
        },
        enabled: activeTab === 'orders' && !!user,
        retry: 1,
        refetchInterval: activeTab === 'orders' ? 30_000 : false,
    });

    // Trigger fetch as soon as the orders tab is opened
    useEffect(() => {
        if (activeTab === 'orders') refetchOrders();
    }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

    const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
        queryKey: ['userWishlist'],
        queryFn: async () => {
            const res = await api.get('/users/wishlist', { withCredentials: true });
            return res.data;
        },
        enabled: activeTab === 'wishlist' && !!user,
        retry: 1,
    });

    // ── Mutations ──────────────────────────────────────────────────────────────

    const updateProfileMutation = useMutation({
        mutationFn: async (data: UpdateProfileData) => {
            const res = await api.put('/users/profile', data, { withCredentials: true });
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            if (data?.data?.user) setUser(data.data.user);
            setIsEditing(false);
            showSuccess('Profile updated successfully!');
        },
        onError: (error: any) => {
            showError(error.response?.data?.message || 'Failed to update profile');
        },
    });

    const cancelOrderMutation = useMutation({
        mutationFn: async (orderId: string) => {
            const res = await api.patch(
                `/orders/${orderId}/cancel`,
                {},
                { withCredentials: true }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userOrders'] });
            showSuccess('Order cancelled successfully.');
            setCancelConfirmId(null);
        },
        onError: (err: any) => {
            showError(
                err.response?.data?.error?.message ||
                err.response?.data?.message ||
                'Failed to cancel order.'
            );
            setCancelConfirmId(null);
        },
        onSettled: () => setCancellingId(null),
    });

    // ── Forms ──────────────────────────────────────────────────────────────────

    const {
        register,
        handleSubmit,
        reset: resetProfile,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
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

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

    // ── Handlers ───────────────────────────────────────────────────────────────

    const onSubmitProfile = (data: ProfileFormValues) => {
        updateProfileMutation.mutate({
            fullName: data.fullName,
            email: data.email,
            address: { street: data.address, area: data.area, city: data.city },
        });
    };

    const onSubmitPassword = async (data: PasswordFormValues) => {
        try {
            await api.put(
                '/users/change-password',
                { currentPassword: data.currentPassword, newPassword: data.newPassword },
                { withCredentials: true }
            );
            showSuccess('Password changed successfully!');
            resetPassword();
        } catch (error: any) {
            showError(error.response?.data?.error?.message || 'Failed to change password');
        }
    };

    const handleCancelOrder = (orderId: string) => {
        setCancellingId(orderId);
        cancelOrderMutation.mutate(orderId);
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

    // ── Derived data — safe fallbacks at every level ───────────────────────────
    if (profileLoading) {
        return (
            <div className="bg-[#F7F7F7] w-full min-h-screen flex items-center justify-center">
                <div className="text-lg text-[#818B9C]">Loading profile...</div>
            </div>
        );
    }

    const currentUser = profileData?.data?.user || user;

    // The backend returns { success, data: { orders: [...] } }
    const orders: any[] = ordersData?.data?.orders ?? [];

    // The backend returns { success, data: { wishlist: [...] } }
    const wishlist: any[] = wishlistData?.data?.wishlist ?? [];

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="bg-[#F7F7F7] w-full min-h-screen py-12 px-4">
            <div className="max-w-300 mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm md:text-base font-medium text-[#818B9C] select-none flex-wrap mb-8">
                    <Link href="/" className="text-[#C85A3A] hover:underline">Home</Link>
                    <MdKeyboardArrowRight className="text-[#818B9C]" />
                    <span className="text-[#0B0F0E] font-semibold">My Profile</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* ── Sidebar ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-[#E4E9EE] rounded-lg p-6">
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full bg-[#F6F6F6] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                        {currentUser?.profileImage ? (
                                            <Image
                                                src={currentUser.profileImage}
                                                alt={currentUser.fullName}
                                                width={128}
                                                height={128}
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
                                </div>
                                <h3 className="text-lg font-semibold text-[#0B0F0E] mt-4">
                                    {currentUser?.fullName || 'User'}
                                </h3>
                                <p className="text-sm text-[#818B9C]">{currentUser?.phone}</p>
                            </div>

                            <nav className="space-y-2">
                                {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === id
                                                ? 'bg-[#C85A3A] text-white'
                                                : 'text-[#0B0F0E] hover:bg-[#F7F7F7]'
                                            }`}
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

                    {/* ── Main Content ── */}
                    <div className="lg:col-span-3">

                        {/* ── Profile Tab ── */}
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
                                        <input type="text" disabled={!isEditing} {...register('fullName')} className={disabledInputCls} />
                                        {errors.fullName && <span className="text-sm text-red-500">{errors.fullName.message}</span>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaPhone className="text-[#C85A3A]" /> Phone Number
                                        </label>
                                        <input type="tel" disabled {...register('phone')} className="px-4 py-3 border border-[#E4E9EE] rounded-lg text-base bg-[#F7F7F7] cursor-not-allowed" />
                                        <span className="text-xs text-[#818B9C]">Phone number cannot be changed</span>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E] flex items-center gap-2">
                                            <FaEnvelope className="text-[#C85A3A]" /> Email (Optional)
                                        </label>
                                        <input type="email" disabled={!isEditing} {...register('email')} className={disabledInputCls} />
                                        {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
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
                                        <textarea rows={3} disabled={!isEditing} {...register('address')} className={`${disabledInputCls} resize-none`} />
                                    </div>

                                    {isEditing && (
                                        <button
                                            type="submit"
                                            disabled={updateProfileMutation.isPending}
                                            className="w-full md:w-auto px-8 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all disabled:opacity-50"
                                        >
                                            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* ── Orders Tab ── */}
                        {activeTab === 'orders' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-6">My Orders</h2>

                                {ordersLoading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                                        ))}
                                    </div>
                                ) : ordersError ? (
                                    <div className="text-center py-16 text-[#818B9C]">
                                        <FaBox className="w-16 h-16 mx-auto mb-4 text-[#E4E9EE]" />
                                        <p className="font-semibold text-red-500">Could not load orders</p>
                                        <p className="text-sm mt-1">
                                            {(ordersError as any)?.response?.data?.error?.message || 'Please try again.'}
                                        </p>
                                        <button
                                            onClick={() => refetchOrders()}
                                            className="mt-4 px-5 py-2 bg-[#C85A3A] text-white rounded-lg text-sm font-semibold hover:bg-[#A84830] transition-colors"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                ) : orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {orders.map((order: any) => {
                                            const cancellable = canCancelOrder(order);
                                            const minsLeft = cancellable ? minutesLeft(order) : 0;
                                            const isCancelling =
                                                cancellingId === order._id && cancelOrderMutation.isPending;

                                            return (
                                                <div
                                                    key={order._id}
                                                    className="border border-[#E4E9EE] rounded-lg p-5 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                                        <div>
                                                            <h3 className="text-base font-semibold text-[#0B0F0E]">
                                                                {order.orderNumber}
                                                            </h3>
                                                            <p className="text-xs text-[#818B9C] mt-0.5">
                                                                Placed on{' '}
                                                                {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-GB', {
                                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                                })}
                                                            </p>
                                                        </div>
                                                        <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BADGES[order.status] || STATUS_BADGES.new}`}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </div>

                                                    {/* Items preview */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {order.items?.slice(0, 3).map((item: any, idx: number) => (
                                                            <div key={idx} className="flex items-center gap-2 bg-[#F7F7F7] rounded-md px-3 py-1.5 text-xs text-[#0B0F0E]">
                                                                {item.productImage && (
                                                                    <Image src={item.productImage} alt={item.productName || ''} width={24} height={24} className="rounded object-cover" />
                                                                )}
                                                                <span className="line-clamp-1 max-w-[120px]">{item.productName}</span>
                                                                <span className="text-[#818B9C]">×{item.quantity}</span>
                                                            </div>
                                                        ))}
                                                        {order.items?.length > 3 && (
                                                            <span className="text-xs text-[#818B9C] self-center">+{order.items.length - 3} more</span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#E4E9EE]">
                                                        <div className="flex gap-6">
                                                            <div>
                                                                <p className="text-xs text-[#818B9C] mb-0.5">Total</p>
                                                                <p className="text-base font-bold text-[#C85A3A]">৳{order.total}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-[#818B9C] mb-0.5">Items</p>
                                                                <p className="text-base font-semibold text-[#0B0F0E]">{order.items?.length}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-[#818B9C] mb-0.5">Payment</p>
                                                                <p className="text-base font-semibold text-[#0B0F0E]">COD</p>
                                                            </div>
                                                        </div>

                                                        {cancellable && (
                                                            <div className="flex flex-col items-end gap-1">
                                                                <button
                                                                    onClick={() => setCancelConfirmId(order._id)}
                                                                    disabled={isCancelling}
                                                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
                                                                >
                                                                    <FaTimesCircle className="w-3.5 h-3.5" />
                                                                    Cancel Order
                                                                </button>
                                                                <span className="text-xs text-[#818B9C]">Window closes in {minsLeft} min</span>
                                                            </div>
                                                        )}

                                                        {order.status === 'cancelled' && order.cancelledAt && (
                                                            <p className="text-xs text-red-400">
                                                                Cancelled on {new Date(order.cancelledAt).toLocaleDateString('en-GB')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 text-[#818B9C]">
                                        <FaBox className="w-16 h-16 mx-auto mb-4 text-[#E4E9EE]" />
                                        <p className="font-semibold">No orders yet</p>
                                        <p className="text-sm mt-1">When you place your first order it will appear here.</p>
                                        <Link href="/products">
                                            <button className="mt-5 px-6 py-2.5 bg-[#C85A3A] text-white rounded-lg text-sm font-semibold hover:bg-[#A84830] transition-colors">
                                                Browse Products
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Wishlist Tab ── */}
                        {activeTab === 'wishlist' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-6">My Wishlist</h2>
                                {wishlistLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
                                        ))}
                                    </div>
                                ) : wishlist.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {wishlist.map((product: any) => (
                                            <ProductCard
                                                key={product._id}
                                                id={product._id}
                                                name={product.name}
                                                image={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'}
                                                salePrice={`৳${product.price}`}
                                                originalPrice={product.originalPrice ? `৳${product.originalPrice}` : undefined}
                                                stock={product.stock}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 text-[#818B9C]">
                                        <FaHeart className="w-16 h-16 mx-auto mb-4 text-[#E4E9EE]" />
                                        <p className="font-semibold">Your wishlist is empty</p>
                                        <p className="text-sm mt-1">
                                            Heart a product on the product page to save it here.
                                        </p>
                                        <p className="text-xs text-[#818B9C] mt-2">
                                            Note: You must be logged in for wishlist to sync.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Password Tab ── */}
                        {activeTab === 'password' && (
                            <div className="bg-white border border-[#E4E9EE] rounded-lg p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-[#0B0F0E] mb-6">Change Password</h2>
                                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                                    {[
                                        { name: 'currentPassword' as const, label: 'Current Password' },
                                        { name: 'newPassword' as const, label: 'New Password' },
                                        { name: 'confirmPassword' as const, label: 'Confirm New Password' },
                                    ].map(({ name, label }) => (
                                        <div key={name} className="flex flex-col gap-2">
                                            <label className="text-base font-medium text-[#0B0F0E]">{label}</label>
                                            <input type="password" {...registerPassword(name)} className={inputCls} />
                                            {passwordErrors[name] && (
                                                <span className="text-sm text-red-500">{passwordErrors[name]?.message}</span>
                                            )}
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

            {/* ── Cancel Confirm Modal ── */}
            {cancelConfirmId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                <FaTimesCircle className="text-red-500 w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0B0F0E]">Cancel Order?</h3>
                        </div>
                        <p className="text-sm text-[#818B9C] mb-6">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancelConfirmId(null)}
                                className="flex-1 px-4 py-2.5 border border-[#E4E9EE] text-[#0B0F0E] rounded-lg font-semibold hover:bg-[#F7F7F7] transition-all"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={() => handleCancelOrder(cancelConfirmId)}
                                disabled={cancelOrderMutation.isPending}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-60"
                            >
                                {cancelOrderMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;