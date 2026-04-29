import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User, Sparkles, Wand2, Store } from 'lucide-react';
import { getPanganAIResponse } from '../../services/aiService';
import { ChatMessage } from '../../types';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'model', 
      text: 'Halo! Saya PanganAI. Ada yang bisa saya bantu hari ini? Anda bisa tanya tentang stok sayuran segar, prediksi panen, atau rekomendasi belanja.', 
      timestamp: Date.now() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getPanganAIResponse(input, { history: messages.slice(-5) });
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || 'Maaf, saya tidak mengerti. Bisa diulangi?',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-brand-500/40 hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <MessageSquare size={28} />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">AI</span>
        
        {/* Tooltip */}
        <div className="absolute right-20 bg-slate-900 text-white text-xs font-bold py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Tanya PanganAI 👋
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-32 w-[420px] h-[640px] bg-white rounded-[32px] shadow-2xl shadow-brand-900/20 z-50 flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-6 bg-brand-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-black font-display tracking-tight text-lg leading-none">PanganAI Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-brand-100 uppercase tracking-widest">Online • Beta</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-brand-500 text-white rounded-br-none shadow-lg shadow-brand-500/10' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none flex gap-1 items-center">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                   </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100">
               <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    { text: 'Rekomendasi sayur minggu ini', icon: <Sparkles size={12} /> },
                    { text: 'Cara pre-order?', icon: <Wand2 size={12} /> },
                    { text: 'Update stok tomat', icon: <Store size={12} /> }
                  ].map((chip, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(chip.text)}
                      className="whitespace-nowrap px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 flex items-center gap-1.5 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-100 transition-all"
                    >
                      {chip.icon}
                      {chip.text}
                    </button>
                  ))}
               </div>
               <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Tanya PanganAI..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                    />
                    <div className="absolute right-2 inset-y-0 flex items-center">
                       <button className="p-2 text-slate-300 hover:text-brand-500 transition-colors">
                          <Sparkles size={16} />
                       </button>
                    </div>
                  </div>
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-3 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 disabled:opacity-50 transition-all shadow-lg shadow-brand-500/20"
                  >
                    <Send size={20} />
                  </button>
               </div>
               <p className="text-[9px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
                  AI dapat membuat kesalahan. Periksa info penting.
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
