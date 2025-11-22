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
            className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex justify-between items-center relative overflow-hidden cursor-pointer shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all active:scale-[0.98]"
        >
            <div className="flex items-center flex-1 min-w-0">
                <div className="w-16 h-16 relative shrink-0 mr-4">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-xl bg-gray-100 dark:bg-gray-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-[10px] text-gray-400">
                            No Img
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100 truncate pr-2">{product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-1 truncate">
                        {product.category || 'Umum'}
                    </p>
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                        Rp {product.sellPrice.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between h-full pl-2">
                {/* Use a dynamic stock badge if available, else show a generic 'In Stock' or remove */}
                {/* For now, using a cleaner badge style */}
                <div className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                    <span className="text-[10px] font-bold text-green-700 dark:text-green-400">Ready</span>
                </div>
            </div>
        </div>
    );
};
