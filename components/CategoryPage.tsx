import React from 'react';

interface CategoryPageProps {
    categories: string[];
    onCategoryClick: (category: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categories, onCategoryClick }) => {
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

            {/* Category Section Header */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Category</h2>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-gray-400 text-sm">
                        Belum ada kategori.
                    </div>
                ) : (
                    categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => onCategoryClick(category)}
                            className="aspect-square bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 flex flex-col items-start justify-start text-left hover:opacity-90 transition-opacity"
                        >
                            <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                {category}
                            </span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};
