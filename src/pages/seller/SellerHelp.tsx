import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  ChevronDown, 
  MessageSquare, 
  Phone, 
  Mail, 
  BookOpen, 
  Sparkles, 
  Sprout, 
  Info, 
  UploadCloud, 
  CreditCard 
} from 'lucide-react';

export default function SellerHelp() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      icon: Sprout,
      question: "Bagaimana cara mendapatkan lebih banyak pesanan (order)?",
      answer: "Untuk memaksimalkan penjualan, Anda dapat membuka sistem Pre-Order lebih awal sebelum musim panen dimulai agar pembeli memiliki waktu merencanakan pembelian mereka. Pastikan deskripsi pangan ditulis detail (misal: bebas pestisida, jenis pupuk) dan unggah foto produk pangan asli yang jernih. Memiliki reputasi rating bintang tinggi juga otomatis menempatkan produk Anda di halaman utama pembeli."
    },
    {
      icon: UploadCloud,
      question: "Bagaimana cara mengupload atau menambah produk pangan baru?",
      answer: "Buka menu 'Produk Saya' di sidebar sebelah kiri, lalu klik tombol '+ Tambah Produk Baru' di pojok kanan atas. Isi formulir dengan lengkap mulai dari Nama Pangan, Kategori (Sayur, Buah, Beras), Deskripsi Keunggulan, Harga per kg/unit, Tanggal Estimasi Panen, Jumlah Stok Tani, dan aktifkan pilihan 'Pre-Order'. Unggah foto pangan terbaik lalu klik 'Simpan'."
    },
    {
      icon: CreditCard,
      question: "Bagaimana cara memantau status invoice pembayaran DP & Pelunasan?",
      answer: "Semua pembayaran dari pembeli menggunakan sistem rekber/escrow PanganDesa untuk keamanan bersama. Saat pembeli melakukan pemesanan, invoice otomatis diterbitkan. Anda dapat memantau riwayat kuitansi invoice di menu 'Keuangan'. Status pembayaran DP (30%) dari pembeli akan diverifikasi oleh Admin sebelum Anda mulai memproses panen, begitu juga dengan pelunasan (70%) sebelum barang dikirim."
    },
    {
      icon: HelpCircle,
      question: "Bagaimana alur pencairan uang hasil penjualan ke rekening bank?",
      answer: "Setelah pembeli mengonfirmasi bahwa produk pangan telah sampai dan diterima dengan baik, dana transaksi akan langsung diteruskan masuk ke 'Saldo yang Dapat Ditarik' Anda. Masuk ke halaman 'Dashboard' atau menu 'Keuangan', lalu klik tombol 'Tarik Dana'. Pilih rekening bank Anda yang telah terverifikasi, masukkan nominal pencairan, dan dana akan ditransfer ke rekening bank Anda dalam waktu maksimal 1x24 jam kerja."
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 pb-20">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <HelpCircle className="text-brand-600" size={32} />
                 <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight">Bantuan & Panduan</h1>
              </div>
              <p className="text-slate-500 font-medium text-xs md:text-sm">Panduan lengkap pengoperasian platform PanganDesa dan solusi cepat kendala mitra tani.</p>
           </div>
        </div>

        {/* Quick Help Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/50">
                 <MessageSquare size={20} />
              </div>
              <div>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">WhatsApp CS</p>
                 <p className="text-xs font-black text-slate-800">0812-3456-7890</p>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100/50">
                 <Mail size={20} />
              </div>
              <div>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email Support</p>
                 <p className="text-xs font-black text-slate-800">bantuan@pangan.desa</p>
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100/50">
                 <BookOpen size={20} />
              </div>
              <div>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Waktu Layanan</p>
                 <p className="text-xs font-black text-slate-800">Setiap Hari 08:00-17:00</p>
              </div>
           </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm space-y-8">
           <div>
              <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Pertanyaan yang Sering Diajukan</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Jawaban cepat seputar penambahan produk pangan, sistem invoice, dan pencairan dana.</p>
           </div>

           <div className="space-y-4">
             {faqs.map((faq, idx) => {
               const Icon = faq.icon;
               const isExpanded = expandedIndex === idx;
               return (
                 <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                    <button 
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors"
                    >
                       <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isExpanded ? 'bg-brand-900 text-white' : 'bg-slate-50 text-slate-400'
                          }`}>
                             <Icon size={16} />
                          </div>
                          <span className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-tight">{faq.question}</span>
                       </div>
                       <ChevronDown size={18} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-brand-900' : ''}`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                           <div className="p-6 text-xs md:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100/60 bg-slate-50/50 uppercase tracking-wide">
                              {faq.answer}
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
               );
             })}
           </div>
        </div>

      </div>
    </div>
  );
}
