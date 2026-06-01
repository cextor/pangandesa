import React from 'react';
import { ShoppingBag, Truck, CheckCircle2, Clock, MapPin, Receipt, Star, ArrowRight, AlertCircle } from 'lucide-react';
import { useOrder } from '../../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
  const { orders } = useOrder();
  const navigate = useNavigate();
  
  // Filter for completed or cancelled orders
  const historyOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED');

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  const getStatusBadge = (status: string) => {
    if (status === 'COMPLETED') {
      return { label: 'Selesai', style: 'bg-green-50 text-green-600 border-green-100' };
    }
    return { label: 'Dibatalkan', style: 'bg-red-50 text-red-600 border-red-100' };
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30 pb-20">
      <div className="max-w-[1000px] mx-auto p-4 sm:p-8 lg:p-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-800 font-display mb-2">Riwayat Pesanan</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Lacak kembali pembelian hasil tani terbaik Anda.</p>
        </div>

        <div className="space-y-6 sm:space-y-8">
           {historyOrders.map((order) => {
             const badge = getStatusBadge(order.status);
             return (
               <div key={order.id} className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand-500/5 transition-all group overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-slate-50">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#1a4d2e] group-hover:text-white transition-all shrink-0">
                          <Receipt size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-xs font-black text-slate-800 truncate">ID: #{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{order.createdAt}</p>
                        </div>
                     </div>
                     <div className="flex items-center self-start sm:self-auto">
                        <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${badge.style}`}>
                           {badge.label}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                     {order.items.map((item, i) => (
                       <div key={i} className="flex items-center gap-4 sm:gap-6">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-slate-100 transform group-hover:scale-105 transition-transform duration-500 shrink-0 bg-slate-50 flex items-center justify-center">
                             <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="font-bold text-slate-800 uppercase tracking-tight text-xs sm:text-sm truncate">{item.name}</h4>
                             <p className="text-[10px] sm:text-xs text-slate-400 font-medium">{item.quantity} {item.unit}</p>
                          </div>
                          {order.status === 'COMPLETED' && (
                            <button className="flex items-center gap-2 text-[#1a4d2e] bg-emerald-50/50 hover:bg-[#1a4d2e] hover:text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all shadow-xs shrink-0 border-0 cursor-pointer">
                               <Star size={12} className="sm:w-[14px] sm:h-[14px]" /> Beri Ulasan
                            </button>
                          )}
                       </div>
                     ))}
                  </div>

                  <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                     <div>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Transaksi</p>
                        <p className="text-xl sm:text-2xl font-black text-[#1a4d2e] font-display">{formatter.format(order.totalAmount)}</p>
                     </div>
                     <button 
                       onClick={() => navigate('/buyer/preorder')}
                       className="bg-slate-900 hover:bg-black text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-3 border-0 cursor-pointer shadow-md active:scale-95"
                     >
                        Beli Lagi
                        <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                     </button>
                  </div>
               </div>
             );
           })}
           {historyOrders.length === 0 && (
             <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100 p-8 shadow-xs">
               <ShoppingBag size={48} className="mx-auto text-slate-350 mb-4" />
               <p className="font-bold text-slate-700 text-lg mb-2">Belum Ada Riwayat Transaksi</p>
               <p className="text-slate-400 max-w-sm mx-auto text-sm mb-6">Pesanan yang telah selesai atau dibatalkan akan terekam di sini secara otomatis.</p>
               <button 
                 onClick={() => navigate('/buyer/preorder')}
                 className="bg-[#1a4d2e] hover:bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 mx-auto cursor-pointer border-0 shadow-lg shadow-emerald-950/10"
               >
                 Mulai Belanja
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
