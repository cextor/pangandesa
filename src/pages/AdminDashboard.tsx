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
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  onConfirmPayment: (orderId: string, statusType: 'DP' | 'FINAL') => void;
}

export default function AdminDashboard({ orders, onConfirmPayment }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState<'ALL' | 'PENDING' | 'DOCS' | 'SETTINGS'>('PENDING');

  const paymentPendingOrders = orders.filter(o => 
    o.status === 'WAITING_ADMIN_DP' || o.status === 'WAITING_ADMIN_FINAL'
  );

  const displayOrders = filter === 'PENDING' ? paymentPendingOrders : (filter === 'ALL' ? orders : []);

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
                 <button 
                  onClick={() => setFilter('DOCS')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${
                    filter === 'DOCS' ? 'bg-brand-900 text-white' : 'text-slate-400 hover:text-slate-800'
                  }`}
                 >
                   Verifikasi Berkas
                 </button>
                 <button 
                  onClick={() => setFilter('SETTINGS')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${
                    filter === 'SETTINGS' ? 'bg-brand-900 text-white' : 'text-slate-400 hover:text-slate-800'
                  }`}
                 >
                   Konfigurasi Sistem
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

           {/* Orders, Docs, or Settings Content */}
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
              {filter === 'SETTINGS' ? (
                <AdminSettingsPanel />
              ) : filter === 'DOCS' ? (
                <div className="p-8 sm:p-20 text-center">
                   <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600">
                      <ShieldCheck size={40} />
                   </div>
                   <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Verifikasi Dokumen Legalitas</h3>
                   <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">Antrian verifikasi Akte, NIB, dan Sertifikat Lahan untuk Seller & Buyer Company.</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {[
                        { id: 1, name: 'Pak Joko (Seller)', type: 'Sertifikat Lahan', date: '5 May 2024' },
                        { id: 2, name: 'PT Panen Jaya (Buyer)', type: 'Akte Pendirian', date: '4 May 2024' }
                      ].map(doc => (
                        <div key={doc.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left flex items-center justify-between">
                           <div>
                              <p className="text-sm font-black text-slate-800">{doc.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.type}</p>
                           </div>
                           <button className="p-3 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-600/20 hover:bg-black transition-all">
                              <Eye size={16} />
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
              ) : (
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
                              <button 
                                onClick={() => navigate('/admin/transaksi-panen')}
                                className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-all flex items-center justify-center cursor-pointer"
                                title="Diskusi Forum"
                              >
                                <MessageSquare size={16} />
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
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

function AdminSettingsPanel() {
  const [serviceFee, setServiceFee] = React.useState<number>(() => Number(localStorage.getItem('service_fee') || '7'));
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [simulationTotal, setSimulationTotal] = React.useState('150000');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('service_fee', String(serviceFee));
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const simSubtotal = Number(simulationTotal) || 0;
  const simFee = Math.round(simSubtotal * (serviceFee / 100));
  const simOngkir = simSubtotal > 0 ? 15000 : 0;
  const simTotal = simSubtotal + simFee + simOngkir;
  const simDP = Math.round(simTotal * 0.3);
  const simPelunasan = simTotal - simDP;

  return (
    <div className="p-10 space-y-8 font-display">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
             <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Konfigurasi Finansial Sistem</h3>
             <p className="text-slate-500 font-medium text-xs mt-1">Sesuaikan besaran biaya layanan untuk seluruh transaksi pre-order PanganDesa.</p>
          </div>
          <div className="px-4 py-2.5 bg-brand-50 border border-brand-100 rounded-2xl flex items-center gap-2">
             <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
             <span className="text-[10px] font-black text-brand-900 uppercase tracking-widest">Sistem Aktif</span>
          </div>
       </div>

       {showSuccess && (
         <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-3xl flex items-center gap-3 text-xs font-bold shadow-md shadow-emerald-500/5">
           <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
           Konfigurasi biaya layanan berhasil diperbarui menjadi {serviceFee}% dan telah disinkronisasikan!
         </div>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Configuration Controls */}
          <div className="lg:col-span-7 bg-slate-50 rounded-[32px] p-8 border border-slate-100 space-y-6">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Persentase Biaya Layanan</label>
                <div className="flex items-center gap-6">
                   <input 
                     type="range" 
                     min="0" 
                     max="50" 
                     value={serviceFee}
                     onChange={(e) => setServiceFee(Number(e.target.value))}
                     className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-900"
                   />
                   <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={serviceFee}
                        onChange={(e) => setServiceFee(Math.max(0, Math.min(100, Number(e.target.value))))}
                        className="w-20 bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm font-black text-slate-800 text-center focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 outline-none transition-all"
                      />
                      <span className="font-bold text-slate-500 text-sm">%</span>
                   </div>
                </div>
             </div>

             <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                   Biaya layanan dibebankan kepada pembeli pada saat checkout keranjang belanja. Nilai ini dihitung berdasarkan persentase dari total harga produk yang dipesan.
                </p>
             </div>

             <button 
               onClick={handleSave}
               disabled={isSaving}
               className="w-full bg-brand-900 hover:bg-black text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-950/10 active:scale-95 transition-all flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
             </button>
          </div>

          {/* Right: Transaction Simulator */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-[32px] p-8 space-y-6 relative overflow-hidden flex flex-col justify-between">
             <div className="relative z-10 space-y-6">
                <div>
                   <h4 className="font-black uppercase tracking-widest text-[10px] text-emerald-400">Simulator Transaksi</h4>
                   <p className="text-[10px] text-slate-400 font-medium mt-0.5">Uji dampak konfigurasi biaya layanan secara langsung.</p>
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Simulasi Total Belanja</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                      <input 
                        type="text" 
                        value={simulationTotal}
                        onChange={(e) => setSimulationTotal(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-xs font-black text-white outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all"
                      />
                   </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-white/5 text-[11px] font-medium text-slate-300">
                   <div className="flex justify-between items-center">
                      <span>Subtotal Produk</span>
                      <span className="font-bold text-white">Rp {simSubtotal.toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span>Ongkir (Estimasi)</span>
                      <span className="font-bold text-white">Rp {simOngkir.toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between items-center text-emerald-400">
                      <span>Biaya Layanan ({serviceFee}%)</span>
                      <span className="font-bold">Rp {simFee.toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between items-center border-t border-white/5 pt-2.5 text-xs font-black text-white uppercase">
                      <span>Total Transaksi</span>
                      <span className="text-sm font-black text-emerald-400 font-display">Rp {simTotal.toLocaleString('id-ID')}</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-[10px]">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                      <p className="font-black text-slate-400 uppercase tracking-widest text-[8px] mb-0.5">DP Pembeli (30%)</p>
                      <p className="font-black text-white text-xs">Rp {simDP.toLocaleString('id-ID')}</p>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                      <p className="font-black text-slate-400 uppercase tracking-widest text-[8px] mb-0.5">Pelunasan (70%)</p>
                      <p className="font-black text-white text-xs">Rp {simPelunasan.toLocaleString('id-ID')}</p>
                   </div>
                </div>
             </div>
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
          </div>
       </div>
    </div>
  );
}
