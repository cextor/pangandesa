import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sprout, Mail, Lock, ArrowRight, ShieldCheck, Leaf, Users, Heart } from 'lucide-react';
import { AppRole } from '../types';

interface LoginPageProps {
  onLogin: (role: AppRole) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      if (username === 'pembeli' && password === '123456') {
        onLogin('buyer');
      } else if (username === 'penjual' && password === '123456') {
        onLogin('seller');
      } else {
        setError('Username atau password salah. Coba lagi.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-display">
      {/* Left Column: Visual/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-900 relative overflow-hidden group cursor-pointer">
        <motion.div 
          whileHover={{ x: 10 }}
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

          {/* Floating Glassmorphism Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute top-[20%] right-[-5%] w-64 h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 z-20 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white">
                  <Heart size={20} fill="currentColor" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Happy Customers</p>
                  <p className="text-xl font-black text-white">4.9/5 RATING</p>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: -40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute bottom-[25%] left-[-5%] w-72 h-40 bg-brand-600/20 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 z-20 shadow-2xl"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 mb-4 shadow-lg">
               <ShieldCheck size={24} />
            </div>
            <p className="text-sm font-bold text-white mb-1">100% Secure Transact</p>
            <p className="text-[10px] text-white/60 font-medium">Your money is safe with our escrow system, guaranteed.</p>
          </motion.div>

          <div className="relative z-10 p-20 flex flex-col justify-between h-full text-white">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                <Sprout size={32} className="text-brand-300" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-black tracking-tight leading-none">PanganDesa</h1>
                <span className="text-[9px] font-black text-brand-300 uppercase tracking-[0.4em] mt-1">Direct from village</span>
              </div>
            </div>

            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-6xl font-black leading-[1.1] mb-8 font-display">
                  Kesegaran Desa <br />
                  <span className="text-brand-400">Di Ujung Jari.</span>
                </h2>
                <p className="text-xl text-brand-50 font-medium leading-relaxed mb-12 max-w-md opacity-90">
                  Hubungkan dapur Anda langsung dengan petani terbaik di seluruh Indonesia. Pesan hari ini, panen hari ini.
                </p>
              </motion.div>

              <div className="flex items-center gap-12">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-900 bg-slate-200 overflow-hidden shadow-lg">
                         <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="User" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-brand-900 bg-brand-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                      +2K
                    </div>
                 </div>
                 <div className="h-10 w-px bg-white/10" />
                 <div className="flex flex-col">
                    <span className="text-2xl font-black text-white">1,240+</span>
                    <span className="text-[9px] font-black text-brand-300 uppercase tracking-widest">Active Farmers</span>
                 </div>
              </div>
            </div>

            <div className="text-xs text-white/40 flex items-center gap-8">
              <span className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full" /> 500+ Desa Unggulan</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full" /> Ekosistem Terpercaya</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full" /> Panen Setiap Hari</span>
            </div>
          </div>
          
          {/* Abstract decorative blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500 rounded-full blur-[150px] opacity-10 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-brand-400 rounded-full blur-[120px] opacity-10" />
        </motion.div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h3 className="text-3xl font-black text-slate-800 mb-3 uppercase tracking-tight">Selamat Datang 👋</h3>
            <p className="text-slate-500 font-medium">Silakan masuk untuk melanjutkan ke dashboard Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username Anda"
                  className="w-full bg-white border border-slate-200 rounded-[20px] py-4 pl-14 pr-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-[20px] py-4 pl-14 pr-6 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all shadow-sm"
                  required
                />
              </div>
              <div className="flex justify-end pr-1">
                <button type="button" className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline">Lupa Password?</button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full bg-brand-600 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-brand-600/20 flex items-center justify-center gap-3 transition-all hover:bg-brand-700 active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  MASUK SEKARANG
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-400 font-medium">Belum punya akun? <button className="text-brand-600 font-black uppercase tracking-tight hover:underline">Daftar Jadi Petani</button></p>
          </div>

          <div className="mt-20 pt-12 border-t border-slate-100">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] text-center mb-6">Demo Credentials</p>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-xs">
                   <p className="text-[10px] font-black text-slate-800 mb-1">PEMBELI</p>
                   <p className="text-[10px] text-slate-400 font-medium font-mono">pembeli / 123456</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-xs">
                   <p className="text-[10px] font-black text-slate-800 mb-1">PENJUAL</p>
                   <p className="text-[10px] text-slate-400 font-medium font-mono">penjual / 123456</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
