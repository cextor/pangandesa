import React from 'react';
import ProductCard from '../../components/UI/ProductCard';
import { MOCK_PRODUCTS } from '../../constants';
import { Calendar, Info, Clock, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';

interface PreOrderPageProps {
  onProductSelect: (product: Product) => void;
}

export default function PreOrderPage({ onProductSelect }: PreOrderPageProps) {
  // All our mock products are currently set up as pre-order candidates
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-8 lg:p-12">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 bg-brand-50 text-brand-600 px-4 py-1.5 rounded-full w-fit mb-4 sm:mb-6 border border-brand-100">
             <Clock size={16} className="animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">Sistem Pre-Order Panen Desa</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 font-display mb-4 italic leading-tight">Pesan Sebelum Panen</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
             Dukung petani dengan kepastian pasar. Pesanan Anda akan dipanen saat tingkat kematangan optimal dan dikirim langsung dalam 24 jam setelah harvest.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
           <div className="order-2 lg:order-1 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} onPreview={onProductSelect} />
              ))}
           </div>
           
           <div className="order-1 lg:order-2 lg:col-span-3 space-y-6 sm:space-y-8">
              <div className="bg-slate-900 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 text-white relative overflow-hidden">
                 <h3 className="text-lg sm:text-xl font-black mb-4 font-display">Cara Kerja 🚜</h3>
                 <div className="space-y-4 sm:space-y-6">
                    {[
                      { step: '1', title: 'Pilih Produk', desc: 'Pilih hasil tani yang sedang masa tanam.' },
                      { step: '2', title: 'Pre-Order', desc: 'Lakukan pembayaran aman via Escrow.' },
                      { step: '3', title: 'Update Panen', desc: 'Terima notifikasi foto saat produk dipanen.' },
                      { step: '4', title: 'Pengiriman', desc: 'Produk sampai di rumah dalam kondisi paling segar.' }
                    ].map((s, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="w-6 h-6 bg-brand-500 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">{s.step}</span>
                        <div>
                           <p className="text-xs font-bold text-white uppercase tracking-tight">{s.title}</p>
                           <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-brand-50 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 border border-brand-100">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 mb-4 sm:mb-6 shadow-sm">
                    <Info size={24} />
                 </div>
                 <h3 className="font-bold text-slate-800 mb-2 italic">Kenapa Pre-Order?</h3>
                 <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-loose mb-6">
                    Dengan pre-order, petani bisa meminimalisir food waste hingga 40% dan Anda mendapatkan harga 20-30% lebih murah dibanding harga pasar.
                 </p>
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-[9px] sm:text-[10px] uppercase">
                       <CheckCircle2 size={12} /> Garansi Segar 100%
                    </div>
                    <div className="flex items-center gap-2 text-brand-600 font-bold text-[9px] sm:text-[10px] uppercase">
                       <CheckCircle2 size={12} /> Tanpa Minimal Order
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
