import React from 'react';
import ProductCard from '../../components/UI/ProductCard';
import { MOCK_PRODUCTS } from '../../constants';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Product } from '../../types';

interface AllProductsProps {
  onProductSelect: (product: Product) => void;
  initialCategory?: string | null;
}

export default function AllProducts({ onProductSelect, initialCategory }: AllProductsProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string | null>(initialCategory || null);

  React.useEffect(() => {
    setActiveCategory(initialCategory || null);
  }, [initialCategory]);

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? p.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Semua', ...new Set(MOCK_PRODUCTS.map(p => p.category))];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1400px] mx-auto p-8 sm:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-800 font-display mb-2 uppercase tracking-tight">
              {activeCategory ? activeCategory : 'Semua Produk'}
            </h1>
            <p className="text-slate-500 font-medium italic">Temukan hasil tani terbaik langsung dari petani pilihan kami.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="relative flex-1 min-w-[300px]">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari produk, desa, atau petani..." 
                  className="w-full bg-white border border-slate-200 rounded-full py-4 pl-12 pr-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all shadow-sm"
                />
             </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === 'Semua' ? null : cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                (cat === 'Semua' && !activeCategory) || cat === activeCategory
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onPreview={onProductSelect} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-20 text-center border font-display border-slate-100">
             <h3 className="text-2xl font-black text-slate-300 uppercase italic">Produk tidak ditemukan</h3>
             <p className="text-slate-400 mt-2">Coba gunakan kata kunci lain</p>
          </div>
        )}
      </div>
    </div>
  );
}
