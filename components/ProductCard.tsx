import React from 'react';
import { Product } from '../types';
import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-3 active:scale-[0.99] transition-all duration-200 flex gap-4 items-center">
      {/* Image Section */}
      <div className="w-20 h-20 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="text-gray-300 dark:text-gray-500" size={24} />
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-1">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 mb-1 truncate max-w-full">
              {product.category || 'Umum'}
            </span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </div>
          
          {/* Price Display */}
          <div className="text-right shrink-0">
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatRupiah(product.sellPrice)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end mt-2 gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(product); }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 rounded-lg transition-colors"
            aria-label="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-300 rounded-lg transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};