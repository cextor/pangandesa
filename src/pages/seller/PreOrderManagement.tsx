import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight, 
  Box, 
  ChevronRight,
  TrendingDown,
  Info,
  Clock,
  Zap,
  BarChart3
} from 'lucide-react';

export default function PreOrderManagement() {
  const demands = [
    { id: 1, product: 'Cabai Merah Keriting', demand: 1200, unit: 'kg', trend: '+12%', growth: 'up', potential: 'High' },
    { id: 2, product: 'Tomat Beef', demand: 850, unit: 'kg', trend: '+5%', growth: 'up', potential: 'Medium' },
    { id: 3, product: 'Jagung Manis', demand: 2100, unit: 'kg', trend: '-2%', growth: 'down', potential: 'Stable' },
  ];

  const capacities = [
    { id: 1, product: 'Cabai Merah Keriting', confirmed: 800, target: 1000, color: 'bg-emerald-500' },
    { id: 2, product: 'Jagung Manis', confirmed: 500, target: 2000, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-10 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <Calendar className="text-brand-600" size={32} />
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manajemen Pre-Order</h1>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed max-w-lg">
                Pantau permintaan pasar secara real-time dan konfirmasi kapasitas produksi lahan Anda.
              </p>
           </div>
           
           <div className="bg-brand-900 rounded-[32px] p-8 text-white flex items-center gap-8 shadow-2xl shadow-brand-900/20">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-brand-300 mb-1">Total Demand</span>
                 <span className="text-3xl font-black">4,150 <span className="text-sm font-bold text-brand-300 uppercase">kg</span></span>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-brand-300 mb-1">Potensi Omzet</span>
                 <span className="text-3xl font-black">Rp 122M</span>
              </div>
           </div>
        </div>

        {/* Real-time Demand Analytics */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                 <TrendingUp className="text-emerald-500" /> Demand Real-Time Pasar
              </h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {demands.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                         <BarChart3 size={24} />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                        item.growth === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {item.trend} {item.growth === 'up' ? <ArrowUpRight size={10} /> : <TrendingDown size={10} />}
                      </div>
                   </div>
                   
                   <h3 className="text-sm font-black text-slate-800 mb-1 uppercase tracking-tight">{item.product}</h3>
                   <p className="text-2xl font-black text-slate-900 mb-6">{item.demand.toLocaleString()} <span className="text-xs text-slate-400 uppercase">{item.unit}</span></p>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Akurasi AI: 98%</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight ${
                        item.potential === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>{item.potential} Potential</span>
                   </div>
                   
                   <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-brand-50 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
           </div>
        </section>

        {/* Capacity Confirmation */}
        <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm overflow-hidden relative">
           <div className="relative z-10 flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3">
                 <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-3">
                    <Box className="text-brand-600" /> Konfirmasi Kapasitas
                 </h2>
                 <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
                    Sesuaikan kapasitas lahan produksi Anda untuk memenuhi pesanan pre-order yang masuk. AI kami akan menghitung resiko gagal panen secara otomatis.
                 </p>
                 <button className="bg-brand-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-900/10 hover:scale-105 active:scale-95 transition-all">
                    Update Semua Lahan
                 </button>
              </div>

              <div className="flex-1 space-y-8">
                 {capacities.map((cap) => (
                   <div key={cap.id} className="space-y-4">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{cap.product}</p>
                            <p className="text-lg font-black text-slate-800">Capaian: {cap.confirmed} / {cap.target} {cap.product === 'Jagung Manis' ? 'kg' : 'kg'}</p>
                         </div>
                         <span className="text-sm font-black text-brand-600">{Math.round((cap.confirmed/cap.target)*100)}%</span>
                      </div>
                      <div className="h-6 bg-slate-50 rounded-full border border-slate-100 p-1 overflow-hidden">
                         <div 
                           className={`h-full rounded-full transition-all duration-1000 ${cap.color}`} 
                           style={{ width: `${(cap.confirmed/cap.target)*100}%` }}
                         />
                      </div>
                      <div className="flex gap-4">
                         <button className="flex-1 bg-white border border-slate-100 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Atur Kapasitas</button>
                         <button className="flex-1 bg-white border border-slate-100 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-all">Optimasi Produksi</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           {/* Background Accents */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
        </section>

        {/* AI Insight Banner */}
        <div className="bg-orange-900 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10 text-white relative overflow-hidden group">
           <div className="w-20 h-20 bg-orange-500/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10 relative z-10 shrink-0">
              <Zap size={40} className="text-orange-400 animate-pulse" />
           </div>
           <div className="relative z-10">
              <h4 className="text-xl font-black uppercase tracking-tight mb-2">AI Optimization Insight</h4>
              <p className="text-sm font-medium text-orange-100/70 max-w-xl leading-relaxed">
                Berdasarkan data cuaca 30 hari ke depan, kami merekomendasikan untuk menaikkan kapasitas produksi <span className="text-white font-black">Cabai Merah</span> sebesar <span className="text-orange-400 font-extrabold uppercase tracking-widest">20%</span> guna memenuhi lonjakan demand Idul Adha.
              </p>
           </div>
           <button className="relative z-10 ml-auto bg-white text-brand-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-orange-50 transition-colors">
              Gunakan Rekomendasi
           </button>
           
           <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-brand-500/10 rounded-full blur-[80px]" />
        </div>
      </div>
    </div>
  );
}
