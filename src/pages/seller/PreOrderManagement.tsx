import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight, 
  Box, 
  ChevronRight,
  TrendingDown,
  Info,
  Clock,
  Zap,
  BarChart3,
  ShoppingBag,
  Search,
  Filter,
  MessageSquare,
  MapPin,
  User,
  Check,
  X
} from 'lucide-react';
import { useOrder } from '../../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';
import { ensureDayMonthYear } from '../../utils/harvestHelper';

export default function PreOrderManagement() {
  const { orders, updateOrderStatus } = useOrder();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Dashboard demands & capacities mock data
  const demands = [
    { id: 1, product: 'Cabai Merah Keriting', demand: 1200, unit: 'kg', trend: '+12%', growth: 'up', potential: 'High' },
    { id: 2, product: 'Tomat Beef', demand: 850, unit: 'kg', trend: '+5%', growth: 'up', potential: 'Medium' },
    { id: 3, product: 'Jagung Manis', demand: 2100, unit: 'kg', trend: '-2%', growth: 'down', potential: 'Stable' },
  ];

  const capacities = [
    { id: 1, product: 'Cabai Merah Keriting', confirmed: 800, target: 1000, color: 'bg-emerald-500' },
    { id: 2, product: 'Jagung Manis', confirmed: 500, target: 2000, color: 'bg-orange-500' },
  ];

  // Base active statuses
  const activeStatuses = [
    'WAITING_PAYMENT_DP', 
    'WAITING_ADMIN_DP', 
    'WAITING_HARVEST', 
    'HARVEST_CONFIRMED_SELLER', 
    'WAITING_FINAL_PAYMENT', 
    'WAITING_ADMIN_FINAL', 
    'SHIPPING', 
    'DELIVERED',
    'COMPLETED',
    'CANCELLED'
  ];

  // Map database orders or fall back to mock orders for interactive testing
  const baseOrders = orders.length > 0 ? orders : [
    {
      id: 'po-101',
      buyerName: 'Andi Wijaya',
      buyerVillage: 'Gegerkalong',
      buyerAddress: 'Jl. Setiabudi No. 12, Desa Gegerkalong',
      totalAmount: 180000,
      dpAmount: 54000,
      remainingAmount: 126000,
      status: 'WAITING_HARVEST',
      createdAt: '30/05/2026',
      items: [
        { 
          productId: 'p1', 
          name: 'Cabai Merah Keriting (Panen: 15/06/2026)', 
          quantity: 5, 
          price: 36000, 
          unit: 'kg', 
          image: 'https://images.unsplash.com/photo-1618161546200-5047b11933c0?q=80&w=200' 
        }
      ]
    },
    {
      id: 'po-102',
      buyerName: 'Siti Aminah',
      buyerVillage: 'Sukasari',
      buyerAddress: 'Desa Sukasari RT 03/04',
      totalAmount: 120000,
      dpAmount: 36000,
      remainingAmount: 84000,
      status: 'WAITING_PAYMENT_DP',
      createdAt: '29/05/2026',
      items: [
        { 
          productId: 'p2', 
          name: 'Tomat Beef (Panen: 20/06/2026)', 
          quantity: 8, 
          price: 15000, 
          unit: 'kg', 
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200' 
        }
      ]
    }
  ];

  const filteredOrders = baseOrders.filter(order => {
    const matchesSearch = 
      order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING_PAYMENT_DP':
        return { label: 'Menunggu DP', style: 'bg-amber-50 text-amber-600 border-amber-100' };
      case 'WAITING_ADMIN_DP':
        return { label: 'Verifikasi DP', style: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'WAITING_HARVEST':
        return { label: 'Menunggu Panen', style: 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse' };
      case 'HARVEST_CONFIRMED_SELLER':
        return { label: 'Siap Pelunasan', style: 'bg-teal-50 text-teal-600 border-teal-100' };
      case 'WAITING_FINAL_PAYMENT':
        return { label: 'Menunggu Pelunasan', style: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
      case 'WAITING_ADMIN_FINAL':
        return { label: 'Verifikasi Lunas', style: 'bg-violet-50 text-violet-600 border-violet-100' };
      case 'SHIPPING':
        return { label: 'Dikirim', style: 'bg-sky-50 text-sky-600 border-sky-100' };
      case 'DELIVERED':
        return { label: 'Tiba di Lokasi', style: 'bg-pink-50 text-pink-600 border-pink-100' };
      case 'COMPLETED':
        return { label: 'Selesai', style: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      case 'CANCELLED':
        return { label: 'Batal', style: 'bg-rose-50 text-rose-600 border-rose-100' };
      default:
        return { label: status, style: 'bg-slate-50 text-slate-600 border-slate-100' };
    }
  };

  const activeOrdersCount = baseOrders.filter(o => activeStatuses.includes(o.status)).length;
  const waitingHarvestCount = baseOrders.filter(o => o.status === 'WAITING_HARVEST').length;

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-5 md:space-y-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-8">
           <div className="space-y-1">
              <div className="flex items-center gap-2 md:gap-3">
                 <Calendar className="text-[#1a4d2e] w-6 h-6 md:w-9 md:h-9" />
                 <h1 className="text-lg md:text-3xl font-black text-slate-800 tracking-tight uppercase">Pre-Order Masuk</h1>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed max-w-lg text-[10px] md:text-sm">
                Pantau pesanan pre-order masuk dari pembeli, verifikasi jadwal panen, konfirmasi kapasitas, dan proses pelunasan.
              </p>
           </div>
           
           <div className="flex gap-2 sm:gap-4 shrink-0 self-stretch sm:self-auto">
              <div className="bg-white p-2.5 sm:p-4 md:p-6 rounded-xl md:rounded-3xl border border-slate-100 flex items-center gap-2 sm:gap-4 shadow-sm flex-1 sm:flex-none">
                 <div className="w-8 h-8 sm:w-10 md:w-12 bg-emerald-50 text-[#1a4d2e] rounded-lg md:rounded-2xl flex items-center justify-center shrink-0">
                    <ShoppingBag size={14} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                 </div>
                 <div>
                    <p className="text-[6.5px] sm:text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 leading-none">Total PO Masuk</p>
                    <p className="text-xs sm:text-sm md:text-lg font-black text-slate-800 tracking-tight leading-tight">{activeOrdersCount} <span className="text-[8px] sm:text-[10px] md:text-xs uppercase font-bold text-slate-400">Pesanan</span></p>
                 </div>
              </div>

              <div className="bg-[#1a4d2e] p-2.5 sm:p-4 md:p-6 rounded-xl md:rounded-3xl border border-[#143b23] flex items-center gap-2 sm:gap-4 shadow-md text-white flex-1 sm:flex-none">
                 <div className="w-8 h-8 sm:w-10 md:w-12 bg-white/10 text-emerald-300 rounded-lg md:rounded-2xl flex items-center justify-center shrink-0">
                    <Clock size={14} className="sm:w-5 sm:h-5 md:w-6 md:h-6 animate-pulse" />
                 </div>
                 <div>
                    <p className="text-[6.5px] sm:text-[8px] md:text-[10px] font-black text-emerald-250 uppercase tracking-widest mb-0.5 leading-none">Menunggu Panen</p>
                    <p className="text-xs sm:text-sm md:text-lg font-black tracking-tight leading-tight">{waitingHarvestCount} <span className="text-[8px] sm:text-[10px] md:text-xs uppercase font-bold text-emerald-200">Siklus</span></p>
                 </div>
              </div>
           </div>
        </div>

        {/* PO Orders List Section */}
        <section className="space-y-6">
           <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm">
             {/* Search Input */}
             <div className="flex-1 relative group">
               <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1a4d2e] transition-colors">
                 <Search size={18} />
               </div>
               <input 
                 type="text" 
                 placeholder="Cari ID Pesanan, nama pembeli atau pangan..." 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-3.5 pl-14 pr-6 text-xs md:text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 transition-all shadow-inner placeholder:text-slate-350 text-slate-800"
               />
             </div>

             {/* Compact Dropdown Filter */}
             <div className="flex bg-slate-50 border border-slate-100 rounded-[20px] px-4 py-3.5 shrink-0 items-center gap-2">
               <Filter size={16} className="text-slate-400" />
               <select
                 value={statusFilter}
                 onChange={e => setStatusFilter(e.target.value)}
                 className="bg-transparent border-0 text-xs font-black uppercase text-slate-600 outline-none pr-8 cursor-pointer"
               >
                 <option value="ALL">Semua PO ({baseOrders.length})</option>
                 <option value="WAITING_PAYMENT_DP">Menunggu DP ({baseOrders.filter(o => o.status === 'WAITING_PAYMENT_DP').length})</option>
                 <option value="WAITING_ADMIN_DP">Verifikasi DP ({baseOrders.filter(o => o.status === 'WAITING_ADMIN_DP').length})</option>
                 <option value="WAITING_HARVEST">Menunggu Panen ({baseOrders.filter(o => o.status === 'WAITING_HARVEST').length})</option>
                 <option value="HARVEST_CONFIRMED_SELLER">Siap Pelunasan ({baseOrders.filter(o => o.status === 'HARVEST_CONFIRMED_SELLER').length})</option>
                 <option value="WAITING_FINAL_PAYMENT">Menunggu Pelunasan ({baseOrders.filter(o => o.status === 'WAITING_FINAL_PAYMENT').length})</option>
                 <option value="WAITING_ADMIN_FINAL">Verifikasi Lunas ({baseOrders.filter(o => o.status === 'WAITING_ADMIN_FINAL').length})</option>
                 <option value="COMPLETED">Selesai ({baseOrders.filter(o => o.status === 'COMPLETED').length})</option>
               </select>
             </div>
           </div>

           {/* Pre-Orders Cards */}
           <div className="space-y-6">
             <AnimatePresence mode="popLayout">
               {filteredOrders.length > 0 ? (
                 filteredOrders.map((order) => {
                   const badge = getStatusBadge(order.status);
                   return (
                      <motion.div 
                        key={order.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-[20px] md:rounded-[40px] border border-slate-100 p-4 md:p-8 shadow-sm hover:shadow-md transition-all space-y-4 md:space-y-8"
                      >
                        {/* Header Card */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-4 md:pb-6">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-slate-50 p-2 sm:p-3 rounded-xl md:rounded-2xl border border-slate-100 flex items-center justify-center">
                              <ShoppingBag size={16} className="text-slate-500 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">ID Pre-Order</p>
                              <h3 className="text-xs md:text-sm font-black text-slate-800 uppercase">#{order.id.slice(-8)}</h3>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[8px] md:text-[9px] font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full border uppercase tracking-widest ${badge.style}`}>
                              {badge.label}
                            </span>
                            <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-slate-100">
                              <Calendar size={11} /> {order.createdAt}
                            </div>
                          </div>
                        </div>

                        {/* Products list */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 md:gap-6">
                              <img 
                                src={item.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200"} 
                                alt={item.name} 
                                className="w-12 h-12 md:w-20 md:h-20 rounded-lg md:rounded-[24px] object-cover border border-slate-100 shadow-sm shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs md:text-base font-black text-slate-800 uppercase tracking-tight truncate">{item.name}</h4>
                                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                  {item.quantity} {item.unit || 'kg'} @ Rp {item.price.toLocaleString('id-ID')}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-[8px] md:text-xs font-bold text-slate-400 uppercase leading-none mb-0.5">Subtotal</p>
                                <p className="text-xs md:text-base font-black text-slate-800">
                                  Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Buyer Information & Financial Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-slate-50 p-3.5 md:p-6 rounded-xl md:rounded-[24px] border border-slate-100">
                          {/* Buyer */}
                          <div className="space-y-2">
                            <h5 className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Informasi Pembeli</h5>
                            <div className="flex items-start gap-2.5">
                              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0 mt-0.5">
                                <User size={12} />
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-800 leading-none">{order.buyerName}</p>
                                <p className="text-[9px] md:text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-medium"><MapPin size={9} /> Desa {order.buyerVillage}</p>
                              </div>
                            </div>
                          </div>

                          {/* Transaction Summary */}
                          <div className="grid grid-cols-3 gap-1 text-right border-t md:border-t-0 md:border-l border-slate-200/60 pt-3 md:pt-0 md:pl-6">
                            <div>
                              <p className="text-[7.5px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total PO</p>
                              <p className="text-[10px] md:text-xs font-black text-slate-800">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                            </div>
                            <div>
                              <p className="text-[7.5px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">DP (30%)</p>
                              <p className="text-[10px] md:text-xs font-black text-emerald-600">Rp {order.dpAmount.toLocaleString('id-ID')}</p>
                            </div>
                            <div>
                              <p className="text-[7.5px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pelunasan</p>
                              <p className="text-[10px] md:text-xs font-black text-brand-600">Rp {order.remainingAmount.toLocaleString('id-ID')}</p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Action Footer */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 md:pt-2">
                          <div className="text-[8.5px] md:text-[10px] font-medium text-slate-400 leading-normal uppercase tracking-widest flex items-center gap-1">
                            <Clock size={11} className="text-slate-350 shrink-0" />
                            <span className="truncate">
                              {order.status === 'WAITING_PAYMENT_DP' && 'Menunggu Pembeli membayar Uang Muka (DP 30%).'}
                              {order.status === 'WAITING_ADMIN_DP' && 'Pembeli sudah mengunggah bukti DP. Menunggu konfirmasi Admin.'}
                              {order.status === 'WAITING_HARVEST' && 'Siklus panen aktif. Rawat tanaman lalu konfirmasi panen siap.'}
                              {order.status === 'HARVEST_CONFIRMED_SELLER' && 'Siap pelunasan. Menunggu pembeli menyelesaikan pembayaran pelunasan.'}
                              {order.status === 'WAITING_FINAL_PAYMENT' && 'Pembeli sedang proses melakukan transfer pelunasan.'}
                              {order.status === 'WAITING_ADMIN_FINAL' && 'Pembeli sudah membayar lunas. Menunggu verifikasi finansial Admin.'}
                              {order.status === 'SHIPPING' && 'Lakukan pengiriman pangan segar ke pembeli sekarang.'}
                              {order.status === 'COMPLETED' && 'Transaksi selesai. Dana sudah cair sepenuhnya.'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => navigate('/seller/transaksi-panen/' + order.id)}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg md:rounded-xl text-[8.5px] md:text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
                            >
                              <MessageSquare size={12} /> Diskusi Forum
                            </button>
                            
                            {order.status === 'WAITING_HARVEST' && (
                              <button 
                                onClick={async () => {
                                  await updateOrderStatus(order.id, 'HARVEST_CONFIRMED_SELLER');
                                }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#1a4d2e] hover:bg-emerald-800 text-white px-4 py-2.5 rounded-lg md:rounded-xl text-[8.5px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-950/10 transition-all active:scale-95 cursor-pointer border-0"
                              >
                                <CheckCircle2 size={12} /> Konfirmasi Siap Panen
                              </button>
                            )}
                          </div>
                        </div>

                      </motion.div>
                   );
                 })
               ) : (
                 <div className="bg-white rounded-[32px] border border-slate-100 p-16 text-center space-y-4 shadow-sm">
                   <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
                     <ShoppingBag size={28} />
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Tidak Ada Data Pre-Order</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                        Belum ada pesanan pre-order masuk yang sesuai dengan kata kunci atau filter status Anda.
                      </p>
                   </div>
                 </div>
               )}
             </AnimatePresence>
           </div>
        </section>

        {/* Real-time Demand Analytics */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                 <TrendingUp className="text-emerald-500" /> Demand Real-Time Pasar
              </h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {demands.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                         <BarChart3 size={24} />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                        item.growth === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {item.trend} {item.growth === 'up' ? <ArrowUpRight size={10} /> : <TrendingDown size={10} />}
                      </div>
                   </div>
                   
                   <h3 className="text-sm font-black text-slate-800 mb-1 uppercase tracking-tight">{item.product}</h3>
                   <p className="text-2xl font-black text-slate-900 mb-6">{item.demand.toLocaleString()} <span className="text-xs text-slate-400 uppercase">{item.unit}</span></p>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Akurasi AI: 98%</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight ${
                        item.potential === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>{item.potential} Potential</span>
                   </div>
                   
                   <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-brand-50 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
           </div>
        </section>

        {/* Capacity Confirmation */}
        <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm overflow-hidden relative">
           <div className="relative z-10 flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3">
                 <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-3">
                    <Box className="text-[#1a4d2e]" /> Konfirmasi Kapasitas
                 </h2>
                 <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
                    Sesuaikan kapasitas lahan produksi Anda untuk memenuhi pesanan pre-order yang masuk. AI kami akan menghitung resiko gagal panen secara otomatis.
                 </p>
                 <button className="bg-[#1a4d2e] hover:bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-900/10 hover:scale-105 active:scale-95 transition-all border-0 cursor-pointer">
                    Update Semua Lahan
                 </button>
              </div>

              <div className="flex-1 space-y-8">
                 {capacities.map((cap) => (
                   <div key={cap.id} className="space-y-4">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{cap.product}</p>
                            <p className="text-lg font-black text-slate-800 font-display">Capaian: {cap.confirmed} / {cap.target} kg</p>
                         </div>
                         <span className="text-sm font-black text-[#1a4d2e]">{Math.round((cap.confirmed/cap.target)*100)}%</span>
                      </div>
                      <div className="h-6 bg-slate-50 rounded-full border border-slate-100 p-1 overflow-hidden">
                         <div 
                           className={`h-full rounded-full transition-all duration-1000 ${cap.color}`} 
                           style={{ width: `${(cap.confirmed/cap.target)*100}%` }}
                         />
                      </div>
                      <div className="flex gap-4">
                         <button className="flex-1 bg-white border border-slate-100 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all cursor-pointer">Atur Kapasitas</button>
                         <button className="flex-1 bg-white border border-slate-100 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer">Optimasi Produksi</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           {/* Background Accents */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
        </section>

        {/* AI Insight Banner */}
        <div className="bg-emerald-950 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10 text-white relative overflow-hidden group">
           <div className="w-20 h-20 bg-emerald-800/40 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/10 relative z-10 shrink-0">
              <Zap size={40} className="text-emerald-300 animate-pulse" />
           </div>
           <div className="relative z-10">
              <h4 className="text-xl font-black uppercase tracking-tight mb-2">AI Optimization Insight</h4>
              <p className="text-sm font-medium text-emerald-100/75 max-w-xl leading-relaxed">
                Berdasarkan data cuaca 30 hari ke depan, kami merekomendasikan untuk menaikkan kapasitas produksi <span className="text-white font-black">Cabai Merah</span> sebesar <span className="text-emerald-300 font-extrabold uppercase tracking-widest">20%</span> guna memenuhi lonjakan demand Idul Adha.
              </p>
           </div>
           <button className="relative z-10 ml-auto bg-white text-[#1a4d2e] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-emerald-50 transition-colors border-0 cursor-pointer shadow-lg shadow-emerald-950/20">
              Gunakan Rekomendasi
           </button>
           
           <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[80px]" />
        </div>
      </div>
    </div>
  );
}
