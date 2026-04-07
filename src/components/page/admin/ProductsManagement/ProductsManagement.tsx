'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { categoryService, type Category as CategoryType } from '@/lib/categoryService';
import {
    FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash,
    FaSearch, FaExclamationTriangle, FaTimes,
    FaCloudUploadAlt, FaSpinner,
} from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://karughor-backend.onrender.com/api';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    stock: number;
    description: string;
    images: string[];
    isActive: boolean;
}

interface ProductForm {
    name: string;
    category: string;
    price: string;
    originalPrice: string;
    stock: string;
    description: string;
}

const EMPTY_FORM: ProductForm = {
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
};

// ── helpers ──────────────────────────────────────────────────────────────────
function getAdminToken() {
    if (typeof window === 'undefined') return '';
    try {
        return localStorage.getItem('admin_token') || '';
    } catch {
        return '';
    }
}

function authHeaders() {
    const token = getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── component ─────────────────────────────────────────────────────────────────
const ProductsManagement = () => {
    const queryClient = useQueryClient();

    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productForm, setProductForm] = useState<ProductForm>(EMPTY_FORM);

    // image state
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]); // for edit
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── API calls ──────────────────────────────────────────────────────────────
    const { data, isLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/products?limit=200`, {
                headers: authHeaders(),
                withCredentials: true,
            });
            return res.data.data.products as Product[];
        },
    });

    const products = data || [];

    const STATIC_CATEGORIES: CategoryType[] = [
        { _id: '1', name: 'Jute Rug', slug: 'jute-rug', icon: 'GiBasket', isActive: true, sortOrder: 1, subCategories: [] },
        { _id: '2', name: "Ladies' Bags & Purses", slug: 'ladies-bags-purses', icon: 'FaShoppingBag', isActive: true, sortOrder: 2, subCategories: [] },
        { _id: '3', name: 'Planter Baskets', slug: 'planter-baskets', icon: 'GiFlowerPot', isActive: true, sortOrder: 3, subCategories: [] },
        { _id: '4', name: 'Laundry Baskets', slug: 'laundry-baskets', icon: 'MdLocalLaundryService', isActive: true, sortOrder: 4, subCategories: [] },
        { _id: '5', name: 'Shotoronji', slug: 'shotoronji', icon: 'BsGrid3X2Gap', isActive: true, sortOrder: 5, subCategories: [] },
        { _id: '6', name: 'Dining Placemats', slug: 'dining-placemats', icon: 'FaUtensils', isActive: true, sortOrder: 6, subCategories: [] },
        { _id: '7', name: 'Wall Art', slug: 'wall-art', icon: 'MdWallpaper', isActive: true, sortOrder: 7, subCategories: [] },
        { _id: '8', name: 'Three-Piece Sets', slug: 'three-piece-sets', icon: 'FaTshirt', isActive: true, sortOrder: 8, subCategories: [] },
        { _id: '9', name: 'Bed Sheets', slug: 'bed-sheets', icon: 'FaBed', isActive: true, sortOrder: 9, subCategories: [] },
        { _id: '10', name: 'Nakshi Kantha', slug: 'nakshi-kantha', icon: 'GiSewingNeedle', isActive: true, sortOrder: 10, subCategories: [] },
    ];

    // Inside the component:
    const { data: apiCategories = [] } = useQuery<CategoryType[]>({
        queryKey: ['categories'],
        queryFn: categoryService.getAll,
    });
    const categories = apiCategories.length > 0 ? apiCategories : STATIC_CATEGORIES;


    const createMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await axios.post(`${API_URL}/products`, formData, {
                headers: { ...authHeaders() },
                withCredentials: true,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            handleCloseModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
            const res = await axios.put(`${API_URL}/products/${id}`, formData, {
                headers: { ...authHeaders() },
                withCredentials: true,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            handleCloseModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`${API_URL}/products/${id}`, {
                headers: authHeaders(),
                withCredentials: true,
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
    });

    const toggleMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.patch(`${API_URL}/products/${id}/toggle`, {}, {
                headers: authHeaders(),
                withCredentials: true,
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
    });

    // ── image handlers ─────────────────────────────────────────────────────────
    const addFiles = useCallback((files: FileList | File[]) => {
        const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
        const remaining = 5 - imageFiles.length - existingImages.length;
        const toAdd = arr.slice(0, remaining);
        setImageFiles(prev => [...prev, ...toAdd]);
        toAdd.forEach(f => {
            const reader = new FileReader();
            reader.onload = e => setImagePreviews(prev => [...prev, e.target?.result as string]);
            reader.readAsDataURL(f);
        });
    }, [imageFiles.length, existingImages.length]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(e.target.files);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        addFiles(e.dataTransfer.files);
    };

    const removeNewImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    // ── modal helpers ──────────────────────────────────────────────────────────
    const openAddModal = () => {
        setProductForm(EMPTY_FORM);
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
        setShowAddModal(true);
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setProductForm({
            name: product.name,
            category: product.category,
            price: String(product.price),
            originalPrice: String(product.originalPrice ?? ''),
            stock: String(product.stock),
            description: product.description,
        });
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages(product.images || []);
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedProduct(null);
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
    };

    // ── submit ─────────────────────────────────────────────────────────────────
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('name', productForm.name);
        fd.append('category', productForm.category);
        fd.append('price', productForm.price);
        fd.append('stock', productForm.stock);
        fd.append('description', productForm.description);
        if (productForm.originalPrice) fd.append('originalPrice', productForm.originalPrice);

        imageFiles.forEach(f => fd.append('images', f));

        if (showEditModal) {
            existingImages.forEach(url => fd.append('existingImages', url));
        }

        if (showEditModal && selectedProduct) {
            updateMutation.mutate({ id: selectedProduct._id, formData: fd });
        } else {
            createMutation.mutate(fd);
        }
    };


    // ── derived ────────────────────────────────────────────────────────────────
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10);
    const outOfStockProducts = products.filter(p => p.stock === 0);

    const isSaving = createMutation.isPending || updateMutation.isPending;
    const totalImagesSelected = existingImages.length + imageFiles.length;

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-4">
            <div className="max-w-300 mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">Products Management</h1>
                        <p className="text-[#818B9C]">Manage your product inventory</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all"
                    >
                        <FaPlus /> Add Product
                    </button>
                </div>

                {/* Alert Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {lowStockProducts.length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FaExclamationTriangle className="text-orange-600 w-6 h-6" />
                                <h3 className="text-lg font-semibold text-orange-900">Low Stock Alert</h3>
                            </div>
                            <p className="text-orange-700 mb-4">{lowStockProducts.length} product(s) running low</p>
                            <div className="space-y-2">
                                {lowStockProducts.slice(0, 3).map(p => (
                                    <div key={p._id} className="flex justify-between text-sm">
                                        <span className="text-orange-900">{p.name}</span>
                                        <span className="font-semibold text-orange-600">{p.stock} left</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {outOfStockProducts.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FaExclamationTriangle className="text-red-600 w-6 h-6" />
                                <h3 className="text-lg font-semibold text-red-900">Out of Stock</h3>
                            </div>
                            <p className="text-red-700 mb-4">{outOfStockProducts.length} product(s) out of stock</p>
                            <div className="space-y-2">
                                {outOfStockProducts.slice(0, 3).map(p => (
                                    <div key={p._id} className="text-sm text-red-900">{p.name}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg p-4 mb-6">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#818B9C]" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-[#E4E9EE] rounded-lg focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                        />
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20 gap-3 text-[#818B9C]">
                            <FaSpinner className="animate-spin w-5 h-5" />
                            Loading products...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F7F7F7]">
                                    <tr>
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Product</th>
                                        <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Category</th>
                                        <th className="text-right py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Price</th>
                                        <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Stock</th>
                                        <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Status</th>
                                        <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product._id} className="border-t border-[#E4E9EE] hover:bg-[#F7F7F7] transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-[#F6F6F6] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                        {product.images?.[0] ? (
                                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <FaCloudUploadAlt className="w-6 h-6 text-[#C0C8D2]" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-[#0B0F0E]">{product.name}</p>
                                                        <p className="text-sm text-[#818B9C]">ID: {product._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-[#818B9C]">{product.category}</td>
                                            <td className="py-4 px-4 text-right font-semibold text-[#C85A3A]">৳{product.price}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${product.stock === 0
                                                        ? 'bg-red-100 text-red-700'
                                                        : product.stock <= 10
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex justify-center">
                                                    <button
                                                        onClick={() => toggleMutation.mutate(product._id)}
                                                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${product.isActive
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {product.isActive ? (
                                                            <><FaEye className="inline w-3 h-3 mr-1" />Active</>
                                                        ) : (
                                                            <><FaEyeSlash className="inline w-3 h-3 mr-1" />Inactive</>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(product)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Delete this product?')) deleteMutation.mutate(product._id);
                                                        }}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-12 text-[#818B9C]">No products found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Add / Edit Modal ── */}
                {(showAddModal || showEditModal) && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">

                            {/* Modal header */}
                            <div className="sticky top-0 bg-white border-b border-[#E4E9EE] px-6 py-5 flex items-center justify-between rounded-t-xl z-10">
                                <h2 className="text-xl font-bold text-[#0B0F0E]">
                                    {showEditModal ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button onClick={handleCloseModal} className="p-2 hover:bg-[#F7F7F7] rounded-lg transition-colors">
                                    <FaTimes className="w-5 h-5 text-[#818B9C]" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-6">

                                {/* ── IMAGE UPLOAD (FIRST) ── */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-base font-medium text-[#0B0F0E]">
                                        Product Images * <span className="text-sm text-[#818B9C] font-normal">(up to 5)</span>
                                    </label>

                                    {/* Drop zone */}
                                    <div
                                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={handleDrop}
                                        onClick={() => totalImagesSelected < 5 && fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-all cursor-pointer select-none ${dragOver
                                            ? 'border-[#C85A3A] bg-[#C85A3A]/5'
                                            : totalImagesSelected >= 5
                                                ? 'border-[#E4E9EE] bg-[#F7F7F7] cursor-not-allowed opacity-60'
                                                : 'border-[#C0C8D2] hover:border-[#C85A3A] hover:bg-[#C85A3A]/5'
                                            }`}
                                    >
                                        <FaCloudUploadAlt className="w-10 h-10 text-[#C85A3A]" />
                                        <p className="text-sm font-medium text-[#0B0F0E]">
                                            {totalImagesSelected >= 5
                                                ? 'Maximum 5 images reached'
                                                : 'Drop images here or click to browse'}
                                        </p>
                                        <p className="text-xs text-[#818B9C]">JPG, PNG, WEBP — max 5 MB each</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    {/* Image previews */}
                                    {(existingImages.length > 0 || imagePreviews.length > 0) && (
                                        <div className="flex flex-wrap gap-3 mt-1">
                                            {/* Existing images (edit mode) */}
                                            {existingImages.map((url, i) => (
                                                <div key={`existing-${i}`} className="relative group w-24 h-24">
                                                    <img src={url} alt="" className="w-24 h-24 object-cover rounded-lg border border-[#E4E9EE]" />
                                                    {i === 0 && (
                                                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5 rounded-b-lg">Main</span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(i)}
                                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MdClose className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* New image previews */}
                                            {imagePreviews.map((src, i) => (
                                                <div key={`new-${i}`} className="relative group w-24 h-24">
                                                    <img src={src} alt="" className="w-24 h-24 object-cover rounded-lg border-2 border-[#C85A3A]" />
                                                    {existingImages.length === 0 && i === 0 && (
                                                        <span className="absolute bottom-0 left-0 right-0 bg-[#C85A3A]/80 text-white text-[10px] text-center py-0.5 rounded-b-lg">Main</span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(i)}
                                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MdClose className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Product Name */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-base font-medium text-[#0B0F0E]">Product Name *</label>
                                    <input
                                        type="text"
                                        value={productForm.name}
                                        onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))}
                                        required
                                        placeholder="Enter product name"
                                        className="px-4 py-3 border border-[#E4E9EE] rounded-lg focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                    />
                                </div>

                                {/* Category */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-base font-medium text-[#0B0F0E]">Category *</label>
                                    <select
                                        value={productForm.category}
                                        onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))}
                                        required
                                        className="px-4 py-3 border border-[#E4E9EE] rounded-lg focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 bg-white text-[#0B0F0E]"
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {categories.filter(c => c.isActive).map(cat => (
                                            <optgroup key={cat._id} label={cat.name}>
                                                {/* Parent category itself as a selectable option */}
                                                <option value={cat.name}>{cat.name}</option>
                                                {/* Sub-categories */}
                                                {cat.subCategories.filter(s => s.isActive).map(sub => (
                                                    <option key={sub._id} value={sub.name}>
                                                        &nbsp;&nbsp;↳ {sub.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>

                                {/* Price & Original Price */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">Sale Price (৳) *</label>
                                        <input
                                            type="number"
                                            value={productForm.price}
                                            onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))}
                                            required
                                            min="0"
                                            step="1"
                                            placeholder="0"
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-base font-medium text-[#0B0F0E]">Original Price (৳)</label>
                                        <input
                                            type="number"
                                            value={productForm.originalPrice}
                                            onChange={e => setProductForm(p => ({ ...p, originalPrice: e.target.value }))}
                                            min="0"
                                            step="1"
                                            placeholder="0 (optional)"
                                            className="px-4 py-3 border border-[#E4E9EE] rounded-lg focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                        />
                                    </div>
                                </div>

                                {/* Stock */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-base font-medium text-[#0B0F0E]">Stock *</label>
                                    <input
                                        type="number"
                                        value={productForm.stock}
                                        onChange={e => setProductForm(p => ({ ...p, stock: e.target.value }))}
                                        required
                                        min="0"
                                        placeholder="0"
                                        className="px-4 py-3 border border-[#E4E9EE] rounded-lg focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-base font-medium text-[#0B0F0E]">Description *</label>
                                    <textarea
                                        value={productForm.description}
                                        onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                                        required
                                        rows={4}
                                        placeholder="Enter product description"
                                        className="px-4 py-3 border border-[#E4E9EE] rounded-lg focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20 resize-none"
                                    />
                                </div>

                                {/* Error */}
                                {(createMutation.isError || updateMutation.isError) && (
                                    <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                        Failed to save product. Please try again.
                                    </p>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-6 py-3 border border-[#E4E9EE] text-[#818B9C] rounded-lg font-semibold hover:bg-[#F7F7F7] transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving || (totalImagesSelected === 0 && !showEditModal)}
                                        className="flex-1 px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? (
                                            <><FaSpinner className="animate-spin" /> Saving...</>
                                        ) : (
                                            showEditModal ? 'Update Product' : 'Add Product'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsManagement;