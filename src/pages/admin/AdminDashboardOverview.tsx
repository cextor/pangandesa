import React from 'react';
import { 
  Wallet, 
  CreditCard, 
  Sprout, 
  Users, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../types';
import apiClient from '../../services/apiClient';

interface AdminDashboardOverviewProps {
  orders: Order[];
}

export default function AdminDashboardOverview({ orders }: AdminDashboardOverviewProps) {
  const navigate = useNavigate();
  const [users, setUsers] = React.useState<any[]>([]);
  const [usersLoading, setUsersLoading] = React.useState(true);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await apiClient.get('/users');
      if (res.data && res.data.users) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const activeOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const paymentPendingOrders = orders.filter(o => 
    o.status === 'WAITING_ADMIN_DP' || o.status === 'WAITING_ADMIN_FINAL'
  );
  const sellers = users.filter(u => u.role === 'seller');
  const buyers = users.filter(u => u.role === 'buyer');

  const totalRevenue = orders
    .filter(o => o.status !== 'WAITING_PAYMENT_DP' && o.status !== 'WAITING_ADMIN_DP' && o.status !== 'CANCELLED')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const recentOrders = [...orders].reverse().slice(0, 5);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="p-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <ShieldCheck className="text-brand-600 animate-pulse" size={26} />
                 <h1 className="text-2xl font-black text-slate-800 font-display">Dashboard Utama</h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">Pengawasan metrik finansial, proyeksi yield panen, dan aktivitas mitra desa.</p>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar pb-32">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Metrics summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Wallet size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Transaksi</p>
                <h4 className="text-xl font-black text-slate-800 tracking-tight mt-1.5">{formatIDR(totalRevenue)}</h4>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <CreditCard size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Pesanan Berjalan</p>
                <h4 className="text-xl font-black text-slate-800 tracking-tight mt-1.5">{activeOrders.length} Pre-Order</h4>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                <Sprout size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Komunitas Petani</p>
                <h4 className="text-xl font-black text-slate-800 tracking-tight mt-1.5">{usersLoading ? '...' : `${sellers.length} Produsen`}</h4>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <Users size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Konsumen Terdaftar</p>
                <h4 className="text-xl font-black text-slate-800 tracking-tight mt-1.5">{usersLoading ? '...' : `${buyers.length} Mitra Usaha`}</h4>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* SVG Line Chart */}
            <div className="lg:col-span-8 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">Tren Yield & Volume Transaksi</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Grafik volume penjualan pre-order pangan minggu berjalan.</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-[10px] font-bold">
                  <TrendingUp size={14} /> +12.4% Bulan Ini
                </div>
              </div>

              <div className="h-64 relative w-full pt-4">
                <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1a4d2e" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#1a4d2e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeDasharray="4" />
                  
                  <path 
                    d="M0,170 Q70,90 140,110 T280,60 T420,130 T500,80 L500,200 L0,200 Z" 
                    fill="url(#chartGradient)" 
                  />
                  <path 
                    d="M0,170 Q70,90 140,110 T280,60 T420,130 T500,80" 
                    fill="none" 
                    stroke="#1a4d2e" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                  
                  <circle cx="140" cy="110" r="5" fill="#1a4d2e" stroke="white" strokeWidth="2" />
                  <circle cx="280" cy="60" r="5" fill="#1a4d2e" stroke="white" strokeWidth="2" />
                  <circle cx="420" cy="130" r="5" fill="#1a4d2e" stroke="white" strokeWidth="2" />
                </svg>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2 border-t border-slate-50 pt-4">
                <span>Senin</span>
                <span>Selasa</span>
                <span>Rabu</span>
                <span>Kamis</span>
                <span>Jumat</span>
                <span>Sabtu</span>
                <span>Minggu</span>
              </div>
            </div>

            {/* Quick action triage panel */}
            <div className="lg:col-span-4 bg-slate-900 text-white rounded-[32px] p-8 space-y-6 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div>
                  <h4 className="font-black uppercase tracking-widest text-[10px] text-emerald-400">Verifikasi Antrian Tindakan</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Pantau dan verifikasi pembayaran pre-order masuk.</p>
                </div>

                {paymentPendingOrders.length > 0 ? (
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500/10 text-orange-400 rounded-lg flex items-center justify-center">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white leading-none">{paymentPendingOrders.length} Pembayaran</p>
                        <p className="text-[9px] text-slate-400 font-medium mt-1">Perlu tindakan verifikasi transfer manual</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/admin/verifikasi')}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase py-2.5 rounded-xl tracking-wider active:scale-95 transition-all border-0 cursor-pointer"
                    >
                      Buka Menu Verifikasi
                    </button>
                  </div>
                ) : (
                  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <ShieldCheck className="mx-auto text-emerald-400 mb-2" size={24} />
                    <p className="text-[10px] font-bold text-slate-300">Semua Pembayaran Berhasil Diverifikasi</p>
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Menu Jalan Pintas</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => navigate('/admin/promo')} className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl text-left transition-all cursor-pointer">
                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider block mb-0.5">Kode Diskon</span>
                      <span className="text-[10px] font-bold text-white">Kelola Promo</span>
                    </button>
                    <button onClick={() => navigate('/admin/pengaturan-admin')} className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl text-left transition-all cursor-pointer">
                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider block mb-0.5">Finansial</span>
                      <span className="text-[10px] font-bold text-white">Tarif Layanan</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
              <div>
                <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">5 Transaksi Pre-Order Terbaru</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Daftar transaksi pre-order paling belakangan terekam oleh sistem.</p>
              </div>
              <button 
                onClick={() => navigate('/admin/laporan')}
                className="text-brand-600 hover:text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              >
                Lihat Semua <ArrowRight size={14} />
              </button>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-6 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Pesanan</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Transaksi</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="p-6 pr-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-display">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-6 pl-8 font-black text-slate-800 text-xs">#{order.id.toUpperCase()}</td>
                    <td className="p-6 text-xs font-semibold text-slate-500">{order.createdAt}</td>
                    <td className="p-6 text-xs font-black text-slate-850">{formatIDR(order.totalAmount)}</td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider ${
                        order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                        order.status === 'CANCELLED' ? 'bg-red-50 text-red-650' : 'bg-orange-50 text-orange-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-6 pr-8 text-right">
                      <button 
                        onClick={() => navigate('/admin/transaksi-panen')}
                        className="p-2 bg-slate-50 hover:bg-brand-50 text-slate-400 hover:text-brand-600 rounded-lg transition-all border-0 cursor-pointer"
                        title="Buka Forum Diskusi"
                      >
                        <MessageSquare size={14} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400 font-bold uppercase tracking-wider">
                      Belum ada transaksi terekam
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
