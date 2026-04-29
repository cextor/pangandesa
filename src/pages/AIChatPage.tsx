import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, Send, Bell, Sparkles, Wand2, Store, ChevronLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import { getPanganAIResponse } from '../services/aiService';
import { ChatMessage } from '../types';

interface AIChatPageProps {
  onBack?: () => void;
  role: 'buyer' | 'seller';
}

export default function AIChatPage({ onBack, role }: AIChatPageProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'model', 
      text: role === 'buyer' 
        ? 'Halo Andi! Saya PanganAI 👋 Ada yang bisa saya bantu hari ini?' 
        : 'Selamat pagi Pak Joko! Saya asisten AI Anda. Ada yang ingin dikonsultasikan mengenai prediksi panen atau harga pasar hari ini?', 
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

  const handleSend = async (text: string = input) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getPanganAIResponse(messageText, { 
        role,
        history: messages.slice(-5) 
      });
      
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

  const buyerSuggestions = [
    'Bandingkan harga tomat di 3 desa',
    'Kapan tomat cabai merah panen?',
    'Cara menyimpan sayuran agar tahan lama'
  ];

  const sellerSuggestions = [
    'Prediksi harga tomat minggu depan',
    'Saran deskripsi produk jagung manis',
    'Analisis tren pasar sayuran organik'
  ];

  const suggestions = role === 'buyer' ? buyerSuggestions : sellerSuggestions;

  return (
    <div className="flex-1 overflow-hidden bg-slate-50 flex flex-col items-center p-8">
      <div className="w-full max-w-3xl flex-1 flex flex-col bg-white rounded-[40px] shadow-2xl shadow-brand-900/5 border border-slate-100 overflow-hidden relative">
        
        {/* Header */}
        <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
          <div className="flex items-center gap-4">
            {onBack && (
               <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                  <ChevronLeft size={20} />
               </button>
            )}
            <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <Bot size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 font-display leading-none">AI Assistant</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>
          <button className="p-3 bg-slate-50 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-2xl transition-all">
            <Bell size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8 bg-white">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {m.role === 'model' && (
                  <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 shrink-0 border-2 border-white shadow-sm">
                    <Bot size={20} />
                  </div>
                )}
                <div className={`p-6 rounded-[28px] text-sm font-medium leading-loose shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-tr-none' 
                    : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {m.text.includes('\n') ? (
                    <div className="space-y-4">
                      {m.text.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                      {m.role === 'model' && (
                        <button className="flex items-center gap-2 bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-600 transition-all mt-4 group">
                          Lihat Produk
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  ) : m.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 bg-brand-500 rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 bg-brand-500 rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 bg-brand-500 rounded-full" />
               </div>
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="p-10 bg-white border-t border-slate-50">
           <div className="flex flex-col gap-3 mb-8">
              {suggestions.map((q, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-left py-3 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-500 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm flex items-center justify-between group"
                >
                  {q}
                  <Sparkles size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
           </div>

           <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tanyakan apa saja..."
                className="w-full bg-slate-100/50 border border-slate-200 rounded-[28px] py-6 pl-8 pr-20 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all shadow-inner"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-3 top-3 bottom-3 w-14 bg-brand-500 text-white rounded-[20px] flex items-center justify-center hover:bg-brand-600 disabled:opacity-50 transition-all shadow-lg shadow-brand-500/20 active:scale-95"
              >
                <Send size={24} />
              </button>
           </div>
        </div>
      </div>
      <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Powered by PanganDesa Intelligence</p>
    </div>
  );
}
