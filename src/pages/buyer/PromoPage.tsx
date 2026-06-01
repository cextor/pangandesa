import React, { useState, useEffect } from 'react';
import { Tag, Percent, ArrowRight, Clock, Star, Gift, CheckCircle2, AlertCircle } from 'lucide-react';
import { PromoService } from '../../services/PromoService';
import { Promo } from '../../types';

export default function PromoPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    PromoService.getAllPromos().then((data) => {
      setPromos(data);
      setLoading(false);
    });
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 pb-20">
      <div className="max-w-[1000px] mx-auto p-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-800 font-display mb-2 uppercase tracking-tight">Promo Menarik</h1>
            <p className="text-slate-500 font-medium italic">Nikmati hasil tani terbaik dengan harga yang lebih bersahabat.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-wider">
            Memuat data promo...
          </div>
        ) : promos.length > 0 ? (
          <div className="space-y-6">
             {promos.map((p) => (
              <div key={p.id} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
                 <div className="flex items-center gap-6 flex-1">
                    <div className="w-20 h-20 bg-emerald-550 rounded-[30px] flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0 relative">
                       {p.image ? (
                         <img src={p.image} className="w-full h-full object-cover" alt={p.title} />
                       ) : (
                         <Tag size={32} />
                       )}
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1.5">
                         <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg">
                           Diskon {p.discountPercent}%
                         </span>
                         <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                           Min. Belanja: {formatter.format(p.minPurchase)}
                         </span>
                       </div>
                       <h3 className="text-xl font-black text-slate-800 font-display uppercase tracking-tight">{p.title}</h3>
                       <p className="text-sm text-slate-400 font-medium mt-1 leading-relaxed max-w-sm">{p.description}</p>
                    </div>
                 </div>

                 <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center min-w-[200px] shrink-0">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kode Promo</p>
                    <div className="text-xl font-black text-[#1a4d2e] font-mono tracking-widest bg-white px-4 py-2 rounded-xl border border-emerald-100 shadow-sm mb-4 uppercase">
                      {p.code}
                    </div>
                    <button 
                      onClick={() => handleCopyCode(p.code)}
                      className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-0 cursor-pointer ${
                        copiedCode === p.code
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-900 text-white hover:bg-emerald-800'
                      }`}
                    >
                      {copiedCode === p.code ? '✓ Tersalin' : 'Salin Kode'}
                    </button>
                 </div>
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-50 rounded-full blur-3xl opacity-50" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100 p-8 shadow-xs">
            <Tag size={48} className="mx-auto text-slate-350 mb-4" />
            <p className="font-bold text-slate-700 text-lg mb-2">Belum Ada Promo Tersedia</p>
            <p className="text-slate-400 max-w-sm mx-auto text-sm">Kembali lagi nanti untuk mendapatkan penawaran potongan harga menarik.</p>
          </div>
        )}

        <div className="mt-16 bg-brand-900 rounded-[48px] p-12 text-white flex items-center justify-between relative overflow-hidden shadow-xl shadow-brand-900/10">
           <div className="relative z-10">
              <h2 className="text-3xl font-black font-display mb-4">Undang Teman & <br /> Dapatkan Voucher Rp 50rb!</h2>
              <p className="text-brand-100 mb-8 max-w-xs font-medium">Bagikan kebaikan produk desa ke temanmu dan nikmati hadiahnya bersama.</p>
              <button className="bg-white text-brand-900 px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-brand-50 transition-all flex items-center gap-3 border-0 cursor-pointer">
                 Undang Sekarang
                 <Gift size={20} />
              </button>
           </div>
           <Percent size={200} className="absolute -right-10 -bottom-10 text-white/5 transform rotate-12" />
        </div>
      </div>
    </div>
  );
}
