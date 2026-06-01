import React from 'react';
import { User, Lock, ShieldCheck, Mail, Phone, CreditCard, ChevronRight, Fingerprint, Bell } from 'lucide-react';

export default function SettingsPage({ onNavigate }: { onNavigate: (item: string) => void }) {
  const sections = [
    { 
      group: 'Profil & Keamanan',
      items: [
        { label: 'Data Pribadi', desc: 'Ubah nama, email, dan biodata Anda', icon: <User />, type: 'profil-detail' },
        { label: 'Keamanan Akun', desc: 'Ganti password dan aktifkan 2FA', icon: <Lock />, type: 'ganti-password' },
        { label: 'PIN PanganDesa', desc: 'Atur PIN transaksimu agar lebih aman', icon: <Fingerprint />, type: 'pin-keamanan' },
      ]
    },
    // {
    //   group: 'Transaksi & Pembayaran',
    //   items: [
    //     { label: 'Rekening Bank', desc: 'Kelola rekening untuk refund atau saldo', icon: <CreditCard />, type: 'bank' },
    //     { label: 'Metode Pembayaran', desc: 'E-Wallet dan VA Terhubung', icon: <ShieldCheck />, type: 'payment' },
    //   ]
    // },
    {
      group: 'Komunikasi',
      items: [
        { label: 'Notifikasi', desc: 'Pilih tipe kabar yang ingin Anda terima', icon: <Bell />, type: 'notif' },
        { label: 'Hubungkan WhatsApp', desc: 'Update status pengiriman via WA', icon: <Phone />, type: 'wa' },
      ]
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar p-6 sm:p-12">
      <div className="max-w-[1000px] mx-auto space-y-8 sm:space-y-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-800 font-display mb-2">Pengaturan</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Kelola pengalaman belanja dan keamanan akun Anda.</p>
        </div>

        <div className="space-y-8 sm:space-y-12">
           {sections.map((section, idx) => (
             <div key={idx}>
                <h3 className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-4 sm:mb-6 px-4">{section.group}</h3>
                <div className="bg-white rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                   {section.items.map((item, i) => (
                     <div key={i} className="group cursor-pointer" onClick={() => onNavigate(item.type)}>
                        <div className="flex items-center justify-between p-4 sm:p-8 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0">
                           <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                              <div className="w-11 h-11 sm:w-14 sm:h-14 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all shrink-0">
                                 {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
                              </div>
                              <div className="min-w-0">
                                 <h4 className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors uppercase tracking-tight text-xs sm:text-sm truncate">{item.label}</h4>
                                 <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 sm:mt-1 truncate sm:whitespace-normal">{item.desc}</p>
                              </div>
                           </div>
                           <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           ))}

           <div className="bg-red-50/50 rounded-[24px] sm:rounded-[40px] p-6 sm:p-8 border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                 <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-sm shadow-red-500/10 shrink-0">
                    <ShieldCheck size={28} />
                 </div>
                 <div>
                    <h4 className="font-black text-red-600 font-display uppercase tracking-tight">Hapus Akun</h4>
                    <p className="text-[10px] sm:text-xs text-red-400 font-medium mt-1 italic">Hapus data Anda secara permanen dari sistem PanganDesa.</p>
                 </div>
              </div>
              <button className="w-full sm:w-auto px-8 py-3.5 sm:px-6 sm:py-3 bg-red-500 text-white rounded-xl sm:rounded-2xl font-black text-xs hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20">
                 Hapus Akun
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
