import React from 'react';
import { Product } from '../types';
import { ProductListCard } from './ProductListCard';

interface HomePageProps {
    products: Product[];
    onProductClick: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, onProductClick }) => {
    // Format date: "11-21-2025" (MM-DD-YYYY) as per design
    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${today.getFullYear()}`;

    return (
        <div className="pb-24 pt-6 px-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">WarungKu</h1>
                <p className="text-red-500 text-xs font-medium mt-1">{formattedDate}</p>
            </div>

            {/* Product Section Header */}
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Product</h2>
                <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Lihat Semua &gt;
                </button>
            </div>

            {/* Product List */}
            <div className="space-y-4">
                {products.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        Belum ada produk.
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
