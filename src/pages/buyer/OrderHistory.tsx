import React from 'react';
import { ShoppingBag, Truck, CheckCircle2, Clock, MapPin, Receipt, Star, ArrowRight } from 'lucide-react';

export default function OrderHistory() {
  const history = [
    { 
      id: 'INV-20240401-443', 
      date: '1 April 2024',
      status: 'Selesai',
      total: 82500,
      items: [
        { name: 'Tomat Segar', qty: 2, unit: 'kg', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop' },
        { name: 'Jagung Manis', qty: 3, unit: 'kg', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=200&auto=format&fit=crop' }
      ]
    },
    { 
      id: 'INV-20240315-122', 
      date: '15 Maret 2024',
      status: 'Selesai',
      total: 45000,
      items: [
        { name: 'Bayam Organik', qty: 5, unit: 'ikat', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=200&auto=format&fit=crop' }
      ]
    },
    { 
      id: 'INV-20240310-098', 
      date: '10 Maret 2024',
      status: 'Dibatalkan',
      total: 120000,
      items: [
        { name: 'Beras Merah', qty: 5, unit: 'kg', img: 'https://images.unsplash.com/photo-1586201327693-86629f7cf446?q=80&w=200&auto=format&fit=crop' }
      ]
    }
  ];

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1000px] mx-auto p-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-800 font-display mb-2">Riwayat Pesanan</h1>
          <p className="text-slate-500 font-medium">Lacak kembali pembelian hasil tani terbaik Anda.</p>
        </div>

        <div className="space-y-8">
           {history.map((order) => (
             <div key={order.id} className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand-500/5 transition-all group overflow-hidden">
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all">
                        <Receipt size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{order.id}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{order.date}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        order.status === 'Selesai' 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                         {order.status}
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   {order.items.map((item, i) => (
                     <div key={i} className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 transform group-hover:scale-105 transition-transform duration-500">
                           <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                        </div>
                        <div className="flex-1">
                           <h4 className="font-bold text-slate-800 uppercase tracking-tight">{item.name}</h4>
                           <p className="text-xs text-slate-400 font-medium">{item.qty} {item.unit}</p>
                        </div>
                        {order.status === 'Selesai' && (
                          <button className="flex items-center gap-2 text-brand-600 bg-brand-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all shadow-sm">
                             <Star size={14} /> Beri Ulasan
                          </button>
                        )}
                     </div>
                   ))}
                </div>

                <div className="mt-8 pt-8 flex items-center justify-between">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Transaksi</p>
                      <p className="text-2xl font-black text-brand-600 font-display">{formatter.format(order.total)}</p>
                   </div>
                   <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-brand-600 transition-all flex items-center gap-3">
                      Beli Lagi
                      <ArrowRight size={18} />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
