import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, Calendar, User, Sprout, ChevronLeft, Minus, Plus, Heart, Share2, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { parseHarvestSchedules, ensureDayMonthYear } from '../../utils/harvestHelper';

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

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onPreOrder: (product: Product, quantity: number, selectedHarvestDate?: string) => void;
}

export default function ProductDetail({ product, onBack, onPreOrder }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);

  React.useEffect(() => {
    setActiveImage(product.image);
  }, [product.image]);

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  const thumbnails = product.images && product.images.length > 0
    ? product.images.map(img => img.imagePath)
    : [product.image].filter(Boolean);

  // Parse active pre-order schedules
  const allSchedules = parseHarvestSchedules(product.harvestDate, product.stock, product.price, product.isPreOrder);
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const schedules = allSchedules.filter(s => s.status === 'READY' && s.isPreOrder && s.stock > 0 && s.date >= todayStr);

  // Auto-select schedule matching selectedHarvestDate if passed from the card
  const matchedSchedule = (product as any).selectedHarvestDate 
    ? (schedules.find(s => s.date === (product as any).selectedHarvestDate) || schedules[0] || null)
    : (schedules[0] || null);

  const [selectedSchedule, setSelectedSchedule] = useState<any>(matchedSchedule);

  const activePrice = selectedSchedule ? selectedSchedule.price : product.price;
  const activeStock = selectedSchedule ? selectedSchedule.stock : product.stock;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
      <div className="max-w-6xl mx-auto p-4 sm:p-8 pt-6 sm:pt-10">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold text-xs sm:text-sm mb-6 sm:mb-10 transition-colors group"
        >
          <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-brand-50 transition-colors">
            <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
          </div>
          Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column: Images */}
          <div className="space-y-4 sm:space-y-6">
            <div className="aspect-square rounded-[24px] sm:rounded-[40px] overflow-hidden border border-slate-100 shadow-sm relative group bg-slate-50 flex items-center justify-center">
              {activeImage ? (
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={activeImage} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-6">
                   <div className="w-16 h-16 rounded-3xl bg-slate-100/60 flex items-center justify-center text-slate-300 mb-2 text-2xl">🌾</div>
                   <span className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-widest text-center">Belum Ada Foto Produk</span>
                </div>
              )}
              <button className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 sm:p-4 bg-white/90 backdrop-blur-md rounded-2xl text-slate-400 hover:text-red-500 shadow-xl transition-all active:scale-90">
                <Heart size={18} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            
            {product.image && (
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {thumbnails.filter(Boolean).map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`shrink-0 w-16 h-16 sm:w-auto sm:flex-1 aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-500 ring-2 sm:ring-4 ring-brand-100' : 'border-slate-100 hover:border-brand-200'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="flex flex-col">
            <div className="mb-6 sm:mb-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-brand-50 text-brand-600 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-100">
                  Pre-Order Tersedia
                </span>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-500 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100 italic">
                  Bersertifikat Organik
                </div>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-800 font-display mb-3 sm:mb-4 leading-tight uppercase tracking-tight">{product.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                 <div className="flex items-center gap-1.5 self-start">
                    <Star size={14} className="text-yellow-400 fill-yellow-400 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{product.rating}</span>
                    <span className="text-[10px] sm:text-sm font-medium text-slate-400">({product.reviewCount} ulasan)</span>
                 </div>
              </div>
            </div>

            <div className="bg-slate-50/50 rounded-[28px] sm:rounded-[32px] p-5 sm:p-10 border border-slate-200/60 mb-6 sm:mb-10">
               <div className="flex items-baseline gap-2 mb-4 sm:mb-8 border-b border-slate-200/50 pb-4 sm:pb-6">
                  <span className="text-2xl sm:text-4xl font-black text-brand-600">{formatter.format(activePrice)}</span>
                  <span className="text-xs sm:text-lg font-bold text-slate-400">/{product.unit}</span>
               </div>
               
               <p className="text-slate-500 text-xs sm:text-sm lg:text-base leading-relaxed font-medium mb-6 sm:mb-8">
                  Dapatkan komoditas segar berkualitas premium langsung dari kelompok tani lokal PanganDesa. Dijamin dipanen segar sesuai jadwal panen pilihan Anda.
               </p>

               {/* Harvest Date Picker Selector */}
               {schedules.length > 0 && (
                 <div className="mb-6 sm:mb-8 space-y-3">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Pilih Jadwal Panen</span>
                   <div className="flex flex-wrap gap-2.5">
                     {schedules.map((sch, i) => (
                       <button
                         key={i}
                         type="button"
                         onClick={() => setSelectedSchedule(sch)}
                         className={`py-2 px-3 rounded-xl font-bold text-xs transition-all border text-left cursor-pointer flex flex-col ${
                           selectedSchedule?.date === sch.date
                             ? 'bg-brand-50 text-brand-700 border-brand-300 ring-2 ring-brand-100 shadow-sm'
                             : 'bg-white text-slate-600 border-slate-200 hover:border-brand-200'
                         }`}
                       >
                         <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 leading-none">Siklus Panen:</span>
                         <span className="font-extrabold text-xs mt-0.5">{ensureDayMonthYear(sch.date)}</span>
                         <span className="text-[9px] font-bold text-slate-500 mt-1">
                           Stok: {sch.stock} {product.unit} • {formatter.format(sch.price)}
                         </span>
                       </button>
                     ))}
                   </div>
                 </div>
               )}
 
               <div className="grid grid-cols-2 gap-2.5 sm:gap-5 mb-6 sm:mb-10">
                 {[
                   { label: 'Panen Pilihan', val: selectedSchedule ? ensureDayMonthYear(selectedSchedule.date) : cleanHarvestDate(product.harvestDate), icon: <Calendar size={13} /> },
                   { label: 'Petani', val: product.farmer, icon: <User size={13} /> },
                   { label: 'Metode', val: 'Organik', icon: <Sprout size={13} /> }
                 ].map((item, i) => (
                    <div key={i} className="flex gap-2.5 sm:gap-4 bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 shadow-xs min-w-0">
                       <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-50 flex items-center justify-center text-brand-500 shrink-0">
                         {React.cloneElement(item.icon as React.ReactElement<any>, { size: 14 })}
                       </div>
                       <div className="min-w-0">
                          <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                          <p className="text-[10px] sm:text-xs font-black text-slate-700 truncate">{item.val}</p>
                       </div>
                    </div>
                 ))}
               </div>
 
               <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-1 shadow-xs shrink-0">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 sm:p-3 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-lg sm:rounded-xl transition-all"
                    >
                      <Minus size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <div className="px-3 sm:px-5 text-center min-w-[50px] sm:min-w-[70px]">
                       <span className="text-base sm:text-xl font-black text-slate-800">{quantity}</span>
                       <span className="text-[10px] sm:text-xs font-bold text-slate-400 ml-1">{product.unit}</span>
                    </div>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 sm:p-3 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-lg sm:rounded-xl transition-all"
                    >
                      <Plus size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  <button 
                    onClick={() => onPreOrder(
                      {
                        ...product,
                        price: activePrice,
                        stock: activeStock
                      },
                      quantity,
                      selectedSchedule?.date
                    )}
                    disabled={activeStock <= 0}
                    className={`flex-1 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-base lg:text-lg shadow-xl transition-all flex items-center justify-center gap-2 sm:gap-3 uppercase tracking-tight border-0 ${
                      activeStock <= 0
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20'
                    }`}
                  >
                    <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                    {activeStock <= 0 ? 'Stok Panen Habis' : 'Pre-Order Sekarang'}
                  </button>
               </div>
            </div>
 
            <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] sm:text-sm">
               <button className="flex items-center gap-1.5 hover:text-brand-600 transition-colors bg-transparent border-0 cursor-pointer">
                  <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Bagikan
               </button>
               <span className="border-l border-slate-200 h-3 sm:h-4" />
               <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${activeStock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="truncate">Stok Panen: {activeStock} {product.unit}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Deep Details Section */}
        <section className="mt-12 sm:mt-20 border-t border-slate-100 pt-12 sm:pt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16">
          <div className="lg:col-span-2 space-y-10 sm:space-y-12">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-4 sm:mb-6 font-display">Deskripsi Lengkap</h3>
              <div className="prose prose-slate max-w-none text-slate-500 font-medium leading-loose text-sm sm:text-base">
                <p>
                  {product.description} Kami menjamin kesegaran produk karena sistem pre-order memungkinkan petani memanen produk sesaat sebelum proses pengiriman dilakukan. 
                </p>
                <p className="mt-4">
                  Visi PanganDesa adalah memutus rantai distribusi yang terlalu panjang agar keuntungan maksimal kembali ke petani, dan konsumen mendapatkan harga terbaik dengan kualitas premium.
                </p>
              </div>
            </div>

            {/* Daftar Estimasi Siklus Panen */}
            {allSchedules.length > 0 && (
              <div className="bg-slate-50 rounded-[28px] border border-slate-100 p-6 md:p-8 space-y-5 shadow-xs">
                <div className="flex items-center gap-2">
                  <Sprout size={18} className="text-[#1a4d2e]" />
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Daftar Estimasi Siklus Panen</h4>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold text-slate-650 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="pb-3 pl-1">Siklus</th>
                        <th className="pb-3">Tanggal Panen</th>
                        <th className="pb-3 text-right">Stok Estimasi</th>
                        <th className="pb-3 text-right">Harga Unit</th>
                        <th className="pb-3 text-center">Status PO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSchedules.filter(s => s.date >= todayStr).map((sch, i) => (
                        <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-100/50 transition-colors">
                          <td className="py-3.5 pl-1 font-black text-slate-700">#{i + 1}</td>
                          <td className="py-3.5 font-extrabold text-slate-800">{ensureDayMonthYear(sch.date)}</td>
                          <td className="py-3.5 text-right font-bold text-slate-700">{sch.stock} {product.unit}</td>
                          <td className="py-3.5 text-right font-extrabold text-brand-600">{formatter.format(sch.price)}</td>
                          <td className="py-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                              sch.isPreOrder && sch.status === 'READY'
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-slate-100 text-slate-400'
                            }`}>
                              {sch.isPreOrder && sch.status === 'READY' ? 'PO Aktif' : 'PO Nonaktif'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 font-display">Ulasan Pembeli</h3>
                <div className="flex items-center gap-3 bg-brand-50 px-4 py-2 rounded-xl text-brand-600 font-bold self-start sm:self-auto">
                   <Star size={20} fill="currentColor" />
                   <span>{product.rating} / 5.0</span>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {[
                  { name: 'Andi Wijaya', date: '2 Mei 2024', comment: 'Luar biasa segarnya! Panennya beneran pas. Tomatnya manis dan padat. Recomended!', rating: 5 },
                  { name: 'Siti Aminah', date: '5 Mei 2024', comment: 'Sangat praktis bisa pre-order sebelum panen. Gak pusing lagi nyari sayur fresh.', rating: 4.8 }
                ].map((review, i) => (
                  <div key={i} className="bg-slate-50 p-5 sm:p-6 rounded-[28px] sm:rounded-3xl border border-slate-100 flex gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 font-bold text-xl overflow-hidden shrink-0 border-4 border-white shadow-sm">
                       <User size={28} className="sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate">{review.name}</h4>
                        <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400 mb-2 sm:mb-3">
                         {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < Math.floor(review.rating) ? "currentColor" : "none"} />)}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-slate-900 rounded-[32px] p-6 sm:p-8 text-white relative overflow-hidden">
               <h4 className="text-base sm:text-lg font-black mb-3 sm:mb-4 font-display">Jaminan Kesegaran ❄️</h4>
               <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium mb-6">
                 Semua produk dipanen maksimal 24 jam sebelum sampai di tangan Anda. Kami menggunakan cold storage portabel selama perjalanan.
               </p>
               <div className="flex items-center gap-3 text-brand-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                  <div className="w-8 h-8 rounded-lg bg-brand-900/50 flex items-center justify-center shrink-0">🤝</div>
                  <span>100% Refund Jika Tidak Segar</span>
               </div>
            </div>

            <div className="bg-brand-50 rounded-[32px] p-6 sm:p-8 border border-brand-100 flex flex-col items-center text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-brand-500 mb-4 sm:mb-6 border border-brand-50">
                 <MapPin size={28} className="sm:w-8 sm:h-8" />
              </div>
              <h4 className="font-bold text-slate-800 mb-2 text-sm sm:text-base">Traceability Insight</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-6">Lacak produk ini sampai ke petak lahan desa petani mitra.</p>
              <button className="w-full bg-white text-brand-600 py-3 rounded-xl text-xs font-bold border border-brand-200 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all font-display uppercase tracking-widest">
                Cek Jejak Panen
              </button>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
