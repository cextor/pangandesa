import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ShoppingCart, 
  User, 
  ChevronDown, 
  MapPin, 
  Menu,
  Lock,
  Key,
  LogOut,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { AppRole } from '../../types';

interface HeaderProps {
  onCartClick: () => void;
  onMenuClick?: () => void;
  onLogout?: () => void;
  activeRole?: AppRole;
}

export default function Header({ onCartClick, onMenuClick, onLogout, activeRole = 'buyer' }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isAdmin = activeRole === 'seller';
  const userName = isAdmin ? 'Pak Joko' : 'Andi Wijaya';
  const userLocation = isAdmin ? 'Desa Sukamaju' : 'Jakarta';
  const userAvatar = isAdmin 
    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' // Using a realistic avatar
    : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop';
  const userStatus = isAdmin ? 'Penjual Verified' : 'Pembeli Verified';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  const menuItems = [
    { label: 'Profil Saya', icon: User, color: 'text-blue-500' },
    { label: 'Ganti Password', icon: Lock, color: 'text-amber-500' },
    { label: 'Ubah PIN', icon: Key, color: 'text-emerald-500' },
    { label: 'Keluar', icon: LogOut, color: 'text-red-500' },
  ];

  return (
    <header className="h-24 bg-white border-b border-white flex items-center justify-between px-4 sm:px-12 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
        >
          <Menu size={24} />
        </button>
        <div className="hidden sm:flex-1 sm:max-w-[400px] lg:max-w-[600px] relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Cari produk, kategori, atau petani..."
            className="w-full bg-slate-50 border border-slate-100 rounded-full py-3.5 pl-14 pr-6 text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {activeRole === 'seller' && (
            <button className="p-3 rounded-full text-slate-400 hover:bg-slate-50 hover:text-brand-500 transition-all relative group">
               <MessageSquare size={22} className="group-hover:scale-110 transition-transform" />
               <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </button>
          )}
          {activeRole === 'buyer' && (
            <button 
              onClick={onCartClick}
              className="p-3 rounded-full text-slate-400 hover:bg-slate-50 hover:text-brand-500 transition-all relative border border-transparent group"
            >
              <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-brand-600 text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center">2</span>
            </button>
          )}
          <button className="p-3 rounded-full text-slate-400 hover:bg-slate-50 hover:text-red-500 transition-all relative group">
            <Bell size={22} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>

        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-4 pl-4 border-l border-slate-100 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[13px] font-black text-slate-800 leading-none mb-0.5">{userName}</p>
              <p className="text-[11px] font-bold text-slate-400 flex items-center justify-end gap-1">
                {userLocation}
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:ring-brand-200 transition-all">
              <img 
                src={userAvatar} 
                alt="Avatar"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <ChevronDown size={16} className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-4 w-60 bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-3 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
              <div className="p-4 border-b border-slate-50 mb-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Akun</p>
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${activeRole === 'seller' ? 'bg-brand-500' : 'bg-emerald-500'} rounded-full animate-pulse`} />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{userStatus}</span>
                 </div>
              </div>
              <div className="space-y-1">
                {menuItems.map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (item.label === 'Keluar') {
                        onLogout?.();
                      }
                    }}
                    className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-colors group text-left"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${item.color}`}>
                      <item.icon size={18} />
                    </div>
                    <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
