import React from 'react';
import { motion } from 'motion/react';
import { 
  Sprout, 
  Leaf, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Package, 
  PackageCheck, 
  Box,
  Zap, 
  Info,
  Clock
} from 'lucide-react';

export default function HarvestProduction() {
  const readyProducts = [
    { 
      id: 1, 
      name: 'Cabai Merah Keriting', 
      status: 'READY', 
      estimatedAmount: '800 kg', 
      quality: 'Premium Grade A',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=600'
    },
    { 
      id: 2, 
      name: 'Tomat Beef', 
      status: 'HARVESTED', 
      estimatedAmount: '450 kg', 
      quality: 'Standard',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600'
    },
  ];

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-10 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <Sprout className="text-emerald-600" size={32} />
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">Panen & Produksi</h1>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed max-w-lg">
                Kelola hasil panen yang siap didistribusikan. Pastikan kualitas produk terjaga sebelum masuk gudang pengiriman.
              </p>
           </div>
           
           <div className="flex gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <PackageCheck size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Siap Panen</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">1.2 <span className="text-xs uppercase">Ton</span></p>
                 </div>
              </div>
           </div>
        </div>

        {/* Focus Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {readyProducts.map((p) => (
             <div key={p.id} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row">
                <div className="md:w-48 h-48 md:h-auto shrink-0 relative overflow-hidden">
                   <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                   <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${
                        p.status === 'READY' ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}>
                         {p.status === 'READY' ? 'Menunggu Panen' : 'Sudah Panen'}
                      </span>
                   </div>
                </div>
                
                <div className="flex-1 p-8 flex flex-col justify-between">
                   <div className="space-y-4">
                      <div>
                         <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-1">{p.name}</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Leaf size={14} className="text-emerald-500" /> Kualitas: {p.quality}
                         </p>
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Box className="text-slate-300" size={18} />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estimasi Berat</span>
                         </div>
                         <span className="text-sm font-black text-slate-800">{p.estimatedAmount}</span>
                      </div>
                   </div>
                   
                   <button className="w-full mt-6 bg-brand-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-brand-900/10 hover:bg-black transition-all">
                      Konfirmasi Panen Selesai <ArrowRight size={16} />
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Production Calendar/Overview */}
        <div className="bg-emerald-900 rounded-[40px] p-12 text-white relative overflow-hidden">
           <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                 <h2 className="text-3xl font-black uppercase tracking-tight">Timeline Produksi AI</h2>
                 <p className="text-emerald-100/70 font-medium leading-relaxed">
                    Sistem visi komputer kami memprediksi puncak kematangan lahan blok Utara dalam 3 hari lagi. Pastikan logistik siap untuk pengiriman ke Jakarta.
                 </p>
                 <div className="flex gap-4">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex-1">
                       <Clock className="text-emerald-300 mb-2" size={20} />
                       <p className="text-[10px] font-black uppercase mb-1">Peak Time</p>
                       <p className="text-lg font-black">15 Mei</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex-1">
                       <Zap className="text-emerald-300 mb-2" size={20} />
                       <p className="text-[10px] font-black uppercase mb-1">Health Index</p>
                       <p className="text-lg font-black">94/100</p>
                    </div>
                 </div>
              </div>
              
              <div className="flex-1 bg-white/5 backdrop-blur-3xl rounded-[32px] p-8 border border-white/10 w-full">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-emerald-400">Log Aktivitas Terakhir</h4>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-2 h-2 bg-emerald-400 rounded-full mt-1 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                       <div>
                          <p className="text-xs font-bold leading-none">Penyemprotan Nutrisi Organik Lahan A</p>
                          <p className="text-[10px] text-emerald-300/50 mt-1 uppercase font-black">Selesai • 2 Jam yang lalu</p>
                       </div>
                    </div>
                    <div className="flex gap-4 opacity-50">
                       <div className="w-2 h-2 bg-white rounded-full mt-1 shrink-0" />
                       <div>
                          <p className="text-xs font-bold leading-none">Pengecekan Kelembaban Tanah AI</p>
                          <p className="text-[10px] text-emerald-300/50 mt-1 uppercase font-black">Selesai • 5 Jam yang lalu</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="absolute top-0 left-0 w-full h-full">
             <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-emerald-500/10 rounded-full blur-[120px]" />
             <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-emerald-500/20 rounded-full blur-[120px]" />
           </div>
        </div>
      </div>
    </div>
  );
}
