import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  ArrowRight, 
  Star, 
  MapPin, 
  Calendar, 
  LayoutGrid, 
  List, 
  MessageSquare, 
  Truck, 
  Bot, 
  Package,
  ShieldCheck,
  Percent,
  Clock,
  CheckCircle2,
  Users,
  Smartphone,
  Sprout
} from 'lucide-react';
import ProductCard from '../components/UI/ProductCard';
import { MOCK_PRODUCTS, CATEGORIES } from '../constants';

interface BuyerDashboardProps {
  onProductSelect: (product: any) => void;
  onCategorySelect: (category: string) => void;
  onTrackingSelect: () => void;
  onMenuSelect: (item: string) => void;
}

export default function BuyerDashboard({ onProductSelect, onCategorySelect, onTrackingSelect, onMenuSelect }: BuyerDashboardProps) {
  const popularCategories = [
    { name: 'Sayuran', icon: '🥬' },
    { name: 'Buah', icon: '🍎' },
    { name: 'Beras & Biji', icon: '🌾' },
    { name: 'Umbi & Rimpang', icon: '🍠' },
    { name: 'Rempah', icon: '🌶️' },
    { name: 'Olahan Desa', icon: '🍯' },
    { name: 'Produk Organik', icon: '🌿' },
    { name: 'Minuman', icon: '🧃' },
  ];

  const bestSellers = [
    { name: 'Kentang Granola', price: 12000, unit: 'kg', rating: 4.8, reviews: 86, img: 'https://images.unsplash.com/photo-1518977676601-b53f02bad675?q=80&w=200&auto=format&fit=crop' },
    { name: 'Bayam Organik', price: 8000, unit: 'ikat', rating: 4.9, reviews: 123, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=200&auto=format&fit=crop' },
    { name: 'Melon Premium', price: 25000, unit: 'kg', rating: 4.8, reviews: 74, img: 'https://images.unsplash.com/photo-1571575173749-bef820af310d?q=80&w=200&auto=format&fit=crop' },
    { name: 'Telur Ayam Kampung', price: 32000, unit: 'kg', rating: 4.9, reviews: 109, img: 'https://images.unsplash.com/photo-1582722872445-44c501f3c834?q=80&w=200&auto=format&fit=crop' },
  ];

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-6 pb-20 space-y-12">
        
        {/* Banner Hero Section */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 relative min-h-[400px] sm:h-[480px] rounded-[32px] sm:rounded-[40px] overflow-hidden group shadow-2xl shadow-brand-900/10">
            <img 
              src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2000&auto=format&fit=crop" 
              alt="PanganDesa Hero"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-r from-brand-900/60 via-brand-900/30 to-transparent p-6 sm:p-14 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-xl"
              >
                <h1 className="text-3xl sm:text-5xl font-black text-white leading-[1.1] mb-4 font-display">
                  Pangan Segar Langsung <br className="hidden sm:block" /> dari Desa ke Rumah Anda
                </h1>
                <p className="text-xs sm:text-base text-brand-50 mb-6 sm:mb-8 leading-relaxed font-medium opacity-90 max-w-sm">
                  Pre-order hari ini, panen khusus untuk Anda. Lebih segar, lebih hemat, petani lebih sejahtera.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <button className="bg-brand-900 text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-brand-800 transition-all shadow-xl active:scale-95">
                    Belanja Sekarang
                  </button>
                  <button className="bg-white/90 backdrop-blur text-brand-900 px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-white transition-all shadow-xl active:scale-95 border border-white/20">
                    Cara Pre-Order
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-50 border border-brand-100 rounded-[32px] sm:rounded-[40px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden h-auto py-12 lg:h-[480px]">
             <div className="relative z-10 w-full">
                <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-600/20">
                   <Bot size={42} className="text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-800 font-display mb-2 uppercase tracking-tight">AI Assistant</h3>
                <div className="space-y-4 mb-8">
                   <p className="text-[15px] font-bold text-slate-700 italic leading-snug">"Halo Andi! 👋 Saya siap membantu rekomendasi produk terbaik untuk Anda."</p>
                </div>
                <button className="w-full bg-white border-2 border-brand-100 text-brand-600 py-4 rounded-2xl font-black text-sm hover:bg-brand-50 transition-all shadow-sm">
                   Mulai Chat
                </button>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-100 rounded-full -ml-16 -mb-16 blur-2xl opacity-50" />
          </div>
        </section>

        {/* Feature Service Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
           {[
             { label: 'Langsung dari Petani', desc: 'Tanpa perantara', icon: <Sprout className="text-brand-600" /> },
             { label: 'Pre-Order Lebih Hemat', desc: 'Harga stabil & transparan', icon: <Percent className="text-brand-600" /> },
             { label: 'Kualitas Terjamin', desc: 'Panen segar pilihan', icon: <CheckCircle2 className="text-brand-600" /> },
             { label: 'Lacak Asal Produk', desc: 'Dari desa ke rumah Anda', icon: <MapPin className="text-brand-600" /> },
             { label: 'Pembayaran Aman', desc: 'Escrow & garansi dana', icon: <ShieldCheck className="text-brand-600" /> }
           ].map((f, i) => (
             <div key={i} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100/50">
                <div className="w-10 h-10 shrink-0 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                   {f.icon}
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{f.label}</p>
                   <p className="text-[9px] text-slate-500 font-medium leading-none">{f.desc}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800 font-display uppercase tracking-tight">Kategori Populer</h2>
            <button 
              onClick={() => onMenuSelect('kategori')}
              className="text-brand-600 font-black text-[10px] uppercase tracking-widest hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6">
            {popularCategories.map((cat, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center gap-3 group cursor-pointer"
                onClick={() => onCategorySelect(cat.name)}
              >
                <div className="w-full aspect-square bg-white rounded-[32px] border border-slate-100 shadow-xs flex items-center justify-center text-3xl sm:text-4xl group-hover:bg-brand-50 group-hover:border-brand-200 transition-all duration-300">
                  {cat.icon}
                </div>
                <span className="font-bold text-slate-600 uppercase tracking-tight text-[10px] group-hover:text-brand-600 transition-colors text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pre-Order Selection Section */}
        <section>
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-800 font-display uppercase tracking-tight">Pre-Order Pilihan</h2>
              <button 
                onClick={() => onMenuSelect('preorder')}
                className="text-brand-600 font-black text-[10px] uppercase tracking-widest hover:underline"
              >
                Lihat Semua
              </button>
           </div>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
             {MOCK_PRODUCTS.map((p) => (
               <ProductCard key={p.id} product={p} onPreview={onProductSelect} />
             ))}
           </div>
        </section>

        {/* Best Sellers Section */}
        <section>
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-800 font-display uppercase tracking-tight">Produk Terlaris</h2>
              <button 
                onClick={() => onMenuSelect('produk')}
                className="text-brand-600 font-black text-[10px] uppercase tracking-widest hover:underline"
              >
                Lihat Semua
              </button>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {MOCK_PRODUCTS.slice(0, 4).map((p, i) => (
                <div 
                  key={i} 
                  onClick={() => onProductSelect(p)}
                  className="bg-white rounded-[24px] sm:rounded-[32px] p-3 sm:p-4 flex items-center gap-3 sm:gap-4 border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                >
                   <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-50">
                      <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-[11px] sm:text-sm mb-0.5 group-hover:text-brand-600 transition-colors line-clamp-1">{p.name}</h4>
                      <p className="text-xs sm:text-base font-black text-brand-600 mb-0.5 whitespace-nowrap">{formatter.format(p.price)}<span className="text-[9px] text-slate-400 font-medium lowercase">/{p.unit}</span></p>
                      <div className="flex items-center gap-1">
                         <Star size={10} className="text-yellow-400 fill-yellow-400" />
                         <span className="text-[9px] font-bold text-slate-700">{p.rating}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* How it Works Section */}
        <section>
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-800 font-display uppercase tracking-tight">Cara Kerja Pre-Order</h2>
           </div>
           <div className="bg-slate-50/50 rounded-[48px] p-8 sm:p-12 border border-slate-100/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { step: 1, title: 'Pilih Produk', desc: 'Pilih produk & petani favorit Anda', icon: <LayoutGrid className="text-brand-600" /> },
                { step: 2, title: 'Pre-Order', desc: 'Pesan sebelum panen dengan harga terbaik', icon: <Calendar className="text-brand-600" /> },
                { step: 3, title: 'Panen & Kirim', desc: 'Petani panen khusus untuk pesanan Anda', icon: <Package className="text-brand-600" /> },
                { step: 4, title: 'Diterima', desc: 'Produk segar sampai ke rumah Anda', icon: <Smartphone className="text-brand-600" /> }
              ].map((s, i) => (
                <div key={i} className="flex gap-6 items-start">
                   <div className="text-center relative">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center relative z-10 transition-transform hover:scale-110">
                        {s.icon}
                      </div>
                      <div className="absolute -top-3 -left-3 w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center text-[10px] font-black z-20 border-4 border-white">
                         {s.step}
                      </div>
                   </div>
                   <div>
                      <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm mb-1">{s.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
}


