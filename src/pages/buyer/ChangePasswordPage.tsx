import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthService } from '../../services/AuthService';

interface ChangePasswordProps {
  onBack: () => void;
}

export default function ChangePasswordPage({ onBack }: ChangePasswordProps) {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToastMsg = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToastMsg('Harap isi semua kolom kata sandi!', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToastMsg('Kata sandi baru minimal harus 6 karakter!', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToastMsg('Konfirmasi kata sandi baru tidak cocok!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!user?.id) return;
      await AuthService.changePassword(user.id, {
        old_password: oldPassword,
        new_password: newPassword
      });
      showToastMsg('Kata sandi Anda berhasil diperbarui!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Navigate back after a short delay
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Gagal mengubah kata sandi. Pastikan kata sandi lama Anda benar.';
      showToastMsg(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
      <div className="max-w-xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
           <button 
             onClick={onBack}
             className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white rounded-xl md:rounded-2xl transition-all text-slate-400 hover:text-slate-800 border border-slate-100 bg-white/50 shadow-sm cursor-pointer"
           >
             <ChevronLeft size={20} className="md:w-6 md:h-6" />
           </button>
           <h1 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight">Ganti Password</h1>
        </div>

        {/* Security Intro */}
        <div className="bg-brand-900 rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-white relative overflow-hidden group">
           <div className="relative z-10 flex gap-4 md:gap-6 items-center">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center border border-white/20">
                 <ShieldCheck size={24} className="text-brand-300 md:w-7 md:h-7" />
              </div>
              <div className="flex-1">
                 <h4 className="text-xs md:text-sm font-black uppercase tracking-tight mb-1">Keamanan Akun</h4>
                 <p className="text-[9px] md:text-[10px] font-medium text-brand-200/70 leading-relaxed uppercase tracking-widest">Minimal 6 karakter dengan kombinasi angka dan huruf.</p>
              </div>
           </div>
           
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[80px] -mr-16 -mt-16" />
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm space-y-6 md:space-y-8">
           <div className="space-y-5 md:space-y-6">
              <div className="space-y-1.5 md:space-y-2">
                 <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Lama</label>
                 <div className="relative">
                    <Lock className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type={showOldPass ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 pl-12 md:pl-14 pr-12 md:pr-14 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all shadow-inner"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowOldPass(!showOldPass)}
                      className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors border-0 bg-transparent cursor-pointer"
                    >
                       {showOldPass ? <EyeOff size={18} className="md:w-5 md:h-5" /> : <Eye size={18} className="md:w-5 md:h-5" />}
                    </button>
                 </div>
              </div>

              <div className="h-px bg-slate-50 mx-4" />

              <div className="space-y-1.5 md:space-y-2">
                 <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
                 <div className="relative">
                    <Lock className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 pl-12 md:pl-14 pr-12 md:pr-14 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all shadow-inner"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors border-0 bg-transparent cursor-pointer"
                    >
                       {showNewPass ? <EyeOff size={18} className="md:w-5 md:h-5" /> : <Eye size={18} className="md:w-5 md:h-5" />}
                    </button>
                 </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                 <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Password Baru</label>
                 <div className="relative">
                    <Lock className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type={showConfirmPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 pl-12 md:pl-14 pr-12 md:pr-14 text-xs md:text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all shadow-inner"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors border-0 bg-transparent cursor-pointer"
                    >
                       {showConfirmPass ? <EyeOff size={18} className="md:w-5 md:h-5" /> : <Eye size={18} className="md:w-5 md:h-5" />}
                    </button>
                 </div>
              </div>
           </div>

           <button 
             type="submit"
             disabled={isSubmitting}
             className="w-full bg-brand-900 hover:bg-black text-white py-4 md:py-5 rounded-xl md:rounded-[24px] text-xs md:text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-900/20 active:scale-95 transition-all border-0 cursor-pointer disabled:opacity-55"
           >
              {isSubmitting ? 'Memproses...' : 'Perbarui Password'}
           </button>
           
           <p className="text-center text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pt-4">Lupa Password? <span className="text-brand-600 cursor-pointer hover:underline">Reset Via WhatsApp</span></p>
        </form>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl shadow-slate-950/20 border transition-all duration-300 transform translate-y-0 animate-fade-in ${
          toast.type === 'success' 
            ? 'bg-emerald-500 border-emerald-400 text-white' 
            : 'bg-red-500 border-red-400 text-white'
        }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} className="text-white shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-white shrink-0" />
            )}
            <div className="text-left">
               <p className="text-xs font-black uppercase tracking-wider">{toast.type === 'success' ? 'Berhasil' : 'Gagal'}</p>
               <p className="text-[11px] text-slate-100 font-medium leading-tight">{toast.message}</p>
            </div>
        </div>
      )}
    </div>
  );
}
