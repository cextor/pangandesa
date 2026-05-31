import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  ChevronRight, 
  CreditCard, 
  Building2, 
  Wallet,
  ClipboardCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Order } from '../../types';

interface InvoiceProps {
  order: Order;
  onConfirm: (paymentMethod: string) => void;
}

export default function Invoice({ order, onConfirm }: InvoiceProps) {
  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const ongkir = 15000;
  const biayaLayanan = Math.max(0, order.totalAmount - subtotal - ongkir);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });

  const showToastMsg = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

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
              <span className="text-[10px] sm:text-sm font-bold text-slate-600">Subtotal Produk</span>
              <span className="text-[10px] sm:text-sm font-bold text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center opacity-60">
              <span className="text-[10px] sm:text-sm font-bold text-slate-600">Ongkir (Estimasi)</span>
              <span className="text-[10px] sm:text-sm font-bold text-slate-800">Rp {ongkir.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center opacity-60">
              <span className="text-[10px] sm:text-sm font-bold text-slate-600">Biaya Layanan</span>
              <span className="text-[10px] sm:text-sm font-bold text-slate-800">Rp {biayaLayanan.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-100 pt-2 opacity-80">
              <span className="text-[10px] sm:text-sm font-bold text-slate-700">Total Pembayaran</span>
              <span className="text-[10px] sm:text-sm font-black text-slate-900">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
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

        {/* Payment Transfer Instructions */}
        <div className="space-y-4">
          <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Rekening Pembayaran Resmi BNI</label>
          <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-8 bg-brand-900 rounded-lg flex items-center justify-center text-white font-black text-[10px] font-display select-none">
                  BNI
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tight">BNI Manual Transfer</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Metode Pembayaran Eksklusif</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-3">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Nama Pemilik Rekening</p>
                <p className="text-xs sm:text-sm font-black text-slate-800 uppercase">SRIWIJAYA DIGITAL INDONESIA</p>
              </div>
              <div className="h-px bg-slate-100" />
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Nomor Rekening</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm sm:text-base font-black text-brand-900 tracking-wider">1384354499</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('1384354499');
                      showToastMsg('Nomor rekening berhasil disalin!', 'success');
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors border-0"
                  >
                    Salin
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Petunjuk Pembayaran</p>
              <ol className="list-decimal list-inside text-[10px] sm:text-xs text-slate-600 font-medium space-y-1.5 leading-relaxed pl-1">
                <li>Buka aplikasi Mobile Banking BNI, ATM, atau SMS Banking.</li>
                <li>Pilih menu <span className="font-bold">Transfer &gt; Ke Rekening BNI</span>.</li>
                <li>Masukkan nomor rekening <span className="font-bold text-slate-800">1384354499</span>.</li>
                <li>Pastikan nama penerima tertulis <span className="font-bold text-slate-800">SRIWIJAYA DIGITAL INDONESIA</span>.</li>
                <li>Ketik nominal transfer sebesar <span className="font-bold text-[#1a4d2e]">Rp {(order.status === 'WAITING_PAYMENT_DP' ? order.dpAmount : order.remainingAmount).toLocaleString('id-ID')}</span>.</li>
                <li>Simpan bukti transfer dan unggah pada halaman berikutnya untuk verifikasi admin.</li>
              </ol>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onConfirm('transfer')}
          className="w-full bg-brand-600 text-white py-4 sm:py-6 rounded-xl sm:rounded-[32px] font-black uppercase text-[10px] sm:text-sm tracking-widest shadow-xl shadow-brand-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3 hover:bg-brand-700"
        >
          Konfirmasi & Bayar DP <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>
      </div>
      {toast.show && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl shadow-brand-950/20 border transition-all duration-300 transform translate-y-0 animate-fade-in ${
          toast.type === 'success' 
            ? 'bg-[#1a4d2e] text-white border-emerald-800' 
            : 'bg-red-900 text-white border-red-800'
        }`}>
          <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-400" />
            ) : (
              <AlertCircle size={18} className="text-red-400" />
            )}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider">{toast.type === 'success' ? 'Berhasil' : 'Gagal'}</p>
            <p className="text-[11px] text-slate-100 font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
