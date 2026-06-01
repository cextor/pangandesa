import React from 'react';
import { 
  BarChart3, 
  Search, 
  Clock, 
  AlertCircle, 
  MessageSquare,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../types';

interface SystemReportsProps {
  orders: Order[];
}

export default function SystemReports({ orders }: SystemReportsProps) {
  const navigate = useNavigate();
  const [orderSearch, setOrderSearch] = React.useState('');

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.status.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden font-display">
      {/* Header */}
      <div className="p-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <BarChart3 className="text-brand-600" size={26} />
                 <h1 className="text-2xl font-black text-slate-800 font-display">Laporan Transaksi</h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">Rekapitulasi log seluruh transaksi, omzet pendapatan, dan riwayat audit escrow.</p>
           </div>

           <div className="flex gap-4">
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center gap-6 shadow-sm">
                 <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Audit</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">{orders.length} Transaksi</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar pb-32">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Search bar row */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Log Semua Transaksi</h3>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari ID Pesanan/Status..." 
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold outline-none focus:ring-4 focus:ring-brand-500/5 transition-all w-64 shadow-sm"
              />
            </div>
          </div>

          {/* Audit Table */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                 <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaksi</th>
                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Belanja</th>
                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">DP (30%)</th>
                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelunasan (70%)</th>
                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Audit</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-display">
                 {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                   <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
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
                     <td className="p-8 font-black text-slate-800 text-sm">
                       Rp {order.totalAmount.toLocaleString('id-ID')}
                     </td>
                     <td className="p-8 font-bold text-slate-600 text-xs">
                       Rp {order.dpAmount.toLocaleString('id-ID')}
                     </td>
                     <td className="p-8 font-bold text-slate-650 text-xs">
                       Rp {order.remainingAmount.toLocaleString('id-ID')}
                     </td>
                     <td className="p-8">
                        <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight ${
                          order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                          order.status === 'CANCELLED' ? 'bg-red-50 text-red-650' : 'bg-orange-50 text-orange-500'
                        }`}>
                          {order.status}
                        </span>
                     </td>
                   </tr>
                 )) : (
                   <tr>
                     <td colSpan={5} className="p-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                           <BarChart3 size={40} />
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tidak ada record audit log</p>
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
