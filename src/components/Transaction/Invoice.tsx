import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ChevronRight, 
  CreditCard, 
  Building2, 
  Wallet,
  ClipboardCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Download,
  X,
  MapPin
} from 'lucide-react';
import { Order } from '../../types';
import { useOrder } from '../../contexts/OrderContext';
import OrderForum from './OrderForum';

interface InvoiceProps {
  order: Order;
  onConfirm?: (paymentMethod: string) => void;
  onBack?: () => void;
}

export default function Invoice({ order, onConfirm, onBack }: InvoiceProps) {
  const navigate = useNavigate();
  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const ongkir = 15000;
  const biayaLayanan = Math.max(0, order.totalAmount - subtotal - ongkir);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });

  const { messages, sendMessage, loadChatMessages } = useOrder();

  React.useEffect(() => {
    if (order?.id) {
      loadChatMessages(order.id);
    }
  }, [order?.id]);

  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateMockSlip = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 400, 500);
      
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, 0, 400, 80);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TRANSFER BERHASIL', 200, 45);
      
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#a7f3d0';
      ctx.fillText('Siklus Escrow PanganDesa', 200, 65);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      
      const yStart = 140;
      const lineH = 30;
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('TANGGAL:', 40, yStart);
      ctx.fillText('ID TRANS:', 40, yStart + lineH);
      ctx.fillText('PENGIRIM:', 40, yStart + lineH * 2);
      ctx.fillText('BANK:', 40, yStart + lineH * 3);
      ctx.fillText('NOMINAL:', 40, yStart + lineH * 4);
      
      ctx.fillStyle = '#ffffff';
      const dateStr = new Date().toLocaleDateString('id-ID');
      ctx.fillText(dateStr, 150, yStart);
      ctx.fillText('#' + order.id.toUpperCase(), 150, yStart + lineH);
      ctx.fillText(order.buyerName || 'Mitra Pembeli Desa', 150, yStart + lineH * 2);
      ctx.fillText('BNI (Escrow)', 150, yStart + lineH * 3);
      
      const amount = order.status === 'WAITING_PAYMENT_DP' ? order.dpAmount : order.remainingAmount;
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('Rp ' + amount.toLocaleString('id-ID'), 150, yStart + lineH * 4);
      
      ctx.fillStyle = '#475569';
      ctx.fillRect(40, 360, 320, 2);
      
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Bukti transfer ini sah dan diproses otomatis.', 200, 400);
    }
    const dataUrl = canvas.toDataURL('image/png');
    setSelectedImage(dataUrl);
    setFileName('bukti_transfer_simulasi.png');
  };

  const showToastMsg = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <div className="bg-white h-full lg:rounded-[40px] overflow-hidden flex flex-col relative">
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .custom-scrollbar {
            overflow: visible !important;
            height: auto !important;
          }
          .bg-slate-50 {
            background-color: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
          }
          .bg-brand-50 {
            background-color: #f4fbf7 !important;
            border: 1px solid #c2ebd9 !important;
          }
          .border-slate-100 {
            border-color: #e2e8f0 !important;
          }
          .text-brand-900 {
            color: #113821 !important;
          }
        }
      `}</style>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onBack ? onBack() : navigate('/buyer/pesanan')} 
            className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 transition-all cursor-pointer border-0 active:scale-95 flex items-center justify-center shrink-0 bg-slate-50"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
              <FileText className="text-brand-600 w-5 h-5 sm:w-6 sm:h-6" /> Invoice
            </h2>
            <p className="text-[10px] sm:text-sm text-slate-500 font-medium">Selesaikan DP untuk mengamankan pre-order.</p>
          </div>
        </div>
        
        <button 
          onClick={() => window.print()} 
          className="self-start sm:self-center flex items-center gap-2 px-5 py-2.5 bg-[#1a4d2e] hover:bg-[#123520] text-white rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95 border-0 shadow-md shadow-emerald-900/10"
        >
          <Download className="w-4 h-4" /> Cetak / Download PDF
        </button>
      </div>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-10 pb-24">
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
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border border-white overflow-hidden shadow-sm shrink-0 bg-slate-50 flex items-center justify-center">
                    <img src={item.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200&auto=format&fit=crop'} className="w-full h-full object-cover" alt={item.name} />
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

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="space-y-4">
            <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Alamat Pengiriman</label>
            <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-slate-100 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Alamat Tujuan</p>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-600 leading-relaxed mt-1">
                  {order.shippingAddress}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Warning Banner for Rejected Payment */}
        {((order.status === 'WAITING_PAYMENT_DP' || order.status === 'WAITING_FINAL_PAYMENT') && order.paymentProof) && (
          <div className="bg-red-50 border border-red-100 rounded-[24px] sm:rounded-[32px] p-6 flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-600 shadow-xs border border-red-100 shrink-0">
                <AlertCircle size={20} className="sm:w-6 sm:h-6" />
             </div>
             <div>
                <h4 className="text-xs sm:text-sm font-black text-red-900 uppercase tracking-tight mb-1">Pembayaran Sebelumnya Ditolak</h4>
                <p className="text-[10px] sm:text-xs font-medium text-red-700/80 leading-relaxed">
                   Mohon maaf, bukti pembayaran yang Anda unggah sebelumnya ditolak oleh admin. Silakan periksa kembali nominal transfer Anda, pastikan sesuai dengan instruksi di bawah ini, lalu unggah bukti transfer yang baru dan valid.
                </p>
             </div>
          </div>
        )}

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

        {order.status === 'WAITING_PAYMENT_DP' || order.status === 'WAITING_FINAL_PAYMENT' || order.status === 'HARVEST_CONFIRMED_SELLER' ? (
          !isConfirmed ? (
            <button 
              onClick={() => {
                setIsConfirmed(true);
                showToastMsg('Konfirmasi berhasil! Silakan unggah bukti transfer Anda.', 'success');
              }}
              className="w-full bg-[#1a4d2e] text-white py-4 sm:py-6 rounded-xl sm:rounded-[32px] font-black uppercase text-[10px] sm:text-sm tracking-widest shadow-xl shadow-[#1a4d2e]/10 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3 hover:bg-black no-print border-0 cursor-pointer"
            >
              {order.status === 'WAITING_PAYMENT_DP' ? 'Konfirmasi & Bayar DP (30%)' : 'Konfirmasi & Bayar Pelunasan (70%)'} <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <div className="p-6 bg-slate-50 rounded-[24px] sm:rounded-[32px] border border-slate-200 space-y-4 no-print animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="text-[#1a4d2e] w-4.5 h-4.5" /> Unggah Bukti Transfer
                </h3>
                <button 
                  onClick={() => setIsConfirmed(false)}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer"
                >
                  Batal
                </button>
              </div>

              {/* Drag and Drop File selector box */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#1a4d2e] transition-colors relative cursor-pointer group bg-white">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-emerald-50 text-[#1a4d2e] rounded-xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
                    <Download size={18} className="rotate-180" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Pilih File Bukti Pembayaran</p>
                    <p className="text-[9px] text-slate-400 font-medium mt-1">Mendukung format PNG, JPG, atau JPEG</p>
                  </div>
                </div>
              </div>

              {/* Auto generate button */}
              <button 
                type="button"
                onClick={generateMockSlip}
                className="w-full py-2.5 bg-[#1a4d2e]/5 hover:bg-[#1a4d2e]/10 text-[#1a4d2e] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-0 cursor-pointer"
              >
                Simulasikan Slip Transfer Otomatis
              </button>

              {/* Selected Image Preview */}
              {selectedImage && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pratinjau Bukti Transfer</p>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white p-2">
                    <img src={selectedImage} alt="Pratinjau Slip" className="w-full max-h-60 object-contain rounded-xl" />
                    <p className="text-[8px] font-mono text-center text-slate-400 mt-1 truncate">{fileName}</p>
                  </div>
                </div>
              )}

              {/* Submit trigger */}
              <button 
                disabled={!selectedImage}
                onClick={() => {
                  if (!selectedImage) return;
                  onConfirm && onConfirm(selectedImage);
                }}
                className={`w-full py-3.5 rounded-xl font-black uppercase text-xs tracking-wider transition-all border-0 flex items-center justify-center gap-2 ${
                  selectedImage 
                    ? 'bg-[#1a4d2e] hover:bg-black text-white shadow-lg shadow-[#1a4d2e]/15 cursor-pointer active:scale-95' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 size={14} /> Kirim Bukti Pembayaran
              </button>
            </div>
          )
        ) : (
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4 text-emerald-800 text-xs font-semibold no-print">
            <CheckCircle2 className="text-emerald-600 shrink-0 animate-bounce-slow" size={20} />
            <div className="text-left">
              <p className="font-black uppercase tracking-wider text-[10px] leading-none mb-1">Transaksi Dilindungi Escrow</p>
              <p className="text-emerald-700/80 leading-relaxed font-medium">Pembayaran Anda aman di rekening penampung PanganDesa. Dana hanya akan dicairkan ke petani setelah kualitas pangan optimal terverifikasi saat panen dan dikirim ke alamat Anda.</p>
            </div>
          </div>
        )}

        {/* Forum Diskusi untuk WAITING_ADMIN_DP / WAITING_ADMIN_FINAL */}
        {(order.status === 'WAITING_ADMIN_DP' || order.status === 'WAITING_ADMIN_FINAL') && (
          <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4 no-print mt-6 text-left">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">Diskusi Forum Transaksi</h3>
            </div>
            <div className="h-[400px] sm:h-[450px] border border-slate-100 rounded-2xl overflow-hidden flex flex-col">
              <OrderForum 
                order={order}
                role="buyer"
                messages={messages}
                onSendMessage={(content) => sendMessage(order.id, content, 'buyer')}
                hideHeader={true}
              />
            </div>
          </div>
        )}
      </div>
      </div>
      {toast.show && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl shadow-brand-950/20 border transition-all duration-300 transform translate-y-0 animate-fade-in no-print ${
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
