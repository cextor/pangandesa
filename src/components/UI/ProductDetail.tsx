import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, Calendar, User, Sprout, ChevronLeft, Minus, Plus, Heart, Share2, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onPreOrder: (product: Product, quantity: number) => void;
}

export default function ProductDetail({ product, onBack, onPreOrder }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  const thumbnails = [
    product.image,
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=200&auto=format&fit=crop"
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
      <div className="max-w-6xl mx-auto p-8">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold text-sm mb-8 transition-colors group"
        >
          <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-brand-50 transition-colors">
            <ChevronLeft size={18} />
          </div>
          Kembali ke Beranda
        </button>

        <div className="grid grid-cols-2 gap-16">
          {/* Left Column: Images */}
          <div className="space-y-6">
            <div className="aspect-square rounded-[40px] overflow-hidden border border-slate-100 shadow-sm relative group">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                src={activeImage} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl text-slate-400 hover:text-red-500 shadow-xl transition-all active:scale-90">
                <Heart size={24} />
              </button>
            </div>
            
            <div className="flex gap-4">
              {thumbnails.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`flex-1 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-500 ring-4 ring-brand-100' : 'border-slate-100 hover:border-brand-200'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-brand-100">
                  Pre-Order Tersedia
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100 italic">
                  Bersertifikat Organik
                </div>
              </div>
              <h1 className="text-5xl font-black text-slate-800 font-display mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-brand-500" />
                    <span className="text-sm font-bold text-slate-600">{product.village}</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                    <span className="text-sm font-medium text-slate-400">({product.reviewCount} ulasan)</span>
                 </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-200/60 mb-8">
               <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-extrabold text-brand-600">{formatter.format(product.price)}</span>
                  <span className="text-lg font-bold text-slate-400">/{product.unit}</span>
               </div>
               
               <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
                 Tomat segar berkualitas tinggi, dipanen saat matang sempurna langsung dari kebun petani mitra di {product.village}. Cocok untuk berbagai masakan sehat keluarga.
               </p>

               <div className="grid grid-cols-2 gap-4 mb-8">
                 {[
                   { label: 'Panen', val: product.harvestDate, icon: <Calendar size={14} /> },
                   { label: 'Asal', val: product.village.split(',')[0], icon: <MapPin size={14} /> },
                   { label: 'Petani', val: product.farmer, icon: <User size={14} /> },
                   { label: 'Metode Tanam', val: 'Organik', icon: <Sprout size={14} /> }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-brand-500">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                        <p className="text-xs font-bold text-slate-700">{item.val}</p>
                      </div>
                   </div>
                 ))}
               </div>

               <div className="flex gap-4">
                  <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <Minus size={20} />
                    </button>
                    <div className="w-16 text-center">
                       <span className="text-lg font-black text-slate-800">{quantity}</span>
                       <span className="text-xs font-bold text-slate-400 ml-1">{product.unit}</span>
                    </div>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <button 
                    onClick={() => onPreOrder(product, quantity)}
                    className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-brand-500/30 transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingCart size={20} />
                    Pre-Order Sekarang
                  </button>
               </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
               <button className="flex items-center gap-2 hover:text-brand-600 transition-colors">
                  <Share2 size={18} />
                  Bagikan
               </button>
               <span className="border-l border-slate-200 h-4" />
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Stok: {product.stock} {product.unit} Tersedia
               </div>
            </div>
          </div>
        </div>

        {/* Deep Details Section */}
        <section className="mt-20 border-t border-slate-100 pt-16 grid grid-cols-3 gap-16">
          <div className="col-span-2 space-y-12">
            <div>
              <h3 className="text-2xl font-black text-slate-800 mb-6 font-display">Deskripsi Lengkap</h3>
              <div className="prose prose-slate max-w-none text-slate-500 font-medium leading-loose">
                <p>
                  {product.description} Kami menjamin kesegaran produk karena sistem pre-order memungkinkan petani memanen produk sesaat sebelum proses pengiriman dilakukan. 
                </p>
                <p className="mt-4">
                  Visi PanganDesa adalah memutus rantai distribusi yang terlalu panjang agar keuntungan maksimal kembali ke petani, dan konsumen mendapatkan harga terbaik dengan kualitas premium.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-800 font-display">Ulasan Pembeli</h3>
                <div className="flex items-center gap-3 bg-brand-50 px-4 py-2 rounded-xl text-brand-600 font-bold">
                   <Star size={20} fill="currentColor" />
                   <span>{product.rating} / 5.0</span>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { name: 'Andi Wijaya', date: '2 Mei 2024', comment: 'Luar biasa segarnya! Panennya beneran pas. Tomatnya manis dan padat. Recomended!', rating: 5 },
                  { name: 'Siti Aminah', date: '5 Mei 2024', comment: 'Sangat praktis bisa pre-order sebelum panen. Gak pusing lagi nyari sayur fresh.', rating: 4.8 }
                ].map((review, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex gap-6">
                    <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 font-bold text-xl overflow-hidden shrink-0 border-4 border-white shadow-sm">
                       <User size={32} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-800">{review.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400 mb-3">
                         {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < Math.floor(review.rating) ? "currentColor" : "none"} />)}
                      </div>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
               <h4 className="text-lg font-black mb-4 font-display">Jaminan Kesegaran ❄️</h4>
               <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">
                 Semua produk dipanen maksimal 24 jam sebelum sampai di tangan Anda. Kami menggunakan cold storage portabel selama perjalanan.
               </p>
               <div className="flex items-center gap-3 text-brand-400 font-bold text-xs uppercase tracking-widest">
                  <div className="w-8 h-8 rounded-lg bg-brand-900/50 flex items-center justify-center">🤝</div>
                  <span>100% Refund Jika Tidak Segar</span>
               </div>
            </div>

            <div className="bg-brand-50 rounded-[32px] p-8 border border-brand-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-brand-500 mb-6 border border-brand-50">
                 <MapPin size={32} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Traceability Insight</h4>
              <p className="text-xs text-slate-500 font-medium mb-6">Lacak produk ini sampai ke petak lahan desa {product.village}.</p>
              <button className="w-full bg-white text-brand-600 py-3 rounded-xl text-xs font-bold border border-brand-200 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all">
                Cek Jejak Panen
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
