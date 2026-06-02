import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  FileText,
  X
} from 'lucide-react';
import { Order } from '../../types';
import Invoice from '../../components/Transaction/Invoice';

interface PaymentVerificationDetailProps {
  orders: Order[];
  onConfirmPayment: (orderId: string, statusType: 'DP' | 'FINAL' | 'DP_REJECT' | 'FINAL_REJECT' | 'CANCEL_DP' | 'CANCEL_FINAL') => void;
}

export default function PaymentVerificationDetail({ orders, onConfirmPayment }: PaymentVerificationDetailProps) {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = React.useState<Order | null>(null);
  const [isRejecting, setIsRejecting] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState('');

  const order = orders.find(o => o.id.toLowerCase() === orderId?.toLowerCase());

  if (!order) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 text-center min-h-screen">
        <div className="max-w-md bg-white rounded-[32px] p-10 border border-slate-100 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-red-50 rounded-[24px] flex items-center justify-center mx-auto text-red-500 border-4 border-red-100 animate-bounce-slow">
            <AlertCircle size={28} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Transaksi Tidak Ditemukan</h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">Pesanan dengan ID #{orderId?.toUpperCase()} tidak dapat ditemukan atau telah dihapus.</p>
          </div>
          <button 
            onClick={() => navigate('/admin/verifikasi')}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer border-0 active:scale-95 transition-all"
          >
            Kembali ke Daftar Verifikasi
          </button>
        </div>
      </div>
    );
  }

  const isDp = order.status === 'WAITING_ADMIN_DP' || ['WAITING_HARVEST', 'HARVEST_CONFIRMED_SELLER', 'WAITING_FINAL_PAYMENT'].includes(order.status);
  const subtotal = (order.items || []).reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const ongkir = 15000;
  const biayaLayanan = Math.max(0, order.totalAmount - subtotal - ongkir);

  // Bank metadata parsing
  const bankParts = order.paymentMethod 
    ? order.paymentMethod.split(' - ')
    : ['BNI', '1384354499 a.n SRIWIJAYA DIGITAL INDONESIA'];
  const bankName = bankParts[0] || 'BNI';
  const bankRest = bankParts[1] || '1384354499 a.n SRIWIJAYA DIGITAL INDONESIA';
  const bankSubParts = bankRest.split(' a.n ');
  const bankNum = bankSubParts[0] || '1384354499';
  const bankHolder = bankSubParts[1] || 'SRIWIJAYA DIGITAL INDONESIA';

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar flex flex-col min-h-screen">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-white border-b border-slate-100 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/verifikasi')}
            className="p-2 hover:bg-slate-55 rounded-xl text-slate-650 transition-all cursor-pointer border-0 active:scale-95 flex items-center justify-center shrink-0 bg-slate-50"
            title="Kembali ke Daftar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
               <ShieldCheck className="text-brand-600" size={18} />
               <h1 className="text-base sm:text-lg font-black text-slate-800 font-display">Verifikasi Transaksi #{order.id.toUpperCase()}</h1>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Tinjau detail alamat, rincian pembelian, sisa tagihan, dan bukti slip transfer.</p>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 sm:p-10 max-w-4xl w-full mx-auto space-y-6 sm:space-y-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Main info panel */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Meta status info card */}
            <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaksi ID</span>
                <span className="font-bold text-slate-800 text-xs">#{order.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis Verifikasi</span>
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  isDp ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                }`}>
                  {isDp ? 'Down Payment (30%)' : 'Pelunasan (70%)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tanggal Pemesanan</span>
                <span className="text-xs font-bold text-slate-700">{order.createdAt}</span>
              </div>
            </div>

            {/* Address info card */}
            <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Informasi Alamat Pengiriman</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Pembeli</p>
                  <p className="font-bold text-slate-800 text-sm">{order.buyerName || 'Pembeli Umum'}</p>
                  <p className="text-slate-500 font-medium leading-relaxed">{order.buyerAddress || 'Alamat tidak tertera, Sukamaju'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Penjual / Petani</p>
                  <p className="font-bold text-slate-800 text-sm">{order.sellerName || 'Penjual Desa'}</p>
                  <p className="text-slate-500 font-medium leading-relaxed">{order.sellerAddress || 'Alamat Penjual, Sukamaju'}</p>
                </div>
              </div>
            </div>

            {/* Products list card */}
            <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Komoditas yang Dipesan</p>
              <div className="space-y-4">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop'} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0" 
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate text-sm">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {item.quantity} {item.unit} x Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <p className="font-black text-slate-850 shrink-0 text-sm">
                      Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial breakdown card */}
            <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Rincian Finansial Lengkap</p>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal Produk:</span>
                  <span className="font-bold text-slate-700">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimasi Ongkos Kirim:</span>
                  <span className="font-bold text-slate-700">Rp {ongkir.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Biaya Layanan Escrow:</span>
                  <span className="font-bold text-slate-700">Rp {biayaLayanan.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-500 border-t border-slate-200/50 pt-2.5 font-semibold">
                  <span className="text-slate-800">Total Transaksi:</span>
                  <span className="text-slate-800 font-black">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Down Payment (30%):</span>
                  <span className="font-bold text-slate-700">Rp {order.dpAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-500 border-t border-slate-100 pt-2.5 font-black">
                  <span className="text-slate-800">Sisa Pembayaran (Pelunasan 70%):</span>
                  <span className="text-brand-650 text-sm sm:text-base">Rp {order.remainingAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar / Slip and actions */}
          <div className="space-y-6">
            
            {/* Bank Receipt Slip (Bukti Transfer) */}
            <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Bukti Transfer (Slip)</p>
              {order.paymentProof ? (
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 p-2 shadow-inner">
                  <img 
                    src={order.paymentProof} 
                    alt="Bukti Transfer Pembeli" 
                    className="w-full max-h-72 object-contain rounded-xl hover:scale-105 transition-transform duration-300 cursor-zoom-in" 
                  />
                  <p className="text-[8px] font-mono text-center text-slate-400 mt-2 uppercase tracking-wider">Gambar Bukti Transfer Diunggah Pembeli</p>
                </div>
              ) : (
                <div className="bg-slate-900 rounded-3xl p-5 text-white font-mono space-y-3 relative group overflow-hidden shadow-lg border border-slate-800">
                  <div className="text-center pb-3 border-b border-white/5">
                    <h4 className="text-[10px] font-black tracking-widest text-emerald-400">TRANSFER BERHASIL</h4>
                    <p className="text-[8px] text-slate-550 mt-0.5 uppercase tracking-tight">Siklus Escrow PanganDesa</p>
                  </div>
                  <div className="space-y-2 text-[9px]">
                    <div className="flex justify-between gap-2"><span className="text-slate-400 shrink-0">TANGGAL:</span><span className="truncate">{order.createdAt}</span></div>
                    <div className="flex justify-between gap-2"><span className="text-slate-400 shrink-0">ID TRANS:</span><span className="truncate">#{order.id.toUpperCase()}</span></div>
                    <div className="flex justify-between gap-2"><span className="text-slate-400 shrink-0">PENGIRIM:</span><span className="truncate">{order.buyerName || 'Mitra Pembeli'}</span></div>
                    <div className="flex justify-between gap-2"><span className="text-slate-400 shrink-0">BANK TUJUAN:</span><span>{bankName}</span></div>
                    <div className="flex justify-between gap-2"><span className="text-slate-400 shrink-0">REK TUJUAN:</span><span>{bankNum}</span></div>
                    <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                      <span className="text-slate-400 font-bold">TOTAL BAYAR:</span>
                      <span className="text-emerald-400 font-black text-[10px]">
                        Rp {(isDp ? order.dpAmount : order.remainingAmount).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
                </div>
              )}
            </div>

            {/* Page Actions block */}
            <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Tindakan Admin</p>
              
              {/* Formal Invoice print/download triggers a full modal preview */}
              <button 
                onClick={() => setSelectedInvoiceOrder(order)}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-slate-100 cursor-pointer font-bold"
              >
                <FileText size={14} className="text-slate-500" /> Lihat & Cetak Invoice
              </button>

              {/* Approval Buttons block */}
              {(order.status === 'WAITING_ADMIN_DP' || order.status === 'WAITING_ADMIN_FINAL') ? (
                isRejecting ? (
                  <div className="space-y-3 bg-red-50/50 p-4 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="space-y-1.5">
                      <label className="text-[8px] sm:text-[9px] font-black text-red-800 uppercase tracking-widest block">Alasan Penolakan Pembayaran</label>
                      <textarea 
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Masukkan alasan penolakan..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-xs font-semibold text-slate-800 bg-white resize-none"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setIsRejecting(false)}
                        className="flex-1 py-2 bg-white border border-slate-200 text-slate-505 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Batal
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          if (!rejectionReason.trim()) return;
                          const confirmReject = confirm(`Apakah Anda yakin ingin menolak pembayaran ${isDp ? 'DP' : 'Pelunasan'} untuk pesanan #${order.id.toUpperCase()}?`);
                          if (confirmReject) {
                            try {
                              onConfirmPayment(order.id, order.status === 'WAITING_ADMIN_DP' ? 'DP_REJECT' : 'FINAL_REJECT');
                              alert(`✅ Pembayaran pesanan #${order.id.toUpperCase()} berhasil ditolak! Alasan: "${rejectionReason}"`);
                              navigate('/admin/verifikasi');
                            } catch (error) {
                              alert(`❌ Gagal menolak pembayaran pesanan #${order.id.toUpperCase()}. Silakan coba lagi.`);
                            }
                          }
                        }}
                        className="flex-1 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider border-0 cursor-pointer shadow-md shadow-red-950/10"
                      >
                        Kirim
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => {
                        const confirmApprove = confirm(`Apakah Anda yakin ingin menyetujui pembayaran ${isDp ? 'DP' : 'Pelunasan'} untuk pesanan #${order.id.toUpperCase()}?`);
                        if (confirmApprove) {
                          try {
                            onConfirmPayment(order.id, order.status === 'WAITING_ADMIN_DP' ? 'DP' : 'FINAL');
                            alert(`✅ Pembayaran pesanan #${order.id.toUpperCase()} berhasil disetujui!`);
                            navigate('/admin/verifikasi');
                          } catch (error) {
                            alert(`❌ Gagal menyetujui pembayaran pesanan #${order.id.toUpperCase()}. Silakan coba lagi.`);
                          }
                        }
                      }}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all border-0 cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 font-bold"
                    >
                      <CheckCircle2 size={14} /> Setujui Pembayaran
                    </button>
                    <button 
                      onClick={() => {
                        setIsRejecting(true);
                        setRejectionReason('');
                      }}
                      className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-0 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <XCircle size={14} /> Tolak Pembayaran
                    </button>
                  </div>
                )
              ) : (
                <button 
                  onClick={() => {
                    const isDp = ['WAITING_HARVEST', 'HARVEST_CONFIRMED_SELLER', 'WAITING_FINAL_PAYMENT'].includes(order.status);
                    const confirmCancel = confirm(`Apakah Anda yakin ingin membatalkan konfirmasi pembayaran ${isDp ? 'DP' : 'Pelunasan'} untuk pesanan #${order.id.toUpperCase()}?`);
                    if (confirmCancel) {
                      try {
                        onConfirmPayment(order.id, isDp ? 'CANCEL_DP' : 'CANCEL_FINAL');
                        alert(`✅ Konfirmasi pembayaran pesanan #${order.id.toUpperCase()} berhasil dibatalkan!`);
                        navigate('/admin/verifikasi');
                      } catch (error) {
                        alert(`❌ Gagal membatalkan konfirmasi pembayaran pesanan #${order.id.toUpperCase()}. Silakan coba lagi.`);
                      }
                    }
                  }}
                  className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-0 cursor-pointer flex items-center justify-center gap-1.5 font-bold"
                >
                  <XCircle size={14} /> Batalkan Verifikasi
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Invoice Modal for Printable formal invoice */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedInvoiceOrder(null)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-[800px] h-[85vh] overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <Invoice 
                order={selectedInvoiceOrder} 
                onBack={() => setSelectedInvoiceOrder(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
