import React, { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Product } from './types';
import { getProducts, addProduct, updateProduct, deleteProduct, generateId } from './services/storageService';
import { ProductForm } from './components/ProductForm';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { CategoryPage } from './components/CategoryPage';

const App: React.FC = () => {
  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isError, setIsError] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [currentView, setCurrentView] = useState<'home' | 'categories' | 'add'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Data on Mount
  const fetchProducts = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }, [products, searchQuery]);

  // Unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [products]);

  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'lastUpdated'>, id?: string) => {
    const now = new Date().toISOString();

    try {
      if (id) {
        // Edit
        const updatedProduct: Product = {
          id,
          ...productData,
          lastUpdated: now
        };

        // Optimistic Update (Update UI immediately)
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));

        // Sync to DB
        await updateProduct(updatedProduct);
      } else {
        // Add
        const newProduct: Product = {
          id: generateId(),
          ...productData,
          lastUpdated: now,
        };

        // Optimistic Update
        setProducts(prev => [newProduct, ...prev]);

        // Sync to DB
        await addProduct(newProduct);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      alert("Gagal menyimpan data. Periksa koneksi internet.");
      // Revert/Refetch if needed (simplified here)
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus barang ini?')) {
      try {
        // Optimistic Delete
        setProducts(prev => prev.filter(p => p.id !== id));

        // Sync to DB
        await deleteProduct(id);
      } catch (error) {
        alert("Gagal menghapus. Periksa koneksi internet.");
        fetchProducts();
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // ... existing code ...

  // ... existing code ...

  const handleNavigation = (view: 'home' | 'categories' | 'add') => {
    if (view === 'add') {
      openAddModal();
    } else {
      if (view === 'home') {
        setSearchQuery('');
      }
      setCurrentView(view);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
      <Sidebar currentView={currentView} onNavigate={handleNavigation} />

      <div className="md:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto min-h-screen bg-white dark:bg-gray-900 shadow-sm md:shadow-none overflow-hidden relative">

          {/* Main Content Area */}
          <div className="h-full overflow-y-auto no-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-screen pb-20 text-gray-400">
                <Loader2 className="animate-spin mb-3 text-blue-500" size={32} />
                <p>Memuat data warung...</p>
              </div>
            ) : currentView === 'home' ? (
              <HomePage
                products={filteredProducts}
                onProductClick={openEditModal}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            ) : (
              <CategoryPage
                categories={categories}
                onCategoryClick={(cat) => {
                  setSearchQuery(cat);
                  setCurrentView('home');
                }}
              />
            )}
          </div>

          {/* Bottom Navigation */}
          <BottomNav currentView={currentView} onNavigate={handleNavigation} />

          {/* Modal */}
          <ProductForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveProduct}
            initialData={editingProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default App;