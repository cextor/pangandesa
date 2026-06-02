import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../types';

interface PaymentVerificationProps {
  orders: Order[];
  onConfirmPayment: (orderId: string, statusType: 'DP' | 'FINAL' | 'DP_REJECT' | 'FINAL_REJECT' | 'CANCEL_DP' | 'CANCEL_FINAL') => void;
}

export default function PaymentVerification({ orders, onConfirmPayment }: PaymentVerificationProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'pending' | 'history'>('pending');
  const [orderSearch, setOrderSearch] = React.useState('');

  const paymentPendingOrders = orders.filter(o => 
    o.status === 'WAITING_ADMIN_DP' || o.status === 'WAITING_ADMIN_FINAL'
  );

  const confirmedOrders = orders.filter(o => 
    o.status === 'WAITING_HARVEST' || 
    o.status === 'HARVEST_CONFIRMED_SELLER' || 
    o.status === 'WAITING_FINAL_PAYMENT' || 
    o.status === 'SHIPPING' || 
    o.status === 'DELIVERED' || 
    o.status === 'COMPLETED'
  );

  const currentTabOrders = activeTab === 'pending' ? paymentPendingOrders : confirmedOrders;

  const filteredOrders = currentTabOrders.filter(o => 
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    (o.buyerName && o.buyerName.toLowerCase().includes(orderSearch.toLowerCase()))
  );

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar flex flex-col">
      {/* Header - Not sticky */}
      <div className="p-4 sm:p-6 bg-white border-b border-slate-100 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
           <div>
              <div className="flex items-center gap-2 mb-0.5">
                 <ShieldCheck className="text-brand-600 animate-pulse-slow" size={18} />
                 <h1 className="text-base sm:text-lg font-black text-slate-800 font-display">Verifikasi Pembayaran</h1>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Verifikasi slip setoran Down Payment (30%) dan Pelunasan (70%) nasabah.</p>
           </div>
 
           <div className="shrink-0 self-start sm:self-auto">
              <div className="bg-orange-50/70 border border-orange-100 p-2.5 sm:p-3 rounded-2xl flex items-center gap-3 shadow-xs">
                 <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-orange-500/10">
                    <Clock size={14} />
                 </div>
                 <div>
                    <p className="text-[7px] sm:text-[8px] font-black text-orange-600 uppercase tracking-wider mb-0.5">Waiting Action</p>
                    <p className="text-sm sm:text-base font-black text-slate-800 tracking-tight leading-none">{paymentPendingOrders.length}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="p-4 sm:p-10 max-w-6xl w-full mx-auto space-y-6 sm:space-y-8 pb-32">
        
        {/* Navigation Tabs and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/50 w-full sm:w-fit overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 sm:flex-initial text-center px-4 sm:px-5 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-0 whitespace-nowrap ${
                activeTab === 'pending'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
              }`}
            >
              Antrean Verifikasi ({paymentPendingOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 sm:flex-initial text-center px-4 sm:px-5 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-0 whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
              }`}
            >
              Riwayat Pembayaran ({confirmedOrders.length})
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari ID/Nama Pembeli..." 
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl py-2.5 pl-11 pr-5 text-xs font-bold outline-none focus:ring-4 focus:ring-brand-500/5 transition-all w-full shadow-sm"
            />
          </div>
        </div>

        {/* 1. Desktop Tabular View */}
        <div className="hidden md:block bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <table className="w-full text-left">
            <thead>
               <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="p-6 pl-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaksi</th>
                  <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Pembeli</th>
                  <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
                  <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis</th>
                  <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-6 pr-8 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-display">
               {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                 const isDp = order.status === 'WAITING_ADMIN_DP' || ['WAITING_HARVEST', 'HARVEST_CONFIRMED_SELLER', 'WAITING_FINAL_PAYMENT'].includes(order.status);
                 return (
                   <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                     <td className="p-6 pl-8">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                              <AlertCircle size={18} />
                           </div>
                           <div>
                              <p className="text-xs font-black text-slate-800">#{order.id.toUpperCase()}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{order.createdAt}</p>
                           </div>
                        </div>
                     </td>
                     <td className="p-6">
                        <p className="text-xs font-black text-slate-800">{order.buyerName || 'Mitra Pembeli Desa'}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{order.buyerVillage || 'Sukamaju'}</p>
                     </td>
                     <td className="p-6">
                        <p className="text-xs font-black text-slate-800">
                          Rp {(isDp ? order.dpAmount : order.remainingAmount).toLocaleString('id-ID')}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Screenshot Terlampir</p>
                     </td>
                     <td className="p-6">
                        <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-tight ${
                          isDp ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {isDp ? 'Down Payment' : 'Pelunasan'}
                        </span>
                     </td>
                     <td className="p-6">
                        {activeTab === 'pending' ? (
                          <div className="flex items-center gap-1.5 text-orange-500">
                             <Clock size={12} />
                             <span className="text-[9px] font-black uppercase tracking-tight">Verifikasi Manual</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-600">
                             <CheckCircle2 size={12} />
                             <span className="text-[9px] font-black uppercase tracking-tight">
                               {isDp ? 'DP TERKONFIRMASI' : 'LUNAS TERKONFIRMASI'}
                             </span>
                          </div>
                        )}
                     </td>
                     <td className="p-6 pr-8 text-right">
                        {activeTab === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => navigate(`/admin/verifikasi/${order.id}`)}
                               className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-md shadow-emerald-500/10 active:scale-95 transition-all hover:bg-emerald-600 flex items-center gap-1.5 border-0 cursor-pointer font-bold animate-in fade-in"
                             >
                               <AlertCircle size={12} /> Detail
                             </button>

                             <button 
                               onClick={() => navigate('/admin/transaksi-panen/' + order.id)}
                               className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-all flex items-center justify-center cursor-pointer border-0"
                               title="Diskusi Forum"
                             >
                               <MessageSquare size={14} />
                             </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => navigate(`/admin/verifikasi/${order.id}`)}
                               className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider active:scale-95 transition-all flex items-center gap-1.5 border-0 cursor-pointer font-bold"
                             >
                               <AlertCircle size={12} /> Detail
                             </button>
                             
                             <button 
                               onClick={() => navigate('/admin/transaksi-panen/' + order.id)}
                               className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-all flex items-center justify-center cursor-pointer border-0"
                               title="Diskusi Forum"
                             >
                               <MessageSquare size={14} />
                             </button>

                             <button
                               onClick={() => {
                                 if (confirm(`Apakah Anda yakin ingin membatalkan konfirmasi pembayaran ${isDp ? 'DP' : 'Pelunasan'} untuk pesanan #${order.id.toUpperCase()}? Status pesanan akan dikembalikan ke status Verifikasi Manual.`)) {
                                   onConfirmPayment(order.id, isDp ? 'CANCEL_DP' : 'CANCEL_FINAL');
                                 }
                               }}
                               className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider active:scale-95 transition-all flex items-center gap-1.5 border-0 cursor-pointer font-bold"
                               title="Batalkan Konfirmasi Pembayaran"
                             >
                               <XCircle size={12} /> Batalkan Konfirmasi
                             </button>
                          </div>
                        )}
                     </td>
                   </tr>
                 );
               }) : (
                 <tr>
                   <td colSpan={6} className="p-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                         <ShieldCheck size={32} />
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                         {activeTab === 'pending' ? 'Tidak ada antrean verifikasi' : 'Tidak ada riwayat pembayaran'}
                      </p>
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>

        {/* 2. Mobile Responsive Card List */}
        <div className="block md:hidden space-y-4 animate-in fade-in duration-300">
          {filteredOrders.length > 0 ? filteredOrders.map((order) => {
            const isDp = order.status === 'WAITING_ADMIN_DP' || ['WAITING_HARVEST', 'HARVEST_CONFIRMED_SELLER', 'WAITING_FINAL_PAYMENT'].includes(order.status);
            const amount = isDp ? order.dpAmount : order.remainingAmount;
            
            return (
              <div key={order.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <AlertCircle size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">#{order.id.toUpperCase()}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">{order.createdAt}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                    isDp ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {isDp ? 'DP' : 'Pelunasan'}
                  </span>
                </div>

                {/* Card Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Pembeli</p>
                    <p className="font-bold text-slate-800 truncate">{order.buyerName || 'Mitra Pembeli Desa'}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase truncate">{order.buyerVillage || 'Sukamaju'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Nominal</p>
                    <p className="font-black text-slate-800 text-brand-650">Rp {amount.toLocaleString('id-ID')}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">Slip Terlampir</p>
                  </div>
                </div>

                {/* Card Actions & Status */}
                <div className="flex flex-col gap-3 pt-3 border-t border-slate-50">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider">Status</span>
                    {activeTab === 'pending' ? (
                      <div className="flex items-center gap-1 text-orange-500 font-bold text-[8px] uppercase tracking-wider">
                         <Clock size={10} /> Verifikasi Manual
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-[8px] uppercase tracking-wider">
                         <CheckCircle2 size={10} /> {isDp ? 'DP OK' : 'LUNAS OK'}
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 w-full">
                    {activeTab === 'pending' ? (
                      <>
                        <button 
                          onClick={() => navigate(`/admin/verifikasi/${order.id}`)}
                          className="flex-grow bg-emerald-500 text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-md active:scale-95 transition-all hover:bg-emerald-600 flex items-center justify-center gap-1 border-0 cursor-pointer font-bold"
                        >
                          <AlertCircle size={11} /> Detail
                        </button>
                        <button 
                          onClick={() => navigate('/admin/transaksi-panen/' + order.id)}
                          className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-all flex items-center justify-center cursor-pointer border-0 shrink-0"
                          title="Diskusi Forum"
                        >
                          <MessageSquare size={13} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => navigate(`/admin/verifikasi/${order.id}`)}
                          className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1 border-0 cursor-pointer font-bold"
                        >
                          <AlertCircle size={11} /> Detail
                        </button>
                        
                        <button 
                          onClick={() => navigate('/admin/transaksi-panen/' + order.id)}
                          className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-all flex items-center justify-center cursor-pointer border-0 shrink-0"
                          title="Diskusi Forum"
                        >
                          <MessageSquare size={13} />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Apakah Anda yakin ingin membatalkan konfirmasi pembayaran ${isDp ? 'DP' : 'Pelunasan'} untuk pesanan #${order.id.toUpperCase()}?`)) {
                              onConfirmPayment(order.id, isDp ? 'CANCEL_DP' : 'CANCEL_FINAL');
                            }
                          }}
                          className="flex-grow bg-rose-50 text-rose-600 hover:bg-rose-100 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1 border-0 cursor-pointer font-bold"
                        >
                          <XCircle size={11} /> Batalkan
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-200">
                  <ShieldCheck size={24} />
               </div>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {activeTab === 'pending' ? 'Tidak ada antrean verifikasi' : 'Tidak ada riwayat pembayaran'}
               </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
