import React from 'react';
import { User, Lock, ShieldCheck, Mail, Phone, CreditCard, ChevronRight, Fingerprint, Bell } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    { 
      group: 'Profil & Keamanan',
      items: [
        { label: 'Data Peribadi', desc: 'Ubah nama, email, dan biodata Anda', icon: <User />, type: 'profile' },
        { label: 'Keamanan Akun', desc: 'Ganti password dan aktifkan 2FA', icon: <Lock />, type: 'security' },
        { label: 'PIN PanganDesa', desc: 'Atur PIN transaksimu agar lebih aman', icon: <Fingerprint />, type: 'pin' },
      ]
    },
    {
      group: 'Transaksi & Pembayaran',
      items: [
        { label: 'Rekening Bank', desc: 'Kelola rekening untuk refund atau saldo', icon: <CreditCard />, type: 'bank' },
        { label: 'Metode Pembayaran', desc: 'E-Wallet dan VA Terhubung', icon: <ShieldCheck />, type: 'payment' },
      ]
    },
    {
      group: 'Komunikasi',
      items: [
        { label: 'Notifikasi', desc: 'Pilih tipe kabar yang ingin Anda terima', icon: <Bell />, type: 'notif' },
        { label: 'Hubungkan WhatsApp', desc: 'Update status pengiriman via WA', icon: <Phone />, type: 'wa' },
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1000px] mx-auto p-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-800 font-display mb-2">Pengaturan</h1>
          <p className="text-slate-500 font-medium">Kelola pengalaman belanja dan keamanan akun Anda.</p>
        </div>

        <div className="space-y-12">
           {sections.map((section, idx) => (
             <div key={idx}>
                <h3 className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-6 px-4">{section.group}</h3>
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                   {section.items.map((item, i) => (
                     <div key={i} className="group cursor-pointer">
                        <div className="flex items-center justify-between p-8 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all">
                                 {item.icon}
                              </div>
                              <div>
                                 <h4 className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{item.label}</h4>
                                 <p className="text-xs text-slate-400 font-medium mt-1">{item.desc}</p>
                              </div>
                           </div>
                           <ChevronRight size={20} className="text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           ))}

           <div className="bg-red-50/50 rounded-[40px] p-8 border border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm shadow-red-500/10">
                    <ShieldCheck size={28} />
                 </div>
                 <div>
                    <h4 className="font-black text-red-600 font-display uppercase tracking-tight">Hapus Akun</h4>
                    <p className="text-xs text-red-400 font-medium mt-1 italic">Hapus data Anda secara permanen dari sistem PanganDesa.</p>
                 </div>
              </div>
              <button className="px-6 py-3 bg-red-500 text-white rounded-2xl font-black text-xs hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20">
                 Hapus Akun
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
