import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Wallet, 
  Clock, 
  AlertCircle, 
  MessageSquare,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../types';

interface PaymentVerificationProps {
  orders: Order[];
  onConfirmPayment: (orderId: string, statusType: 'DP' | 'FINAL' | 'DP_REJECT' | 'FINAL_REJECT') => void;
}

export default function PaymentVerification({ orders, onConfirmPayment }: PaymentVerificationProps) {
  const navigate = useNavigate();
  const [orderSearch, setOrderSearch] = React.useState('');
  const [selectedVerifyOrder, setSelectedVerifyOrder] = React.useState<Order | null>(null);
  const [isRejecting, setIsRejecting] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState('');

  const paymentPendingOrders = orders.filter(o => 
    o.status === 'WAITING_ADMIN_DP' || o.status === 'WAITING_ADMIN_FINAL'
  );

  const filteredOrders = paymentPendingOrders.filter(o => 
    o.id.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
           <div>
              <div className="flex items-center gap-2 mb-0.5">
                 <ShieldCheck className="text-brand-600" size={18} />
                 <h1 className="text-lg font-black text-slate-800 font-display">Verifikasi Pembayaran</h1>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Verifikasi slip setoran Down Payment (30%) dan Pelunasan (70%) nasabah.</p>
           </div>
 
           <div className="shrink-0">
              <div className="bg-orange-50/70 border border-orange-100 p-3 rounded-2xl flex items-center gap-3 shadow-xs">
                 <div className="w-8 h-8 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-orange-500/10">
                    <Clock size={16} />
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-orange-600 uppercase tracking-wider mb-0.5">Waiting Action</p>
                    <p className="text-base font-black text-slate-800 tracking-tight leading-none">{paymentPendingOrders.length}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar pb-32">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Search bar row */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Antrean Pembayaran Pending</h3>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari ID Pesanan..." 
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="bg-white border border-slate-100 rounded-2xl py-2.5 pl-11 pr-5 text-xs font-bold outline-none focus:ring-4 focus:ring-brand-500/5 transition-all w-60 shadow-sm"
              />
            </div>
          </div>

          {/* Verification Table */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                 <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="p-6 pl-8 text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaksi</th>
                    <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
                    <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis</th>
                    <th className="p-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="p-6 pr-8 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-55 font-display">
                 {filteredOrders.length > 0 ? filteredOrders.map((order) => (
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
                        <p className="text-xs font-black text-slate-800">
                          Rp {(order.status === 'WAITING_ADMIN_DP' ? order.dpAmount : order.remainingAmount).toLocaleString('id-ID')}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Screenshot Terlampir</p>
                     </td>
                     <td className="p-6">
                        <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-tight ${
                          order.status === 'WAITING_ADMIN_DP' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {order.status === 'WAITING_ADMIN_DP' ? 'Down Payment' : 'Pelunasan'}
                        </span>
                     </td>
                     <td className="p-6">
                        <div className="flex items-center gap-1.5 text-orange-500">
                           <Clock size={12} />
                           <span className="text-[9px] font-black uppercase tracking-tight">Verifikasi Manual</span>
                        </div>
                     </td>
                     <td className="p-6 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => {
                               setSelectedVerifyOrder(order);
                               setIsRejecting(false);
                               setRejectionReason('');
                             }}
                             className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-md shadow-emerald-500/10 active:scale-95 transition-all hover:bg-emerald-600 flex items-center gap-1.5 border-0 cursor-pointer"
                           >
                             <CheckCircle2 size={12} /> Verifikasi
                           </button>
                           <button 
                             onClick={() => navigate('/admin/transaksi-panen')}
                             className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-all flex items-center justify-center cursor-pointer border-0"
                             title="Diskusi Forum"
                           >
                             <MessageSquare size={14} />
                           </button>
                           <button 
                             onClick={() => {
                               setSelectedVerifyOrder(order);
                               setIsRejecting(true);
                               setRejectionReason('');
                             }}
                             className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all border-0 cursor-pointer"
                             title="Tolak Pembayaran"
                           >
                             <XCircle size={14} />
                           </button>
                        </div>
                     </td>
                   </tr>
                 )) : (
                   <tr>
                     <td colSpan={5} className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                           <ShieldCheck size={32} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tidak ada antrian verifikasi</p>
                     </td>
                   </tr>
                 )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Verification Detail Modal */}
      {selectedVerifyOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedVerifyOrder(null)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-800 font-display">Detail Verifikasi Pembayaran</h3>
              <button 
                onClick={() => setSelectedVerifyOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-all border-0 bg-transparent cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Transaksi</span>
                    <span className="font-bold text-slate-800 text-xs">#{selectedVerifyOrder.id.toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Jenis Pembayaran</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      selectedVerifyOrder.status === 'WAITING_ADMIN_DP' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {selectedVerifyOrder.status === 'WAITING_ADMIN_DP' ? 'Down Payment (30%)' : 'Pelunasan (70%)'}
                    </span>
                  </div>
                </div>

                {/* Simulated Bank Receipt Slip (Bukti Transfer) */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Bukti Transfer (Slip Setoran)</span>
                  <div className="bg-slate-900 rounded-3xl p-6 text-white font-mono space-y-4 max-w-sm mx-auto shadow-xl border border-slate-800 relative group overflow-hidden">
                    <div className="text-center pb-4 border-b border-white/5">
                      <h4 className="text-xs font-black tracking-widest text-emerald-400">TRANSFER BERHASIL</h4>
                      <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-tight">Siklus Escrow PanganDesa</p>
                    </div>
                    <div className="space-y-2 text-[10px]">
                      <div className="flex justify-between"><span className="text-slate-400">TANGGAL:</span><span>{selectedVerifyOrder.createdAt}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">ID TRANS:</span><span>#{selectedVerifyOrder.id.toUpperCase()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">PENGIRIM:</span><span>{selectedVerifyOrder.buyerName || 'Mitra Pembeli Desa'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">BANK TUJUAN:</span><span>BNI</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">REK TUJUAN:</span><span>1384354499</span></div>
                      <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                        <span className="text-slate-400 font-bold">TOTAL BAYAR:</span>
                        <span className="text-emerald-400 font-black text-xs">
                          Rp {(selectedVerifyOrder.status === 'WAITING_ADMIN_DP' ? selectedVerifyOrder.dpAmount : selectedVerifyOrder.remainingAmount).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
                  </div>
                </div>
              </div>

              {isRejecting ? (
                <div className="space-y-4 bg-red-50/50 p-5 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-red-800 uppercase tracking-widest block">Alasan Penolakan Pembayaran</label>
                    <textarea 
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Masukkan alasan penolakan, contoh: Bukti transfer tidak terbaca atau nominal tidak sesuai."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs font-semibold text-slate-800 bg-white resize-none"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsRejecting(false)}
                      className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Batal
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        if (!rejectionReason.trim()) return;
                        onConfirmPayment(selectedVerifyOrder.id, selectedVerifyOrder.status === 'WAITING_ADMIN_DP' ? 'DP_REJECT' : 'FINAL_REJECT');
                        setSelectedVerifyOrder(null);
                      }}
                      className="flex-1 py-2.5 bg-red-650 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider border-0 cursor-pointer shadow-md shadow-red-950/10"
                    >
                      Kirim Penolakan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => {
                      setIsRejecting(true);
                      setRejectionReason('');
                    }}
                    className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-0 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={14} /> Tolak Pembayaran
                  </button>
                  <button 
                    onClick={() => {
                      onConfirmPayment(selectedVerifyOrder.id, selectedVerifyOrder.status === 'WAITING_ADMIN_DP' ? 'DP' : 'FINAL');
                      setSelectedVerifyOrder(null);
                    }}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all border-0 cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={14} /> Setujui Pembayaran
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
