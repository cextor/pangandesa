import React from 'react';
import { motion } from 'motion/react';
import { 
  Truck, 
  MapPin, 
  Package, 
  CheckCircle2, 
  ChevronRight,
  ClipboardCheck,
  Download,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { Order } from '../../types';

interface OrderShippingProps {
  order: Order;
  role: 'buyer' | 'seller';
  onConfirmReceipt: () => void;
}

export default function OrderShipping({ order, role, onConfirmReceipt }: OrderShippingProps) {
  const steps = [
    { id: 'processed', label: 'Diproses', icon: Package, date: '12 Mei 2024', current: false, completed: true },
    { id: 'shipped', label: 'Dikirim', icon: Truck, date: '13 Mei 2024', current: true, completed: true },
    { id: 'arrived', label: 'Sampai', icon: MapPin, date: '-', current: false, completed: false },
    { id: 'completed', label: 'Selesai', icon: CheckCircle2, date: '-', current: false, completed: false },
  ];

  return (
    <div className="bg-white min-h-screen lg:min-h-0 lg:rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
      {/* Tracking Header */}
      <div className="p-5 sm:p-8 bg-brand-900 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-4">
             <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl flex items-center justify-center">
                <Truck size={18} className="text-brand-300 sm:w-6 sm:h-6" />
             </div>
             <div>
                <h2 className="text-sm sm:text-xl font-black uppercase tracking-tight leading-tight">Lacak Pengiriman</h2>
                <p className="text-[7px] sm:text-[10px] font-black text-brand-300 uppercase tracking-widest">Resi: {order.trackingNumber || 'PROS-5521990'}</p>
             </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-brand-500 rounded-full blur-[100px] opacity-20" />
      </div>

      <div className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-8 sm:space-y-12 custom-scrollbar">
        {/* Visual Stepper */}
        <div className="relative pt-6 sm:pt-8 pb-10 sm:pb-12 flex justify-between px-2 sm:px-0">
           <div className="absolute top-1/2 left-0 w-full h-0.5 sm:h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 w-1/2 rounded-full" />
           </div>
           
           {steps.map((step, i) => (
             <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl flex items-center justify-center border-2 sm:border-4 border-white shadow-lg transition-all ${
                  step.completed ? 'bg-brand-600 text-white' : step.current ? 'bg-emerald-500 text-white animate-bounce' : 'bg-slate-100 text-slate-300'
                }`}>
                   <step.icon size={16} />
                </div>
                <p className={`mt-3 sm:mt-4 text-[7px] sm:text-[10px] font-black uppercase tracking-widest ${step.completed || step.current ? 'text-slate-800' : 'text-slate-300'} whitespace-nowrap`}>
                  {step.label}
                </p>
                <p className="hidden sm:block text-[9px] font-bold text-slate-400 uppercase mt-1">{step.date}</p>
             </div>
           ))}
        </div>

        {/* BAST Section */}
        <div className="bg-slate-50 border border-slate-100 rounded-[24px] sm:rounded-[40px] p-5 sm:p-10 space-y-6 sm:space-y-8">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                 <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-lg sm:rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-brand-600 shrink-0">
                    <ClipboardCheck size={20} className="sm:w-7 sm:h-7" />
                 </div>
                 <div className="min-w-0">
                    <h3 className="text-sm sm:text-lg font-black text-slate-800 uppercase tracking-tight truncate">Dokumen BAST</h3>
                    <p className="text-[10px] sm:text-sm font-medium text-slate-500 truncate">Berita Acara Serah Terima</p>
                 </div>
              </div>
              <button className="flex items-center justify-center gap-2 bg-brand-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-[8px] sm:text-[10px] uppercase tracking-widest shadow-lg shadow-brand-600/20 active:scale-95 transition-all">
                <Download size={14} className="sm:w-4 sm:h-4" /> Unduh PDF
              </button>
           </div>
           
           <div className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold text-slate-600">
                 <Clock size={14} className="text-brand-500 sm:w-4 sm:h-4" />
                 <span>Estimasi: 14 Mei 2024</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold text-slate-600">
                 <MapPin size={14} className="text-brand-500 sm:w-4 sm:h-4" />
                 <span className="truncate">Tujuan: Jakarta Selatan...</span>
              </div>
           </div>
        </div>

        {/* Confirmation Button for Buyer */}
        {role === 'buyer' && order.status === 'SHIPPING' && (
           <div className="bg-brand-50 rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 border border-brand-100 text-center space-y-4 sm:space-y-6">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-brand-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-brand-600/20">
                 <ShieldCheck size={28} className="sm:w-10 sm:h-10" />
              </div>
              <div>
                 <h4 className="text-base sm:text-xl font-black text-brand-900 uppercase tracking-tight mb-1 sm:mb-2 italic">Barang Sudah Sampai?</h4>
                 <p className="text-[10px] sm:text-sm font-medium text-brand-700/70 max-w-sm mx-auto leading-relaxed">
                   Pastikan kualitas hasil panen sesuai sebelum konfirmasi penerimaan.
                 </p>
              </div>
              <button 
                onClick={onConfirmReceipt}
                className="w-full bg-[#1a4d2e] text-white py-4 sm:py-6 rounded-xl sm:rounded-[24px] font-black uppercase text-[10px] sm:text-xs tracking-widest shadow-xl shadow-emerald-900/10 active:scale-95 transition-all hover:bg-emerald-900"
              >
                Konfirmasi Terima Barang
              </button>
           </div>
        )}
      </div>
    </div>
  );
}
