import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronDown, 
  ArrowUpRight, 
  Package, 
  DollarSign, 
  ShoppingBag,
  ChevronLeft
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const SALES_TREND = [
  { day: '5 Mei', sales: 2 },
  { day: '6 Mei', sales: 24 },
  { day: '7 Mei', sales: 18 },
  { day: '8 Mei', sales: 32 },
  { day: '9 Mei', sales: 18 },
  { day: '10 Mei', sales: 26 },
  { day: '11 Mei', sales: 22 },
  { day: '12 Mei', sales: 35 },
  { day: '13 Mei', sales: 28 },
];

const TOP_PRODUCTS = [
  { 
    name: 'Tomat Segar', 
    amount: '120 kg', 
    revenue: 'Rp 1.920.000',
    img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200'
  },
  { 
    name: 'Cabai Merah Keriting', 
    amount: '65 kg', 
    revenue: 'Rp 1.820.000',
    img: 'https://images.unsplash.com/photo-1588252391480-496af0cdbc7a?q=80&w=200'
  },
  { 
    name: 'Jagung Manis', 
    amount: '40 kg', 
    revenue: 'Rp 380.000',
    img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=200'
  },
];

interface SalesAnalyticsProps {
  onBack: () => void;
}

export default function SalesAnalytics({ onBack }: SalesAnalyticsProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-800 font-display">Analitik Penjualan</h1>
              <p className="text-slate-500 font-medium">Pantau performa penjualan Anda secara real-time</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Periode</span>
             <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-6 py-3 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                <span className="text-sm font-black text-slate-700">Minggu Ini</span>
                <ChevronDown size={18} className="text-slate-400" />
             </div>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                   <Package size={20} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Penjualan</p>
             </div>
             <div className="flex items-end gap-2 mb-4">
                <h4 className="text-4xl font-black text-slate-800 tracking-tight">245 <span className="text-xl font-bold text-slate-400">kg</span></h4>
             </div>
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-emerald-500 font-black text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                   <ArrowUpRight size={14} /> 18%
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">dari minggu lalu</span>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                   <DollarSign size={20} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pendapatan</p>
             </div>
             <div className="flex items-end gap-2 mb-4">
                <h4 className="text-4xl font-black text-slate-800 tracking-tight">Rp 4.250.000</h4>
             </div>
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-emerald-500 font-black text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                   <ArrowUpRight size={14} /> 24%
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">dari minggu lalu</span>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                   <ShoppingBag size={20} />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pesanan</p>
             </div>
             <div className="flex items-end gap-2 mb-4">
                <h4 className="text-4xl font-black text-slate-800 tracking-tight">82</h4>
             </div>
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-emerald-500 font-black text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                   <ArrowUpRight size={14} /> 15%
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">dari minggu lalu</span>
             </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-50 shadow-sm">
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Grafik Penjualan (kg)</h3>
             <div className="flex gap-2">
                <div className="w-3 h-3 bg-brand-600 rounded-full" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Volume Panen Terjual</span>
             </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_TREND}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a4d2e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1a4d2e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)', 
                    padding: '20px' 
                  }}
                  itemStyle={{ 
                    fontSize: '12px', 
                    fontWeight: 900, 
                    textTransform: 'uppercase',
                    color: '#1a4d2e'
                  }}
                  labelStyle={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#94a3b8',
                    marginBottom: '8px',
                    textTransform: 'uppercase'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#1a4d2e" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#1a4d2e' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-10 rounded-[48px] border border-slate-50 shadow-sm">
           <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-8">Produk Terlaris Minggu Ini</h3>
           <div className="divide-y divide-slate-50">
              {TOP_PRODUCTS.map((product, i) => (
                <div key={i} className="py-6 flex items-center justify-between group">
                   <div className="flex items-center gap-6">
                      <div className="relative">
                        <img src={product.img} className="w-16 h-16 rounded-[24px] object-cover border-2 border-transparent group-hover:border-brand-500 transition-all p-0.5" alt={product.name} />
                        <div className="absolute -top-2 -left-2 w-7 h-7 bg-brand-600 border-4 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                           {i + 1}
                        </div>
                      </div>
                      <div>
                         <h4 className="text-lg font-black text-slate-800 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{product.name}</h4>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.amount}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xl font-black text-slate-800 group-hover:scale-110 transition-transform origin-right">{product.revenue}</p>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Sangat Terlaris</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Tren Demand & Prioritas Pasar Tani */}
        <div className="bg-[#f0f9f3] p-10 rounded-[48px] border border-emerald-100 shadow-sm space-y-8">
           <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Analisis Tren Demand & Prioritas Pasar 📈</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed uppercase tracking-wide mt-1">
                 Komoditas yang sedang paling banyak dicari oleh pembeli di platform PanganDesa minggu ini. Gunakan data ini untuk memprioritaskan masa tanam atau pre-order Anda.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[24px] border border-emerald-500/10 space-y-4">
                 <div className="flex justify-between items-start">
                    <span className="text-[7px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-100 uppercase tracking-widest">Sangat Tinggi</span>
                    <span className="text-xs font-black text-emerald-500">+45%</span>
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Cabai Rawit Merah</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Estimasi Harga: Rp 45.000 / kg</p>
                 </div>
                 <div className="border-t border-slate-50 pt-3">
                    <p className="text-[8px] font-black text-brand-700 uppercase tracking-widest">Rekomendasi Petani:</p>
                    <p className="text-[10px] text-slate-600 font-medium leading-normal mt-1">Buka pre-order batch baru sekarang untuk menyerap tingginya pencarian pembeli.</p>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-emerald-500/10 space-y-4">
                 <div className="flex justify-between items-start">
                    <span className="text-[7px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-100 uppercase tracking-widest">Tinggi</span>
                    <span className="text-xs font-black text-emerald-500">+32%</span>
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Bawang Merah</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Estimasi Harga: Rp 35.000 / kg</p>
                 </div>
                 <div className="border-t border-slate-50 pt-3">
                    <p className="text-[8px] font-black text-brand-700 uppercase tracking-widest">Rekomendasi Petani:</p>
                    <p className="text-[10px] text-slate-600 font-medium leading-normal mt-1">Prioritaskan perluasan luas tanam komoditas ini pada rotasi tanam berikutnya.</p>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-emerald-500/10 space-y-4">
                 <div className="flex justify-between items-start">
                    <span className="text-[7px] font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-100 uppercase tracking-widest">Sedang</span>
                    <span className="text-xs font-black text-emerald-500">+18%</span>
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Kentang Dieng</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Estimasi Harga: Rp 18.000 / kg</p>
                 </div>
                 <div className="border-t border-slate-50 pt-3">
                    <p className="text-[8px] font-black text-brand-700 uppercase tracking-widest">Rekomendasi Petani:</p>
                    <p className="text-[10px] text-slate-600 font-medium leading-normal mt-1">Permintaan stabil. Pertahankan volume produksi reguler Anda.</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
