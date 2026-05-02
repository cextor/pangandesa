import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  MessageSquare, 
  Star, 
  ShoppingBag, 
  ChevronRight,
  Heart,
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function Customers() {
  const customers = [
    { 
      id: 1, 
      name: 'Budi Santoso', 
      location: 'Jakarta Selatan', 
      totalOrders: 12, 
      totalSpent: 'Rp 4.5M', 
      rating: 5, 
      status: 'Loyal',
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200' 
    },
    { 
      id: 2, 
      name: 'Rina Wijaya', 
      location: 'Bandung', 
      totalOrders: 8, 
      totalSpent: 'Rp 2.8M', 
      rating: 4.8, 
      status: 'Regular',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200' 
    },
    { 
      id: 3, 
      name: 'Andi Pratama', 
      location: 'Surabaya', 
      totalOrders: 5, 
      totalSpent: 'Rp 1.2M', 
      rating: 4.5, 
      status: 'New',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' 
    },
  ];

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-10 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <Heart className="text-red-500 fill-red-500" size={32} />
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pelanggan Saya</h1>
              </div>
              <p className="text-slate-500 font-medium">Data pelanggan yang telah menyelesaikan transaksi dan berkontribusi pada pertumbuhan toko Anda.</p>
           </div>
           
           <div className="flex gap-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-6">
                 <div className="w-12 h-12 bg-white text-brand-600 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                    <Users size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pelanggan</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">128</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row items-center gap-4">
           <div className="flex-1 relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Cari nama pelanggan atau lokasi..." 
                className="w-full bg-white border border-slate-100 rounded-[28px] py-4 pl-14 pr-6 text-sm font-medium focus:ring-4 focus:ring-brand-500/5 transition-all outline-none shadow-sm"
              />
           </div>
           <button className="bg-white border border-slate-100 px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={18} /> Filter Status
           </button>
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {customers.map((c) => (
             <div key={c.id} className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="flex items-center gap-6 mb-8 relative z-10">
                   <div className="w-20 h-20 rounded-[28px] overflow-hidden border-4 border-white shadow-lg ring-1 ring-slate-100 shrink-0">
                      <img src={c.image} className="w-full h-full object-cover" alt={c.name} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight mb-1">{c.name}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <MapPin size={12} className="text-brand-500" /> {c.location}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Orders</p>
                      <p className="text-lg font-black text-slate-800">{c.totalOrders}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Spent</p>
                      <p className="text-lg font-black text-brand-600">{c.totalSpent}</p>
                   </div>
                </div>

                <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-1.5">
                      <Star size={14} className="text-orange-400 fill-orange-400" />
                      <span className="text-xs font-black text-slate-800">{c.rating}</span>
                   </div>
                   <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                     c.status === 'Loyal' ? 'bg-emerald-100 text-emerald-700' : 
                     c.status === 'Regular' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                   }`}>
                      {c.status}
                   </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-50 flex gap-3 relative z-10">
                   <button className="flex-1 bg-brand-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-900/10 hover:scale-105 active:scale-95 transition-all">Hubungi</button>
                   <button className="w-12 h-11 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-brand-50 hover:text-brand-600 transition-all border border-slate-100">
                      <ExternalLink size={18} />
                   </button>
                </div>
                
                {/* Background Decor */}
                <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-brand-50 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
