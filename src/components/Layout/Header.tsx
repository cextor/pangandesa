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
  MessageSquare,
  Check,
  X
} from 'lucide-react';
import { AppRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationService, NotificationItem } from '../../services/NotificationService';

interface HeaderProps {
  onCartClick: () => void;
  onMenuClick?: () => void;
  onLogout?: () => void;
  onNavigate?: (id: string) => void;
  activeRole?: AppRole;
}

export default function Header({ onCartClick, onMenuClick, onLogout, onNavigate, activeRole = 'buyer' }: HeaderProps) {
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const isAdmin = activeRole === 'seller';
  const userName = user?.name || (isAdmin ? 'Pak Joko' : 'Andi Wijaya');
  const userLocation = user?.village ? `Desa ${user.village}` : (isAdmin ? 'Desa Sukamaju' : 'Jakarta');
  const userStatus = isAdmin ? 'Penjual Verified' : 'Pembeli Verified';

  const fetchNotifications = async () => {
    const userId = user?.id || (activeRole === 'seller' ? 2 : 3);
    const data = await NotificationService.getNotifications(userId);
    setNotifications(data);
  };

  const unreadCount = notifications.filter(n => !n.is_read || String(n.is_read) === '0').length;

  const handleMarkAsRead = async (id: string | number) => {
    const ok = await NotificationService.markAsRead(id);
    if (ok) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    }
  };

  const handleMarkAllAsRead = async () => {
    const userId = user?.id || (activeRole === 'seller' ? 2 : 3);
    const ok = await NotificationService.markAllAsRead(userId);
    if (ok) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    }
  };

  const getNotifMeta = (type: string) => {
    switch (type) {
      case 'pre_order':
        return { icon: '🌾', bg: 'bg-emerald-50 text-emerald-600 border border-emerald-100' };
      case 'harvest_warning':
        return { icon: '🚜', bg: 'bg-amber-50 text-amber-600 border border-amber-100' };
      case 'finance':
        return { icon: '💰', bg: 'bg-yellow-50 text-yellow-600 border border-yellow-100' };
      case 'system':
      default:
        return { icon: '👤', bg: 'bg-blue-50 text-blue-600 border border-blue-100' };
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user?.id, activeRole]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef, notificationsRef]);

  const menuItems = [
    { id: 'profil-detail', label: 'Profil Saya', icon: User, color: 'text-blue-500' },
    { id: 'ganti-password', label: 'Ganti Password', icon: Lock, color: 'text-amber-500' },
    { id: 'pin-keamanan', label: 'Ubah PIN', icon: Key, color: 'text-emerald-500' },
    { id: 'keluar', label: 'Keluar', icon: LogOut, color: 'text-red-500' },
  ];

  return (
    <header className="h-20 sm:h-24 bg-white border-b border-white flex items-center justify-between px-4 sm:px-8 lg:px-12 sticky top-0 z-30">
      <div className="flex items-center gap-3 sm:gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl"
        >
          <Menu size={20} className="sm:w-6 sm:h-6" />
        </button>
        <div className="hidden sm:flex sm:max-w-[300px] lg:max-w-[500px] xl:max-w-[600px] relative group">
          <div className="absolute inset-y-0 left-5 sm:left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
            <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
          </div>
          <input 
            type="text" 
            placeholder="Cari produk..."
            className="w-full bg-slate-50 border border-slate-100 rounded-full py-2.5 sm:py-3.5 pl-12 sm:pl-14 pr-5 sm:pr-6 text-[12px] sm:text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
        <div className="flex items-center gap-1 sm:gap-2">
          {activeRole === 'seller' && (
            <button className="p-2 sm:p-3 rounded-full text-slate-400 hover:bg-slate-50 hover:text-brand-500 transition-all relative group">
               <MessageSquare size={20} className="sm:w-[22px] sm:h-[22px] group-hover:scale-110 transition-transform" />
               <span className="absolute top-2 sm:top-2.5 right-2 sm:right-3 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </button>
          )}
          {activeRole === 'buyer' && (
            <button 
              onClick={onCartClick}
              className="p-2 sm:p-3 rounded-full text-slate-400 hover:bg-slate-50 hover:text-brand-500 transition-all relative border border-transparent group"
            >
              <ShoppingCart size={20} className="sm:w-[22px] sm:h-[22px] group-hover:scale-110 transition-transform" />
              <span className="absolute top-1 sm:top-1 right-1 sm:right-1 w-4 h-4 sm:w-5 sm:h-5 bg-brand-600 text-white text-[8px] sm:text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center">2</span>
            </button>
          )}
          <div className="relative" ref={notificationsRef}>
            <button 
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 sm:p-3 rounded-full text-slate-400 hover:bg-slate-50 hover:text-red-500 transition-all relative group cursor-pointer"
            >
              <Bell size={20} className="sm:w-[22px] sm:h-[22px] group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-red-500 text-white text-[8px] sm:text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center animate-pulse shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="fixed sm:absolute top-20 sm:top-full left-4 right-4 sm:left-auto sm:right-0 sm:mt-3 sm:w-96 bg-[#fffdf7] rounded-[24px] border border-[#d8d3c2] shadow-[0_20px_50px_rgba(29,58,42,0.18)] p-4 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Pemberitahuan</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded-full text-[9px] font-black">{unreadCount} Baru</span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-[9px] font-black text-brand-650 hover:text-brand-700 uppercase tracking-widest cursor-pointer flex items-center gap-1 bg-transparent border-none"
                    >
                      <Check size={12} strokeWidth={3} /> Tandai Semua Dibaca
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => {
                      const meta = getNotifMeta(notif.type);
                      const isUnread = !notif.is_read || String(notif.is_read) === '0';
                      return (
                        <div 
                          key={notif.id}
                          className={`p-3 rounded-2xl flex gap-3 transition-all border ${
                            isUnread 
                              ? 'bg-slate-50/50 border-slate-100/50 font-bold' 
                              : 'bg-white border-transparent'
                          } hover:bg-slate-50 group/item relative`}
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg ${meta.bg}`}>
                            {meta.icon}
                          </div>
                          <div className="flex-1 min-w-0 pr-6 text-left">
                            <h4 className={`text-[11px] sm:text-xs font-black leading-tight mb-0.5 ${isUnread ? 'text-brand-900 font-extrabold' : 'text-slate-700 font-bold'}`}>{notif.title}</h4>
                            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-relaxed mb-0.5">{notif.message}</p>
                          </div>
                          
                          {/* Right action button to mark as read */}
                          {isUnread && (
                            <button 
                              type="button"
                              onClick={() => handleMarkAsRead(notif.id)}
                              title="Tandai dibaca"
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-650 hover:border-brand-200 shadow-sm opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer"
                            >
                              <Check size={12} strokeWidth={3} />
                            </button>
                          )}
                          {isUnread && (
                            <span className="absolute right-4 top-4 w-2 h-2 bg-red-500 rounded-full group-hover/item:opacity-0 transition-opacity" />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-350 mb-3 text-xl">🔔</div>
                      <p className="text-xs font-black text-slate-450 uppercase tracking-widest">Belum Ada Notifikasi</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">Semua pemberitahuan baru akan muncul di sini</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-slate-100 cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <p className="text-[13px] font-black text-slate-800 leading-none mb-0.5">{userName}</p>
              <p className="text-[11px] font-bold text-slate-400 flex items-center justify-end gap-1">
                {userLocation}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-50 flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:ring-brand-200 transition-all overflow-hidden shrink-0">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Avatar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
              )}
            </div>
            <ChevronDown size={14} className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-3 w-48 sm:w-52 bg-white rounded-[20px] border border-slate-100 shadow-2xl shadow-slate-200/50 p-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="p-2 px-3 border-b border-slate-50 mb-1 flex flex-col">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status Akun</p>
                 <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 ${activeRole === 'seller' ? 'bg-brand-500' : 'bg-emerald-500'} rounded-full animate-pulse`} />
                    <span className="text-[10px] font-black text-slate-650 uppercase tracking-tight leading-none">{userStatus}</span>
                 </div>
              </div>
              <div className="space-y-0.5">
                {menuItems.map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (item.id === 'keluar') {
                        onLogout?.();
                      } else if (onNavigate) {
                        onNavigate(item.id);
                      }
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group text-left cursor-pointer"
                  >
                    <div className={`w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${item.color} shrink-0`}>
                      <item.icon size={14} />
                    </div>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{item.label}</span>
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
