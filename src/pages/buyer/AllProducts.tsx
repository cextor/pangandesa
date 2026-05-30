import React from 'react';
import ProductCard from '../../components/UI/ProductCard';
import { Search, LayoutGrid, List, Calendar } from 'lucide-react';
import { Product } from '../../types';
import { ProductService } from '../../services/ProductService';

interface AllProductsProps {
  onProductSelect: (product: Product) => void;
  initialCategory?: string | null;
}

export default function AllProducts({ onProductSelect, initialCategory }: AllProductsProps) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string | null>(initialCategory || null);
  const [filterPreOrder, setFilterPreOrder] = React.useState<'ALL' | 'PRE_ORDER' | 'READY'>('ALL');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  React.useEffect(() => {
    setActiveCategory(initialCategory || null);
  }, [initialCategory]);

  React.useEffect(() => {
    ProductService.getAllProducts().then((data) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? p.category === activeCategory : true;
    const matchesPreOrder = 
      filterPreOrder === 'ALL' ? true : 
      filterPreOrder === 'PRE_ORDER' ? p.isPreOrder : 
      !p.isPreOrder;
    return matchesSearch && matchesCategory && matchesPreOrder;
  });

  const categories = ['Semua', ...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-8 lg:p-12">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-800 font-display mb-2 uppercase tracking-tight">
              {activeCategory ? activeCategory : 'Semua Produk'}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium italic">Temukan hasil tani terbaik langsung dari petani pilihan kami.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
             {/* Search input */}
             <div className="relative flex-1 sm:min-w-[320px]">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari produk..." 
                  className="w-full bg-white border border-slate-200 rounded-full py-3 pl-12 pr-6 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all shadow-sm"
                />
             </div>

             {/* Pre-order/Ready Filter pills */}
             <div className="flex bg-white p-1 rounded-full border border-slate-200 shadow-sm shrink-0 self-center sm:self-auto">
                <button
                  onClick={() => setFilterPreOrder('ALL')}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterPreOrder === 'ALL' ? 'bg-[#1a4d2e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterPreOrder('PRE_ORDER')}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${filterPreOrder === 'PRE_ORDER' ? 'bg-[#1a4d2e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Calendar size={11} /> Pre-Order
                </button>
                <button
                  onClick={() => setFilterPreOrder('READY')}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterPreOrder === 'READY' ? 'bg-[#1a4d2e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Stok Ready
                </button>
             </div>

             {/* View mode toggle */}
             <div className="flex bg-white p-1 rounded-full border border-slate-200 shadow-sm shrink-0 self-center sm:self-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-[#1a4d2e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Tampilan 2 Kolom"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-[#1a4d2e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Tampilan List"
                >
                  <List size={16} />
                </button>
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

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-4 border border-slate-100 animate-pulse space-y-4">
                <div className="aspect-square bg-slate-100 rounded-2xl w-full" />
                <div className="h-4 bg-slate-100 rounded-md w-2/3" />
                <div className="h-6 bg-slate-100 rounded-md w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-2 gap-4 sm:gap-6 md:gap-8" 
              : "grid grid-cols-1 gap-4 sm:gap-6 max-w-4xl mx-auto"
          }>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onPreview={onProductSelect} layout={viewMode} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-10 sm:p-20 text-center border font-display border-slate-100">
             <h3 className="text-xl sm:text-2xl font-black text-slate-300 uppercase italic">Produk tidak ditemukan</h3>
             <p className="text-sm sm:text-base text-slate-400 mt-2">Coba gunakan kata kunci lain atau reset filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
