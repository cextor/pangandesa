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
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? p.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Semua', ...new Set(MOCK_PRODUCTS.map(p => p.category))];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-800 font-display mb-2 uppercase tracking-tight">
              {activeCategory ? activeCategory : 'Semua Produk'}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium italic">Temukan hasil tani terbaik langsung dari petani pilihan kami.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="relative flex-1 w-full lg:min-w-[400px]">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari produk..." 
                  className="w-full bg-white border border-slate-200 rounded-full py-3 sm:py-4 pl-12 pr-6 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all shadow-sm"
                />
             </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-nowrap overflow-x-auto gap-2 sm:gap-3 mb-8 sm:mb-10 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === 'Semua' ? null : cat)}
              className={`whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onPreview={onProductSelect} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-10 sm:p-20 text-center border font-display border-slate-100">
             <h3 className="text-xl sm:text-2xl font-black text-slate-300 uppercase italic">Produk tidak ditemukan</h3>
             <p className="text-sm sm:text-base text-slate-400 mt-2">Coba gunakan kata kunci lain</p>
          </div>
        )}
      </div>
    </div>
  );
}
