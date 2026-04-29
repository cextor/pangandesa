import React from 'react';
import ProductCard from '../../components/UI/ProductCard';
import { MOCK_PRODUCTS } from '../../constants';
import { Heart, Search } from 'lucide-react';
import { Product } from '../../types';

interface FavoritesPageProps {
  onProductSelect: (product: Product) => void;
}

export default function FavoritesPage({ onProductSelect }: FavoritesPageProps) {
  // Mock favorites - just taking a subset of mock products
  const favorites = [MOCK_PRODUCTS[0], MOCK_PRODUCTS[2], MOCK_PRODUCTS[3]];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1400px] mx-auto p-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-4 mb-2 text-red-500">
               <Heart size={32} fill="currentColor" />
               <h1 className="text-4xl font-black text-slate-800 font-display">Favorit Saya</h1>
            </div>
            <p className="text-slate-500 font-medium">Produk-produk pilihan yang selalu ada di hati Anda.</p>
          </div>
          <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 text-sm font-bold flex items-center gap-3">
             <Search size={18} /> 
             Mencari di antara {favorites.length} favorit
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-4 gap-8">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} onPreview={onProductSelect} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-20 flex flex-col items-center text-center border border-slate-100 border-dashed">
             <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200 mb-8">
                <Heart size={48} />
             </div>
             <h3 className="text-2xl font-black text-slate-800 font-display mb-4">Belum Ada Favorit</h3>
             <p className="text-slate-500 max-w-xs font-medium leading-loose">Sukain produk yang Anda temukan di beranda untuk menambahkannya ke sini.</p>
             <button className="mt-8 bg-brand-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/20 active:scale-95">
               Mulai Belanja
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
