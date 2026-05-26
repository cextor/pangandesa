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
  const [modalContent, setModalContent] = React.useState<{ title: string, content: React.ReactNode } | null>(null);

  const activeOrders = (orders || []).filter(o => 
    o.status === 'WAITING_HARVEST' || 
    o.status === 'HARVEST_CONFIRMED_SELLER' || 
    o.status === 'WAITING_FINAL_PAYMENT' || 
    o.status === 'WAITING_PAYMENT_DP' || 
    o.status === 'WAITING_ADMIN_DP'
  );

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
              <h1 className="text-xl sm:text-3xl font-black text-slate-800 font-display">Selamat pagi, Pak Joko! 🌿</h1>
            </div>
            <p className="text-sm sm:text-base text-slate-500 font-medium">Desa Sukamaju, Lembang</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
             <div 
                className="flex items-center justify-between sm:justify-start gap-2 bg-white border border-slate-100 rounded-xl sm:rounded-2xl px-4 py-2.5 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleAction('Pilih Filter', <p className="font-medium text-slate-600">Silakan pilih rentang waktu analisis data Anda.</p>)}
             >
                <span className="text-xs font-bold text-slate-600">Minggu Ini</span>
                <ChevronDown size={14} className="text-slate-400 sm:w-4 sm:h-4" />
             </div>
             <div 
                className="flex items-center justify-between sm:justify-start gap-4 bg-white border border-slate-100 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2.5 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleAction('Kalender Laporan', <p className="font-medium text-slate-600">Tampilan kalender untuk laporan penjualan akan muncul di sini.</p>)}
             >
                <span className="text-xs font-bold text-slate-600">6 Mei - 12 Mei 2024</span>
                <ChevronRight size={14} className="text-slate-400 sm:w-4 sm:h-4" />
             </div>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            label="Total Pendapatan" 
            value="Rp 4.2jt" 
            subValue="32% ↑" 
            type="up" 
            onClick={() => handleAction('Detail Pendapatan', <p className="font-medium text-slate-600">Rincian pendapatan bulan Mei 2024 mencapai Rp 4.250.000, naik signifikan dari bulan lalu.</p>)}
          />
          <StatCard 
            label="Total Pesanan" 
            value="82" 
            subValue="18% ↑" 
            type="up" 
            onClick={() => handleAction('Daftar Pesanan', <p className="font-medium text-slate-600">Total 82 pesanan telah diterima minggu ini. 12 di antaranya sedang dalam pengiriman.</p>)}
          />
          <StatCard 
            label="Pre-Order" 
            value="27" 
            subValue="Aktif" 
            type="neutral" 
            onClick={() => handleAction('Status Pre-Order', <p className="font-medium text-slate-600">Terdapat 27 slot pre-order aktif untuk batch panen minggu depan.</p>)}
          />
          <StatStatCard 
            label="Rating" 
            value="4.8/5" 
            subValue="132 Ulasan" 
            onClick={() => handleAction('Ulasan Pelanggan', <p className="font-medium text-slate-600">Rating rata-rata Anda adalah 4.8. Pelanggan sangat menyukai kualitas kesegaran tomat Anda.</p>)}
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
                        customer="Andi Wijaya"
                        location="Sukamaju"
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
                     <p className="text-xl sm:text-2xl font-black text-slate-800">245 kg</p>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={SALES_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={8}
                      >
                        {SALES_DATA.map((entry, index) => (
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
                  {SALES_DATA.slice(0, 3).map((item, i) => (
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
              <BestSellerItem 
                img="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200" 
                name="Tomat Segar"
                amount="120 kg"
                revenue="Rp 1.920.000"
                onClick={() => handleAction('Performa: Tomat Segar', <p className="font-medium text-slate-600">Tomat Segar menyumbang 40% dari total pendapatan minggu ini.</p>)}
              />
              <BestSellerItem 
                img="https://images.unsplash.com/photo-1618161546200-5047b11933c0?q=80&w=400" 
                name="Cabai Merah Keriting"
                amount="65 kg"
                revenue="Rp 1.820.000"
                onClick={() => handleAction('Performa: Cabai Merah', <p className="font-medium text-slate-600">Cabai Merah meningkat penjualannya sebesar 15% setiap harinya.</p>)}
              />
              <BestSellerItem 
                img="https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=200" 
                name="Jagung Manis"
                amount="40 kg"
                revenue="Rp 380.000"
                onClick={() => handleAction('Performa: Jagung Manis', <p className="font-medium text-slate-600">Jagung Manis stabil di posisi produk terlaris ketiga.</p>)}
              />
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
                  <TimelineItem date="10 Mei 2024" name="Tomat Segar" type="Panen" />
                  <TimelineItem date="11 Mei 2024" name="Jagung Manis" type="Panen" />
                  <TimelineItem date="12 Mei 2024" name="Cabai Merah Keriting" type="Panen" />
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
                    <p className="text-base sm:text-xl font-black text-slate-800">Rp 2.3jt</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendapatan</p>
                    <p className="text-base sm:text-xl font-black text-emerald-600">Rp 4.2jt</p>
                </div>
              </div>
              <button 
                onClick={() => handleAction('Tarik Dana', <div className="space-y-6">
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Saldo yang dapat ditarik</p>
                      <p className="text-3xl font-black text-brand-600">Rp 2.350.000</p>
                   </div>
                   <div className="space-y-4">
                      <p className="text-sm font-bold text-slate-700">Pilih Rekening Tujuan</p>
                      <div className="p-4 bg-white border-2 border-brand-500 rounded-xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center font-black text-[8px]">BANK</div>
                            <div>
                               <p className="text-xs font-bold">Bank Mandiri</p>
                               <p className="text-[10px] text-slate-400">123-****-456 a.n Pak Joko</p>
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
