import React from 'react';
import { HelpCircle, MessageCircle, Phone, Mail, Search, ChevronRight, FileText, ShieldQuestion } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    { q: 'Apa itu Sistem Pre-Order?', a: 'Sistem pre-order memungkinkan Anda memesan produk petani sebelum masa panen tiba. Ini memberikan jaminan segar 100% karena dipanen khusus untuk Anda.' },
    { q: 'Bagaimana cara lacak pengiriman?', a: 'Anda dapat masuk ke menu "Lacak Pesanan" untuk melihat status terkini dan foto produk Anda saat sedang dipanen atau dikirim.' },
    { q: 'Apakah ada minimal pembelian?', a: 'Tidak ada minimal pembelian di PanganDesa. Namun, beberapa promo mungkin memerlukan minimal belanja tertentu.' },
    { q: 'Bagaimana jika pesanan saya rusak?', a: 'Kami memiliki fitur "Garansi Dana Kembali". Jika produk sampai dalam kondisi tidak layak, Anda bisa mengajukan komplain via chat assistant.' },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1000px] mx-auto p-12">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mx-auto mb-6 border border-brand-100 shadow-sm">
             <HelpCircle size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 font-display mb-2 uppercase tracking-tight">Pusat Bantuan</h1>
          <p className="text-slate-500 font-medium italic">Bagaimana kami bisa membantu Anda hari ini?</p>
        </div>

        <div className="relative mb-16">
           <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
             type="text" 
             placeholder="Cari kendala atau pertanyaan Anda..."
             className="w-full bg-white border border-slate-100 rounded-full py-6 pl-16 pr-8 text-lg font-medium text-slate-800 shadow-xl shadow-slate-200/20 focus:outline-none focus:ring-4 focus:ring-brand-500/5 transition-all"
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
           {[
             { title: 'Tanya Pangan-Bot', desc: 'Chat asisten AI kami 24/7', icon: <MessageCircle />, color: 'bg-green-50 text-green-600' },
             { title: 'Kontak WhatsApp', desc: 'CS Manusia (08:00 - 17:00)', icon: <Phone />, color: 'bg-brand-50 text-brand-600' },
             { title: 'Support Email', desc: 'Respon dalam 24 jam', icon: <Mail />, color: 'bg-blue-50 text-blue-600' },
             { title: 'Panduan Pengguna', desc: 'Tutorial lengkap aplikasi', icon: <FileText />, color: 'bg-amber-50 text-amber-600' },
           ].map((item, i) => (
             <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex items-center gap-6 group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110 ${item.color}`}>
                   {item.icon}
                </div>
                <div>
                   <h3 className="font-black text-slate-800 uppercase tracking-tight">{item.title}</h3>
                   <p className="text-xs text-slate-500 font-medium mt-1">{item.desc}</p>
                </div>
                <ChevronRight size={20} className="ml-auto text-slate-300 group-hover:text-brand-500 transition-colors" />
             </div>
           ))}
        </div>

        <div className="bg-white rounded-[48px] p-12 border border-slate-100 shadow-sm">
           <div className="flex items-center gap-4 mb-10">
              <ShieldQuestion className="text-brand-600" size={32} />
              <h2 className="text-2xl font-black text-slate-800 font-display uppercase tracking-tight">Pertanyaan Populer</h2>
           </div>
           <div className="divide-y divide-slate-100">
              {faqs.map((faq, i) => (
                <div key={i} className="py-8 first:pt-0 last:pb-0 group cursor-pointer">
                   <h4 className="text-lg font-black text-slate-800 flex items-center justify-between group-hover:text-brand-600 transition-colors">
                      {faq.q}
                      <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-all" />
                   </h4>
                   <p className="text-sm text-slate-500 mt-3 leading-loose font-medium max-w-2xl">{faq.a}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
