import React from 'react';
import { Star, MapPin, Calendar, Heart, Plus } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onPreview?: (product: Product) => void;
  key?: React.Key;
}

export default function ProductCard({ product, onAddToCart, onPreview }: ProductCardProps) {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return (
    <div 
      onClick={() => onPreview?.(product)}
      className="bg-white rounded-3xl border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
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

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="mb-2">
          <h3 className="text-sm sm:text-[15px] font-black text-slate-800 group-hover:text-brand-600 transition-colors uppercase tracking-tight leading-tight sm:leading-snug line-clamp-2 sm:line-clamp-none">{product.name}</h3>
        </div>

        <div className="mt-auto pt-1 flex items-baseline">
          <span className="text-sm sm:text-base font-black text-slate-800 leading-none">{formatter.format(product.price)}</span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold ml-1">/{product.unit}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-slate-400">
           <Calendar size={12} className="text-brand-500 shrink-0" />
           <p className="text-[9px] sm:text-[10px] font-bold truncate">Panen: <span className="text-slate-700">{product.harvestDate}</span></p>
        </div>

        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <Star size={10} className="text-yellow-400 fill-yellow-400 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-black text-slate-800 truncate">{product.rating} <span className="hidden xs:inline text-slate-400 font-bold ml-0.5">({Math.floor(Math.random() * 100) + 20})</span></span>
           </div>
           <button 
             onClick={(e) => {
               e.stopPropagation();
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
