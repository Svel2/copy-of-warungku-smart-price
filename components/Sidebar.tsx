import React from 'react';
import { Home, Plus, Grid } from 'lucide-react';

interface SidebarProps {
    currentView: 'home' | 'categories' | 'add';
    onNavigate: (view: 'home' | 'categories' | 'add') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
    return (
        <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 p-6 z-50">
            <div className="mb-10 flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <span className="text-lg font-bold">W</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">WarungKu</h1>
            </div>

            <nav className="space-y-2 flex-1">
                <button
                    onClick={() => onNavigate('home')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === 'home'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                >
                    <Home size={20} strokeWidth={currentView === 'home' ? 2.5 : 2} />
                    <span>Home</span>
                </button>

                <button
                    onClick={() => onNavigate('categories')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === 'categories'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                >
                    <Grid size={20} strokeWidth={currentView === 'categories' ? 2.5 : 2} />
                    <span>Kategori</span>
                </button>
            </nav>

            <button
                onClick={() => onNavigate('add')}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                <Plus size={20} strokeWidth={2.5} />
                <span className="font-medium">Tambah Produk</span>
            </button>
        </div>
    );
};
