import React, { useState } from 'react';
import { Camera, Mail, Phone, MapPin, User, ChevronLeft, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileDetailProps {
  onBack: () => void;
}

export default function ProfileDetailPage({ onBack }: ProfileDetailProps) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, email, phone, address });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };

  const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop';
  const userAvatar = user?.avatar || defaultAvatar;

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
           <button 
             onClick={onBack}
             className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white rounded-xl md:rounded-2xl transition-all text-slate-400 hover:text-slate-800 border border-slate-100 bg-white/50 shadow-sm cursor-pointer"
           >
             <ChevronLeft size={20} className="md:w-6 md:h-6" />
           </button>
           <h1 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Profil Saya</h1>
        </div>

        {/* Profile Image Section */}
        <div className="bg-white p-6 sm:p-10 rounded-[28px] sm:rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center gap-4 sm:gap-6">
           <div className="relative">
               <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[28px] sm:rounded-[40px] overflow-hidden border-4 border-white shadow-xl bg-slate-50 flex items-center justify-center ring-1 ring-slate-100 shrink-0">
                  {user?.avatar ? (
                     <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                     <User className="w-10 h-10 sm:w-14 sm:h-14 text-slate-300" />
                  )}
               </div>
               <button className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-brand-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg hover:bg-brand-700 transition-all border-4 border-white cursor-pointer">
                  <Camera size={14} className="sm:w-[18px] sm:h-[18px]" />
               </button>
            </div>
            <div className="text-center">
               <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">{user?.name || 'User PanganDesa'}</h2>
               <p className="text-slate-400 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest mt-1">ID Pelanggan: PD-{user?.id || '882190'}</p>
            </div>
        </div>

        {/* Form Details */}
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-10 rounded-[28px] sm:rounded-[40px] border border-slate-100 shadow-sm space-y-6 sm:space-y-8">
           <div className="space-y-5 sm:space-y-6">
              <h3 className="text-[9px] sm:text-[10px] font-black text-brand-600 uppercase tracking-widest px-1">Informasi Personal</h3>
              
              <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <div className="relative">
                     <User size={16} className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-300 sm:w-[18px] sm:h-[18px]" />
                     <input 
                       type="text" 
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 pl-11 sm:pl-14 text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all shadow-inner"
                     />
                  </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                     <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Akun</label>
                     <select className="w-full bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none appearance-none">
                        <option>Individu / Perseorangan</option>
                        <option>Perusahaan / Badan Hukum</option>
                     </select>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                     <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dokumen Legalitas (Opsional)</label>
                     <button type="button" className="w-full bg-slate-50 border border-dashed border-slate-300 rounded-xl py-3.5 sm:py-5 text-[9px] font-black uppercase text-slate-400 hover:border-brand-500 hover:text-brand-600 transition-all cursor-pointer">
                        Upload Dokumen (.pdf/jpg)
                     </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                     <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                     <div className="relative">
                        <Mail size={16} className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-300 sm:w-[18px] sm:h-[18px]" />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 pl-11 sm:pl-14 text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all shadow-inner"
                        />
                     </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                     <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. WhatsApp</label>
                     <div className="relative">
                        <Phone size={16} className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-300 sm:w-[18px] sm:h-[18px]" />
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 pl-11 sm:pl-14 text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all shadow-inner"
                        />
                     </div>
                  </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Utama</label>
                  <div className="relative">
                     <MapPin size={16} className="absolute left-4 sm:left-5 top-6 sm:top-7 -translate-y-1/2 text-slate-300 sm:w-[18px] sm:h-[18px]" />
                     <textarea 
                       value={address}
                       onChange={(e) => setAddress(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 pl-11 sm:pl-14 text-xs sm:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all shadow-inner min-h-[80px] sm:min-h-[100px] resize-none"
                     />
                  </div>
              </div>
           </div>

           <button 
             type="submit"
             disabled={isSaved}
             className={`w-full flex items-center justify-center gap-2 py-4 md:py-5 rounded-xl md:rounded-[24px] text-xs md:text-sm font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 cursor-pointer ${
               isSaved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-brand-900 text-white shadow-brand-900/20 hover:bg-black'
             }`}
           >
              {isSaved ? (
                <>
                  <CheckCircle2 size={16} className="animate-bounce" /> Sukses Disimpan
                </>
              ) : (
                <>
                  <Save size={16} /> Simpan Perubahan
                </>
              )}
           </button>
        </form>
      </div>
    </div>
  );
}
