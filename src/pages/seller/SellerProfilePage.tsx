import React from 'react';
import { motion } from 'motion/react';
import { 
  Camera, 
  Store, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronLeft, 
  Save, 
  Globe, 
  Info,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SellerProfileProps {
  onBack: () => void;
}

export default function SellerProfilePage({ onBack }: SellerProfileProps) {
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 pb-20">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 md:gap-6">
           <button 
             onClick={onBack}
             className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-slate-100 rounded-xl md:rounded-2xl text-slate-400 hover:text-slate-800 hover:shadow-md transition-all active:scale-95 shadow-sm"
           >
             <ChevronLeft size={20} className="md:w-6 md:h-6" />
           </button>
           <div>
              <h1 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight">Profil Penjual</h1>
              <p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1">Kelola toko & identitas Anda</p>
           </div>
        </div>

        {/* Hero Section: Avatar & Shop Card */}
        <div className="bg-white rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-brand-900 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-transparent to-brand-900" />
           </div>
           
           <div className="relative pt-12 md:pt-16 px-6 md:px-10 pb-8 md:pb-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
              <div className="relative">
                 <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] md:rounded-[48px] overflow-hidden border-4 md:border-8 border-white shadow-2xl bg-white ring-1 ring-slate-100">
                    <img 
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400" 
                      alt="Seller Logo" 
                      className="w-full h-full object-cover"
                    />
                 </div>
                 <button className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-brand-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-[20px] flex items-center justify-center shadow-xl hover:bg-brand-700 hover:rotate-6 transition-all border-4 border-white cursor-pointer group/cam">
                    <Camera size={18} className="md:w-[22px] md:h-[22px] group-hover/cam:scale-110 transition-transform" />
                 </button>
              </div>

              <div className="flex-1 text-center md:text-left pb-2 md:pb-4">
                 <div className="flex flex-col md:flex-row items-center gap-3 mb-3 md:mb-2">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">Pak Joko Lembang</h2>
                    <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm border border-emerald-100/50">
                       <ShieldCheck size={12} /> Terverifikasi
                    </div>
                 </div>
                 <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 md:gap-4 text-slate-400">
                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                       <Store size={14} className="text-brand-500" /> Toko Berkah Tani
                    </div>
                    <div className="hidden md:block w-1 h-1 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-500">
                       <ShieldCheck size={14} /> Seller Terverifikasi
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
           {/* Sidebar Info - Hidden or Stacked on small screens */}
           <div className="order-2 lg:order-1 lg:col-span-1 space-y-6">
              <div className="bg-brand-50/50 border border-brand-100 p-6 md:p-8 rounded-[32px] md:rounded-[40px] space-y-4">
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-100 text-brand-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <Info size={20} className="md:w-6 md:h-6" />
                 </div>
                 <h4 className="text-xs md:text-sm font-black text-brand-900 uppercase tracking-tight">Data Profil Penting</h4>
                 <p className="text-[10px] md:text-xs font-medium text-brand-700/70 leading-relaxed uppercase tracking-widest">
                    Informasi akurat meningkatkan <span className="font-black text-brand-900 text-xs text-nowrap">KEPERCAYAAN PEMBELI</span>. Pastikan kontak WhatsApp aktif.
                 </p>
              </div>

              <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-sm flex items-center justify-between">
                 <div>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Toko</p>
                    <p className="text-xs md:text-sm font-black text-emerald-600 uppercase tracking-tight">Buka Sekarang</p>
                 </div>
                 <div className="w-10 h-5 md:w-12 md:h-6 bg-emerald-100 rounded-full p-1 relative cursor-pointer shadow-inner">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-emerald-600 rounded-full absolute right-1" />
                 </div>
              </div>
           </div>

           {/* Main Form */}
           <div className="order-1 lg:order-2 lg:col-span-2 space-y-8">
              <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm space-y-8 md:space-y-10">
                 {/* Personal Section */}
                 <div className="space-y-5 md:space-y-6">
                    <h3 className="text-[9px] md:text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] px-1 flex items-center gap-3">
                       <User size={14} /> Informasi Pribadi
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                       <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Pemilik</label>
                          <div className="relative group">
                             <User className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors w-4 h-4 md:w-[18px] md:h-[18px]" />
                             <input 
                               type="text" 
                               defaultValue="Joko Susanto"
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 pl-12 md:pl-14 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:bg-white focus:border-brand-200 outline-none transition-all shadow-inner"
                             />
                          </div>
                       </div>
                       <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Toko</label>
                          <div className="relative group">
                             <Store className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors w-4 h-4 md:w-[18px] md:h-[18px]" />
                             <input 
                               type="text" 
                               defaultValue="Toko Berkah Tani"
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 pl-12 md:pl-14 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:bg-white focus:border-brand-200 outline-none transition-all shadow-inner"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                       <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Bisnis</label>
                          <div className="relative group">
                             <Mail className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors w-4 h-4 md:w-[18px] md:h-[18px]" />
                             <input 
                               type="email" 
                               defaultValue="joko.tani@pangan.desa"
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 pl-12 md:pl-14 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:bg-white focus:border-brand-200 outline-none transition-all shadow-inner"
                             />
                          </div>
                       </div>
                       <div className="space-y-1.5 md:space-y-2">
                          <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Toko</label>
                          <div className="relative group">
                             <Phone className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors w-4 h-4 md:w-[18px] md:h-[18px]" />
                             <input 
                               type="tel" 
                               defaultValue="0812-7788-9900"
                               className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 pl-12 md:pl-14 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:bg-white focus:border-brand-200 outline-none transition-all shadow-inner"
                             />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Legal Section */}
                 <div className="space-y-5 md:space-y-6">
                    <h3 className="text-[9px] md:text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] px-1 flex items-center gap-3">
                       <ShieldCheck size={14} /> Dokumen Legalitas (Wajib)
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                       <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[28px] text-center space-y-3 group hover:border-brand-300 transition-all cursor-pointer">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:text-brand-600 shadow-sm border border-slate-100 transition-all">
                             <Save size={24} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Akte / SK Kemenkumham / Sertifikat Lahan</p>
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Format: PDF/JPG (Maks 10MB)</p>
                          </div>
                          <span className="inline-block text-[9px] font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-lg">Pilih File</span>
                       </div>
                    </div>
                 </div>

                 {/* Shop Section */}
                 <div className="space-y-5 md:space-y-6">
                    <h3 className="text-[9px] md:text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] px-1 flex items-center gap-3">
                       <Globe size={14} /> Deskripsi Toko
                    </h3>
                    
                    <div className="space-y-1.5 md:space-y-2">
                       <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Toko</label>
                       <textarea 
                         defaultValue="Menyediakan sayuran segar organik langsung dari ladang. Kami mengedepankan kualitas dan harga yang bersahabat."
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] p-5 md:p-6 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:bg-white focus:border-brand-200 outline-none transition-all shadow-inner min-h-[100px] md:min-h-[120px] resize-none"
                         placeholder="Ceritakan tentang toko Anda..."
                       />
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                       <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Penjemputan</label>
                       <div className="relative group">
                          <MapPin className="absolute left-4 md:left-5 top-7 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors w-4 h-4 md:w-[18px] md:h-[18px]" />
                          <textarea 
                            defaultValue="Blok C No. 45, Desa Lembang, Kec. Lembang, Kabupaten Bandung Barat, Jawa Barat 40391"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[32px] p-5 md:p-6 pl-12 md:pl-14 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:bg-white focus:border-brand-200 outline-none transition-all shadow-inner min-h-[80px] md:min-h-[100px] resize-none"
                          />
                       </div>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="pt-4 flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button 
                      type="submit"
                      disabled={isSaved}
                      className={`flex-1 flex items-center justify-center gap-2 md:gap-3 py-4 md:py-5 rounded-xl md:rounded-[24px] text-xs md:text-sm font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                        isSaved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-brand-900 text-white shadow-brand-900/20 hover:bg-black'
                      }`}
                    >
                       {isSaved ? (
                         <>
                           <CheckCircle2 size={20} className="animate-bounce" /> Sukses Disimpan
                         </>
                       ) : (
                         <>
                           <Save size={18} /> Simpan Perubahan
                         </>
                       )}
                    </button>
                    <button 
                      type="button"
                      onClick={onBack}
                      className="px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-[24px] text-xs md:text-sm font-black uppercase tracking-widest text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                    >
                       Batal
                    </button>
                 </div>
              </div>
           </div>
        </form>
      </div>
    </div>
  );
}
