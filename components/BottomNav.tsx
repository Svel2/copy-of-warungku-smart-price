import React from 'react';
import { Home, Plus, Grid } from 'lucide-react';

interface BottomNavProps {
  currentView: 'home' | 'categories' | 'add';
  onNavigate: (view: 'home' | 'categories' | 'add') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-8 flex justify-between items-center z-50 h-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <button
        onClick={() => onNavigate('home')}
        className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${currentView === 'home'
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
      >
        <Home size={22} strokeWidth={currentView === 'home' ? 2.5 : 2} />
        {currentView === 'home' && <span className="text-[10px] font-bold">Home</span>}
      </button>

      <button
        onClick={() => onNavigate('add')}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full -mt-12 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-4 border-white dark:border-gray-900"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => onNavigate('categories')}
        className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${currentView === 'categories'
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
      >
        <Grid size={22} strokeWidth={currentView === 'categories' ? 2.5 : 2} />
        {currentView === 'categories' && <span className="text-[10px] font-bold">Kategori</span>}
      </button>
    </div>
  );
};
