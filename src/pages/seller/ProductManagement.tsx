import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Star, 
  Calendar,
  ChevronRight,
  Package,
  AlertCircle
} from 'lucide-react';
import { Product } from '../../types';
import ProductForm from '../../components/Seller/ProductForm';

const INITIAL_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Tomat Segar', 
    price: 16000, 
    unit: 'kg', 
    farmer: 'Pak Joko', 
    village: 'Lembang', 
    category: 'Buah', 
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200', 
    harvestDate: '10 Mei 2024',
    rating: 4.8,
    reviewCount: 132,
    stock: 50,
    description: 'Tomat segar dipanen langsung dari kebun kami.',
    isPreOrder: true
  },
  { 
    id: '2', 
    name: 'Cabai Merah Keriting', 
    price: 28000, 
    unit: 'kg', 
    farmer: 'Pak Joko', 
    village: 'Lembang', 
    category: 'Sayur', 
    image: 'https://images.unsplash.com/photo-1588252391480-496af0cdbc7a?q=80&w=200', 
    harvestDate: '12 Mei 2024',
    rating: 4.9,
    reviewCount: 85,
    stock: 30,
    description: 'Cabai merah premium kualitas ekspor.',
    isPreOrder: false
  },
];

export default function ProductManagement() {
  const [products, setProducts] = React.useState<Product[]>(INITIAL_PRODUCTS);
  const [isAddingMode, setIsAddingMode] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = (productData: Partial<Product>) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } as Product : p));
    } else {
      const newProduct: Product = {
        ...productData,
        id: Math.random().toString(36).substr(2, 9),
        farmer: 'Pak Joko',
        village: 'Lembang',
        rating: 0,
        reviewCount: 0,
      } as Product;
      setProducts([newProduct, ...products]);
    }
    setIsAddingMode(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isAddingMode || editingProduct) {
    return (
      <div className="flex-1 overflow-hidden bg-slate-50 p-0 lg:p-10 flex items-center justify-center">
        <div className="w-full max-w-2xl h-full lg:h-auto overflow-hidden shadow-2xl">
          <ProductForm 
            product={editingProduct || undefined} 
            onSave={handleSave} 
            onCancel={() => {
              setIsAddingMode(false);
              setEditingProduct(null);
            }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 font-display uppercase tracking-tight">Produk Saya</h1>
            <p className="text-slate-500 font-medium">Kelola daftar produk dan stok jualan Anda</p>
          </div>
          <button 
            onClick={() => setIsAddingMode(true)}
            className="bg-brand-600 text-white px-8 py-4 rounded-[24px] font-black text-sm flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 active:scale-95"
          >
            <Plus size={20} /> Tambah Produk
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Cari produk Anda..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-[28px] py-4 pl-16 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 transition-all shadow-sm"
            />
          </div>
          <button className="w-full md:w-auto bg-white border border-slate-100 rounded-[24px] px-8 py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} /> Filter
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div 
              layout
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:border-brand-200 transition-all"
            >
              <div className="relative aspect-square">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                <div className="absolute top-6 left-6 flex gap-2">
                   {product.isPreOrder && (
                     <span className="bg-brand-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Pre-Order</span>
                   )}
                   <span className="bg-white/90 backdrop-blur-md text-slate-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{product.category}</span>
                </div>
                <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => setEditingProduct(product)}
                    className="w-10 h-10 bg-white rounded-xl shadow-xl flex items-center justify-center text-slate-600 hover:text-brand-600 hover:scale-110 transition-all"
                   >
                     <Edit3 size={18} />
                   </button>
                   <button 
                    onClick={() => handleDelete(product.id)}
                    className="w-10 h-10 bg-white rounded-xl shadow-xl flex items-center justify-center text-slate-600 hover:text-red-500 hover:scale-110 transition-all"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-xl font-black text-slate-800">{product.name}</h3>
                   <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                   </div>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Stok: {product.stock} {product.unit}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Harga per {product.unit}</p>
                     <p className="text-xl font-black text-slate-800">Rp {product.price.toLocaleString('id-ID')}</p>
                   </div>
                   <button 
                    onClick={() => setEditingProduct(product)}
                    className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-brand-50 hover:text-brand-600 transition-all group/btn"
                   >
                     <Package size={20} className="group-hover/btn:scale-110 transition-transform" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Empty State / Add New Card */}
          <div 
            onClick={() => setIsAddingMode(true)}
            className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center p-12 gap-4 cursor-pointer hover:border-brand-200 hover:bg-brand-50/10 transition-all group"
          >
             <div className="w-20 h-20 bg-white rounded-[32px] shadow-sm flex items-center justify-center text-slate-300 group-hover:text-brand-600 group-hover:scale-110 transition-all group-hover:shadow-xl group-hover:shadow-brand-500/10">
                <Plus size={40} />
             </div>
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-brand-600 mt-2">Tambah Produk Baru</p>
          </div>
        </div>

        {/* Low Stock Warning */}
        {products.some(p => p.stock < 10) && (
          <div className="bg-orange-50 border border-orange-100 rounded-[32px] p-8 flex items-start gap-6">
             <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-500 shrink-0">
                <AlertCircle size={28} />
             </div>
             <div>
                <h4 className="text-lg font-black text-slate-800 mb-1">Peringatan Stok Rendah</h4>
                <p className="text-slate-600 font-medium">Beberapa produk Anda memiliki stok kurang dari 10 kg. Segera perbarui stok untuk menghindari pesanan yang tertunda.</p>
                <div className="flex gap-4 mt-4">
                  {products.filter(p => p.stock < 10).map(p => (
                    <span key={p.id} className="text-[10px] font-black text-orange-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-orange-100 uppercase tracking-tight">
                      {p.name}: {p.stock} {p.unit}
                    </span>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
