import React from 'react';
import { 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Wallet 
} from 'lucide-react';

export default function SystemConfiguration() {
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
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden font-display">
      {/* Header */}
      <div className="p-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <Settings className="text-brand-600 animate-spin-slow" size={26} />
                 <h1 className="text-2xl font-black text-slate-800 font-display">Konfigurasi Sistem</h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">Pengaturan parameter operasional finansial dan penyesuaian biaya layanan global.</p>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar pb-32">
        <div className="max-w-6xl mx-auto space-y-8">

          {showSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-3xl flex items-center gap-3 text-xs font-bold shadow-md shadow-emerald-500/5">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              Konfigurasi biaya layanan berhasil diperbarui menjadi {serviceFee}% dan telah disinkronisasikan!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Configuration Controls */}
            <div className="lg:col-span-7 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
               <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                 <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Biaya Layanan Transaksi</h3>
                 <span className="text-[10px] font-black bg-brand-50 text-brand-600 px-3 py-1 rounded-full uppercase tracking-wider">Escrow Aktif</span>
               </div>

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
                 className="w-full bg-brand-900 hover:bg-black text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
               </button>
            </div>

            {/* Transaction Simulator */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-[32px] p-8 space-y-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
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
      </div>
    </div>
  );
}
