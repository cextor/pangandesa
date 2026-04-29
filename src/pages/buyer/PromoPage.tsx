import React from 'react';
import { Tag, Percent, ArrowRight, Clock, Star, Gift } from 'lucide-react';

export default function PromoPage() {
  const promos = [
    { title: 'Diskon Ongkir 50%', desc: 'Berlaku untuk semua pre-order minggu ini dari Desa Sukamaju.', code: 'PANENSEGAR', expires: '3 hari lagi', color: 'bg-brand-500' },
    { title: 'Promo Petani Baru', desc: 'Diskon 20% untuk pembelian pertama produk dari Petani Mitra Baru.', code: 'MITRABARU', expires: '7 hari lagi', color: 'bg-amber-500' },
    { title: 'Cashback Rp 25rb', desc: 'Minimal belanja Rp 200rb menggunakan Saldo PanganDesa.', code: 'SALDOHEMAT', expires: 'Besok', color: 'bg-blue-500' },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1000px] mx-auto p-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-800 font-display mb-2 uppercase tracking-tight">Promo Menarik</h1>
          <p className="text-slate-500 font-medium italic">Nikmati hasil tani terbaik dengan harga yang lebih bersahabat.</p>
        </div>

        <div className="space-y-6">
           {promos.map((p, i) => (
             <div key={i} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                   <div className="flex items-center gap-6">
                      <div className={`w-20 h-20 ${p.color} rounded-[30px] flex items-center justify-center text-white shadow-lg`}>
                         <Tag size={32} />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-slate-800 font-display uppercase tracking-tight">{p.title}</h3>
                         <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed max-w-sm">{p.desc}</p>
                         <div className="flex items-center gap-2 mt-3 text-red-500 bg-red-50 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Clock size={12} /> Berakhir {p.expires}
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center min-w-[200px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kode Promo</p>
                      <div className="text-xl font-black text-brand-600 font-mono tracking-widest bg-white px-4 py-2 rounded-xl border border-brand-100 shadow-sm mb-4">
                        {p.code}
                      </div>
                      <button className="w-full bg-slate-900 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-600 transition-colors">
                        Salin Kode
                      </button>
                   </div>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-50 rounded-full blur-3xl opacity-50" />
             </div>
           ))}
        </div>

        <div className="mt-16 bg-brand-900 rounded-[48px] p-12 text-white flex items-center justify-between relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-3xl font-black font-display mb-4">Undang Teman & <br /> Dapatkan Voucher Rp 50rb!</h2>
              <p className="text-brand-100 mb-8 max-w-xs font-medium">Bagikan kebaikan produk desa ke temanmu dan nikmati hadiahnya bersama.</p>
              <button className="bg-white text-brand-900 px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-brand-50 transition-all flex items-center gap-3">
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
