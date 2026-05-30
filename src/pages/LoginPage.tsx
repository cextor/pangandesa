import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowRight, ShieldCheck, Leaf, Users, Heart } from 'lucide-react';
import { AppRole } from '../types';
import { APP_LOGO } from '../constants';

interface LoginPageProps {
  onLogin: (username: string, password?: string) => Promise<void>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let loginEmail = username;
      let loginPassword = password;

      // Pemetaan kata kunci alias/demo demi kemudahan login
      const cleanUsername = username.trim().toLowerCase();
      if (cleanUsername === 'pembeli') {
        loginEmail = 'andi@gmail.com';
        loginPassword = 'password';
      } else if (cleanUsername === 'penjual') {
        loginEmail = 'petani@gmail.com';
        loginPassword = 'password';
      } else if (cleanUsername === 'admin') {
        loginEmail = 'admin@pangandesa.com';
        loginPassword = 'password';
      }

      await onLogin(loginEmail, loginPassword);
    } catch (err: any) {
      console.error('Login error details:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Username/Email atau Password salah. Silakan coba lagi.');
        } else {
          setError(`Error server (${err.response.status}): ${err.response.data?.message || 'Gagal masuk.'}`);
        }
      } else if (err.request) {
        setError('Jaringan terputus: Gagal menghubungi API backend (http://localhost:8081). Pastikan server backend berjalan.');
      } else {
        setError(`Kesalahan sistem: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden font-display">
      {/* Left Column: Visual/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 relative overflow-hidden group cursor-pointer h-full">
        <motion.div 
          whileHover={{ x: 3 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
            <img 
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
              alt="Agricultural Farm"
            />
            <div className="absolute inset-0 bg-linear-to-br from-brand-900/80 via-brand-900/40 to-brand-800/20" />
          </div>

          <div className="relative z-10 p-10 lg:p-12 xl:p-16 flex flex-col justify-between h-full text-white w-full">
            {/* Header: Logo & Brand Name */}
            <div className="flex items-center gap-4">
              <div className="bg-white p-1 rounded-2xl shadow-xl w-14 h-14 xl:w-16 xl:h-16 flex items-center justify-center overflow-hidden">
                <img 
                  src={APP_LOGO} 
                  alt="PanganDesa Logo" 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const icon = document.createElement('div');
                      icon.className = "text-brand-600 flex items-center justify-center w-full h-full";
                      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sprout"><path d="M7 20h10"/><path d="M10 20c5.5 0 5.5-10 10-10"/><path d="M14 20c-5.5 0-5.5-10-10-10"/></svg>';
                      parent.appendChild(icon);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl xl:text-3xl font-black tracking-tight leading-none uppercase">PanganDesa</h1>
                <span className="text-[8px] font-black text-brand-300 uppercase tracking-[0.4em] mt-1">Dari Desa, Untuk Indonesia</span>
              </div>
            </div>

            {/* Middle Section: Heading + Glassmorphism Cards Side-by-Side to Prevent Overlap */}
            <div className="grid grid-cols-12 gap-6 xl:gap-8 items-center w-full my-auto">
              {/* Left Column: Heading and Description */}
              <div className="col-span-7 xl:col-span-8 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl xl:text-5xl font-display font-black leading-[1.15] tracking-tight">
                    Kesegaran Desa <br />
                    <span className="text-brand-400">Di Ujung Jari.</span>
                  </h2>
                  <p className="text-xs xl:text-sm text-brand-50 font-medium leading-relaxed opacity-95 max-w-sm">
                    Hubungkan dapur Anda langsung dengan petani terbaik di seluruh Indonesia. Pesan hari ini, panen hari ini.
                  </p>
                </motion.div>
              </div>

              {/* Right Column: Rating and Security Cards Stacked Nicely without Overlapping */}
              <div className="col-span-5 xl:col-span-4 flex flex-col gap-4">
                {/* Rating Card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-xl w-full"
                >
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                        <Heart size={16} fill="currentColor" />
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-white/50 uppercase tracking-widest leading-none">Happy Customers</p>
                        <p className="text-sm font-black text-white mt-1">4.9/5 RATING</p>
                     </div>
                  </div>
                </motion.div>

                {/* Escrow Security Card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-xl w-full"
                >
                  <div className="flex items-start gap-3">
                     <div className="w-8 h-8 bg-brand-600/30 rounded-xl flex items-center justify-center text-white shrink-0 border border-white/10">
                        <ShieldCheck size={16} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-white leading-none">Escrow System</p>
                        <p className="text-[8px] text-white/60 font-medium leading-tight mt-1">Sistem rekening bersama untuk keamanan transaksi Anda.</p>
                     </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Bottom Bullet Points */}
            <div className="text-[10px] xl:text-xs text-white/40 flex items-center gap-6 xl:gap-8">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> 500+ Desa Unggulan</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Ekosistem Terpercaya</span>
            </div>
          </div>
          
          {/* Abstract decorative blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-500 rounded-full blur-[120px] opacity-10 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-brand-400 rounded-full blur-[100px] opacity-10" />
        </motion.div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 xl:p-20 bg-slate-50/50 h-full overflow-y-auto scrollbar-hide">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md my-auto"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white p-1 rounded-xl shadow-md w-11 h-11 flex items-center justify-center overflow-hidden border border-slate-100">
              <img 
                src={APP_LOGO} 
                alt="PanganDesa Logo" 
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const icon = document.createElement('div');
                    icon.className = "text-brand-600 flex items-center justify-center w-full h-full";
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sprout"><path d="M7 20h10"/><path d="M10 20c5.5 0 5.5-10 10-10"/><path d="M14 20c-5.5 0-5.5-10-10-10"/></svg>';
                    parent.appendChild(icon);
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tight leading-none uppercase text-brand-900">PanganDesa</h1>
              <span className="text-[7px] font-black text-brand-600 uppercase tracking-[0.3em] mt-0.5">Dari Desa, Untuk Indonesia</span>
            </div>
          </div>

          <div className="mb-6 xl:mb-8">
            <p className="text-xs xl:text-sm text-slate-500 font-medium">Silakan masuk untuk melanjutkan ke dashboard Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 xl:space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] xl:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <Mail size={16} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username Anda"
                  className="w-full bg-white border border-slate-200 rounded-[18px] py-3 xl:py-3.5 pl-14 pr-6 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] xl:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-[18px] py-3 xl:py-3.5 pl-14 pr-6 text-xs sm:text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all shadow-sm"
                  required
                />
              </div>
              <div className="flex justify-end pr-1">
                <button type="button" className="text-[9px] xl:text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline">Lupa Password?</button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl text-[11px] font-bold"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full bg-brand-600 text-white py-3.5 xl:py-4 rounded-xl font-black text-xs sm:text-sm shadow-xl shadow-brand-600/20 flex items-center justify-center gap-3 transition-all hover:bg-brand-700 active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  MASUK SEKARANG
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 xl:mt-6 text-center">
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Belum punya akun?{' '}
              <button 
                type="button"
                onClick={() => navigate('/register')}
                className="text-brand-600 font-black uppercase tracking-tight hover:underline cursor-pointer"
              >
                Daftar Jadi Mitra
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
