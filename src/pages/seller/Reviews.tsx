import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Smile, 
  Sparkles, 
  HelpCircle,
  TrendingUp,
  User,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Reviews() {
  const { user } = useAuth();
  const [replyIndex, setReplyIndex] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      buyerName: 'Andi Wijaya',
      rating: 5,
      date: '28 Mei 2026',
      productName: 'Tomat Segar',
      comment: 'Tomatnya sangat segar, besar-besar, dan manis! Masih berembun pas sampai lokasi. Seller ramah banget dan respon cepat. Pasti langganan di sini.',
      reply: 'Terima kasih banyak Mas Andi atas ulasan bintang 5-nya! Senang sekali bisa membantu memenuhi kebutuhan buah tomat segarnya. Kami tunggu pre-order berikutnya ya!',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200'
    },
    {
      id: 2,
      buyerName: 'Rina Wijaya',
      rating: 5,
      date: '26 Mei 2026',
      productName: 'Cabai Merah Keriting',
      comment: 'Cabainya segar sekali, pedas mantap! Pengiriman cepat pakai kurir desa. Rekomendasi banget buat yang cari bumbu dapur segar langsung dari petani.',
      reply: null,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'
    },
    {
      id: 3,
      buyerName: 'Budi Santoso',
      rating: 4.8,
      date: '22 Mei 2026',
      productName: 'Jagung Manis',
      comment: 'Jagungnya manis sekali, segar dan ukurannya besar. Cuma respon chat agak sedikit lambat pas sore hari. Tapi produknya juara!',
      reply: 'Mohon maaf Pak Budi atas keterlambatan responnya kemarin sore karena kami sedang ada proses muat hasil panen di ladang. Terima kasih masukan berharganya!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
    }
  ]);

  const ratingValue = user?.rating ? Number(user.rating).toFixed(1) : '4.9';

  const handleSendReply = (id: number) => {
    if (!replyText.trim()) return;
    setReviewsList(prev => prev.map(rev => rev.id === id ? { ...rev, reply: replyText } : rev));
    setReplyText('');
    setReplyIndex(null);
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-10 pb-20">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <Star className="text-orange-400 fill-orange-400" size={32} />
                 <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight">Ulasan & Rating</h1>
              </div>
              <p className="text-slate-500 font-medium text-xs md:text-sm">Pantau review dan tingkat kepuasan pembeli terhadap mutu produk pangan dan pelayanan toko Anda.</p>
           </div>
        </div>

        {/* Aggregated Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Main Rating */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Rating Toko</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-800 font-display">{ratingValue}</span>
                <span className="text-sm font-bold text-slate-400">/ 5.0</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-orange-400">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} size={18} className="fill-orange-400 text-orange-400" />
               ))}
               <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase">128 Review</span>
            </div>
          </div>

          {/* Card 2: Satisfaction Categories */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm col-span-1 md:col-span-2 space-y-4">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Metrik Kepuasan Pelayanan</p>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Kualitas Pangan</p>
                   <div className="flex items-center gap-2">
                     <span className="text-lg font-black text-slate-800">4.9</span>
                     <Star size={14} className="text-orange-400 fill-orange-400" />
                   </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Kecepatan Respon</p>
                   <div className="flex items-center gap-2">
                     <span className="text-lg font-black text-slate-800">4.8</span>
                     <Star size={14} className="text-orange-400 fill-orange-400" />
                   </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Kecepatan Kirim</p>
                   <div className="flex items-center gap-2">
                     <span className="text-lg font-black text-slate-800">4.9</span>
                     <Star size={14} className="text-orange-400 fill-orange-400" />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm space-y-8">
           <div>
              <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Daftar Ulasan Masuk</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Dengarkan umpan balik dari pembeli untuk terus meningkatkan mutu hasil panen desa.</p>
           </div>

           <div className="divide-y divide-slate-100">
             {reviewsList.map((rev) => (
               <div key={rev.id} className="py-8 first:pt-0 last:pb-0 space-y-6">
                  {/* Reviewer Header */}
                  <div className="flex items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                        <img src={rev.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm shrink-0" alt={rev.buyerName} />
                        <div>
                           <h4 className="text-sm font-black text-slate-800">{rev.buyerName}</h4>
                           <div className="flex items-center gap-2 mt-1">
                             <div className="flex items-center gap-0.5 text-orange-400">
                               {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={10} className={i < Math.floor(rev.rating) ? 'fill-orange-400' : 'text-slate-200'} />
                               ))}
                             </div>
                             <span className="text-[9px] font-bold text-slate-400">• {rev.date}</span>
                           </div>
                        </div>
                     </div>

                     <span className="text-[8px] font-black px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-slate-500 uppercase tracking-widest">
                       Produk: {rev.productName}
                     </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed bg-slate-50/50 p-5 rounded-2xl border border-slate-50/40">
                     "{rev.comment}"
                  </p>

                  {/* Seller Reply */}
                  {rev.reply ? (
                    <div className="ml-6 sm:ml-10 bg-brand-50/50 border border-brand-100 p-5 rounded-2xl space-y-2">
                       <div className="flex items-center gap-2">
                         <Smile size={14} className="text-brand-600" />
                         <span className="text-[9px] font-black text-brand-900 uppercase tracking-widest">Balasan Anda (Toko Berkah Tani)</span>
                       </div>
                       <p className="text-xs text-brand-800 font-medium leading-relaxed">
                          {rev.reply}
                       </p>
                    </div>
                  ) : (
                    <div className="ml-6 sm:ml-10">
                      {replyIndex === rev.id ? (
                        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <textarea 
                             value={replyText}
                             onChange={(e) => setReplyText(e.target.value)}
                             placeholder="Tulis balasan apresiasi atau tanggapan profesional Anda..."
                             className="w-full bg-white border border-slate-100 rounded-xl p-4 text-xs font-medium outline-none resize-none min-h-[80px]"
                           />
                           <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleSendReply(rev.id)}
                                className="bg-brand-900 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider active:scale-95 transition-all"
                              >
                                Kirim Balasan
                              </button>
                              <button 
                                onClick={() => setReplyIndex(null)}
                                className="bg-white border border-slate-200 text-slate-500 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider"
                              >
                                Batal
                              </button>
                           </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setReplyIndex(rev.id)}
                          className="flex items-center gap-1.5 text-[9px] font-black text-brand-600 uppercase tracking-widest hover:underline"
                        >
                           Balas Ulasan <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  )}
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
