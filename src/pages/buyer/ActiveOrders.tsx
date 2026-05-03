import React from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Phone,
  MessageCircle,
  Box,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Order } from '../../types';

interface ActiveOrdersProps {
  orders: Order[];
  onTrack: (order: Order) => void;
}

export default function ActiveOrders({ orders, onTrack }: ActiveOrdersProps) {
  // Filter for orders that are paid and shipping
  const shippingOrders = orders.filter(o => o.status === 'SHIPPING' || o.status === 'DELIVERED');

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-8 custom-scrollbar pb-32">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        {/* Header */}
        <div>
           <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight uppercase mb-2 leading-tight">Pesanan Dalam Pengiriman</h1>
           <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">Produk yang telah Anda lunasi dan sedang dalam proses pengantaran oleh kurir PanganDesa.</p>
        </div>

        {shippingOrders.length === 0 ? (
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-10 sm:p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center">
             <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 sm:mb-8 border border-slate-100">
                <Package size={40} className="sm:w-12 sm:h-12" />
             </div>
             <h3 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Belum Ada Pengiriman</h3>
             <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-sm">Pesanan Anda akan muncul di sini setelah pelunasan diverifikasi dan barang mulai dikirim.</p>
             <button className="mt-6 sm:mt-8 bg-brand-900 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-brand-900/10 hover:scale-105 active:scale-95 transition-all">Belanja Sekarang</button>
          </div>
        ) : (
          <div className="space-y-6">
             {shippingOrders.map((order) => (
               <div key={order.id} className="bg-white rounded-[32px] sm:rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                  <div className="p-6 sm:p-8">
                     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-sm border border-brand-100">
                              <Truck size={28} />
                           </div>
                           <div>
                              <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">ID: {order.trackingNumber || 'PROS-8821'}</p>
                              <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                 {order.status === 'SHIPPING' ? 'Dikirim' : 'Tiba'}
                                 <motion.div 
                                   animate={{ scale: [1, 1.2, 1] }} 
                                   transition={{ repeat: Infinity, duration: 2 }}
                                   className="w-2 h-2 bg-emerald-500 rounded-full" 
                                 />
                              </h3>
                           </div>
                        </div>
                        <div className="bg-slate-50 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border border-slate-100 flex items-center gap-3 self-start lg:self-auto">
                           <ShieldCheck className="text-brand-600 shrink-0 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                           <span className="text-[8px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Escrow Terlindungi</span>
                        </div>
                     </div>

                     <div className="space-y-6">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-6 items-center">
                             <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                                <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                             </div>
                             <div className="flex-1">
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.name}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.quantity} {item.unit} • Rp {item.price.toLocaleString()}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-slate-50 p-4 sm:p-6 flex flex-col md:flex-row items-center gap-3 sm:gap-4">
                     <button 
                       onClick={() => onTrack(order)}
                       className="w-full md:flex-1 bg-white border border-slate-200 text-slate-700 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest hover:border-brand-500 hover:text-brand-600 transition-all flex items-center justify-center gap-3"
                     >
                        Lacak Lokasi <ChevronRight size={14} />
                     </button>
                     <button className="w-full md:flex-1 bg-brand-900 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest shadow-lg shadow-brand-900/10 hover:bg-black transition-all">Selesai</button>
                     <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:w-14 md:h-14 bg-white border border-slate-200 rounded-xl sm:rounded-2xl py-3.5 sm:py-0 flex items-center justify-center text-brand-600 hover:bg-brand-50 transition-all"><MessageCircle size={20} className="sm:w-6 sm:h-6" /></button>
                        <button className="flex-1 md:w-14 md:h-14 bg-white border border-slate-200 rounded-xl sm:rounded-2xl py-3.5 sm:py-0 flex items-center justify-center text-brand-600 hover:bg-brand-50 transition-all"><Phone size={20} className="sm:w-6 sm:h-6" /></button>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 flex gap-4 sm:gap-6">
           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 shrink-0">
              <AlertCircle size={20} className="sm:w-6 sm:h-6" />
           </div>
           <div>
              <h4 className="text-xs sm:text-sm font-black text-blue-900 uppercase tracking-tight mb-1">Informasi Pengiriman</h4>
              <p className="text-[10px] sm:text-xs font-medium text-blue-700/70 leading-relaxed">
                 Semua produk dalam pengiriman telah melalui kontrol kualitas di gudang desa. Jika kemasan rusak saat diterima, silakan tolak pesanan atau ajukan komplain melalui tombol Chat AI.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
