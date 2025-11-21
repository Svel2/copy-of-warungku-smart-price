import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { X, Sparkles, Loader2, Save, Image as ImageIcon, Upload, Wand2 } from 'lucide-react';
import { suggestProductInfo, generateProductImage } from '../services/geminiService';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'lastUpdated'>, id?: string) => void;
  initialData?: Product | null;
}

const PRESET_CATEGORIES = [
  "Makanan", "Minuman", "Sembako", 
  "Perlengkapan Mandi", "Kebersihan Rumah", 
  "Rokok", "Obat-obatan", "Gas & Galon"
];

export const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [image, setImage] = useState<string | undefined>(undefined);
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setCategory(initialData.category);
        setSellPrice(initialData.sellPrice.toString());
        setImage(initialData.image);
      } else {
        resetForm();
      }
      setAiMessage(null);
      setIsDragging(false);
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setName('');
    setCategory('');
    setSellPrice('');
    setImage(undefined);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar!');
      return;
    }
    
    // Simple check for size (approx 1MB limit)
    if (file.size > 1024 * 1024) {
      alert("Ukuran foto terlalu besar. Mohon gunakan foto di bawah 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            return; // Only process the first image found
          }
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      category,
      sellPrice: Number(sellPrice) || 0,
      image
    }, initialData?.id);
  };

  const handleAskAI = async () => {
    if (!name || name.length < 3) {
      alert('Isi nama produk dengan jelas dulu ya!');
      return;
    }
    setIsAiLoading(true);
    setAiMessage(null);
    
    const suggestion = await suggestProductInfo(name);
    
    setIsAiLoading(false);
    if (suggestion) {
      setSellPrice(suggestion.suggestedSellPrice.toString());
      setCategory(suggestion.suggestedCategory);
      setAiMessage(`Saran: ${suggestion.reasoning}`);
    } else {
      setAiMessage("Maaf, AI tidak bisa menemukan data produk ini.");
    }
  };

  const handleGenerateImage = async () => {
    if (!name || name.length < 3) {
      alert('Isi nama produk dengan jelas dulu ya untuk membuat gambar!');
      return;
    }
    setIsImageLoading(true);
    
    const generatedImage = await generateProductImage(name);
    
    setIsImageLoading(false);
    if (generatedImage) {
      setImage(generatedImage);
    } else {
      alert("Gagal membuat gambar. Coba lagi atau upload manual.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 transition-opacity"
      onPaste={handlePaste}
    >
      {/* Modal Container: Full height on mobile (h-[100dvh]), Auto height on Desktop */}
      <div className="bg-white dark:bg-gray-900 w-full sm:max-w-lg h-[100dvh] sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {initialData ? 'Edit Harga' : 'Tambah Produk Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Image Upload Section */}
          <div className="flex flex-col items-center gap-3">
            <div 
              className={`relative w-full h-48 sm:w-32 sm:h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-colors group ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-500'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isImageLoading ? (
                <div className="flex flex-col items-center justify-center text-blue-500">
                  <Loader2 className="animate-spin mb-2" size={24} />
                  <span className="text-xs">Membuat...</span>
                </div>
              ) : image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <ImageIcon className={`mb-2 transition-colors ${isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500'}`} size={32} />
                  <span className={`text-xs text-center px-2 ${isDragging ? 'text-blue-600 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                    {isDragging ? 'Lepas foto di sini' : 'Ketuk, tempel, atau drop foto'}
                  </span>
                </>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
              {!isImageLoading && image && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Upload className="text-white" size={24} />
                </div>
              )}
            </div>

            {/* Generate Image Button */}
            <button 
              type="button"
              onClick={handleGenerateImage}
              disabled={isImageLoading || !name}
              className={`text-xs flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
                !name 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg active:scale-95'
              }`}
            >
              {isImageLoading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
              {image ? 'Buat Gambar Ulang' : 'Buat Gambar AI'}
            </button>
          </div>

          {/* Name Input + AI Price Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Produk</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Indomie Goreng"
                className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12 text-base"
              />
              {!initialData && (
                <button 
                  type="button"
                  onClick={handleAskAI}
                  disabled={isAiLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
                  title="Tanya AI untuk harga"
                >
                  {isAiLoading ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1 leading-relaxed">
               Tombol <Sparkles size={12} className="inline text-blue-500"/> untuk cek harga pasar. Tombol <Wand2 size={12} className="inline text-purple-500"/> untuk foto otomatis.
            </p>
          </div>

          {/* AI Feedback Message */}
          {aiMessage && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-3.5 rounded-xl text-sm text-blue-800 dark:text-blue-200 flex gap-3 items-start shadow-sm">
              <Sparkles size={18} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"/>
              <span className="leading-relaxed">{aiMessage}</span>
            </div>
          )}

          {/* Sell Price - Big and prominent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Harga Jual</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-bold">Rp</span>
              <input
                type="number"
                required
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="0"
                className="w-full p-4 pl-14 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-gray-900 dark:text-white text-2xl font-bold focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Category + Chips */}
          <div className="pb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kategori</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Pilih atau ketik..."
              className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-3 text-base"
            />
            <div className="flex flex-wrap gap-2">
              {PRESET_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 ${
                    category === cat 
                      ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-sm' 
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions - Sticky at bottom */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/95 backdrop-blur-sm sm:rounded-b-2xl flex gap-3 shrink-0 safe-area-bottom">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:bg-gray-200"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-[2] py-3.5 px-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 active:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};
