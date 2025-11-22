import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Product } from '../types';
import { ProductListCard } from './ProductListCard';

interface HomePageProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, onProductClick, searchQuery, onSearchChange }) => {
    // Format date: "11-21-2025" (MM-DD-YYYY) as per design
    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;

    return (
        <div className="pb-24 pt-6 px-6">
            {/* Header */}
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">WarungKu</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-1">{formattedDate}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <span className="text-xs font-bold">W</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    placeholder="Cari barang..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Product Section Header */}
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Daftar Produk</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {products.length} Barang
                </span>
            </div>

            {/* Product List */}
            <div className="space-y-3">
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 dark:text-white font-medium mb-1">Tidak ditemukan</h3>
                        <p className="text-gray-500 text-sm">Coba kata kunci lain atau tambah produk baru.</p>
                    </div>
                ) : (
                    products.map(product => (
                        <ProductListCard
                            key={product.id}
                            product={product}
                            onClick={() => onProductClick(product)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
