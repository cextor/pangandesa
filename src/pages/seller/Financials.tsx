import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Download, 
  Briefcase, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Info, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { useOrder } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Financials() {
  const { orders } = useOrder();
  const { user } = useAuth();
  const [fundingModal, setFundingModal] = useState<string | null>(null);
  const [statementSuccess, setStatementSuccess] = useState(false);

  // Dynamic revenue calculation from database
  const completedOrActiveOrders = orders.filter(o => o.status !== 'WAITING_PAYMENT_DP' && o.status !== 'WAITING_ADMIN_DP');
  const totalRevenue = completedOrActiveOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  
  const withdrawableBalance = orders
    .filter(o => o.status === 'COMPLETED' || o.status === 'SHIPPING' || o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingBalance = orders
    .filter(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Partners list
  const fundingPartners = [
    {
      id: 'bri',
      name: 'Kredit Usaha Rakyat (KUR) BRI',
      description: 'Program pembiayaan modal kerja bersubsidi pemerintah dengan suku bunga rendah khusus petani.',
      rate: '6% Efektif Per Tahun',
      limit: 'Hingga Rp 50.000.000',
      logo: 'BANK BRI'
    },
    {
      id: 'crowde',
      name: 'Crowde Tani Sejahtera',
      description: 'Penyaluran modal kerja berupa saprotan (sarana produksi pertanian) dengan pengembalian bagi hasil panen.',
      rate: 'Bagi Hasil 70:30',
      limit: 'Sesuai Rencana Anggaran (RAB)',
      logo: 'CROWDE'
    },
    {
      id: 'tanifund',
      name: 'TaniFund Permodalan',
      description: 'Peer-to-peer lending khusus sektor pertanian nasional untuk pengembangan budidaya hortikultura.',
      rate: '12% Per Siklus Tanam',
      limit: 'Hingga Rp 150.000.000',
      logo: 'TaniFund'
    }
  ];

  const handleExportStatement = () => {
    setStatementSuccess(true);
    setTimeout(() => setStatementSuccess(false), 4000);
  };

  const handleApplyFunding = (partnerId: string) => {
    setFundingModal(partnerId);
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 pb-20">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <CreditCard className="text-brand-600" size={32} />
                 <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight">Keuangan & Invoice</h1>
              </div>
              <p className="text-slate-500 font-medium text-xs md:text-sm">Dokumentasi transaksi yang rapi dan terstruktur untuk mempermudah akses pembiayaan modal kerja tani.</p>
           </div>
        </div>

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Balance */}
          <div className="bg-brand-900 text-white p-8 rounded-[32px] shadow-xl shadow-emerald-950/20 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                <DollarSign size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[9px] font-black text-emerald-200 uppercase tracking-widest leading-none mb-1">Saldo yang Dapat Ditarik</p>
                <h4 className="text-2xl md:text-3xl font-black font-display">Rp {withdrawableBalance.toLocaleString('id-ID')}</h4>
              </div>
              <div className="flex items-center justify-between gap-4 pt-2">
                <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-300">Tersedia Rekening BRI</span>
                <button className="bg-white text-brand-900 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-brand-50 transition-colors shadow-sm">Tarik Dana</button>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
          </div>

          {/* Card 2: Revenue */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/50">
              <ArrowUpRight size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Pendapatan Kotor</p>
              <h4 className="text-2xl md:text-3xl font-black font-display text-slate-800">Rp {totalRevenue.toLocaleString('id-ID')}</h4>
            </div>
            <p className="text-[9px] font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded uppercase tracking-widest">
              +12.4% Bulan Ini
            </p>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center border border-orange-100/50">
              <ArrowDownRight size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dana Dalam Penangguhan (PO)</p>
              <h4 className="text-2xl md:text-3xl font-black font-display text-slate-800">Rp {pendingBalance.toLocaleString('id-ID')}</h4>
            </div>
            <p className="text-[9px] font-bold text-slate-400 bg-slate-50 w-fit px-2 py-0.5 rounded uppercase tracking-widest">
              Amankan Dana Escrow
            </p>
          </div>
        </div>

        {/* Financial Funding Hub */}
        <div className="bg-[#f0f9f3] border border-emerald-100 rounded-[32px] md:rounded-[40px] p-6 md:p-10 space-y-8 relative overflow-hidden group">
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                 <div className="bg-white text-brand-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm border border-emerald-100 w-fit">
                    <Award size={12} /> Funding Hub
                 </div>
                 <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Butuh Pendanaan Usaha Tani? 💼</h2>
                 <p className="text-slate-600 text-xs md:text-sm font-medium max-w-2xl">
                    PanganDesa membantu mendokumentasikan pembukuan transaksi Anda dengan sangat rapi. Cetak Laporan Arus Kas Bisnis Anda untuk pengajuan pembiayaan modal kerja dari institusi keuangan mitra.
                 </p>
              </div>

              <button 
                onClick={handleExportStatement}
                className="bg-brand-900 hover:bg-black text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-brand-950/10 flex items-center justify-center gap-3 shrink-0"
              >
                <FileSpreadsheet size={16} /> Ekspor Laporan Bisnis
              </button>
           </div>

           <AnimatePresence>
             {statementSuccess && (
               <motion.div 
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0 }}
                 className="bg-white border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-tight shadow-md"
               >
                 <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                 Laporan Arus Kas Bisnis berhasil diekspor! File `pangan_desa_statement_${user?.name || 'mitra'}.xlsx` tersimpan di folder unduhan Anda.
               </motion.div>
             )}
           </AnimatePresence>

           {/* Partners Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 relative z-10">
              {fundingPartners.map((partner) => (
                <div key={partner.id} className="bg-white rounded-[24px] border border-emerald-500/10 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-4">
                     <span className="inline-block text-[8px] font-black text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-100 uppercase tracking-widest">{partner.logo}</span>
                     <div>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{partner.name}</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-2">{partner.description}</p>
                     </div>
                  </div>
                  
                  <div className="border-t border-slate-50 pt-4 mt-6 space-y-3">
                     <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-slate-400 uppercase tracking-widest">Suku Bunga:</span>
                        <span className="text-brand-700 font-black">{partner.rate}</span>
                     </div>
                     <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-slate-400 uppercase tracking-widest">Limit Kredit:</span>
                        <span className="text-slate-800 font-black">{partner.limit}</span>
                     </div>
                     <button 
                       onClick={() => handleApplyFunding(partner.name)}
                       className="w-full bg-slate-50 hover:bg-brand-50 hover:text-brand-700 text-slate-600 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border border-slate-100 mt-2"
                     >
                       Ajukan Pendanaan
                     </button>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Transaction History & Invoice List */}
        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm space-y-8">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-6">
              <div>
                 <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Riwayat Invoice & Pencairan</h3>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Daftar lengkap kuitansi pembayaran dan pencairan dana masuk.</p>
              </div>
           </div>

           <div className="divide-y divide-slate-50">
              {completedOrActiveOrders.length > 0 ? (
                completedOrActiveOrders.map((o) => (
                  <div key={o.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors border border-slate-100 shadow-sm">
                           <CreditCard size={20} />
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                             <h4 className="text-sm font-black text-slate-800 uppercase">INV/{(o.createdAt || '30/05/2026').replace(/\//g, '')}/{o.id.slice(-4).toUpperCase()}</h4>
                             <span className={`text-[7px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                               o.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                             }`}>
                               {o.status === 'COMPLETED' ? 'LUNAS' : 'PENDING'}
                             </span>
                           </div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                             Pembeli: <span className="text-slate-600 font-black">{o.buyerName}</span> • {o.createdAt}
                           </p>
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-slate-50 sm:border-t-0 pt-3 sm:pt-0">
                        <div className="text-right">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Nilai Transaksi</p>
                           <p className="text-sm sm:text-base font-black text-slate-800">Rp {o.totalAmount.toLocaleString('id-ID')}</p>
                        </div>
                        <button 
                          onClick={() => {
                            alert(`Mengunduh berkas PDF Invoice ${o.id.toUpperCase()}...`);
                          }}
                          className="w-10 h-10 bg-slate-50 hover:bg-brand-900 hover:text-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 transition-all active:scale-95 shadow-sm"
                        >
                           <Download size={16} />
                        </button>
                     </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 space-y-3">
                   <Info size={24} className="mx-auto text-slate-300" />
                   <p className="text-xs font-bold uppercase tracking-widest">Belum ada transaksi terekam untuk invoice.</p>
                </div>
              )}
           </div>
        </div>

      </div>

      {/* Funding Modal Simulator */}
      <AnimatePresence>
        {fundingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setFundingModal(null)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl p-8 space-y-6"
             >
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                   <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Pengajuan Pembiayaan</h3>
                   <button onClick={() => setFundingModal(null)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20} /></button>
                </div>

                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-1">
                   <p className="text-[8px] font-black text-brand-700 uppercase tracking-widest">Mitra Finansial</p>
                   <p className="text-base font-black text-slate-800">{fundingModal}</p>
                </div>

                <div className="space-y-4">
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Rencana Penggunaan Dana (RAB)</p>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Jumlah Pengajuan</label>
                         <input type="text" defaultValue="Rp 15.000.000" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-black outline-none shadow-inner" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Tenor Pengembalian</label>
                         <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold outline-none shadow-sm">
                            <option>6 Bulan (Siklus Tanam)</option>
                            <option>12 Bulan (1 Tahun)</option>
                         </select>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                   <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                   <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
                      Dengan mengirimkan form ini, data transaksi Anda dari pembukuan PanganDesa akan dilampirkan otomatis sebagai syarat verifikasi permodalan Anda.
                   </p>
                </div>

                <button 
                  onClick={() => {
                     alert('Pengajuan Anda telah dikirimkan ke tim verifikator mitra keuangan! Tim analis kami akan segera menghubungi Anda melalui WhatsApp.');
                     setFundingModal(null);
                  }}
                  className="w-full bg-[#1a4d2e] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/20 active:scale-95 transition-transform"
                >
                   Kirim Pengajuan Pembiayaan
                </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
