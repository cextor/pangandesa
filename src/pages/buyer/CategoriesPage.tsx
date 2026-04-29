import React from 'react';
import { CATEGORIES } from '../../constants';
import { Grid, ArrowRight, Sparkles } from 'lucide-react';

interface CategoriesPageProps {
  onCategorySelect: (category: string) => void;
}

export default function CategoriesPage({ onCategorySelect }: CategoriesPageProps) {
  const categoryDetails = [
    { id: 'sayuran', name: 'Sayuran', icon: '🥬', desc: 'Segar dari kebun', color: 'bg-green-50' },
    { id: 'buah', name: 'Buah', icon: '🍎', desc: 'Manis & Bernutrisi', color: 'bg-red-50' },
    { id: 'beras', name: 'Beras & Biji', icon: '🌾', desc: 'Pokok Berkualitas', color: 'bg-amber-50' },
    { id: 'umbi', name: 'Umbi & Rimpang', icon: '🍠', desc: 'Asli Tanah Desa', color: 'bg-orange-50' },
    { id: 'rempah', name: 'Rempah', icon: '🌶️', desc: 'Kaya akan Rasa', color: 'bg-rose-50' },
    { id: 'olahan', name: 'Olahan Desa', icon: '🍯', desc: 'Produk Turunan Desa', color: 'bg-yellow-50' },
    { id: 'organik', name: 'Produk Organik', icon: '🌿', desc: 'Tanpa Bahan Kimia', color: 'bg-emerald-50' },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1400px] mx-auto p-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-800 font-display mb-2 uppercase tracking-tight">Semua Kategori</h1>
            <p className="text-slate-500 font-medium italic">Jelajahi beragam hasil bumi yang kami tawarkan.</p>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-brand-50 text-brand-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-brand-100">
             <Sparkles size={16} />
             Kategori Spesial Musim Ini
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categoryDetails.map((cat, i) => {
            return (
              <div 
                key={i} 
                onClick={() => onCategorySelect(cat.name)}
                className={`${cat.color} rounded-[48px] p-10 border border-white/50 shadow-sm hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden h-64 flex flex-col justify-between`}
              >
                 <div className="relative z-10 flex items-center justify-between">
                    <div className="text-6xl group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">{cat.icon}</div>
                    <div className="w-12 h-12 bg-white/80 backdrop-blur rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-brand-500 transition-colors">
                       <ArrowRight size={24} />
                    </div>
                 </div>
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black text-slate-800 font-display mb-1">{cat.name}</h3>
                    <p className="text-sm font-bold text-slate-400 group-hover:text-brand-600 transition-colors italic">{cat.desc}</p>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
              </div>
            );
          })}
        </div>

        <div className="mt-20 flex flex-col items-center">
           <div className="w-20 h-1 bg-slate-200 rounded-full mb-8" />
           <p className="text-slate-400 font-display text-lg font-black uppercase tracking-[0.5em]">PanganDesa 2024</p>
        </div>
      </div>
    </div>
  );
}
