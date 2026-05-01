import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Image as ImageIcon, 
  Paperclip, 
  User,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Order, ChatMessage } from '../../types';

interface OrderForumProps {
  order: Order;
  role: 'buyer' | 'seller' | 'admin';
  messages: ChatMessage[];
  onSendMessage: (content: string, attachmentType?: 'image' | 'file') => void;
  onConfirmHarvest?: () => void;
  onConfirmPurchase?: () => void;
}

export default function OrderForum({ 
  order, 
  role, 
  messages, 
  onSendMessage,
  onConfirmHarvest,
  onConfirmPurchase
}: OrderForumProps) {
  const [inputText, setInputText] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-white lg:rounded-[40px] overflow-hidden shadow-2xl">
      {/* Header Info */}
      <div className="p-8 bg-brand-900 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                <FileText size={28} className="text-brand-300" />
             </div>
             <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Forum Panen: {order.items[0].name}</h2>
                <p className="text-xs font-bold text-brand-300 uppercase tracking-widest">ID Pesanan: {order.id.toUpperCase()}</p>
             </div>
          </div>
          <div className="px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400 animate-pulse">
             Status: Menunggu Panen
          </div>
        </div>

        {/* Milestone Buttons */}
        <div className="grid grid-cols-2 gap-4 pb-2">
           <div className={`p-4 rounded-3xl border flex items-center gap-3 transition-all ${
             order.harvestConfirmedBySeller 
             ? 'bg-emerald-500 border-emerald-400 text-white' 
             : 'bg-white/5 border-white/10 text-white/60'
           }`}>
              <CheckCircle2 size={24} className={order.harvestConfirmedBySeller ? 'text-white' : 'text-white/20'} />
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest">Konfirmasi Panen</p>
                 <p className="text-xs font-bold">{order.harvestConfirmedBySeller ? 'Selesai' : 'Sedang Proses'}</p>
              </div>
              {role === 'seller' && !order.harvestConfirmedBySeller && (
                <button 
                  onClick={onConfirmHarvest}
                  className="ml-auto bg-white text-brand-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight hover:scale-105 active:scale-95 transition-all"
                >
                  Confirm
                </button>
              )}
           </div>

           <div className={`p-4 rounded-3xl border flex items-center gap-3 transition-all ${
             order.purchaseConfirmedByBuyer
             ? 'bg-emerald-500 border-emerald-400 text-white' 
             : 'bg-white/5 border-white/10 text-white/60'
           }`}>
              <ShieldCheck size={24} className={order.purchaseConfirmedByBuyer ? 'text-white' : 'text-white/20'} />
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest">Konfirmasi Terima</p>
                 <p className="text-xs font-bold">{order.purchaseConfirmedByBuyer ? 'Disetujui' : 'Menunggu'}</p>
              </div>
              {role === 'buyer' && order.harvestConfirmedBySeller && !order.purchaseConfirmedByBuyer && (
                <button 
                  onClick={onConfirmPurchase}
                  className="ml-auto bg-white text-brand-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight hover:scale-105 active:scale-95 transition-all"
                >
                  Setujui
                </button>
              )}
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/50 custom-scrollbar"
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
                <div className={`flex items-center gap-2 mb-2 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.senderName}</span>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">{msg.senderRole}</span>
                </div>
                
                <div className={`max-w-[80%] p-6 rounded-[28px] shadow-sm ${
                  isMe 
                    ? 'bg-brand-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                   <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                   
                   {msg.attachmentUrl && (
                     <div className="mt-4 rounded-xl overflow-hidden shadow-inner">
                       {msg.attachmentType === 'image' ? (
                         <img src={msg.attachmentUrl} className="w-full object-cover max-h-64" alt="Attachment" />
                       ) : (
                         <div className="flex items-center gap-3 p-4 bg-slate-50 text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors">
                           <Paperclip size={18} />
                           <span className="text-[10px] font-black uppercase tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">document_harvest_report.pdf</span>
                         </div>
                       )}
                     </div>
                   )}
                   
                   <p className={`text-[9px] mt-3 font-bold uppercase tracking-widest ${isMe ? 'text-white/40 text-right' : 'text-slate-300'}`}>
                      {msg.timestamp}
                   </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-slate-100 bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <button 
              type="button"
              onClick={() => onSendMessage("📷 Lampiran foto hasil panen", 'image')}
              className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all flex items-center justify-center border border-slate-100"
             >
                <ImageIcon size={20} />
             </button>
             <button 
              type="button"
              onClick={() => onSendMessage("📎 Laporan Panen Terpilih", 'file')}
              className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-all flex items-center justify-center border border-slate-100"
             >
               <Paperclip size={20} />
             </button>
           </div>
           
           <div className="flex-1 relative">
             <input 
               type="text" 
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               placeholder="Ketik pesan untuk forum..."
               className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 pl-6 pr-14 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 transition-all"
             />
             <button 
               type="submit"
               className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-600 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-600/20"
             >
               <Send size={18} />
             </button>
           </div>
        </form>
      </div>
    </div>
  );
}
