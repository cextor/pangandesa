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
  ChevronLeft,
  Package,
  AlertCircle,
  LayoutGrid,
  List,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../../types';
import ProductForm from '../../components/Seller/ProductForm';
import { ProductService } from '../../services/ProductService';

import { parseHarvestSchedules } from '../../utils/harvestHelper';

const cleanHarvestDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const schedules = parseHarvestSchedules(dateStr, 0, 0, true);
  return schedules
    .filter(s => s.status === 'READY' && s.isPreOrder)
    .map(s => {
      const parts = s.date.split('-');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return s.date;
    })
    .join(', ');
};

export default function ProductManagement() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isAddingMode, setIsAddingMode] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = React.useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [filterPreOrder, setFilterPreOrder] = React.useState<'ALL' | 'PRE_ORDER' | 'READY'>('ALL');
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    ProductService.getAllProducts().then((data) => {
      // Filter products for this seller (ID: 2) or show all for demo
      const sellerProducts = (data || []).filter(p => p.sellerId === 2 || p.sellerId === '2' || !p.sellerId);
      setProducts(sellerProducts);
    });
  }, []);

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await ProductService.deleteProduct(productToDelete.id);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setSelectedProductForDetail(null);
      setProductToDelete(null);
    } catch (err) {
      alert('Gagal menghapus produk. Produk mungkin terikat dengan transaksi pesanan yang aktif di database.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (productData: Partial<Product>) => {
    if (editingProduct) {
      try {
        const updated = await ProductService.updateProduct(editingProduct.id, productData);
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
        setSuccessToast('Produk berhasil diperbarui!');
        setTimeout(() => setSuccessToast(null), 3000);
      } catch (err) {
        alert('Gagal memperbarui produk di database.');
      }
    } else {
      try {
        const newProduct = await ProductService.createProduct(productData);
        setProducts([newProduct, ...products]);
        setSuccessToast('Produk baru berhasil ditambahkan!');
        setTimeout(() => setSuccessToast(null), 3000);
      } catch (err) {
        alert('Gagal menambahkan produk baru ke database.');
      }
    }
    setIsAddingMode(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPreOrder = 
      filterPreOrder === 'ALL' ? true : 
      filterPreOrder === 'PRE_ORDER' ? p.isPreOrder : 
      !p.isPreOrder;
    return matchesSearch && matchesPreOrder;
  });

  if (isAddingMode || editingProduct) {
    return (
      <div className="flex-1 bg-slate-50 p-0 lg:p-10 flex flex-col items-center min-h-screen lg:h-full lg:overflow-hidden">
        <div className="w-full max-w-5xl h-full lg:h-auto shadow-2xl lg:rounded-[40px] flex flex-col bg-white overflow-hidden">
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

  if (selectedProductForDetail) {
    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <button 
              onClick={() => setSelectedProductForDetail(null)}
              className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-800 border border-slate-100"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Detail Produk</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="aspect-square rounded-[48px] overflow-hidden border-8 border-slate-50 shadow-2xl">
                <img src={selectedProductForDetail.image} className="w-full h-full object-cover" alt={selectedProductForDetail.name} />
              </div>
              <div className="flex gap-4">
                 <div className="flex-1 bg-slate-50 p-6 rounded-[32px] border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                    <div className="flex items-center justify-center gap-2">
                       <Star className="text-yellow-400 fill-yellow-400" size={18} />
                       <span className="text-xl font-black text-slate-800">{selectedProductForDetail.rating}</span>
                    </div>
                 </div>
                 <div className="flex-1 bg-slate-50 p-6 rounded-[32px] border border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ulasan</p>
                    <span className="text-xl font-black text-slate-800">{selectedProductForDetail.reviewCount}</span>
                 </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <span className="bg-brand-100 text-brand-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedProductForDetail.category}</span>
                    {selectedProductForDetail.isPreOrder && <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Pre-Order</span>}
                 </div>
                 <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-2">{selectedProductForDetail.name}</h2>
                 <p className="text-3xl font-black text-brand-600">Rp {selectedProductForDetail.price.toLocaleString('id-ID')} <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">/ {selectedProductForDetail.unit}</span></p>
              </div>

              <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Stok</span>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedProductForDetail.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                       {selectedProductForDetail.stock > 0 ? 'Tersedia' : 'Habis'}
                    </span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jumlah Stok</span>
                    <span className="text-sm font-black text-slate-800">{selectedProductForDetail.stock} {selectedProductForDetail.unit}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimasi Panen</span>
                    <span className="text-sm font-black text-slate-800">{cleanHarvestDate(selectedProductForDetail.harvestDate)}</span>
                 </div>
              </div>

              <div className="space-y-3">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Produk</h4>
                 <p className="text-slate-600 font-medium leading-relaxed">{selectedProductForDetail.description || 'Tidak ada deskripsi detail.'}</p>
              </div>

              <div className="pt-6 flex gap-4">
                 <button 
                   onClick={() => {
                     setEditingProduct(selectedProductForDetail);
                     setSelectedProductForDetail(null);
                   }}
                   className="flex-1 bg-brand-900 text-white py-5 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-brand-900/20 hover:bg-black transition-all"
                 >
                    Edit Produk
                 </button>
                  <button 
                    onClick={() => setProductToDelete(selectedProductForDetail)}
                    className="w-16 h-16 flex items-center justify-center bg-red-50 text-red-500 rounded-[24px] hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10 cursor-pointer"
                  >
                     <Trash2 size={24} />
                  </button>
              </div>
            </div>
          </div>
        </div>
        {/* Premium Tailwind Delete Confirmation Modal inside Detail View */}
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
              onClick={() => setProductToDelete(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 border border-slate-100 overflow-hidden text-center z-10"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
                 <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Hapus Produk</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 px-4">
                Apakah Anda yakin ingin menghapus produk <span className="font-bold text-slate-800">"{productToDelete.name}"</span> secara permanen? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-4">
                 <button 
                   onClick={() => setProductToDelete(null)}
                   disabled={isDeleting}
                   className="flex-1 border border-slate-200 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
                 >
                   Batal
                 </button>
                 <button 
                   onClick={confirmDelete}
                   disabled={isDeleting}
                   className="flex-1 bg-red-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-650 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                   {isDeleting ? (
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : 'Ya, Hapus'}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
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
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1a4d2e] transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Cari produk Anda..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-3 pl-14 pr-6 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 transition-all shadow-inner placeholder:text-slate-300 text-slate-800"
            />
          </div>

          {/* Pre-Order / Ready Filter */}
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0 self-center lg:self-auto">
             <button
               onClick={() => setFilterPreOrder('ALL')}
               className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterPreOrder === 'ALL' ? 'bg-[#1a4d2e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
             >
               Semua
             </button>
             <button
               onClick={() => setFilterPreOrder('PRE_ORDER')}
               className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${filterPreOrder === 'PRE_ORDER' ? 'bg-[#1a4d2e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
             >
               Pre-Order
             </button>
             <button
               onClick={() => setFilterPreOrder('READY')}
               className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterPreOrder === 'READY' ? 'bg-[#1a4d2e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
             >
               Stok Ready
             </button>
          </div>

          {/* View mode toggle */}
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0 self-center lg:self-auto">
             <button
               type="button"
               onClick={() => setViewMode('grid')}
               className={`p-2 rounded-lg transition-all border-0 bg-transparent cursor-pointer ${viewMode === 'grid' ? 'bg-[#1a4d2e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
               title="Tampilan Grid"
             >
               <LayoutGrid size={14} />
             </button>
             <button
               type="button"
               onClick={() => setViewMode('list')}
               className={`p-2 rounded-lg transition-all border-0 bg-transparent cursor-pointer ${viewMode === 'list' ? 'bg-[#1a4d2e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
               title="Tampilan List"
             >
               <List size={14} />
             </button>
          </div>
        </div>

        {/* Product Grid / List */}
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
            : "grid grid-cols-1 gap-4 sm:gap-6 max-w-4xl mx-auto"
        }>
          {filteredProducts.map((product) => {
            if (viewMode === 'list') {
              return (
                <motion.div 
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('button')) return;
                    setSelectedProductForDetail(product);
                  }}
                  className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden group hover:border-brand-200 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-row p-4 gap-6 items-center"
                >
                   <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 relative bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                      <div className="absolute top-2 left-2 flex gap-1">
                         {product.isPreOrder && (
                           <span className="bg-brand-600/90 text-white px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest shadow-sm">Pre-Order</span>
                         )}
                      </div>
                   </div>
                   <div className="flex-1 flex flex-col justify-between min-w-0 h-full">
                      <div className="space-y-1">
                         <div className="flex items-center justify-between">
                            <h3 className="text-sm sm:text-base font-black text-slate-800 leading-tight truncate pr-2 uppercase tracking-tight">{product.name}</h3>
                            <div className="flex items-center gap-1 shrink-0">
                               <Star size={12} className="text-yellow-400 fill-yellow-400" />
                               <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                            </div>
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stok: {product.stock} {product.unit} • Kat: {product.category}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimasi Panen: {cleanHarvestDate(product.harvestDate)}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-3">
                         <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Harga per {product.unit}</p>
                           <p className="text-sm sm:text-base font-black text-slate-800">Rp {product.price.toLocaleString('id-ID')}</p>
                         </div>
                         <div className="flex items-center gap-2">
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProduct(product);
                              }}
                              className="p-2.5 bg-slate-50 hover:bg-brand-50 text-slate-400 hover:text-brand-600 rounded-lg transition-all cursor-pointer border-0"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setProductToDelete(product);
                              }}
                              className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all cursor-pointer border-0"
                            >
                              <Trash2 size={14} />
                            </button>
                         </div>
                      </div>
                   </div>
                </motion.div>
              );
            }

            return (
              <motion.div 
                layout
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('button')) return;
                  setSelectedProductForDetail(product);
                }}
                className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden group hover:border-brand-200 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-28 sm:h-44 w-full overflow-hidden bg-slate-50">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1 sm:gap-1.5 flex-wrap">
                     {product.isPreOrder && (
                       <span className="bg-brand-600/90 backdrop-blur-md text-white px-2 py-0.5 sm:py-1 rounded-full text-[6px] sm:text-[8px] font-black uppercase tracking-widest shadow-sm">Pre-Order</span>
                     )}
                     <span className="bg-white/90 backdrop-blur-md text-slate-800 px-2 py-0.5 sm:py-1 rounded-full text-[6px] sm:text-[8px] font-black uppercase tracking-widest shadow-sm">{product.category}</span>
                  </div>
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-1 sm:gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProduct(product);
                      }}
                      className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-brand-600 hover:scale-110 transition-all cursor-pointer border-0"
                     >
                       <Edit3 size={11} className="sm:w-3.5 sm:h-3.5" />
                     </button>
                     <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setProductToDelete(product);
                      }}
                      className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:text-red-500 hover:scale-110 transition-all cursor-pointer border-0"
                     >
                       <Trash2 size={11} className="sm:w-3.5 sm:h-3.5" />
                     </button>
                  </div>
                </div>
                <div className="p-3 sm:p-5">
                  <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                     <h3 className="text-xs sm:text-base font-black text-slate-800 leading-tight truncate pr-2 uppercase tracking-tight">{product.name}</h3>
                     <div className="flex items-center gap-1 shrink-0">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] sm:text-xs font-bold text-slate-700">{product.rating}</span>
                     </div>
                  </div>
                  <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 leading-none">Stok: {product.stock} {product.unit}</p>
                  <p className="text-[7px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-3 truncate leading-none">Panen: {cleanHarvestDate(product.harvestDate)}</p>
                  <div className="flex items-center justify-between pt-2 sm:pt-4 border-t border-slate-50">
                     <div>
                       <p className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Harga / {product.unit}</p>
                       <p className="text-xs sm:text-base font-black text-slate-800">Rp {product.price.toLocaleString('id-ID')}</p>
                     </div>
                     <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProduct(product);
                      }}
                      className="p-1.5 sm:p-3 bg-slate-50 text-slate-400 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-all group/btn cursor-pointer border-0 shrink-0"
                     >
                       <Package size={12} className="sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
                     </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
  
          {/* Empty State / Add New Card */}
          <div 
            onClick={() => setIsAddingMode(true)}
            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center p-8 gap-3 cursor-pointer hover:border-brand-200 hover:bg-brand-50/5 transition-all group min-h-[268px]"
          >
             <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-brand-600 group-hover:scale-110 transition-all group-hover:shadow-md group-hover:shadow-brand-500/5">
                <Plus size={28} />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-brand-600 mt-1">Tambah Produk</p>
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

      {/* Premium Tailwind Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setProductToDelete(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 border border-slate-100 overflow-hidden text-center z-10"
          >
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
               <Trash2 size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Hapus Produk</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 px-4">
              Apakah Anda yakin ingin menghapus produk <span className="font-bold text-slate-800">"{productToDelete.name}"</span> secara permanen? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-4">
               <button 
                 onClick={() => setProductToDelete(null)}
                 disabled={isDeleting}
                 className="flex-1 border border-slate-200 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
               >
                 Batal
               </button>
               <button 
                 onClick={confirmDelete}
                 disabled={isDeleting}
                 className="flex-1 bg-red-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-650 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 {isDeleting ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : 'Ya, Hapus'}
               </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#1a4d2e] text-white px-6 py-4 rounded-2xl shadow-xl shadow-brand-950/20 border border-emerald-800 flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider">Berhasil</p>
            <p className="text-[11px] text-slate-100 font-medium">{successToast}</p>
          </div>
        </div>
      )}
    </div>
  );
}
