import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Calendar,
  AlertCircle,
  ChevronRight,
  Plus,
  Star,
  Clock,
  CheckCircle2,
  Bell,
  MessageSquare,
  Search,
  X,
  ChevronDown,
  Sprout
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';

const SALES_DATA = [
  { name: 'Tomat Segar', value: 40, color: '#f97316' },
  { name: 'Cabai Merah', value: 25, color: '#10b981' },
  { name: 'Jagung Manis', value: 15, color: '#f59e0b' },
  { name: 'Bayam', value: 10, color: '#ef4444' },
  { name: 'Beras Merah', value: 10, color: '#0ea5e9' },
];

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function ActionModal({ isOpen, onClose, title, children }: DashboardModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{title}</h3>
           <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20} /></button>
        </div>
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
           {children}
        </div>
      </motion.div>
    </div>
  );
}

export default function SellerDashboard({ orders = [], onNavigate }: { orders?: any[], onNavigate: (item: string) => void }) {
  const { user } = useAuth();
  const { ordersLoaded } = useOrder();
  const [modalContent, setModalContent] = React.useState<{ title: string, content: React.ReactNode } | null>(null);

  // Filter States
  const [timeframe, setTimeframe] = React.useState<'TODAY' | 'WEEK' | 'MONTH' | 'ALL' | 'CUSTOM'>('ALL');
  const [customRange, setCustomRange] = React.useState<{ start: string, end: string }>({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // Helper: robust date parsing
  const getOrderDate = React.useCallback((o: any) => {
    if (o.createdAtRaw) {
      return new Date(o.createdAtRaw);
    }
    if (o.createdAt) {
      // parse locale date string "D/M/YYYY" or "D-M-YYYY"
      const parts = o.createdAt.split(/[/\-]/);
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      
      // if it's "1 Mei 2024" or similar (Indonesian long date string format)
      const months: { [key: string]: number } = {
        'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
        'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11,
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'jun': 5, 'jul': 6, 'agu': 7, 'sep': 8,
        'okt': 9, 'nov': 10, 'des': 11
      };
      const cleanStr = o.createdAt.toLowerCase().trim();
      const match = cleanStr.match(/^(\d+)\s+([a-z]+)\s+(\d+)$/);
      if (match) {
        const day = parseInt(match[1], 10);
        const monthName = match[2];
        const year = parseInt(match[3], 10);
        if (months[monthName] !== undefined) {
          return new Date(year, months[monthName], day);
        }
      }
    }
    return new Date();
  }, []);

  const formatFriendlyDate = React.useCallback((date: Date) => {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }, []);

  const formatFriendlyDateShort = React.useCallback((date: Date) => {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }, []);

  const getDateRangeLabel = React.useCallback(() => {
    const today = new Date();
    
    if (timeframe === 'ALL') {
      if (!orders || orders.length === 0) return 'Tidak ada data transaksi';
      const dates = orders.map(o => getOrderDate(o).getTime());
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
      if (minDate.toDateString() === maxDate.toDateString()) {
        return formatFriendlyDate(minDate);
      }
      return `${formatFriendlyDateShort(minDate)} - ${formatFriendlyDate(maxDate)}`;
    }
    
    if (timeframe === 'TODAY') {
      return formatFriendlyDate(today);
    }
    
    if (timeframe === 'WEEK') {
      const dayOfWeek = today.getDay();
      const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - distanceToMonday);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${formatFriendlyDateShort(startOfWeek)} - ${formatFriendlyDate(endOfWeek)}`;
    }
    
    if (timeframe === 'MONTH') {
      return today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    }
    
    if (timeframe === 'CUSTOM') {
      const start = new Date(customRange.start);
      const end = new Date(customRange.end);
      return `${formatFriendlyDateShort(start)} - ${formatFriendlyDate(end)}`;
    }
    
    return '';
  }, [timeframe, customRange, orders, getOrderDate, formatFriendlyDate, formatFriendlyDateShort]);

  // Filtering Logic
  const filteredOrders = React.useMemo(() => {
    return (orders || []).filter(o => {
      const orderDate = getOrderDate(o);
      
      if (timeframe === 'ALL') return true;
      
      if (timeframe === 'TODAY') {
        const today = new Date();
        return orderDate.getDate() === today.getDate() &&
               orderDate.getMonth() === today.getMonth() &&
               orderDate.getFullYear() === today.getFullYear();
      }
      
      if (timeframe === 'WEEK') {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - distanceToMonday);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
      }
      
      if (timeframe === 'MONTH') {
        const today = new Date();
        return orderDate.getMonth() === today.getMonth() &&
               orderDate.getFullYear() === today.getFullYear();
      }
      
      if (timeframe === 'CUSTOM') {
        const start = new Date(customRange.start);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customRange.end);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      }
      
      return true;
    });
  }, [orders, timeframe, customRange, getOrderDate]);

  // Dynamic calculations from filteredOrders
  const activeOrders = React.useMemo(() => {
    return filteredOrders.filter(o => 
      o.status === 'WAITING_HARVEST' || 
      o.status === 'HARVEST_CONFIRMED_SELLER' || 
      o.status === 'WAITING_FINAL_PAYMENT' || 
      o.status === 'WAITING_PAYMENT_DP' || 
      o.status === 'WAITING_ADMIN_DP'
    );
  }, [filteredOrders]);

  const completedOrActiveOrders = React.useMemo(() => {
    return filteredOrders.filter(o => o.status !== 'WAITING_PAYMENT_DP' && o.status !== 'WAITING_ADMIN_DP');
  }, [filteredOrders]);

  const totalRevenue = React.useMemo(() => {
    return completedOrActiveOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  }, [completedOrActiveOrders]);

  const totalOrdersCount = React.useMemo(() => {
    return filteredOrders.length;
  }, [filteredOrders]);

  const preOrderCount = React.useMemo(() => {
    return filteredOrders.filter(o => o.status === 'WAITING_HARVEST').length;
  }, [filteredOrders]);

  const ratingValue = user?.rating ? `${Number(user.rating).toFixed(1)}/5` : '5.0/5';
  
  // Saldo (unaffected by timeframe filter to represent withdrawable funds)
  const currentBalance = React.useMemo(() => {
    return (orders || [])
      .filter(o => o.status === 'COMPLETED' || o.status === 'SHIPPING' || o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  // Dynamic SALES_DATA calculation from filteredOrders
  const dynamicSalesData = React.useMemo(() => {
    const productSales: { [name: string]: number } = {};
    
    filteredOrders.forEach(o => {
      if (o.status !== 'WAITING_PAYMENT_DP' && o.status !== 'WAITING_ADMIN_DP') {
        o.items.forEach(item => {
          productSales[item.name] = (productSales[item.name] || 0) + (item.quantity * item.price);
        });
      }
    });

    const salesList = Object.entries(productSales).map(([name, value]) => ({
      name,
      value
    }));

    // Sort by revenue descending
    salesList.sort((a, b) => b.value - a.value);

    // Sum total value to compute percentages
    const totalSalesVal = salesList.reduce((sum, item) => sum + item.value, 0);

    if (totalSalesVal === 0) {
      if (ordersLoaded) return [];
      // Fallback to mock data if there are no sales in this timeframe
      return [
        { name: 'Tomat Segar', value: 40, color: '#f97316' },
        { name: 'Cabai Merah', value: 25, color: '#10b981' },
        { name: 'Jagung Manis', value: 15, color: '#f59e0b' },
        { name: 'Bayam', value: 10, color: '#ef4444' },
        { name: 'Beras Merah', value: 10, color: '#0ea5e9' },
      ];
    }

    const COLORS = ['#f97316', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6', '#ec4899', '#3b82f6'];

    // Map to percentage and assign colors
    return salesList.slice(0, 5).map((item, idx) => ({
      name: item.name,
      value: Math.max(1, Math.round((item.value / totalSalesVal) * 100)),
      color: COLORS[idx % COLORS.length]
    }));
  }, [filteredOrders]);

  // Dynamic Total Weight calculation
  const totalWeightStr = React.useMemo(() => {
    let totalKg = 0;
    filteredOrders.forEach(o => {
      if (o.status !== 'WAITING_PAYMENT_DP' && o.status !== 'WAITING_ADMIN_DP') {
        o.items.forEach(item => {
          let quantity = item.quantity;
          const unit = (item.unit || 'kg').toLowerCase();
          if (unit.includes('kuintal') || unit.includes('kw')) {
            quantity *= 100;
          } else if (unit.includes('ton')) {
            quantity *= 1000;
          }
          totalKg += quantity;
        });
      }
    });
    if (totalKg === 0) return ordersLoaded ? '0 kg' : '245 kg'; // Mock fallback
    return `${totalKg} kg`;
  }, [filteredOrders]);

  // Dynamic Best Sellers from filteredOrders
  const dynamicBestSellers = React.useMemo(() => {
    const productStats: { [name: string]: { quantity: number, revenue: number, unit: string, image: string } } = {};

    filteredOrders.forEach(o => {
      if (o.status !== 'WAITING_PAYMENT_DP' && o.status !== 'WAITING_ADMIN_DP') {
        o.items.forEach(item => {
          const stats = productStats[item.name] || { quantity: 0, revenue: 0, unit: item.unit || 'kg', image: item.image };
          stats.quantity += item.quantity;
          stats.revenue += item.quantity * item.price;
          productStats[item.name] = stats;
        });
      }
    });

    const sellerList = Object.entries(productStats).map(([name, stats]) => ({
      name,
      amount: `${stats.quantity} ${stats.unit}`,
      revenue: `Rp ${stats.revenue.toLocaleString('id-ID')}`,
      img: stats.image,
      revenueNum: stats.revenue
    }));

    // Sort by revenue descending
    sellerList.sort((a, b) => b.revenueNum - a.revenueNum);

    if (sellerList.length === 0) {
      if (ordersLoaded) return [];
      // Fallback
      return [
        {
          img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200",
          name: "Tomat Segar",
          amount: "120 kg",
          revenue: "Rp 1.920.000"
        },
        {
          img: "https://images.unsplash.com/photo-1618161546200-5047b11933c0?q=80&w=400",
          name: "Cabai Merah Keriting",
          amount: "65 kg",
          revenue: "Rp 1.820.000"
        },
        {
          img: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=200",
          name: "Jagung Manis",
          amount: "40 kg",
          revenue: "Rp 380.000"
        }
      ];
    }

    return sellerList.slice(0, 3);
  }, [filteredOrders]);

  // Dynamic Timeline (Harvest Schedule)
  const dynamicTimeline = React.useMemo(() => {
    const harvestOrders = filteredOrders.filter(o => o.status === 'WAITING_HARVEST');
    if (harvestOrders.length === 0) {
      if (ordersLoaded) return [];
      return [
        { date: "10 Mei 2024", name: "Tomat Segar", type: "Panen" },
        { date: "11 Mei 2024", name: "Jagung Manis", type: "Panen" },
        { date: "12 Mei 2024", name: "Cabai Merah Keriting", type: "Panen" }
      ];
    }
    
    return harvestOrders.map(o => {
      const orderDate = getOrderDate(o);
      const estHarvestDate = new Date(orderDate);
      estHarvestDate.setDate(orderDate.getDate() + 14); // estimate +14 days
      
      return {
        date: formatFriendlyDate(estHarvestDate),
        name: o.items[0]?.name || "Produk Pangan",
        type: "Panen PO"
      };
    });
  }, [filteredOrders, getOrderDate, formatFriendlyDate]);

  const handleAction = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] p-4 sm:p-6 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8">
        
        {/* Header Greeting & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-3xl font-black text-slate-800 font-display">Selamat pagi, {user?.name || 'Mitra Penjual'}! 🌿</h1>
            </div>
            <p className="text-sm sm:text-base text-slate-500 font-medium">{user?.village ? `Desa ${user.village}` : 'Wilayah Tani'}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
             <div 
                className="flex items-center justify-between sm:justify-start gap-2 bg-white border border-slate-[#e2e8f0] rounded-xl sm:rounded-2xl px-4 py-2.5 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsFilterOpen(true)}
             >
                <span className="text-xs font-bold text-slate-600">
                  {timeframe === 'ALL' && 'Semua Waktu'}
                  {timeframe === 'TODAY' && 'Hari Ini'}
                  {timeframe === 'WEEK' && 'Minggu Ini'}
                  {timeframe === 'MONTH' && 'Bulan Ini'}
                  {timeframe === 'CUSTOM' && 'Rentang Kustom'}
                </span>
                <ChevronDown size={14} className="text-slate-400 sm:w-4 sm:h-4" />
             </div>
             <div 
                className="flex items-center justify-between sm:justify-start gap-4 bg-white border border-[#e2e8f0] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2.5 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsFilterOpen(true)}
             >
                <span className="text-xs font-bold text-slate-600">{getDateRangeLabel()}</span>
                <ChevronRight size={14} className="text-slate-400 sm:w-4 sm:h-4" />
             </div>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            label="Total Pendapatan" 
            value={`Rp ${totalRevenue.toLocaleString('id-ID')}`} 
            subValue="Real-time" 
            type="up" 
            onClick={() => handleAction('Detail Pendapatan', <p className="font-medium text-slate-600">Rincian pendapatan bersih dari transaksi yang aktif/selesai sebesar Rp {totalRevenue.toLocaleString('id-ID')}.</p>)}
          />
          <StatCard 
            label="Total Pesanan" 
            value={String(totalOrdersCount)} 
            subValue="Terdaftar" 
            type="up" 
            onClick={() => handleAction('Daftar Pesanan', <p className="font-medium text-slate-600">Total {totalOrdersCount} pesanan telah tercatat di database.</p>)}
          />
          <StatCard 
            label="Pre-Order" 
            value={String(preOrderCount)} 
            subValue="Aktif" 
            type="neutral" 
            onClick={() => handleAction('Status Pre-Order', <p className="font-medium text-slate-600">Terdapat {preOrderCount} pesanan dalam tahap proses panen (pre-order).</p>)}
          />
          <StatStatCard 
            label="Rating" 
            value={ratingValue} 
            subValue="Ulasan Mitra" 
            onClick={() => handleAction('Ulasan Pelanggan', <p className="font-medium text-slate-600">Rating rata-rata Anda adalah {ratingValue} berdasarkan penilaian ulasan pembeli.</p>)}
          />
        </div>

        {/* AI Insight Banner */}
        <div className="bg-[#f0f9f3] rounded-[24px] sm:rounded-[40px] p-6 sm:p-8 border border-[#dcfce7] relative overflow-hidden group">
           <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/10 shrink-0">
                 <img src="https://api.dicebear.com/7.x/bottts/svg?seed=PanganDesa" className="w-10 h-10 sm:w-12 sm:h-12" alt="AI Robot" />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">AI Insight untuk Anda</h3>
                 <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
                    Permintaan tomat meningkat 32% minggu depan. Disarankan tambahkan stok atau buka pre-order lebih awal.
                 </p>
                 <button 
                    onClick={() => handleAction('AI Rekomendasi', <div className="space-y-4">
                       <p className="font-medium text-slate-600">Berdasarkan tren pasar:</p>
                       <ul className="list-disc pl-5 space-y-2 text-sm text-slate-500">
                          <li>Buka Pre-Order segera untuk batch panen 15 Mei (Estimasi 50kg)</li>
                          <li>Naikkan harga jual Cabai Merah sebesar 5% mengikuti kenaikan pasar</li>
                          <li>Promo "Bundling Sambal" diprediksi akan laku keras minggu ini</li>
                       </ul>
                    </div>)}
                    className="mt-4 w-full sm:w-auto bg-white border border-emerald-100 text-emerald-700 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-sm"
                 >
                    Lihat Rekomendasi
                 </button>
              </div>
           </div>
        </div>

        {/* Main Grid: Pre-Order & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Column 1 & 2 Left: Pre-Order */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="bg-white rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">Pre-Order Masuk</h3>
                <button 
                  onClick={() => handleAction('Semua Pre-Order', <p className="font-medium text-slate-600">Menampilkan daftar lengkap 27 pre-order aktif...</p>)}
                  className="text-brand-600 font-bold text-[10px] sm:text-xs uppercase hover:underline"
                >
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-4 sm:space-y-6">
                 {activeOrders.length > 0 ? (
                   activeOrders.map((o: any) => (
                     <OrderItem 
                        key={o.id}
                        img={o.items[0]?.image || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200"} 
                        name={o.items[0]?.name || "Produk"}
                        weight={`${o.items[0]?.quantity || 1} ${o.items[0]?.unit || 'kg'}`}
                        customer={o.buyerName}
                        location={o.buyerVillage}
                        date={o.createdAt}
                        price={`Rp ${o.totalAmount.toLocaleString('id-ID')}`}
                        status={o.status === 'WAITING_PAYMENT_DP' || o.status === 'WAITING_ADMIN_DP' ? 'Menunggu Bayar' : (o.status === 'WAITING_HARVEST' ? 'Proses Panen' : 'Panen Selesai')}
                        statusColor={o.status === 'WAITING_HARVEST' ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}
                        onClick={() => {
                          if (o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT') {
                            onNavigate('transaksi-panen');
                          } else {
                            handleAction(`Detail Pesanan: ${o.items[0]?.name}`, <p className="font-medium text-slate-600">Pesanan ID #{o.id.toUpperCase()} sedang menunggu verifikasi pembayaran DP oleh Admin.</p>);
                          }
                        }}
                     />
                   ))
                 ) : ordersLoaded ? (
                    <div className="text-center py-12 text-slate-400 font-bold uppercase text-xs tracking-wider">
                       Belum ada pre-order masuk
                    </div>
                 ) : (
                   <>
                     <OrderItem 
                        img="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200" 
                        name="Tomat Segar"
                        weight="2 kg"
                        customer="Andi Wijaya"
                        location="Gegerkalong"
                        date="10 Mei"
                        price="Rp 32rb"
                        status="Menunggu"
                        statusColor="bg-orange-50 text-orange-600 border-orange-100"
                        onClick={() => handleAction('Detail Pesanan: Tomat Segar', <p className="font-medium text-slate-600">Pesanan dari Andi Wijaya (Gegerkalong) sebanyak 2kg Tomat Segar. Silakan konfirmasi stok.</p>)}
                     />
                     <OrderItem 
                        img="https://images.unsplash.com/photo-1618161546200-5047b11933c0?q=80&w=400" 
                        name="Cabai Merah"
                        weight="1 kg"
                        customer="Siti Khalimah"
                        location="Sukasari"
                        date="12 Mei"
                        price="Rp 28rb"
                        status="Dikonfirmasi"
                        statusColor="bg-emerald-50 text-emerald-600 border-emerald-100"
                        onClick={() => handleAction('Detail Pesanan: Cabai Merah', <p className="font-medium text-slate-600">Pesanan Siti Khalimah (Sukasari) telah dikonfirmasi dan menunggu jadwal panen.</p>)}
                     />
                   </>
                 )}
              </div>
              <button 
                onClick={() => handleAction('Kelola Sistem PO', <p className="font-medium text-slate-600">Halaman pengaturan alur kerja Pre-Order.</p>)}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-slate-50 rounded-xl sm:rounded-2xl text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors"
              >
                 Kelola Pre-Order <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Column 3 Right: Performance Chart */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-sm p-6 sm:p-8">
               <div className="flex items-center justify-between mb-6 sm:mb-8">
                 <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">Kinerja</h3>
                 <button 
                  onClick={() => onNavigate('sales-analytics')}
                  className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase hover:text-brand-600 transition-colors"
                 >
                  Detail
                 </button>
               </div>
               <div className="h-48 sm:h-64 relative flex items-center justify-center">
                  <div className="absolute text-center z-10">
                     <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Total</p>
                     <p className="text-xl sm:text-2xl font-black text-slate-800">{totalWeightStr}</p>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dynamicSalesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={8}
                      >
                        {dynamicSalesData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '8px' }}
                        itemStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3">
                  {dynamicSalesData.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] sm:text-xs">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-bold text-slate-600 truncate max-w-[100px]">{item.name}</span>
                       </div>
                       <span className="font-black text-slate-800">{item.value}%</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Produk Terlaris & Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Produk Terlaris */}
          <div className="bg-white rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">Produk Terlaris</h3>
              <button 
                onClick={() => handleAction('Statistik Produk Terlaris', <p className="font-medium text-slate-600">Menampilkan tren penjualan per produk dalam 3 bulan terakhir.</p>)}
                className="text-emerald-600 font-bold text-[10px] sm:text-xs uppercase hover:underline"
              >
                Lihat Semua
              </button>
            </div>
            <div className="space-y-5 sm:space-y-6">
              {dynamicBestSellers.length > 0 ? (
                dynamicBestSellers.map((item, idx) => (
                  <BestSellerItem 
                    key={idx}
                    img={item.img || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200"} 
                    name={item.name}
                    amount={item.amount}
                    revenue={item.revenue}
                    onClick={() => handleAction(`Performa: ${item.name}`, <p className="font-medium text-slate-600">{item.name} menyumbang volume penjualan sebesar {item.amount} dengan total omzet {item.revenue} pada periode ini.</p>)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 font-bold uppercase text-xs tracking-wider">
                  Belum ada data penjualan
                </div>
              )}
            </div>
          </div>

          {/* Kalender & Ringkasan Keuangan (Column Right) */}
          <div className="space-y-6 sm:space-y-8">
            {/* Kalender Panen */}
            <div className="bg-white rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">Kalender Panen</h3>
                <button 
                  onClick={() => handleAction('Eksplor Kalender Panen', <p className="font-medium text-slate-600">Menampilkan penjadwalan panen dari seluruh kelompok tani Anda.</p>)}
                  className="text-emerald-600 font-bold text-[10px] sm:text-xs uppercase hover:underline"
                >
                  Lihat Kalender
                </button>
              </div>
              <div className="relative pl-6 sm:pl-8 space-y-6 sm:space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {dynamicTimeline.length > 0 ? (
                  dynamicTimeline.map((item, idx) => (
                    <TimelineItem key={idx} date={item.date} name={item.name} type={item.type} />
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-400 font-bold uppercase text-xs tracking-wider">
                    Belum ada jadwal panen
                  </div>
                )}
              </div>
            </div>

            {/* Ringkasan Keuangan */}
            <div className="bg-white rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">Finansial</h3>
                <button 
                  onClick={() => onNavigate('sales-analytics')}
                  className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase hover:text-brand-600 transition-colors"
                >
                  Detail
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6 transition-all">
                <div className="space-y-1">
                    <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo</p>
                    <p className="text-base sm:text-xl font-black text-slate-800">Rp {currentBalance.toLocaleString('id-ID')}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendapatan</p>
                    <p className="text-base sm:text-xl font-black text-emerald-600">Rp {totalRevenue.toLocaleString('id-ID')}</p>
                </div>
              </div>
              <button 
                onClick={() => handleAction('Tarik Dana', <div className="space-y-6">
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Saldo yang dapat ditarik</p>
                      <p className="text-3xl font-black text-brand-600">Rp {currentBalance.toLocaleString('id-ID')}</p>
                   </div>
                   <div className="space-y-4">
                      <p className="text-sm font-bold text-slate-700">Pilih Rekening Tujuan</p>
                      <div className="p-4 bg-white border-2 border-brand-500 rounded-xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center font-black text-[8px]">BANK</div>
                            <div>
                               <p className="text-xs font-bold">Rekening Terdaftar</p>
                               <p className="text-[10px] text-slate-400">{user?.bank_account || 'Belum mendaftarkan rekening'} a.n {user?.name || 'Pak Joko'}</p>
                            </div>
                         </div>
                         <CheckCircle2 size={20} className="text-brand-500" />
                      </div>
                   </div>
                   <button className="w-full bg-[#1a4d2e] text-white py-4 rounded-xl font-bold uppercase shadow-lg shadow-emerald-900/20 active:scale-95 transition-transform">Konfirmasi Penarikan</button>
                </div>)}
                className="w-full bg-[#1a4d2e] text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                  Tarik Dana
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalContent && (
          <ActionModal 
            isOpen={!!modalContent} 
            onClose={() => setModalContent(null)} 
            title={modalContent.title}
          >
            {modalContent.content}
          </ActionModal>
        )}

        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#fffdf7] border-2 border-[#d8d3c2] rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e6e2d6]">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight font-display">Filter Analitik</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-[#e6e2d6] rounded-xl transition-colors">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Pilih Rentang Waktu</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ALL', label: 'Semua Waktu' },
                    { id: 'TODAY', label: 'Hari Ini' },
                    { id: 'WEEK', label: 'Minggu Ini' },
                    { id: 'MONTH', label: 'Bulan Ini' }
                  ].map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setTimeframe(preset.id as any);
                        setIsFilterOpen(false);
                      }}
                      className={`py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border ${
                        timeframe === preset.id 
                          ? 'bg-[#1a4d2e] text-white border-[#1a4d2e] shadow-md shadow-emerald-900/10' 
                          : 'bg-white text-slate-600 border-[#e6e2d6] hover:bg-[#f3efe4]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#e6e2d6] space-y-3">
                  <button
                    type="button"
                    onClick={() => setTimeframe('CUSTOM')}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border ${
                      timeframe === 'CUSTOM'
                        ? 'bg-[#1a4d2e] text-white border-[#1a4d2e] shadow-md shadow-emerald-900/10'
                        : 'bg-white text-slate-600 border-[#e6e2d6] hover:bg-[#f3efe4]'
                    }`}
                  >
                    Rentang Tanggal Kustom
                  </button>
                  
                  {timeframe === 'CUSTOM' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3 pt-2 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Tanggal Mulai</label>
                          <input 
                            type="date" 
                            value={customRange.start}
                            onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                            className="w-full bg-white border border-[#e6e2d6] rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1a4d2e]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Tanggal Selesai</label>
                          <input 
                            type="date" 
                            value={customRange.end}
                            onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                            className="w-full bg-white border border-[#e6e2d6] rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#1a4d2e]"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full mt-2 py-3.5 bg-[#1a4d2e] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-950/20 active:scale-95 transition-all"
                      >
                        Terapkan Filter
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, subValue, type, onClick }: { label: string, value: string, subValue: string, type: 'up' | 'down' | 'neutral', onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:border-brand-300 transition-all cursor-pointer"
    >
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-none">{label}</p>
       <h4 className="text-2xl font-black text-slate-800 font-display mb-3 group-hover:text-brand-600 transition-colors">{value}</h4>
       <div className="flex items-center gap-1.5">
          {type === 'up' && <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse" />}
          <span className={`text-[10px] font-black uppercase tracking-tight ${type === 'up' ? 'text-emerald-500' : 'text-slate-400'}`}>
             {type === 'up' && '▲ '}
             {subValue}
          </span>
       </div>
    </div>
  );
}

function StatStatCard({ label, value, subValue, onClick }: { label: string, value: string, subValue: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:border-brand-300 transition-all cursor-pointer"
    >
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-none">{label}</p>
       <h4 className="text-2xl font-black text-slate-800 font-display mb-3 group-hover:text-brand-600 transition-colors">{value}</h4>
       <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{subValue}</span>
       </div>
    </div>
  );
}

function OrderItem({ img, name, weight, customer, location, date, price, status, statusColor, onClick }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 group cursor-pointer p-3 -m-3 rounded-2xl hover:bg-slate-50 transition-colors" onClick={onClick}>
       <div className="flex items-center gap-4 flex-1 min-w-0">
          <img src={img} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-100 shadow-sm group-hover:scale-105 transition-transform shrink-0" />
          <div className="flex-1 min-w-0">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2 sm:mb-1">
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-brand-600 transition-colors truncate">
                  {name} <span className="text-slate-400 text-[10px] font-bold italic tracking-normal">{weight}</span>
                </p>
                <span className={`self-start sm:self-auto text-[8px] sm:text-[9px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border uppercase tracking-widest whitespace-nowrap ${statusColor}`}>
                  {status}
                </span>
             </div>
             <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-slate-400">
                <div className="flex flex-col min-w-0">
                   <span className="text-brand-700 truncate max-w-[120px] sm:max-w-none">{customer}</span>
                   <span className="text-[8px] text-slate-400 -mt-0.5 truncate">{location}</span>
                </div>
                <span className="hidden sm:block w-1.5 h-1.5 border border-slate-200 rounded-full shrink-0" />
                <span className="flex items-center gap-1 shrink-0"><Calendar size={10} /> {date}</span>
                <span className="hidden sm:block w-1 h-1 bg-slate-200 rounded-full ml-auto sm:ml-0 shrink-0" />
                <span className="text-brand-600 font-black ml-auto sm:ml-0 size-fit">{price}</span>
             </div>
          </div>
       </div>
    </div>
  );
}

function BestSellerItem({ img, name, amount, revenue, onClick }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer" onClick={onClick}>
       <div className="flex items-center gap-4">
          <img src={img} className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:rotate-6 transition-transform" />
          <div>
             <p className="text-sm font-black text-slate-800 leading-none mb-1 group-hover:text-emerald-600 transition-colors">{name}</p>
             <p className="text-[10px] font-bold text-slate-400 uppercase">{amount}</p>
          </div>
       </div>
       <div className="text-right">
          <p className="text-xs font-black text-slate-800 leading-none mb-1">{revenue}</p>
          <div className="w-16 h-1 bg-slate-50 rounded-full overflow-hidden mt-2">
             <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }} />
          </div>
       </div>
    </div>
  );
}

function TimelineItem({ date, name, type }: any) {
  return (
    <div className="relative group cursor-pointer">
       <div className="absolute -left-[27px] top-1.5 w-4 h-4 bg-white border-2 border-emerald-500 rounded-full z-10 shadow-sm shadow-emerald-500/20 group-hover:scale-125 transition-transform" />
       <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-emerald-500 transition-colors">{date}</p>
            <p className="text-sm font-bold text-slate-700">{name}</p>
          </div>
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg uppercase tracking-widest">{type}</span>
       </div>
    </div>
  );
}
