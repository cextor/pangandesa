import React from 'react';
import { MapPin, Users, Sprout, ArrowRight, Star } from 'lucide-react';

export default function VillagesPage() {
  const villages = [
    { name: 'Desa Sukamaju', region: 'Lembang, Jawa Barat', farmers: 124, specialties: ['Tomat', 'Cabai', 'Kentang'], rating: 4.9, img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop' },
    { name: 'Desa Cikedap', region: 'Garut, Jawa Barat', farmers: 86, specialties: ['Beras Organik', 'Jagung'], rating: 4.8, img: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=600&auto=format&fit=crop' },
    { name: 'Desa Cipanas', region: 'Cianjur, Jawa Barat', farmers: 210, specialties: ['Sayuran Hijau', 'Teh'], rating: 4.9, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop' },
    { name: 'Desa Kaliurang', region: 'Sleman, Yogyakarta', farmers: 95, specialties: ['Salak', 'Sayur Pegunungan'], rating: 4.7, img: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=600&auto=format&fit=crop' },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1400px] mx-auto p-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-800 font-display mb-2">Desa Mitra</h1>
          <p className="text-slate-500 font-medium">Jelajahi komunitas petani kami dan kenali asal pangan Anda.</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {villages.map((v, i) => (
            <div key={i} className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-2xl hover:shadow-brand-500/5 transition-all">
               <div className="h-64 relative overflow-hidden">
                  <img src={v.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={v.name} />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent p-8 flex flex-col justify-end text-white">
                     <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">
                        <MapPin size={14} />
                        {v.region}
                     </div>
                     <h2 className="text-3xl font-black font-display">{v.name}</h2>
                  </div>
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
                     <Star size={16} className="text-yellow-400 fill-yellow-400" />
                     <span className="text-sm font-black text-slate-800">{v.rating}</span>
                  </div>
               </div>
               <div className="p-10 grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                           <Users size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Petani</p>
                           <p className="text-sm font-bold text-slate-800">{v.farmers} Kepala Keluarga</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                           <Sprout size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Komoditas Utama</p>
                           <div className="flex flex-wrap gap-2 mt-1.5">
                              {v.specialties.map((s, j) => (
                                <span key={j} className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-600 rounded-md">{s}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-end justify-end">
                     <button className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-brand-600/20 hover:bg-brand-700 transition-all flex items-center gap-3 active:scale-95">
                        Kunjungi Desa
                        <ArrowRight size={18} />
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
