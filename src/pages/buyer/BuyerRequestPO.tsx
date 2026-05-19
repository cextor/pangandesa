import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Sprout, 
  Calendar, 
  Package, 
  Trash2, 
  PlusCircle, 
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { BuyerRequest } from '../../types';
import { MOCK_BUYER_REQUESTS } from '../../constants';

export default function BuyerRequestPO() {
  const [requests, setRequests] = useState<BuyerRequest[]>(MOCK_BUYER_REQUESTS);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    panganType: '',
    quantity: 0,
    unit: 'kg',
    deliveryPeriod: '',
    budget: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: BuyerRequest = {
      id: Math.random().toString(36).substr(2, 9),
      buyerId: 'user-1',
      buyerName: 'Budi Santoso',
      ...formData,
      status: 'OPEN',
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    setRequests([newReq, ...requests]);
    setIsAdding(false);
    setFormData({ panganType: '', quantity: 0, unit: 'kg', deliveryPeriod: '', budget: 0 });
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
      <div className="max-w-6xl mx-auto p-4 sm:p-8 lg:p-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 sm:mb-16">
          <div>
            <div className="flex items-center gap-2 text-brand-600 bg-brand-50 px-3 py-1 rounded-full w-fit mb-3 border border-brand-100">
               <TrendingUp size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">Market Needs</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-800 font-display uppercase tracking-tight italic">Request Pre-Order</h1>
            <p className="text-slate-500 font-medium max-w-lg mt-2">Buka PO untuk pangan yang Anda butuhkan dan biarkan mitra petani kami yang memenuhinya.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-brand-600 text-white px-8 py-4 rounded-[28px] font-black text-sm flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/20 active:scale-95"
          >
            <PlusCircle size={20} /> Buka Request Baru
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Request Aktif Anda</h3>
            
            <AnimatePresence mode="popLayout">
              {requests.map((req) => (
                <motion.div 
                  layout
                  key={req.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all group overflow-hidden relative"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                    <div className="flex gap-4 sm:gap-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-600 shrink-0 border border-slate-100 group-hover:bg-brand-50 transition-colors">
                        <Sprout size={28} className="group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">{req.panganType}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                            <Package size={12} />
                            {req.quantity} {req.unit}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                            <Clock size={12} />
                            {req.deliveryPeriod}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         req.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                       }`}>
                         {req.status === 'OPEN' ? 'Mencari Petani' : 'Terambil'}
                       </span>
                       <button className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </div>

                  {req.status === 'OPEN' && (
                    <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/50 -mx-6 -mb-6 px-8 py-5">
                       <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                             {[1,2,3].map(i => (
                               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                  <img src={`https://i.pravatar.cc/150?u=${i+100}`} alt="Farmer" />
                               </div>
                             ))}
                          </div>
                          <p className="text-[10px] font-bold text-slate-500"><span className="text-brand-600 font-black">5 Petani</span> tertarik memenuhi</p>
                       </div>
                       <button className="flex items-center gap-2 text-brand-600 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-all">
                          Lihat Konfirmasi <ArrowRight size={14} />
                       </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Guidelines */}
          <div className="space-y-8">
             <div className="bg-slate-900 rounded-[40px] p-8 sm:p-10 text-white relative overflow-hidden">
                <h4 className="text-xl font-black mb-6 font-display uppercase tracking-tight">Cara Kerja Request PO</h4>
                <div className="space-y-8">
                   {[
                     { step: '1', title: 'Buka Request', desc: 'Isi detail pangan, jumlah, dan jadwal pengiriman yang Anda butuhkan.' },
                     { step: '2', title: 'Konfirmasi Petani', desc: 'Pilih petani yang sanggup memenuhi volume request Anda.' },
                     { step: '3', title: 'DP & Ikat Kontrak', desc: 'Bayar DP sebagai tanda jadi agar petani mulai proses tanam/panen.' },
                     { step: '4', title: 'Pelunasan', desc: 'Lakukan pelunasan setelah petani mengunggah foto hasil panen.' }
                   ].map((s, i) => (
                     <div key={i} className="flex gap-4">
                        <span className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 border border-brand-500/30">{s.step}</span>
                        <div>
                           <p className="text-xs font-black text-white uppercase tracking-widest mb-1">{s.title}</p>
                           <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{s.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-orange-50 border border-orange-100 rounded-[32px] p-8 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500 shrink-0">
                   <AlertCircle size={20} />
                </div>
                <div>
                   <h5 className="font-black text-slate-800 text-sm uppercase tracking-tight mb-1">Informasi Penting</h5>
                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                     Request PO memerlukan komitmen DP 30% setelah Anda memilih petani yang sesuai. Pastikan dana Anda siap.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Add Request Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setIsAdding(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Form Request Baru</h3>
              <p className="text-slate-500 text-sm mb-8">Detail kebutuhan pangan yang Anda cari.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Pangan</label>
                  <input 
                    type="text" 
                    required
                    value={formData.panganType}
                    onChange={e => setFormData({ ...formData, panganType: e.target.value })}
                    placeholder="Contoh: Kentang Granola, Bawang Merah, dll"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jumlah</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        required
                        value={formData.quantity || ''}
                        onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-black focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 outline-none transition-all"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">{formData.unit}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Satuan</label>
                    <select 
                      value={formData.unit}
                      onChange={e => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 outline-none appearance-none"
                    >
                      <option>kg</option>
                      <option>ton</option>
                      <option>karung</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Periode Pengiriman</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      value={formData.deliveryPeriod}
                      onChange={e => setFormData({ ...formData, deliveryPeriod: e.target.value })}
                      placeholder="Contoh: Juni 2024 / Minggu ke-2 Mei"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pr-12 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 outline-none transition-all placeholder:text-slate-300"
                    />
                    <Calendar size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                   <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                   >
                     Batal
                   </button>
                   <button 
                    type="submit"
                    className="flex-3 bg-brand-600 text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-600/20 hover:bg-brand-700 transition-all"
                   >
                     Terbitkan Request
                   </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
