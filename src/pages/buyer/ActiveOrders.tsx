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
  AlertCircle,
  Calendar,
  CreditCard,
  MessageSquare,
  Sprout
} from 'lucide-react';
import { Order } from '../../types';
import { useNavigate } from 'react-router-dom';
import { ensureDayMonthYear } from '../../utils/harvestHelper';
import { useOrder } from '../../contexts/OrderContext';

interface ActiveOrdersProps {
  orders: Order[];
  onTrack: (order: Order) => void;
  onPayPelunasan?: (orderId: string) => void;
  onOpenForum?: () => void;
}

export default function ActiveOrders({ orders, onTrack, onPayPelunasan, onOpenForum }: ActiveOrdersProps) {
  const navigate = useNavigate();
  const { updateOrderStatus } = useOrder();

  // Filter for all active orders
  const activeStatuses = [
    'WAITING_PAYMENT_DP', 
    'WAITING_ADMIN_DP', 
    'WAITING_HARVEST', 
    'HARVEST_CONFIRMED_SELLER', 
    'WAITING_FINAL_PAYMENT', 
    'WAITING_ADMIN_FINAL', 
    'SHIPPING', 
    'DELIVERED'
  ];

  const activeOrdersList = orders.filter(o => activeStatuses.includes(o.status));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING_PAYMENT_DP':
        return { label: 'Bayar DP (30%)', style: 'bg-amber-50 text-amber-600 border-amber-100' };
      case 'WAITING_ADMIN_DP':
        return { label: 'Verifikasi DP', style: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'WAITING_HARVEST':
        return { label: 'Menunggu Panen', style: 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse' };
      case 'HARVEST_CONFIRMED_SELLER':
        return { label: 'Siap Pelunasan', style: 'bg-teal-50 text-teal-600 border-teal-100' };
      case 'WAITING_FINAL_PAYMENT':
        return { label: 'Menunggu Pelunasan', style: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
      case 'WAITING_ADMIN_FINAL':
        return { label: 'Verifikasi Lunas', style: 'bg-violet-50 text-violet-600 border-violet-100' };
      case 'SHIPPING':
        return { label: 'Sedang Dikirim', style: 'bg-sky-50 text-sky-600 border-sky-100' };
      case 'DELIVERED':
        return { label: 'Tiba di Lokasi', style: 'bg-pink-50 text-pink-600 border-pink-100' };
      default:
        return { label: status, style: 'bg-slate-50 text-slate-600 border-slate-100' };
    }
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-8 custom-scrollbar pb-32">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        {/* Header */}
        <div>
           <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight uppercase mb-2 leading-tight">Pesanan & Pre-Order Aktif</h1>
           <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
             Pantau kemajuan transaksi pre-order hasil tani Anda, dari pemeliharaan tanah, kematangan panen, hingga proses pengiriman.
           </p>
        </div>

        {activeOrdersList.length === 0 ? (
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-10 sm:p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center">
             <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 sm:mb-8 border border-slate-100">
                <Package size={40} className="sm:w-12 sm:h-12" />
             </div>
             <h3 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Belum Ada Transaksi</h3>
             <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-sm leading-relaxed">
               Anda belum memiliki pesanan aktif. Mulai pre-order pangan segar hasil panen optimal hari ini!
             </p>
             <button 
               onClick={() => navigate('/buyer/preorder')}
               className="mt-6 sm:mt-8 bg-brand-900 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-brand-900/10 hover:scale-105 active:scale-95 transition-all border-0 cursor-pointer"
             >
               Pre-Order Sekarang
             </button>
          </div>
        ) : (
          <div className="space-y-6">
             {activeOrdersList.map((order) => {
               const badge = getStatusBadge(order.status);
               return (
                 <div key={order.id} className="bg-white rounded-[24px] sm:rounded-[36px] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <div className="p-5 sm:p-8">
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-50">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-xs border border-brand-100 shrink-0">
                                {order.status === 'SHIPPING' || order.status === 'DELIVERED' ? <Truck size={20} /> : <Sprout size={20} />}
                             </div>
                             <div>
                                <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">ID Pesanan: #{order.id.slice(-8).toUpperCase()}</p>
                                <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
                                   {badge.label}
                                   {(order.status === 'WAITING_HARVEST' || order.status === 'SHIPPING') && (
                                     <motion.div 
                                       animate={{ scale: [1, 1.2, 1] }} 
                                       transition={{ repeat: Infinity, duration: 2 }}
                                       className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" 
                                     />
                                   )}
                                </h3>
                             </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                             <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                <Calendar size={11} /> {order.createdAt}
                             </div>
                             <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100 flex items-center gap-1.5">
                                <ShieldCheck className="text-brand-600 shrink-0" size={12} />
                                <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-wider leading-none">Escrow</span>
                             </div>
                          </div>
                       </div>

                       {/* Products list */}
                       <div className="space-y-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 sm:gap-6 items-center">
                               <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-slate-100 shadow-xs shrink-0 bg-slate-50 flex items-center justify-center">
                                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-tight truncate">{item.name}</h4>
                                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{item.quantity} {item.unit} @ Rp {item.price.toLocaleString('id-ID')}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Transaction breakdown & Action footer */}
                    <div className="bg-slate-50 p-4 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-t border-slate-100">
                       <div className="flex gap-4 text-left shrink-0">
                          <div>
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5 leading-none">Total Transaksi</p>
                             <p className="text-xs sm:text-sm font-black text-slate-800">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                          </div>
                          <div className="w-px h-6 bg-slate-200 self-center" />
                          <div>
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5 leading-none">Status Bayar</p>
                             <p className="text-xs sm:text-sm font-black text-emerald-600">
                               {order.status === 'WAITING_PAYMENT_DP' || order.status === 'WAITING_ADMIN_DP' ? 'Belum DP' : (order.status === 'WAITING_ADMIN_FINAL' || order.status === 'SHIPPING' || order.status === 'DELIVERED' ? 'Lunas (100%)' : 'DP Lunas (30%)')}
                             </p>
                          </div>
                       </div>

                       <div className="flex flex-wrap items-center gap-2 md:justify-end flex-1">
                          {/* Discuss Forum Button for active pre-orders */}
                          {(order.status === 'WAITING_HARVEST' || order.status === 'HARVEST_CONFIRMED_SELLER' || order.status === 'WAITING_FINAL_PAYMENT') && (
                            <button 
                              onClick={onOpenForum}
                              className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:border-brand-500 hover:text-brand-600 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                               <MessageSquare size={13} /> Diskusi Forum
                            </button>
                          )}

                          {/* Bayar DP Button */}
                          {order.status === 'WAITING_PAYMENT_DP' && onPayPelunasan && (
                             <div className="flex gap-2 w-full sm:w-auto">
                               <button 
                                 onClick={async () => {
                                   if (window.confirm("Apakah Anda yakin ingin membatalkan pesanan pre-order ini?")) {
                                     await updateOrderStatus(order.id, 'CANCELLED');
                                   }
                                 }}
                                 className="flex-1 sm:flex-none bg-red-50 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2.5 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest border border-red-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                               >
                                 Batalkan Pesanan
                               </button>
                               <button 
                                 onClick={() => onPayPelunasan(order.id)}
                                 className="flex-1 sm:flex-none bg-brand-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-md border-0"
                               >
                                 Bayar DP (30%)
                               </button>
                             </div>
                           )}

                          {/* Bayar Pelunasan Button */}
                          {(order.status === 'HARVEST_CONFIRMED_SELLER' || order.status === 'WAITING_FINAL_PAYMENT') && onPayPelunasan && (
                            <button 
                              onClick={() => onPayPelunasan(order.id)}
                              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-md border-0"
                            >
                               Bayar Pelunasan (70%)
                            </button>
                          )}

                          {/* Shipping Track Button */}
                          {(order.status === 'SHIPPING' || order.status === 'DELIVERED') && (
                            <button 
                              onClick={() => onTrack(order)}
                              className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:border-brand-500 hover:text-brand-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                               Lacak Lokasi <ChevronRight size={13} />
                            </button>
                          )}

                          {/* Shipping Completed Demo Button */}
                          {order.status === 'SHIPPING' && (
                            <button 
                              onClick={() => navigate('/buyer/transaksi-panen')}
                              className="flex-1 sm:flex-none bg-brand-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-md border-0"
                            >
                               Konfirmasi Terima
                            </button>
                          )}
                       </div>
                    </div>
                 </div>
               );
             })}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-[24px] sm:rounded-[32px] p-6 flex gap-4">
           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-xs border border-blue-100 shrink-0">
              <AlertCircle size={20} className="sm:w-6 sm:h-6" />
           </div>
           <div>
              <h4 className="text-xs sm:text-sm font-black text-blue-900 uppercase tracking-tight mb-1">Informasi Escrow & Keamanan</h4>
              <p className="text-[10px] sm:text-xs font-medium text-blue-700/70 leading-relaxed">
                 Seluruh pembayaran menggunakan sistem Escrow (rekening bersama) PanganDesa. Dana Down Payment (30%) dan Pelunasan (70%) hanya akan dicairkan ke dompet petani setelah kualitas pangan optimal terverifikasi saat panen dan barang telah sampai di alamat tujuan Anda.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
