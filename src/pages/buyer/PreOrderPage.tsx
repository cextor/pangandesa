import React from 'react';
import ProductCard from '../../components/UI/ProductCard';
import { ProductService } from '../../services/ProductService';
import { Calendar, Info, Clock, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';

interface PreOrderPageProps {
  onProductSelect: (product: Product) => void;
}

export default function PreOrderPage({ onProductSelect }: PreOrderPageProps) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    ProductService.getAllProducts().then((data) => {
      const preOrders = (data || []).filter(p => p.isPreOrder);
      setProducts(preOrders);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-8 lg:p-12">
        <div className="mb-8 sm:mb-16">
          <div className="flex items-center gap-3 bg-brand-50 text-brand-600 px-3 py-1.5 rounded-full w-fit mb-4 sm:mb-8 border border-brand-100">
             <Clock size={14} className="animate-pulse sm:w-4 sm:h-4" />
             <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Sistem Pre-Order Panen Desa</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-800 font-display mb-4 italic leading-none uppercase tracking-tight">Pesan Sebelum Panen</h1>
          <p className="text-xs sm:text-base lg:text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
             Dukung petani dengan kepastian pasar. Pesanan Anda akan dipanen saat tingkat kematangan optimal dan dikirim langsung dalam 24 jam.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
           <div className="order-2 lg:order-1 lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
              {loading ? (
                 [1, 2, 3].map((i) => (
                   <div key={i} className="bg-white rounded-[24px] sm:rounded-[32px] p-4 border border-slate-100 animate-pulse space-y-4">
                      <div className="aspect-square bg-slate-100 rounded-2xl w-full" />
                      <div className="h-4 bg-slate-100 rounded-md w-2/3" />
                      <div className="h-6 bg-slate-100 rounded-md w-1/3" />
                   </div>
                 ))
              ) : products.length > 0 ? (
                 products.map((product) => (
                   <ProductCard key={product.id} product={product} onPreview={onProductSelect} />
                 ))
              ) : (
                 <div className="col-span-full bg-white rounded-3xl p-10 text-center border border-slate-100">
                    <p className="text-slate-400 font-bold uppercase">Belum ada pre-order tersedia</p>
                 </div>
              )}
           </div>
           
           <div className="order-1 lg:order-2 lg:col-span-4 space-y-6 sm:space-y-10">
              <div className="bg-slate-900 rounded-[28px] sm:rounded-[48px] p-6 sm:p-10 text-white relative overflow-hidden">
                 <h3 className="text-lg sm:text-2xl font-black mb-6 sm:mb-10 font-display uppercase tracking-tight">Cara Kerja 🚜</h3>
                 <div className="space-y-6 sm:space-y-10">
                    {[
                      { step: '1', title: 'Pilih Produk', desc: 'Pilih hasil tani yang sedang masa tanam.' },
                      { step: '2', title: 'Pre-Order', desc: 'Lakukan pembayaran aman via Escrow.' },
                      { step: '3', title: 'Update Panen', desc: 'Terima notifikasi foto saat produk dipanen.' },
                      { step: '4', title: 'Pengiriman', desc: 'Produk sampai dalam kondisi paling segar.' }
                    ].map((s, i) => (
                      <div key={i} className="flex gap-4 sm:gap-6">
                        <span className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-600 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 border border-brand-500/30">{s.step}</span>
                        <div>
                           <p className="text-xs sm:text-sm font-black text-white uppercase tracking-widest mb-1">{s.title}</p>
                           <p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-brand-50 rounded-[28px] sm:rounded-[48px] p-6 sm:p-10 border border-brand-100">
                 <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center text-brand-600 mb-6 shadow-sm border border-brand-100">
                    <Info size={24} className="sm:w-8 sm:h-8" />
                 </div>
                 <h3 className="text-base sm:text-xl font-black text-slate-800 mb-3 sm:mb-4 uppercase tracking-tight">Kenapa Pre-Order?</h3>
                 <p className="text-[10px] sm:text-sm text-slate-600 font-medium leading-relaxed mb-6 sm:mb-10">
                    Petani bisa meminimalisir food waste hingga 40% dan Anda mendapatkan harga 20-30% lebih murah dibanding harga pasar.
                 </p>
                 <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2.5 text-brand-600 font-black text-[9px] sm:text-[11px] uppercase tracking-widest">
                       <CheckCircle2 size={14} className="shrink-0" /> Garansi Segar 100%
                    </div>
                    <div className="flex items-center gap-2.5 text-brand-600 font-black text-[9px] sm:text-[11px] uppercase tracking-widest">
                       <CheckCircle2 size={14} className="shrink-0" /> Tanpa Minimal Order
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
