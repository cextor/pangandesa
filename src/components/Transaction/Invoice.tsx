import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  ChevronRight, 
  CreditCard, 
  Building2, 
  Wallet,
  ClipboardCheck,
  ArrowRight
} from 'lucide-react';
import { Order } from '../../types';

interface InvoiceProps {
  order: Order;
  onConfirm: (paymentMethod: string) => void;
}

export default function Invoice({ order, onConfirm }: InvoiceProps) {
  const [selectedMethod, setSelectedMethod] = React.useState('transfer');

  const methods = [
    { id: 'transfer', name: 'Transfer Bank (Manual)', icon: Building2, desc: 'BCA, Mandiri, BNI' },
    { id: 'ewallet', name: 'E-Wallet', icon: Wallet, desc: 'GoPay, OVO, ShopeePay' },
    { id: 'qris', name: 'QRIS', icon: CreditCard, desc: 'Scan & Bayar Instan' },
  ];

  return (
    <div className="bg-white min-h-screen lg:min-h-0 lg:rounded-[40px] overflow-hidden flex flex-col">
      <div className="p-4 sm:p-8 border-b border-slate-50">
        <h2 className="text-lg sm:text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
          <FileText className="text-brand-600 w-5 h-5 sm:w-6 sm:h-6" /> Invoice
        </h2>
        <p className="text-[10px] sm:text-sm text-slate-500 font-medium">Selesaikan DP untuk mengamankan pre-order.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-10 custom-scrollbar">
        {/* Order Summary */}
        <div className="bg-slate-50 rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Pesanan</span>
            <span className="text-[10px] sm:text-sm font-bold text-slate-800">#{order.id.toUpperCase()}</span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center gap-3">
                <div className="flex gap-2 sm:gap-4 items-center min-w-0">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border border-white overflow-hidden shadow-sm shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-sm font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[8px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.quantity} {item.unit}</p>
                  </div>
                </div>
                <p className="text-[10px] sm:text-sm font-bold text-slate-800 shrink-0">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 sm:pt-6 border-t border-slate-200 space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center opacity-60">
              <span className="text-[10px] sm:text-sm font-bold text-slate-600">Total Belanja</span>
              <span className="text-[10px] sm:text-sm font-bold text-slate-800">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center p-4 sm:p-6 bg-brand-50 rounded-xl sm:rounded-2xl border border-brand-100">
              <div>
                <p className="text-[8px] sm:text-[10px] font-black text-brand-600 uppercase tracking-widest mb-0.5 sm:mb-1">
                  {order.status === 'WAITING_PAYMENT_DP' ? 'Down Payment (30%)' : 'Pelunasan (70%)'}
                </p>
                <p className="text-base sm:text-2xl font-black text-brand-900 tracking-tight">
                  Rp {(order.status === 'WAITING_PAYMENT_DP' ? order.dpAmount : order.remainingAmount).toLocaleString('id-ID')}
                </p>
              </div>
              <ClipboardCheck className="text-brand-300 w-5 h-5 sm:w-8 sm:h-8" />
            </div>
             <p className="text-[8px] sm:text-[10px] text-center text-slate-400 font-medium whitespace-pre-line leading-relaxed">
               {order.status === 'WAITING_PAYMENT_DP' 
                 ? `Sisa pelunasan Rp ${order.remainingAmount.toLocaleString('id-ID')}\nsetelah panen konfirmasi.`
                 : 'Selesaikan pelunasan agar produk segera dikirim ke lokasi Anda.'}
             </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 sm:space-y-4">
          <label className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Pilih Pembayaran</label>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {methods.map((m) => (
              <div 
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`p-3.5 sm:p-5 rounded-xl sm:rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedMethod === m.id 
                    ? 'border-brand-500 bg-brand-50/30' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl flex items-center justify-center transition-colors ${
                    selectedMethod === m.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <m.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-sm font-black text-slate-800 truncate">{m.name}</p>
                    <p className="text-[8px] sm:text-xs text-slate-500 font-medium truncate">{m.desc}</p>
                  </div>
                </div>
                <div className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                   selectedMethod === m.id ? 'border-brand-600 bg-brand-600' : 'border-slate-200'
                }`}>
                  {selectedMethod === m.id && <div className="w-1.5 h-1.5 sm:w-2 bg-white rounded-full" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => onConfirm(selectedMethod)}
          className="w-full bg-brand-600 text-white py-4 sm:py-6 rounded-xl sm:rounded-[32px] font-black uppercase text-[10px] sm:text-sm tracking-widest shadow-xl shadow-brand-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3 hover:bg-brand-700"
        >
          Konfirmasi & Bayar DP <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
