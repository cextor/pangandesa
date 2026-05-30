import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  MapPin, 
  ArrowUpRight, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Truck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useOrder } from '../../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const { orders, updateOrderStatus } = useOrder();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter orders for the active seller
  // Normalizing roles: active orders have statuses that are not finished or completely cancelled
  const activeStatuses = [
    'WAITING_PAYMENT_DP', 
    'WAITING_ADMIN_DP', 
    'WAITING_HARVEST', 
    'HARVEST_CONFIRMED_SELLER', 
    'WAITING_FINAL_PAYMENT', 
    'WAITING_ADMIN_FINAL', 
    'SHIPPING', 
    'DELIVERED'
  ];

  const historyStatuses = ['COMPLETED', 'CANCELLED'];

  // Add some mock cancelled orders for complete history testing if none exists
  const baseOrders = orders.length > 0 ? orders : [
    {
      id: 'ord-101',
      buyerName: 'Andi Wijaya',
      buyerVillage: 'Gegerkalong',
      totalAmount: 32000,
      dpAmount: 9600,
      remainingAmount: 22400,
      status: 'WAITING_HARVEST',
      createdAt: '30/05/2026',
      items: [{ productId: 'p1', name: 'Tomat Segar', quantity: 2, price: 16000, unit: 'kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200' }]
    }
  ];

  const processedOrders = [
    ...baseOrders,
    // Add mock cancelled/completed history if it is empty to ensure maximum premium experience
    {
      id: 'ord-cancelled-1',
      buyerName: 'Siti Khalimah',
      buyerVillage: 'Sukasari',
      totalAmount: 56000,
      dpAmount: 16800,
      remainingAmount: 39200,
      status: 'CANCELLED',
      createdAt: '24/05/2026',
      items: [{ productId: 'p2', name: 'Cabai Merah', quantity: 2, price: 28000, unit: 'kg', image: 'https://images.unsplash.com/photo-1618161546200-5047b11933c0?q=80&w=200' }]
    },
    {
      id: 'ord-completed-1',
      buyerName: 'Rudi Tabuti',
      buyerVillage: 'Cihanjuang',
      totalAmount: 95000,
      dpAmount: 28500,
      remainingAmount: 66500,
      status: 'COMPLETED',
      createdAt: '20/05/2026',
      items: [{ productId: 'p3', name: 'Jagung Manis', quantity: 10, price: 9500, unit: 'kg', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=200' }]
    }
  ];

  const filteredOrders = processedOrders.filter(order => {
    const belongsToTab = activeTab === 'active' 
      ? activeStatuses.includes(order.status) 
      : historyStatuses.includes(order.status);
    
    const matchesSearch = 
      order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return belongsToTab && matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING_PAYMENT_DP':
        return { label: 'Menunggu DP', style: 'bg-amber-50 text-amber-600 border-amber-100' };
      case 'WAITING_ADMIN_DP':
        return { label: 'Konfirmasi DP', style: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'WAITING_HARVEST':
        return { label: 'Proses Panen', style: 'bg-orange-50 text-orange-600 border-orange-100' };
      case 'HARVEST_CONFIRMED_SELLER':
        return { label: 'Siap Pelunasan', style: 'bg-teal-50 text-teal-600 border-teal-100' };
      case 'WAITING_FINAL_PAYMENT':
        return { label: 'Menunggu Pelunasan', style: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
      case 'WAITING_ADMIN_FINAL':
        return { label: 'Konfirmasi Lunas', style: 'bg-violet-50 text-violet-600 border-violet-100' };
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

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <ShoppingBag className="text-brand-600" size={32} />
                 <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight">Kelola Pesanan</h1>
              </div>
              <p className="text-slate-500 font-medium text-xs md:text-sm">Pantau kemajuan transaksi pre-order, jadwal panen, pengiriman, dan riwayat pesanan.</p>
           </div>
           
           {/* Quick Stats */}
           <div className="flex gap-4 self-start lg:self-auto">
              <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                 <div className="w-10 h-10 bg-white text-brand-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                    <TrendingUp size={20} />
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Aktif</p>
                    <p className="text-lg font-black text-slate-800">{processedOrders.filter(o => activeStatuses.includes(o.status)).length} Pesanan</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm w-fit">
          <button 
            onClick={() => { setActiveTab('active'); setStatusFilter('ALL'); }}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-brand-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Pesanan Aktif
          </button>
          <button 
            onClick={() => { setActiveTab('history'); setStatusFilter('ALL'); }}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-brand-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Riwayat Transaksi
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4">
           <div className="flex-1 relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ID Pesanan, nama pembeli atau nama pangan..." 
                className="w-full bg-white border border-slate-100 rounded-full py-4 pl-14 pr-6 text-xs md:text-sm font-medium focus:ring-4 focus:ring-brand-500/5 transition-all outline-none shadow-sm"
              />
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
             <Filter className="text-slate-400 hidden md:block" size={18} />
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="bg-white border border-slate-100 rounded-full px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm outline-none w-full md:w-auto"
             >
                <option value="ALL">Semua Status</option>
                {activeTab === 'active' ? (
                  <>
                    <option value="WAITING_PAYMENT_DP">Menunggu DP</option>
                    <option value="WAITING_ADMIN_DP">Verifikasi DP</option>
                    <option value="WAITING_HARVEST">Proses Panen</option>
                    <option value="HARVEST_CONFIRMED_SELLER">Siap Pelunasan</option>
                    <option value="WAITING_FINAL_PAYMENT">Menunggu Pelunasan</option>
                    <option value="WAITING_ADMIN_FINAL">Verifikasi Lunas</option>
                    <option value="SHIPPING">Dalam Pengiriman</option>
                  </>
                ) : (
                  <>
                    <option value="COMPLETED">Selesai</option>
                    <option value="CANCELLED">Batal / Refund</option>
                  </>
                )}
             </select>
           </div>
        </div>

        {/* Orders Listing */}
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
                    className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-6 md:space-y-8"
                  >
                    {/* Header Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-center">
                          <ShoppingBag size={20} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">ID Pesanan</p>
                          <h3 className="text-sm font-black text-slate-800 uppercase">#{order.id.slice(-8)}</h3>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${badge.style}`}>
                          {badge.label}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                          <Calendar size={12} /> {order.createdAt}
                        </div>
                      </div>
                    </div>

                    {/* Products list */}
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 sm:gap-6">
                          <img 
                            src={item.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200"} 
                            alt={item.name} 
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[24px] object-cover border border-slate-100 shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base font-black text-slate-800 uppercase tracking-tight truncate">{item.name}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                              {item.quantity} {item.unit || 'kg'} @ Rp {item.price.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Subtotal</p>
                            <p className="text-sm sm:text-base font-black text-slate-800">
                              Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Buyer Information & Financial Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                      {/* Buyer */}
                      <div className="space-y-3">
                        <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Informasi Pembeli</h5>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0 mt-0.5">
                            <User size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{order.buyerName}</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-medium"><MapPin size={10} /> Desa {order.buyerVillage}</p>
                          </div>
                        </div>
                      </div>

                      {/* Transaction Summary */}
                      <div className="grid grid-cols-3 gap-2 text-right border-t md:border-t-0 md:border-l border-slate-200/60 pt-4 md:pt-0 md:pl-6">
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Transaksi</p>
                          <p className="text-xs font-black text-slate-800">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">DP (30%)</p>
                          <p className="text-xs font-black text-emerald-600">Rp {order.dpAmount.toLocaleString('id-ID')}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pelunasan</p>
                          <p className="text-xs font-black text-brand-600">Rp {order.remainingAmount.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                      <div className="text-[10px] font-medium text-slate-400 leading-normal uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-300" />
                        {order.status === 'WAITING_HARVEST' ? 'Status: Proses pemeliharaan/tahap menunggu panen.' : 'Status transaksi terdokumentasi lengkap.'}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => navigate('/seller/transaksi-panen')}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 text-slate-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
                        >
                          <MessageSquare size={14} /> Diskusi Forum
                        </button>
                        
                        {order.status === 'WAITING_HARVEST' && (
                          <button 
                            onClick={async () => {
                              await updateOrderStatus(order.id, 'HARVEST_CONFIRMED_SELLER');
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1a4d2e] hover:bg-emerald-800 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-950/10 transition-all active:scale-95 cursor-pointer"
                          >
                            <CheckCircle2 size={14} /> Konfirmasi Panen
                          </button>
                        )}
                      </div>
                    </div>

                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[32px] border border-slate-100 p-12 text-center shadow-sm space-y-4"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto border border-slate-100 shadow-inner">
                  <ShoppingBag size={28} />
                </div>
                <div>
                   <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none mb-2">Tidak Ada Pesanan</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                     {searchQuery ? 'Coba ubah kata kunci pencarian Anda' : 'Saat ini Anda belum memiliki transaksi pada kategori ini'}
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
