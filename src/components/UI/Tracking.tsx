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
      <div className="max-w-4xl mx-auto p-8">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold text-sm mb-8 transition-colors group"
        >
          <div className="p-2 rounded-xl bg-white group-hover:bg-brand-50 transition-colors shadow-sm">
            <ChevronLeft size={18} />
          </div>
          Kembali
        </button>

        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-800 font-display">Lacak Pesanan</h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-2xl border border-brand-100">
               <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
               <span className="text-xs font-bold text-brand-600 uppercase tracking-widest leading-none">Paket Sedang Dikirim</span>
            </div>
          </div>

          {/* Order Header Card */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex items-center justify-between group hover:border-brand-300 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md transform -rotate-3 group-hover:rotate-0 transition-transform">
                <img 
                  src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop" 
                  alt="Tomat" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">INV-20240510-001</p>
                   <span className="w-1 h-1 bg-slate-300 rounded-full" />
                   <p className="text-[10px] font-bold text-brand-600">Dikirim</p>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Tomat Segar <span className="text-slate-400 font-medium ml-1">2 kg</span></h3>
                <p className="text-xs text-slate-500 font-medium">Dari Desa Sukamaju, Lembang</p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-2xl font-black text-brand-600 font-display">Rp 32.000</p>
               <div className="flex items-center gap-2 justify-end mt-1 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  <Clock size={12} />
                  Estimasi tiba: 12 Mei 2024
               </div>
            </div>
          </div>

          {/* Tracking Content */}
          <div className="grid grid-cols-2 gap-16 items-start">
            {/* Timeline */}
            <div className="space-y-0 relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100" />
              {steps.map((step, i) => (
                <div key={i} className="relative pl-16 pb-10 last:pb-0 group">
                   <div className={`absolute left-[20px] top-1 w-3 h-3 rounded-full border-4 z-10 transition-all duration-500 ${
                     step.status === 'done' 
                       ? 'bg-brand-500 border-brand-100 scale-125 shadow-lg shadow-brand-500/20' 
                       : 'bg-white border-brand-300 ring-4 ring-slate-50'
                   }`} />
                   
                   {step.status === 'done' && (
                     <div className="absolute left-[25px] top-6 bottom-0 w-0.5 bg-brand-500" />
                   )}

                   <div className={`transition-all duration-300 ${step.status === 'done' ? 'opacity-100' : 'opacity-40'}`}>
                      <h4 className={`text-sm font-bold ${step.status === 'done' ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</h4>
                      <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{step.time}</p>
                   </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="space-y-6">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 group">
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
                   <button className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl text-slate-600 hover:text-brand-600 transition-all">
                      <MapIcon size={20} />
                   </button>
                </div>
              </div>

               <button className="w-full bg-slate-50 border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold text-sm hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all flex items-center justify-center gap-2">
                 Lihat Detail Transaksi
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
