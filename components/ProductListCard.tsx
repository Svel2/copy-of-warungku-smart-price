import React from 'react';
import { Product } from '../types';

interface ProductListCardProps {
    product: Product;
    onClick?: () => void;
}

export const ProductListCard: React.FC<ProductListCardProps> = ({ product, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 flex justify-between items-center relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        >
            <div className="z-10">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Rp {product.sellPrice.toLocaleString()}
                </p>
            </div>

            <div className="absolute top-2 right-2 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded text-xs text-gray-600 dark:text-gray-300 backdrop-blur-sm">
                Stock-50
            </div>

            <div className="w-20 h-20 relative shrink-0 ml-4">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg shadow-sm rotate-6 transform hover:rotate-0 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400">
                        No Img
                    </div>
                )}
            </div>
        </div>
    );
};
