import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sprout, 
  Calendar, 
  Package, 
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  User,
  ShieldCheck
} from 'lucide-react';
import { BuyerRequest } from '../../types';
import { MOCK_BUYER_REQUESTS } from '../../constants';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';

export default function BrowseBuyerRequests() {
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCekDetail, setIsCekDetail] = useState<BuyerRequest | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    apiClient.get('/buyer-requests')
      .then((res) => {
        const live = (res.data.data || []).map((req: any) => ({
          id: req.id.toString(),
          buyerId: req.buyer_id.toString(),
          buyerName: req.buyer_name || 'Andi Wijaya',
          panganType: req.pangan_type,
          quantity: Number(req.quantity),
          unit: req.unit,
          deliveryPeriod: req.delivery_period,
          status: req.status,
          budget: Number(req.budget),
          createdAt: new Date(req.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        })).filter((req: any) => req.status === 'OPEN');
        setRequests(live);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load buyer requests', err);
        setRequests([]);
        setLoading(false);
      });
  }, []);

  const handleTakeRequest = async (requestId: string) => {
    try {
      await apiClient.put(`/buyer-requests/${requestId}/status`, {
        status: 'TAKEN',
        fulfilledBy: user?.id || 2 // Default to Petani Maju (id = 2)
      });
      setRequests(prev => prev.filter(r => r.id !== requestId));
      setIsCekDetail(null);
      alert('Berhasil mengambil request! Pembeli akan segera dihubungi untuk melakukan transaksi DP.');
    } catch (err) {
      console.error('Failed to take request', err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
      <div className="max-w-6xl mx-auto p-4 sm:p-8 lg:p-12">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-full w-fit mb-3 border border-orange-100">
             <TrendingUp size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest">Peluang Panen</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 font-display uppercase tracking-tight italic">Ambil PO Buyer</h1>
          <p className="text-slate-500 font-medium max-w-lg mt-2">Dapatkan kepastian pembeli sebelum Anda menanam. Lihat permintaan dari mitra buyer kami.</p>
        </div>

        {/* Stats & Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
           <div className="flex gap-4">
              <div className="flex-1 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-sm border border-brand-100 shrink-0">
                    <Sprout size={24} />
                 </div>
                 <div>
                    <p className="text-2xl font-black text-slate-800 leading-none">24</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Request Terbuka</p>
                 </div>
              </div>
              <div className="flex-1 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-slate-100 shrink-0">
                    <Package size={24} />
                 </div>
                 <div>
                    <p className="text-2xl font-black text-slate-800 leading-none">12.5T</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Volume</p>
                 </div>
              </div>
           </div>
           <div className="flex gap-3">
              <div className="flex-1 relative group">
                 <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                 <input 
                  type="text" 
                  placeholder="Cari jenis pangan..."
                  className="w-full bg-white border border-slate-100 rounded-[24px] py-4 pl-14 pr-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 outline-none transition-all"
                 />
              </div>
              <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-brand-600 transition-all shadow-sm">
                 <Filter size={20} />
              </button>
           </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
           {loading ? (
             [1, 2].map((i) => (
                <div key={i} className="bg-white rounded-[40px] p-8 border border-slate-100 animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-8">
                   <div className="flex gap-6 items-center flex-1">
                      <div className="w-20 h-20 bg-slate-100 rounded-[28px] shrink-0" />
                      <div className="flex-1 space-y-3">
                         <div className="h-6 bg-slate-100 rounded w-1/3" />
                         <div className="h-4 bg-slate-100 rounded w-1/4" />
                      </div>
                   </div>
                   <div className="w-40 h-14 bg-slate-100 rounded-[24px]" />
                </div>
             ))
           ) : requests.length > 0 ? (
             requests.map((req) => (
               <motion.div 
                key={req.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all group cursor-pointer"
                onClick={() => setIsCekDetail(req)}
               >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                     <div className="flex gap-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-brand-600 shrink-0 border border-slate-100 group-hover:bg-brand-50 transition-colors relative">
                          <Sprout size={36} className="group-hover:rotate-12 transition-transform" />
                          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                             <ShieldCheck size={12} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                             <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">{req.panganType}</h4>
                             <span className="bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-brand-100 italic">Volume Besar</span>
                          </div>
                          <p className="text-brand-600 font-black text-2xl mb-4">Rp {req.budget?.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Target Harga / {req.unit}</span></p>
                          
                          <div className="flex flex-wrap items-center gap-6">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                   <Package size={16} />
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Kuantitas</p>
                                   <p className="text-xs font-black text-slate-700">{req.quantity} {req.unit}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                   <Calendar size={16} />
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Pengiriman</p>
                                   <p className="text-xs font-black text-slate-700 uppercase">{req.deliveryPeriod}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                   <User size={16} />
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Buyer</p>
                                   <p className="text-xs font-black text-slate-700 uppercase">{req.buyerName}</p>
                                </div>
                             </div>
                          </div>
                        </div>
                     </div>
  
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleTakeRequest(req.id); }}
                       className="bg-brand-900 text-white px-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-900/20 hover:bg-black transition-all flex items-center gap-3 self-center sm:self-auto"
                     >
                        Ambil Request Ini <ArrowUpRight size={18} />
                     </button>
                  </div>
               </motion.div>
             ))
           ) : (
             <div className="bg-white rounded-[40px] p-10 text-center border border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-widest">Belum ada request pre-order dari pembeli</p>
             </div>
           )}
        </div>
      </div>

      {/* Detail Modal */}
      {isCekDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setIsCekDetail(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
             <div className="p-8 sm:p-12">
                <div className="flex justify-between items-start mb-10">
                   <div>
                      <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{isCekDetail.panganType}</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">ID Request: #{isCekDetail.id}</p>
                   </div>
                   <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                      <ShieldCheck size={16} /> Terverifikasi
                   </div>
                </div>

                <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 mb-10">
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Budget</p>
                         <p className="text-2xl font-black text-brand-600">Rp {isCekDetail.budget?.toLocaleString('id-ID')} <span className="text-xs text-slate-400">/{isCekDetail.unit}</span></p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Kebutuhan</p>
                         <p className="text-2xl font-black text-slate-800">{isCekDetail.quantity} {isCekDetail.unit}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Periode Pengiriman</p>
                         <p className="text-sm font-black text-slate-700 uppercase">{isCekDetail.deliveryPeriod}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Buyer terdaftar sejak</p>
                         <p className="text-sm font-black text-slate-700 uppercase">Januari 2023</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                     * Dengan mengambil request ini, Anda berkomitmen untuk menyediakan {isCekDetail.panganType} sesuai volume dan waktu yang ditentukan. Konfirmasi akan dikirim ke pembeli untuk proses selanjutnya (Invoice DP).
                   </p>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => setIsCekDetail(null)}
                        className="flex-1 border border-slate-200 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                      >
                        Kembali
                      </button>
                      <button 
                        onClick={() => handleTakeRequest(isCekDetail.id)}
                        className="flex-2 bg-brand-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-900/20 hover:bg-black transition-all"
                      >
                        Konfirmasi Kesediaan
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
