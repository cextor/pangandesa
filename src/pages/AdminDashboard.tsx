import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Wallet, 
  Clock,
  ChevronRight,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Order } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  onConfirmPayment: (orderId: string, statusType: 'DP' | 'FINAL') => void;
}

export default function AdminDashboard({ orders, onConfirmPayment }: AdminDashboardProps) {
  const [filter, setFilter] = React.useState<'ALL' | 'PENDING'>('PENDING');

  const paymentPendingOrders = orders.filter(o => 
    o.status === 'WAITING_ADMIN_DP' || o.status === 'WAITING_ADMIN_FINAL'
  );

  const displayOrders = filter === 'PENDING' ? paymentPendingOrders : orders;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="p-10 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <ShieldCheck className="text-brand-600" size={32} />
                 <h1 className="text-3xl font-black text-slate-800 font-display">Admin Portal</h1>
              </div>
              <p className="text-slate-500 font-medium">Verifikasi pembayaran dan awasi transaksi PanganDesa.</p>
           </div>
           
           <div className="flex gap-4">
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center gap-6 shadow-sm">
                 <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Wallet size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Verified</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">Rp 128.4M</p>
                 </div>
              </div>
              <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex items-center gap-6 shadow-sm">
                 <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Clock size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Waiting Action</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">{paymentPendingOrders.length}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
                 <button 
                  onClick={() => setFilter('PENDING')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${
                    filter === 'PENDING' ? 'bg-brand-900 text-white' : 'text-slate-400 hover:text-slate-800'
                  }`}
                 >
                   Perlu Konfirmasi
                 </button>
                 <button 
                  onClick={() => setFilter('ALL')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${
                    filter === 'ALL' ? 'bg-brand-900 text-white' : 'text-slate-400 hover:text-slate-800'
                  }`}
                 >
                   Semua Transaksi
                 </button>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Cari ID Pesanan..." 
                      className="bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold outline-none focus:ring-4 focus:ring-brand-500/5 transition-all w-64 shadow-sm"
                    />
                 </div>
              </div>
           </div>

           {/* Orders Table */}
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-slate-50">
                       <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaksi</th>
                       <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
                       <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis</th>
                       <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 font-display">
                    {displayOrders.length > 0 ? displayOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-8">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                                 <AlertCircle size={20} />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-800">#{order.id.toUpperCase()}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.createdAt}</p>
                              </div>
                           </div>
                        </td>
                        <td className="p-8">
                           <p className="text-sm font-black text-slate-800">
                             Rp {(order.status === 'WAITING_ADMIN_DP' ? order.dpAmount : order.remainingAmount).toLocaleString('id-ID')}
                           </p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">Screenshot Terlampir</p>
                        </td>
                        <td className="p-8">
                           <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight ${
                             order.status === 'WAITING_ADMIN_DP' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                           }`}>
                             {order.status === 'WAITING_ADMIN_DP' ? 'Down Payment' : 'Pelunasan'}
                           </span>
                        </td>
                        <td className="p-8">
                           <div className="flex items-center gap-2 text-orange-500">
                              <Clock size={14} />
                              <span className="text-[10px] font-black uppercase tracking-tight">Verifikasi Manual</span>
                           </div>
                        </td>
                        <td className="p-8">
                           <div className="flex items-center gap-2">
                              <button 
                                onClick={() => onConfirmPayment(order.id, order.status === 'WAITING_ADMIN_DP' ? 'DP' : 'FINAL')}
                                className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all hover:bg-emerald-600 flex items-center gap-2"
                              >
                                <CheckCircle2 size={14} /> Verifikasi
                              </button>
                              <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                                <XCircle size={18} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="p-20 text-center">
                           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                              <ShieldCheck size={40} />
                           </div>
                           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tidak ada antrian verifikasi</p>
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}
