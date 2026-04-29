import React from 'react';
import { CreditCard, Wallet, Smartphone, Landmark, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export default function PaymentMethods() {
  const methods = [
    { id: 'saldo', name: 'Saldo PanganDesa', icon: <Wallet />, active: true, balance: 'Rp 250.000', type: 'wallet' },
    { id: 'bca', name: 'Virtual Account BCA', icon: <Landmark />, active: true, desc: '9842 1222 3444', type: 'bank' },
    { id: 'go_pay', name: 'GoPay', icon: <Smartphone />, active: false, desc: 'Belum terhubung', type: 'ewallet' },
    { id: 'mandiri', name: 'Mandiri VA', icon: <Landmark />, active: false, desc: 'Belum diaktifkan', type: 'bank' },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1000px] mx-auto p-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-800 font-display mb-2">Metode Pembayaran</h1>
            <p className="text-slate-500 font-medium">Kelola bagaimana Anda membayar hasil tani.</p>
          </div>
          <button className="bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-brand-600/20 active:scale-95">
             <Plus size={20} />
             Tambah Metode
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {methods.map((m) => (
            <div key={m.id} className={`bg-white rounded-[32px] p-8 border hover:shadow-xl transition-all duration-300 flex items-center justify-between ${m.active ? 'border-brand-200' : 'border-slate-100 opacity-70'}`}>
               <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${m.active ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                     {m.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-xl font-display">{m.name}</h3>
                    <p className={`text-sm font-bold ${m.active ? 'text-brand-600' : 'text-slate-400'}`}>
                      {m.active ? (m.balance || m.desc) : 'Bisa segera diaktifkan'}
                    </p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  {m.active ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-xl border border-brand-100 font-bold text-xs">
                       <CheckCircle2 size={16} />
                       Aktif
                    </div>
                  ) : (
                    <button className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold text-xs hover:bg-slate-900 transition-all active:scale-95">
                       Aktifkan Sekarang
                    </button>
                  )}
                  <button className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                     <AlertCircle size={20} />
                  </button>
               </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
           <div className="relative z-10 max-w-lg">
              <h3 className="text-2xl font-black mb-4 font-display">Keamanan Terjamin 🔒</h3>
              <p className="text-slate-400 font-medium leading-relaxed mb-6">Semua transaksi menggunakan sistem Escrow. Dana hanya akan diteruskan ke petani setelah Anda mengonfirmasi bahwa produk telah diterima dengan baik.</p>
              <div className="flex items-center gap-6">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500 mb-1">PCI Level</span>
                    <span className="text-lg font-black italic tracking-tighter">COMPLIANT</span>
                 </div>
                 <div className="w-px h-10 bg-white/10" />
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500 mb-1">Encryption</span>
                    <span className="text-lg font-black uppercase tracking-tighter">AES-256</span>
                 </div>
              </div>
           </div>
           <CreditCard size={180} className="absolute -bottom-10 -right-10 text-white/5 transform rotate-12" />
        </div>
      </div>
    </div>
  );
}
