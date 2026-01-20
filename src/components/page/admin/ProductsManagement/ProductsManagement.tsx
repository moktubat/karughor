'use client';

import React, { useState } from 'react';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaEyeSlash,
    FaSearch,
    FaExclamationTriangle,
} from 'react-icons/fa';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    isActive: boolean;
}

const ProductsManagement = () => {
    const [products, setProducts] = useState<Product[]>([
        {
            id: 1,
            name: 'Logitech G502 Hero',
            category: 'Gaming Mouse',
            price: 89,
            stock: 45,
            image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
            isActive: true,
        },
        {
            id: 2,
            name: 'Logitech G435 Headset',
            category: 'Gaming Headset',
            price: 280,
            stock: 5,
            image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
            isActive: true,
        },
        {
            id: 3,
            name: 'Wireless Keyboard',
            category: 'Keyboard',
            price: 120,
            stock: 0,
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
            isActive: false,
        },
        {
            id: 4,
            name: 'Gaming Chair',
            category: 'Furniture',
            price: 450,
            stock: 12,
            image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
            isActive: true,
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const toggleProductStatus = (id: number) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
        );
    };

    const deleteProduct = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 10);
    const outOfStockProducts = products.filter((p) => p.stock === 0);

    return (
        <div className="bg-[#F7F7F7] min-h-screen p-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0B0F0E] mb-2">
                            Products Management
                        </h1>
                        <p className="text-[#818B9C]">Manage your product inventory</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#C85A3A] text-white rounded-lg font-semibold hover:bg-[#A84830] transition-all"
                    >
                        <FaPlus />
                        Add Product
                    </button>
                </div>

                {/* Alert Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {lowStockProducts.length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FaExclamationTriangle className="text-orange-600 w-6 h-6" />
                                <h3 className="text-lg font-semibold text-orange-900">
                                    Low Stock Alert
                                </h3>
                            </div>
                            <p className="text-orange-700 mb-4">
                                {lowStockProducts.length} product(s) are running low on stock
                            </p>
                            <div className="space-y-2">
                                {lowStockProducts.slice(0, 3).map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex justify-between items-center text-sm"
                                    >
                                        <span className="text-orange-900">{product.name}</span>
                                        <span className="font-semibold text-orange-600">
                                            {product.stock} left
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {outOfStockProducts.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FaExclamationTriangle className="text-red-600 w-6 h-6" />
                                <h3 className="text-lg font-semibold text-red-900">
                                    Out of Stock
                                </h3>
                            </div>
                            <p className="text-red-700 mb-4">
                                {outOfStockProducts.length} product(s) are out of stock
                            </p>
                            <div className="space-y-2">
                                {outOfStockProducts.slice(0, 3).map((product) => (
                                    <div key={product.id} className="text-sm text-red-900">
                                        {product.name}
                                    </div>
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
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-[#E4E9EE] rounded-lg focus:outline-none focus:border-[#C85A3A] focus:ring-2 focus:ring-[#C85A3A]/20"
                        />
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white border border-[#E4E9EE] rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#F7F7F7]">
                                <tr>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Product
                                    </th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Category
                                    </th>
                                    <th className="text-right py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Price
                                    </th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Stock
                                    </th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Status
                                    </th>
                                    <th className="text-center py-4 px-4 text-sm font-semibold text-[#0B0F0E]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-t border-[#E4E9EE] hover:bg-[#F7F7F7] transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-[#F6F6F6] rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[#0B0F0E]">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-sm text-[#818B9C]">
                                                        ID: #{product.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-[#818B9C]">
                                            {product.category}
                                        </td>
                                        <td className="py-4 px-4 text-right font-semibold text-[#C85A3A]">
                                            ${product.price}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${product.stock === 0
                                                            ? 'bg-red-100 text-red-700'
                                                            : product.stock <= 10
                                                                ? 'bg-orange-100 text-orange-700'
                                                                : 'bg-green-100 text-green-700'
                                                        }`}
                                                >
                                                    {product.stock === 0
                                                        ? 'Out of Stock'
                                                        : `${product.stock} in stock`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => toggleProductStatus(product.id)}
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${product.isActive
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {product.isActive ? (
                                                        <>
                                                            <FaEye className="inline w-3 h-3 mr-1" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaEyeSlash className="inline w-3 h-3 mr-1" />
                                                            Inactive
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        console.log('Edit', product.id)
                                                    }
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
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
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12 text-[#818B9C]">
                            No products found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsManagement;