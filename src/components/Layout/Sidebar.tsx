import React from 'react';
import { 
  Home, 
  Package, 
  Calendar, 
  MapPin, 
  Heart, 
  ShoppingBag, 
  MessageSquare, 
  Truck, 
  History, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Grid, 
  Sprout,
  Tag,
  HelpCircle,
  ShieldCheck,
  Percent,
  BarChart3,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { AppRole } from '../../types';

interface SidebarProps {
  activeRole: AppRole;
  onRoleChange: (role: AppRole) => void;
  activeItem: string;
  onItemChange: (item: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeRole, onRoleChange, activeItem, onItemChange, isOpen, onClose }: SidebarProps) {
  const buyerItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'kategori', label: 'Kategori', icon: Grid },
    { id: 'preorder', label: 'Pre-Order', icon: Calendar },
    { id: 'promo', label: 'Promo', icon: Tag },
    { id: 'favorit', label: 'Favorit', icon: Heart },
    { id: 'pesanan', label: 'Pesanan Saya', icon: ShoppingBag },
    { id: 'chat', label: 'Chat AI Assistant', icon: MessageSquare, badge: 'AI' },
    { id: 'lacak', label: 'Lacak Pesanan', icon: Truck },
    { id: 'riwayat', label: 'Riwayat', icon: History },
    { id: 'alamat', label: 'Alamat', icon: MapPin },
    { id: 'metode-pembayaran', label: 'Metode Pembayaran', icon: CreditCard },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
    { id: 'bantuan', label: 'Bantuan', icon: HelpCircle },
  ];

  const sellerItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'produk-saya', label: 'Produk Saya', icon: Package },
    { id: 'preorder-masuk', label: 'Pre-Order Masuk', icon: Calendar },
    { id: 'pesanan', label: 'Pesanan', icon: ShoppingBag },
    { id: 'panen-produksi', label: 'Panen & Produksi', icon: Sprout },
    { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare, badge: 'AI' },
    { id: 'analitik', label: 'Analitik Penjualan', icon: BarChart3 },
    { id: 'keuangan', label: 'Keuangan', icon: CreditCard },
    { id: 'ulasan', label: 'Ulasan & Rating', icon: History },
    { id: 'pelanggan', label: 'Pelanggan', icon: Users },
    { id: 'pengaturan-penjual', label: 'Pengaturan', icon: Settings },
    { id: 'bantuan-penjual', label: 'Bantuan & Panduan', icon: HelpCircle },
  ];

  const items = activeRole === 'buyer' ? buyerItems : sellerItems;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-80 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center border border-brand-100 shadow-sm shadow-brand-500/10">
            <Sprout size={28} className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 font-display leading-tight">PanganDesa</h1>
            <p className="text-[9px] text-brand-600 font-bold uppercase tracking-widest leading-none">Dari Desa, Untuk Indonesia</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto custom-scrollbar pb-8">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onItemChange(item.id);
                onClose?.();
              }}
              className={`flex items-center gap-4 px-5 py-2.5 rounded-2xl cursor-pointer transition-all duration-300 group ${
                activeItem === item.id 
                  ? 'bg-brand-50 text-brand-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon size={18} strokeWidth={activeItem === item.id ? 2.5 : 2} />
              <span className={`flex-1 text-[13px] ${activeItem === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
              {item.badge && (
                 <span className="bg-brand-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase shrink-0">{item.badge}</span>
              )}
              {activeItem === item.id && (
                <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
              )}
            </div>
          ))}
          
          <div className="p-4 space-y-4">
             {/* Promo Card */}
             <div className="bg-brand-900 rounded-[28px] p-6 text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-brand-900/10">
                <div className="relative z-10">
                   <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">Pre-Order Minggu Ini</h4>
                   <p className="text-xs text-brand-100 leading-tight">Diskon ongkir hingga <span className="text-white font-black text-lg block">50%</span></p>
                   <button className="mt-4 w-full bg-white text-brand-900 py-2.5 rounded-xl text-[10px] font-black hover:bg-brand-50 transition-colors uppercase tracking-wider shadow-sm"> Lihat Semua </button>
                </div>
                <Percent className="absolute -bottom-4 -right-4 w-20 h-20 text-white/10 transform rotate-12 group-hover:scale-110 transition-transform opacity-30" />
             </div>

             {/* Security Banner */}
             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-slate-100">
                   <ShieldCheck size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-800 leading-none uppercase tracking-tight">Belanja Aman</p>
                   <p className="text-[9px] text-slate-400 mt-1 leading-tight font-medium">Pembayaran escrow & garansi dana kembali</p>
                </div>
             </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

