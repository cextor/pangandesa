import React from 'react';
import { Camera, Mail, Phone, MapPin, User, ChevronLeft } from 'lucide-react';

interface ProfileDetailProps {
  onBack: () => void;
}

export default function ProfileDetailPage({ onBack }: ProfileDetailProps) {
  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
           <button 
             onClick={onBack}
             className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white rounded-xl md:rounded-2xl transition-all text-slate-400 hover:text-slate-800 border border-slate-100 bg-white/50 shadow-sm"
           >
             <ChevronLeft size={20} className="md:w-6 md:h-6" />
           </button>
           <h1 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Profil Saya</h1>
        </div>

        {/* Profile Image Section */}
        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center gap-4 md:gap-6">
           <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[40px] overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100">
                 <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <button className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-brand-600 text-white w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg hover:bg-brand-700 transition-all border-4 border-white">
                 <Camera size={14} className="md:w-[18px] md:h-[18px]" />
              </button>
           </div>
           <div className="text-center">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Budi Santoso</h2>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">ID Pelanggan: PD-882190</p>
           </div>
        </div>

        {/* Form Details */}
        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm space-y-6 md:space-y-8">
           <div className="space-y-5 md:space-y-6">
              <h3 className="text-[9px] md:text-[10px] font-black text-brand-600 uppercase tracking-widest px-1">Informasi Personal</h3>
              
              <div className="space-y-1.5 md:space-y-2">
                 <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                 <div className="relative">
                    <User className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      defaultValue="Budi Santoso"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 pl-12 md:pl-14 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all shadow-inner"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                 <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative">
                       <Mail className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         type="email" 
                         defaultValue="budi.s@email.com"
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 pl-12 md:pl-14 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all shadow-inner"
                       />
                    </div>
                 </div>
                 <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                    <div className="relative">
                       <Phone className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                         type="tel" 
                         defaultValue="0812-3456-7890"
                         className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 pl-12 md:pl-14 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all shadow-inner"
                       />
                    </div>
                 </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                 <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Utama</label>
                 <div className="relative">
                    <MapPin className="absolute left-4 md:left-5 top-7 -translate-y-1/2 text-slate-300" size={18} />
                    <textarea 
                      defaultValue="Jl. Sudirman No. 123, Blok C, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12190"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 pl-12 md:pl-14 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all shadow-inner min-h-[100px] resize-none"
                    />
                 </div>
              </div>
           </div>

           <button className="w-full bg-brand-900 text-white py-4 md:py-5 rounded-xl md:rounded-[24px] text-xs md:text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-900/20 hover:bg-black active:scale-95 transition-all">
              Simpan Perubahan
           </button>
        </div>
      </div>
    </div>
  );
}
