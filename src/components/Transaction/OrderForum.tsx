import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  Image as ImageIcon, 
  Paperclip, 
  User,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { Order, ChatMessage } from '../../types';
import { useOrder } from '../../contexts/OrderContext';

interface OrderForumProps {
  order: Order;
  role: 'buyer' | 'seller' | 'admin';
  messages: ChatMessage[];
  onSendMessage: (content: string, attachmentType?: 'image' | 'file') => void;
  onConfirmHarvest?: () => void;
  onConfirmPurchase?: () => void;
  hideHeader?: boolean;
}

export default function OrderForum({ 
  order, 
  role, 
  messages, 
  onSendMessage,
  onConfirmHarvest,
  onConfirmPurchase,
  hideHeader = false
}: OrderForumProps) {
  const navigate = useNavigate();
  const { loadChatMessages } = useOrder();
  const [inputText, setInputText] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const lastCountRef = React.useRef(messages.length);

  React.useEffect(() => {
    if (!order?.id) return;
    
    loadChatMessages(order.id);

    // Polling setiap 3 detik agar pembeli, penjual, dan admin tersinkronisasi secara real-time
    const interval = setInterval(() => {
      loadChatMessages(order.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [order?.id]);

  React.useEffect(() => {
    // Hanya gulir ke bawah jika jumlah pesan bertambah (untuk kenyamanan membaca history)
    if (messages.length > lastCountRef.current) {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
    lastCountRef.current = messages.length;
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className={`flex flex-col h-full bg-white ${hideHeader ? '' : 'lg:rounded-[40px] shadow-2xl'} overflow-hidden`}>
      {/* Header Info */}
      {!hideHeader && (
        <div className="p-4 sm:p-8 bg-brand-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
             {/* Beautiful Glassmorphic Back Button */}
             <button 
               onClick={() => navigate(-1)}
               className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/15 text-white hover:bg-white/20 hover:text-brand-300 active:scale-95 transition-all cursor-pointer shrink-0"
               title="Kembali"
             >
                <ArrowLeft size={20} className="sm:w-7 sm:h-7" />
             </button>

             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                <FileText size={20} className="text-brand-300 sm:w-7 sm:h-7" />
             </div>
             <div className="min-w-0">
                <h2 className="text-sm sm:text-xl font-black uppercase tracking-tight truncate">Forum Panen: {order.items[0].name}</h2>
                <p className="text-[8px] sm:text-xs font-bold text-brand-300 uppercase tracking-widest">ID: {order.id.toUpperCase()}</p>
             </div>
          </div>
          <div className="px-3 sm:px-5 py-1.5 sm:py-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-400 animate-pulse self-start sm:self-auto">
             {order.status === 'WAITING_PAYMENT_DP' ? 'Menunggu DP' :
              order.status === 'WAITING_ADMIN_DP' ? 'Verifikasi DP' :
              order.status === 'WAITING_HARVEST' ? 'Proses Panen' :
              order.status === 'HARVEST_CONFIRMED_SELLER' ? 'Siap Pelunasan' :
              order.status === 'WAITING_FINAL_PAYMENT' ? 'Menunggu Pelunasan' :
              order.status === 'WAITING_ADMIN_FINAL' ? 'Verifikasi Lunas' :
              order.status === 'SHIPPING' ? 'Dalam Pengiriman' :
              order.status === 'DELIVERED' ? 'Tiba di Lokasi' :
              order.status === 'COMPLETED' ? 'Selesai' :
              order.status === 'CANCELLED' ? 'Dibatalkan' : 'Siklus Panen'}
          </div>
        </div>

        {/* Milestone Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 pb-1 sm:pb-2">
           <div className={`p-3 sm:p-4 rounded-xl sm:rounded-3xl border flex items-center gap-2 sm:gap-3 transition-all ${
             order.harvestConfirmedBySeller 
             ? 'bg-emerald-500 border-emerald-400 text-white' 
             : 'bg-white/5 border-white/10 text-white/60'
           }`}>
              <CheckCircle2 size={16} className={order.harvestConfirmedBySeller ? 'text-white' : 'text-white/20'} />
              <div className="min-w-0">
                 <p className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest truncate">Konfirmasi Panen</p>
                 <p className="text-[9px] sm:text-xs font-bold">{order.harvestConfirmedBySeller ? 'Selesai' : 'Proses'}</p>
              </div>
              {role === 'seller' && !order.harvestConfirmedBySeller && (
                <button 
                  onClick={onConfirmHarvest}
                  className="ml-auto bg-white text-brand-900 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tight hover:scale-105 active:scale-95 transition-all"
                >
                  OK
                </button>
              )}
           </div>

           <div className={`p-3 sm:p-4 rounded-xl sm:rounded-3xl border flex items-center gap-2 sm:gap-3 transition-all ${
             order.purchaseConfirmedByBuyer
             ? 'bg-emerald-500 border-emerald-400 text-white' 
             : 'bg-white/5 border-white/10 text-white/60'
           }`}>
              <ShieldCheck size={16} className={order.purchaseConfirmedByBuyer ? 'text-white' : 'text-white/20'} />
              <div className="min-w-0">
                 <p className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest truncate">Konfirmasi Terima</p>
                 <p className="text-[9px] sm:text-xs font-bold">{order.purchaseConfirmedByBuyer ? 'Selesai' : 'Menunggu'}</p>
              </div>
              {role === 'buyer' && order.harvestConfirmedBySeller && !order.purchaseConfirmedByBuyer && (
                <button 
                  onClick={onConfirmPurchase}
                  className="ml-auto bg-white text-brand-900 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tight hover:scale-105 active:scale-95 transition-all"
                >
                  Ya
                </button>
              )}
           </div>
        </div>
      </div>
      )}

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-8 bg-slate-50/50 custom-scrollbar"
      >
        <AnimatePresence>
          {messages.map((msg) => {
            const isMe = msg.senderRole === role;
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-center gap-2 mb-1.5 px-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                   <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.senderName}</span>
                   <span className="text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded-md">{msg.senderRole}</span>
                </div>
                
                <div className={`max-w-[85%] sm:max-w-[80%] p-4 sm:p-6 rounded-[20px] sm:rounded-[28px] shadow-xs ${
                  isMe 
                    ? 'bg-brand-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                   <p className="text-xs sm:text-sm font-medium leading-relaxed">{msg.content}</p>
                   
                   {msg.attachmentUrl && (
                     <div className="mt-3 sm:mt-4 rounded-xl overflow-hidden shadow-inner">
                       {msg.attachmentType === 'image' ? (
                         <img src={msg.attachmentUrl} className="w-full object-cover max-h-48 sm:max-h-64" alt="Attachment" />
                       ) : (
                         <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-50 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                           <Paperclip size={16} />
                           <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">report.pdf</span>
                         </div>
                       )}
                     </div>
                   )}
                   
                   <p className={`text-[7px] sm:text-[9px] mt-2 sm:mt-3 font-bold uppercase tracking-widest ${isMe ? 'text-white/40 text-right' : 'text-slate-300'}`}>
                      {msg.timestamp}
                   </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-8 border-t border-slate-100 bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-3 sm:gap-4">
           <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
             <button 
              type="button"
              onClick={() => onSendMessage("📷 Lampiran foto hasil panen", 'image')}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50 text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all flex items-center justify-center border border-slate-100"
             >
                <ImageIcon size={18} className="sm:w-5 sm:h-5" />
             </button>
             <button 
              type="button"
              onClick={() => onSendMessage("📎 Laporan Panen Terpilih", 'file')}
              className="hidden sm:flex w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all items-center justify-center border border-slate-100"
             >
               <Paperclip size={20} />
             </button>
           </div>
           
           <div className="flex-1 relative">
             <input 
               type="text" 
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               placeholder="Pesan..."
               className="w-full bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl py-2.5 sm:py-4 pl-4 sm:pl-6 pr-12 sm:pr-14 text-xs sm:text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 transition-all"
             />
             <button 
               type="submit"
               className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-brand-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-600/20"
             >
               <Send size={14} className="sm:w-[18px] sm:h-[18px]" />
             </button>
           </div>
        </form>
      </div>
    </div>
  );
}
