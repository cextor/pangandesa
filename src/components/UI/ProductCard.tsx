import React from 'react';
import { Star, MapPin, Calendar, Heart, Plus } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onPreview?: (product: Product) => void;
  layout?: 'grid' | 'list';
}

import { parseHarvestSchedules, ensureDayMonthYear } from '../../utils/harvestHelper';
import { triggerFlyToCartAnimation } from '../../utils/cartAnimation';

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

export default function ProductCard({ product, onAddToCart, onPreview, layout = 'grid' }: ProductCardProps) {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  if (layout === 'list') {
    return (
      <div 
        onClick={() => onPreview?.(product)}
        className="bg-white rounded-3xl border border-slate-100 overflow-hidden group hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-500 flex flex-row cursor-pointer p-4 gap-4 sm:gap-6 relative"
      >
        <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 relative bg-slate-50 flex items-center justify-center border border-slate-100">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-2">
               <div className="w-8 h-8 rounded-lg bg-slate-100/50 flex items-center justify-center text-slate-300 mb-1">🌾</div>
               <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center">Belum Ada Foto</span>
            </div>
          )}
          
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.isPreOrder && (
              <div className="bg-brand-900/80 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
                <Calendar size={8} />
                <span>PRE-ORDER</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-lg font-black text-slate-800 group-hover:text-brand-600 transition-colors uppercase tracking-tight leading-tight line-clamp-1">{product.name}</h3>
            
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[9px] sm:text-xs uppercase tracking-wider mt-0.5">
               <span>🧑‍🌾 {product.farmer || 'Petani PanganDesa'}</span>
            </div>

            <div className="flex items-baseline mt-1">
              <span className="text-sm sm:text-lg font-black text-slate-800 leading-none">{formatter.format(product.price)}</span>
              <span className="text-[9px] sm:text-xs text-slate-400 font-bold ml-1">/{product.unit}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 mt-1">
               <Calendar size={12} className="text-brand-500 shrink-0" />
               <p className="text-[10px] sm:text-xs font-bold truncate">Panen: <span className="text-slate-700">{(product as any).selectedHarvestDate ? ensureDayMonthYear((product as any).selectedHarvestDate) : cleanHarvestDate(product.harvestDate)}</span></p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
             <div className="flex items-center gap-1 min-w-0">
                <Star size={10} className="text-yellow-400 fill-yellow-400 shrink-0" />
                <span className="text-[10px] sm:text-xs font-black text-slate-800 truncate">{product.rating}</span>
             </div>
             
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 triggerFlyToCartAnimation(e, product.image);
                 onAddToCart?.(product);
               }}
               className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl py-2 px-4 flex items-center justify-center gap-2 shadow-lg shadow-brand-600/10 active:scale-95 transition-all text-[9px] sm:text-[10px] font-black uppercase tracking-widest cursor-pointer"
             >
                Tambah <Plus className="w-3 h-3" strokeWidth={3} />
             </button>
          </div>
        </div>

        <button className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-slate-400 hover:text-red-500">
          <Heart size={18} />
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onPreview?.(product)}
      className="bg-white rounded-3xl border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-50 flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-4">
             <div className="w-10 h-10 rounded-xl bg-slate-100/50 flex items-center justify-center text-slate-300 mb-1">🌾</div>
             <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center">Belum Ada Foto</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isPreOrder && (
            <div className="bg-brand-900/80 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
              <Calendar size={10} />
              <span>PRE-ORDER</span>
            </div>
          )}
        </div>

        <button className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-slate-400 hover:text-red-500">
          <Heart size={18} />
        </button>
      </div>

      <div className="p-3.5 sm:p-4 flex-1 flex flex-col">
        <div className="mb-1">
          <h3 className="text-xs sm:text-[14px] font-black text-slate-800 group-hover:text-brand-600 transition-colors uppercase tracking-tight leading-tight line-clamp-2">{product.name}</h3>
        </div>

        <div className="flex items-center gap-1 text-emerald-700 font-bold text-[8px] sm:text-[9.5px] uppercase tracking-wider mb-1.5">
           <span>🧑‍🌾 {product.farmer || 'Petani PanganDesa'}</span>
        </div>

        <div className="mt-auto pt-1 flex items-baseline">
          <span className="text-xs sm:text-sm font-black text-slate-800 leading-none">{formatter.format(product.price)}</span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold ml-1">/{product.unit}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 text-slate-400">
           <Calendar size={12} className="text-brand-500 shrink-0" />
           <p className="text-[9px] sm:text-[10px] font-bold truncate">Panen: <span className="text-slate-700">{(product as any).selectedHarvestDate ? ensureDayMonthYear((product as any).selectedHarvestDate) : cleanHarvestDate(product.harvestDate)}</span></p>
        </div>

        <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <Star size={10} className="text-yellow-400 fill-yellow-400 shrink-0" />
              <span className="text-[9.5px] sm:text-[10.5px] font-black text-slate-800 truncate">{product.rating} <span className="hidden xs:inline text-slate-400 font-bold ml-0.5">({Math.floor(Math.random() * 100) + 20})</span></span>
           </div>
           <button 
             onClick={(e) => {
               e.stopPropagation();
               triggerFlyToCartAnimation(e, product.image);
               onAddToCart?.(product);
             }}
             className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-600/20 hover:scale-110 active:scale-95 transition-all shrink-0"
           >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
           </button>
        </div>
      </div>
    </div>
  );
}
