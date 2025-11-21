import React from 'react';
import { Home, Plus, Grid } from 'lucide-react';

interface BottomNavProps {
  currentView: 'home' | 'categories' | 'add';
  onNavigate: (view: 'home' | 'categories' | 'add') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-6 flex justify-between items-center z-50 h-16">
      <button 
        onClick={() => onNavigate('home')}
        className={`p-2 rounded-full transition-colors ${currentView === 'home' ? 'text-black dark:text-white' : 'text-gray-400'}`}
      >
        <Home size={24} />
      </button>
      
      <button 
        onClick={() => onNavigate('add')}
        className="bg-black dark:bg-white text-white dark:text-black p-3 rounded-full -mt-8 shadow-lg hover:scale-105 transition-transform"
      >
        <Plus size={24} />
      </button>
      
      <button 
        onClick={() => onNavigate('categories')}
        className={`p-2 rounded-full transition-colors ${currentView === 'categories' ? 'text-black dark:text-white' : 'text-gray-400'}`}
      >
        <Grid size={24} />
      </button>
    </div>
  );
};
