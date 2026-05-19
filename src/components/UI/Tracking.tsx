import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, MapPin, Package, Truck, CheckCircle2, Clock, Map as MapIcon } from 'lucide-react';

interface TrackingProps {
  onBack: () => void;
}

export default function Tracking({ onBack }: TrackingProps) {
  const steps = [
    { label: 'Pesanan Dibuat', time: '10 Mei 2024, 09:15', status: 'done' },
    { label: 'Dikonfirmasi Petani', time: '10 Mei 2024, 10:30', status: 'done' },
    { label: 'Siap Dipanen', time: '11 Mei 2024, 08:00', status: 'done' },
    { label: 'Dikirim', time: '11 Mei 2024, 14:20', status: 'done' },
    { label: 'Dalam Perjalanan', time: '11 Mei 2024, 16:45', status: 'done' },
    { label: 'Tiba di Tujuan', time: '12 Mei 2024, Estimasi', status: 'next' },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold text-sm mb-4 sm:mb-8 transition-colors group"
        >
          <div className="p-1.5 sm:p-2 rounded-xl bg-white group-hover:bg-brand-50 transition-colors shadow-sm">
            <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
          </div>
          Kembali
        </button>

        <div className="bg-white rounded-[24px] sm:rounded-[40px] p-5 sm:p-10 border border-slate-100 shadow-sm space-y-6 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl sm:text-3xl font-black text-slate-800 font-display uppercase tracking-tight">Lacak Pesanan</h2>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-brand-50 rounded-xl sm:rounded-2xl border border-brand-100 self-start sm:self-auto">
               <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-500 rounded-full animate-pulse" />
               <span className="text-[10px] sm:text-xs font-bold text-brand-600 uppercase tracking-widest leading-none">Paket Sedang Dikirim</span>
            </div>
          </div>

          {/* Order Header Card */}
          <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-brand-300 transition-all">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white shadow-md transform -rotate-3 group-hover:rotate-0 transition-transform shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop" 
                  alt="Tomat" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                   <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">INV-20240510-001</p>
                   <span className="w-1 h-1 bg-slate-300 rounded-full" />
                   <p className="text-[8px] sm:text-[10px] font-bold text-brand-600 uppercase tracking-widest">Dikirim</p>
                </div>
                <h3 className="text-sm sm:text-xl font-bold text-slate-800 truncate">Tomat Segar <span className="text-slate-400 font-medium ml-1">2 kg</span></h3>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Dari Desa Sukamaju, Lembang</p>
              </div>
            </div>
            <div className="text-left sm:text-right pt-4 sm:pt-0 border-t sm:border-0 border-slate-200">
               <p className="text-xl sm:text-2xl font-black text-brand-600 font-display">Rp 32.000</p>
               <div className="flex items-center gap-2 sm:justify-end mt-1 text-[9px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  <Clock size={12} className="shrink-0" />
                  Estimasi: 12 Mei 2024
               </div>
            </div>
          </div>

          {/* Tracking Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Timeline */}
            <div className="space-y-0 relative">
              <div className="absolute left-4 sm:left-6 top-6 bottom-6 w-0.5 bg-slate-100" />
              {steps.map((step, i) => (
                <div key={i} className="relative pl-12 sm:pl-16 pb-8 sm:pb-10 last:pb-0 group">
                   <div className={`absolute left-[11px] sm:left-[19px] top-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-[3px] sm:border-4 z-10 transition-all duration-500 ${
                     step.status === 'done' 
                       ? 'bg-brand-500 border-brand-100 scale-125 shadow-lg shadow-brand-500/20' 
                       : 'bg-white border-brand-300 ring-4 ring-slate-50'
                   }`} />
                   
                   {step.status === 'done' && (
                     <div className="absolute left-[16px] sm:left-[24px] top-6 bottom-0 w-0.5 bg-brand-500" />
                   )}

                   <div className={`transition-all duration-300 ${step.status === 'done' ? 'opacity-100' : 'opacity-40'}`}>
                      <h4 className={`text-xs sm:text-sm font-bold ${step.status === 'done' ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</h4>
                      <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 mt-0.5 sm:mt-1 uppercase tracking-widest">{step.time}</p>
                   </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="space-y-4 sm:space-y-6">
              <div className="relative aspect-square sm:aspect-[3/4] rounded-[24px] sm:rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 group">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop" 
                  alt="Jakarta Map" 
                  className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000"
                />
                
                {/* Route Visualization Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                   <path 
                    d="M 50 20 L 60 40 L 75 60 L 70 85" 
                    fill="none" 
                    stroke="#3c9144" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeDasharray="5, 8"
                    className="animate-pulse"
                   />
                </svg>

                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                   <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl animate-bounce">
                      <MapPin size={20} />
                   </div>
                   <div className="mt-2 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-2xl">
                      Sedang Transit
                   </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                   <div className="w-4 h-4 bg-white rounded-full border-4 border-brand-500 shadow-lg" />
                   <div className="mt-2 text-slate-800 text-[10px] font-black uppercase tracking-widest bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg">
                      Jakarta Selatan
                   </div>
                </div>

                <div className="absolute bottom-6 right-6">
                   <button className="bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl text-slate-600 hover:text-brand-600 transition-all">
                      <MapIcon size={18} className="sm:w-5 sm:h-5" />
                   </button>
                </div>
              </div>

               <button className="w-full bg-slate-50 border border-slate-200 text-slate-600 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all flex items-center justify-center gap-2">
                 Lihat Detail Transaksi
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
