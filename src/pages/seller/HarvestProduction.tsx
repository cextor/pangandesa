import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  Leaf, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Package, 
  PackageCheck, 
  Box,
  Zap, 
  Info,
  Clock,
  X,
  AlertTriangle,
  Settings,
  Slash,
  EyeOff,
  Search,
  Filter,
  LayoutGrid,
  List,
  Plus
} from 'lucide-react';
import { ProductService } from '../../services/ProductService';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../types';
import { 
  parseHarvestSchedules, 
  serializeHarvestSchedules, 
  getTodayISODate, 
  convertToISODate, 
  formatISOToFriendlyDate, 
  ensureDayMonthYear,
  HarvestSchedule
} from '../../utils/harvestHelper';

interface FlattenedHarvestItem {
  id: string; // Unique key: `${product.id}-${index}`
  productId: string;
  product: Product;
  date: string;
  status: 'READY' | 'HARVESTED' | 'FAILED';
  actualDate?: string;
  index: number; // Index in the product's dates list
}

const formatCurrencyInput = (value: number | string) => {
  if (value === undefined || value === null || value === '') return '';
  const cleanVal = String(value).replace(/\D/g, '');
  if (!cleanVal) return '';
  return new Intl.NumberFormat('id-ID').format(Number(cleanVal));
};

const parseCurrencyInput = (formattedStr: string): number => {
  const cleanVal = formattedStr.replace(/\D/g, '');
  return cleanVal ? Number(cleanVal) : 0;
};

export default function HarvestProduction() {
  const { user } = useAuth();
  const [isSelectProductOpen, setIsSelectProductOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Modals & States
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [successTitle, setSuccessTitle] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [confirmTarget, setConfirmTarget] = React.useState<{ item: FlattenedHarvestItem; action: 'HARVESTED' | 'FAILED' | 'READY' } | null>(null);

  // Manage Dates Modal States
  const [isManageDatesOpen, setIsManageDatesOpen] = React.useState(false);
  const [selectedProductForDates, setSelectedProductForDates] = React.useState<Product | null>(null);
  const [manageDatesList, setManageDatesList] = React.useState<HarvestSchedule[]>([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | 'FUTURE_READY' | 'OVERDUE_READY' | 'HARVESTED' | 'FAILED'>('ALL');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [actualDateInput, setActualDateInput] = React.useState(getTodayISODate());

  const loadProducts = () => {
    ProductService.getAllProducts().then(data => {
      // Filter products for this seller (ID: 2) or active seller
      const sellerProducts = (data || []).filter(p => p.sellerId === 2 || p.sellerId === '2' || !p.sellerId);
      setProducts(sellerProducts);
      setLoading(false);
    });
  };

  React.useEffect(() => {
    loadProducts();
  }, []);

  // Flatten products with multiple harvest dates
  const harvestItems: FlattenedHarvestItem[] = [];
  products.forEach(p => {
    const schedules = parseHarvestSchedules(p.harvestDate, p.stock, p.price, p.isPreOrder);
    schedules.forEach((sch, idx) => {
      harvestItems.push({
        id: `${p.id}-${sch.date}`,
        productId: p.id,
        product: {
          ...p,
          price: sch.price,
          stock: sch.stock,
          isPreOrder: sch.isPreOrder
        },
        date: sch.date,
        status: sch.status as any,
        actualDate: sch.actualDate,
        index: idx
      });
    });
  });

  const todayISO = getTodayISODate();

  const countFutureReady = harvestItems.filter(
    item => item.status === 'READY' && convertToISODate(item.date) > todayISO
  ).length;

  const countOverdueReady = harvestItems.filter(
    item => item.status === 'READY' && convertToISODate(item.date) <= todayISO
  ).length;

  const countHarvested = harvestItems.filter(
    item => item.status === 'HARVESTED'
  ).length;

  const countFailed = harvestItems.filter(
    item => item.status === 'FAILED'
  ).length;

  const filteredHarvestItems = harvestItems.filter(item => {
    const matchesSearch = item.product.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (statusFilter === 'ALL') return true;
    
    if (statusFilter === 'FUTURE_READY') {
      return item.status === 'READY' && convertToISODate(item.date) > todayISO;
    }
    if (statusFilter === 'OVERDUE_READY') {
      return item.status === 'READY' && convertToISODate(item.date) <= todayISO;
    }
    if (statusFilter === 'HARVESTED') {
      return item.status === 'HARVESTED';
    }
    if (statusFilter === 'FAILED') {
      return item.status === 'FAILED';
    }
    return true;
  });

  const triggerUpdateStatus = (item: FlattenedHarvestItem, action: 'HARVESTED' | 'FAILED' | 'READY') => {
    setConfirmTarget({ item, action });
    setActualDateInput(convertToISODate(item.date));
    setIsConfirmOpen(true);
  };

  const handleExecuteStatusUpdate = async () => {
    if (!confirmTarget) return;
    const { item, action } = confirmTarget;
    
    // Find the raw product from products to get the full original JSON
    const rawProduct = products.find(p => p.id === item.productId);
    if (!rawProduct) return;

    const schedules = parseHarvestSchedules(rawProduct.harvestDate, rawProduct.stock, rawProduct.price, rawProduct.isPreOrder);
    const todayISO = getTodayISODate();

    const updatedSchedules = schedules.map((sch, idx) => {
      if (idx === item.index) {
        return {
          ...sch,
          status: action,
          actualDate: todayISO
        };
      }
      return sch;
    });

    // Auto-calculate base fields from updated schedules
    const activeSchedules = updatedSchedules.filter(s => s.status === 'READY');
    const isPreOrder = updatedSchedules.some(s => s.isPreOrder && s.status === 'READY');
    const totalStock = activeSchedules.reduce((sum, s) => sum + s.stock, 0);
    
    const preOrderSchedules = updatedSchedules.filter(s => s.isPreOrder && s.status === 'READY');
    const calculatedPrice = preOrderSchedules.length > 0 
      ? Math.min(...preOrderSchedules.map(s => s.price)) 
      : (updatedSchedules.length > 0 ? updatedSchedules[0].price : rawProduct.price);

    const serializedStr = serializeHarvestSchedules(updatedSchedules);

    try {
      await ProductService.updateProduct(rawProduct.id, {
        ...rawProduct,
        isPreOrder,
        stock: totalStock,
        price: calculatedPrice,
        harvestDate: serializedStr
      });
      setIsConfirmOpen(false);
      
      if (action === 'HARVESTED') {
        setSuccessTitle('Panen Selesai!');
        setSuccessMessage(`Berhasil mengonfirmasi panen selesai untuk komoditas ${rawProduct.name} pada tanggal ${ensureDayMonthYear(item.date)}.`);
      } else if (action === 'FAILED') {
        setSuccessTitle('Gagal Panen Tercatat');
        setSuccessMessage(`Berhasil merekam status gagal panen untuk komoditas ${rawProduct.name} pada tanggal ${ensureDayMonthYear(item.date)}.`);
      } else {
        setSuccessTitle('Status Dibatalkan');
        setSuccessMessage(`Berhasil mengembalikan status komoditas ${rawProduct.name} pada tanggal ${ensureDayMonthYear(item.date)} menjadi Menunggu Panen.`);
      }
      
      setIsSuccessOpen(true);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan status ke database.');
    }
  };

  const openManageDates = (product: Product) => {
    setSelectedProductForDates(product);
    const parsed = parseHarvestSchedules(product.harvestDate, product.stock, product.price, product.isPreOrder);
    setManageDatesList(parsed);
    setIsManageDatesOpen(true);
  };

  const handleSaveDates = async () => {
    if (!selectedProductForDates) return;

    // Auto-calculate base fields from schedules
    const activeSchedules = manageDatesList.filter(s => s.status === 'READY');
    const isPreOrder = manageDatesList.some(s => s.isPreOrder && s.status === 'READY');
    const totalStock = activeSchedules.reduce((sum, s) => sum + s.stock, 0);
    
    const preOrderSchedules = manageDatesList.filter(s => s.isPreOrder && s.status === 'READY');
    const calculatedPrice = preOrderSchedules.length > 0 
      ? Math.min(...preOrderSchedules.map(s => s.price)) 
      : (manageDatesList.length > 0 ? manageDatesList[0].price : selectedProductForDates.price);

    const serialized = serializeHarvestSchedules(manageDatesList);

    try {
      await ProductService.updateProduct(selectedProductForDates.id, {
        ...selectedProductForDates,
        isPreOrder,
        stock: totalStock,
        price: calculatedPrice,
        harvestDate: serialized
      });
      setIsManageDatesOpen(false);
      setSuccessTitle('Jadwal Panen Disimpan!');
      setSuccessMessage(`Berhasil memperbarui jadwal panen untuk produk ${selectedProductForDates.name}.`);
      setIsSuccessOpen(true);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui jadwal panen.');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-10 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
           <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                 <Sprout className="text-[#1a4d2e] w-6 h-6 sm:w-8 sm:h-8" />
                 <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tight uppercase">Panen & Produksi</h1>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed max-w-lg text-xs sm:text-sm">
                 Pantau estimasi dan jadwal panen komoditas Anda. Satu produk dapat memiliki lebih dari satu jadwal panen yang tersimpan mandiri di database.
              </p>
           </div>
           
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto shrink-0">
              <button 
                type="button"
                onClick={() => setIsSelectProductOpen(true)}
                className="bg-[#1a4d2e] hover:bg-black text-white px-5 sm:px-6 py-4 sm:py-0 rounded-xl sm:rounded-[20px] font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-brand-900/10 active:scale-95 transition-all cursor-pointer border-0 flex items-center justify-center gap-2 sm:h-[76px] w-full sm:w-auto shrink-0"
              >
                 <Plus size={14} className="sm:w-4 sm:h-4" /> Tambah Jadwal Panen
              </button>
              
              <div className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-3xl border border-slate-100 hidden sm:flex items-center gap-3 sm:gap-4 shadow-sm sm:h-[76px] w-full sm:w-auto">
                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-[#1a4d2e] rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                    <PackageCheck size={20} className="sm:w-6 sm:h-6" />
                 </div>
                 <div className="min-w-0">
                    <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 leading-none">Total Produk Panen</p>
                    <p className="text-sm sm:text-lg font-black text-slate-800 tracking-tight leading-tight">{products.length} <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-450">Komoditas</span></p>
                 </div>
              </div>
            </div>
        </div>

        {/* Compact Filters & Layout Control */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1a4d2e] transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Cari komoditas..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-3 pl-14 pr-6 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 transition-all shadow-inner placeholder:text-slate-350 text-slate-800"
            />
          </div>

          {/* Compact Dropdown Filter */}
          <div className="flex bg-slate-50 border border-slate-100 rounded-[20px] px-4 py-3 shrink-0 items-center gap-2 group-focus-within:border-brand-200">
            <Filter size={16} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-transparent border-0 text-xs font-black uppercase text-slate-600 outline-none pr-8 cursor-pointer"
            >
              <option value="ALL">Semua ({harvestItems.length})</option>
              <option value="FUTURE_READY">Mau Panen ({countFutureReady})</option>
              <option value="OVERDUE_READY">Jatuh Tempo ({countOverdueReady})</option>
              <option value="HARVESTED">Selesai ({countHarvested})</option>
              <option value="FAILED">Gagal ({countFailed})</option>
            </select>
          </div>

          {/* View Mode Toggle and Mobile Total Info */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto shrink-0">
             {/* Mobile Total Info */}
             <div className="block sm:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">
                Total: <span className="text-slate-800 font-extrabold">{products.length} Komoditas</span>
             </div>
             
             <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all border-0 bg-transparent cursor-pointer ${viewMode === 'grid' ? 'bg-[#1a4d2e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Tampilan Grid"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all border-0 bg-transparent cursor-pointer ${viewMode === 'list' ? 'bg-[#1a4d2e] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="Tampilan List"
                >
                  <List size={14} />
                </button>
             </div>
          </div>
        </div>

        {/* Harvest Cards Grid / List */}
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5"
            : "grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mx-auto"
        }>
           {loading ? (
             [1, 2].map((i) => (
                <div key={i} className="bg-white rounded-[40px] p-8 border border-slate-100 animate-pulse h-48" />
             ))
           ) : filteredHarvestItems.length > 0 ? (
             filteredHarvestItems.map((item) => {
               const p = item.product;
               const name = p.name;
               const image = p.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600';
               const quantityStr = `${p.stock} ${p.unit}`;

               if (viewMode === 'list') {
                 return (
                   <div key={item.id} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row p-4 gap-6 items-center">
                      {/* Image Area */}
                      <div className="w-24 h-24 rounded-2xl shrink-0 relative overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                         <img src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={name} />
                         <div className="absolute top-2 left-2">
                            <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest text-white shadow-sm ${
                              item.status === 'READY' 
                                ? 'bg-orange-500' 
                                : item.status === 'HARVESTED' 
                                  ? 'bg-emerald-500' 
                                  : 'bg-red-500'
                            }`}>
                               {item.status === 'READY' 
                                 ? 'Menunggu' 
                                 : item.status === 'HARVESTED' 
                                   ? 'Selesai' 
                                   : 'Gagal'}
                            </span>
                         </div>
                      </div>
                      
                      {/* Details Area */}
                      <div className="flex-1 min-w-0 flex flex-col md:flex-row justify-between md:items-center gap-4 w-full">
                         <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight truncate">{name}</h3>
                            </div>
                            
                            {/* Date displays */}
                            <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 text-slate-500 font-medium">
                               <div className="flex flex-row items-center gap-1 text-[11px] font-bold uppercase tracking-widest">
                                  <span className="text-slate-400">Jadwal:</span>
                                  <span className="text-[#1a4d2e] font-extrabold bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">{ensureDayMonthYear(item.date)}</span>
                               </div>
                               {item.actualDate && (
                                 <div className="flex flex-row items-center gap-1 text-[11px] font-bold uppercase tracking-widest">
                                    <span className="text-slate-400">
                                       {item.status === 'HARVESTED' 
                                         ? 'Panen:' 
                                         : item.status === 'FAILED' 
                                           ? 'Gagal:' 
                                           : 'Batal:'}
                                    </span>
                                    <span className={`font-extrabold px-1.5 py-0.5 rounded-md ${
                                       item.status === 'HARVESTED' 
                                         ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                         : item.status === 'FAILED' 
                                           ? 'bg-red-50 text-red-500 border border-red-100' 
                                           : 'bg-amber-50 text-amber-600 border border-amber-100'
                                    }`}>{ensureDayMonthYear(item.actualDate)}</span>
                                 </div>
                               )}
                            </div>
                            
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              Stok Tanam: <span className="text-slate-700 font-extrabold">{quantityStr}</span>
                            </p>
                         </div>
                         
                         {/* Actions Area */}
                         <div className="shrink-0 flex items-center gap-2">
                            {item.status === 'READY' ? (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => triggerUpdateStatus(item, 'HARVESTED')}
                                  className="bg-[#1a4d2e] hover:bg-black text-white px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all cursor-pointer border-0"
                                >
                                   Selesai
                                </button>
                                <button 
                                  onClick={() => triggerUpdateStatus(item, 'FAILED')}
                                  className="bg-red-50 hover:bg-red-550 text-red-500 hover:text-white px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest border border-red-100 active:scale-95 transition-all cursor-pointer"
                                >
                                   Gagal
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => triggerUpdateStatus(item, 'READY')}
                                className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                              >
                                 Batalkan Status <X size={12} />
                              </button>
                            )}
                         </div>
                      </div>
                   </div>
                 );
               }

                return (
                  <div key={item.id} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                     {/* Image Area */}
                     <div className="relative h-28 sm:h-40 w-full overflow-hidden bg-slate-50 border-b border-slate-100 shrink-0">
                        <img src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={name} />
                        <div className="absolute top-2 left-2">
                           <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest text-white shadow-sm ${
                             item.status === 'READY' 
                               ? 'bg-orange-500' 
                               : item.status === 'HARVESTED' 
                                 ? 'bg-emerald-500' 
                                 : 'bg-red-500'
                           }`}>
                              {item.status === 'READY' 
                                ? 'Menunggu' 
                                : item.status === 'HARVESTED' 
                                  ? 'Selesai' 
                                  : 'Gagal'}
                           </span>
                        </div>
                     </div>
                     
                     {/* Details & Actions Area */}
                     <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                        <div className="space-y-2.5">
                           <div className="min-w-0">
                              <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-tight mb-1 truncate" title={name}>{name}</h3>
                              <div className="flex flex-col gap-1.5 mt-1 w-full">
                                <div className="flex flex-col gap-0.5 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                                   <span className="text-slate-400">Jadwal:</span>
                                   <span className="text-slate-850 font-black bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md text-[8px] self-start">{ensureDayMonthYear(item.date)}</span>
                                </div>
                                {item.actualDate && (
                                   <div className="flex flex-col gap-0.5 text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                      <span className="text-slate-400">
                                         {item.status === 'HARVESTED' 
                                           ? 'Panen:' 
                                           : item.status === 'FAILED' 
                                             ? 'Gagal:' 
                                             : 'Batal:'}
                                      </span>
                                      <span className={`font-black px-1.5 py-0.5 rounded-md text-[8px] self-start ${
                                        item.status === 'HARVESTED' 
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                          : item.status === 'FAILED' 
                                            ? 'bg-red-50 text-red-655 border border-red-100' 
                                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                                      }`}>{ensureDayMonthYear(item.actualDate)}</span>
                                   </div>
                                )}
                              </div>
                           </div>
                           
                           <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between gap-1">
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Kuantitas</span>
                              <span className="text-[9px] sm:text-[10px] font-black text-slate-800">{quantityStr}</span>
                           </div>
                        </div>
                        
                        {/* Contextual Actions */}
                        {item.status === 'READY' ? (
                          <div className="flex gap-1.5 mt-3 sm:mt-4">
                            <button 
                              onClick={() => triggerUpdateStatus(item, 'HARVESTED')}
                              className="flex-1 bg-[#1a4d2e] hover:bg-black text-white py-2 rounded-lg font-black text-[8px] uppercase tracking-widest shadow-sm active:scale-95 transition-all cursor-pointer border-0 flex items-center justify-center"
                            >
                               Selesai
                            </button>
                            <button 
                              onClick={() => triggerUpdateStatus(item, 'FAILED')}
                              className="flex-1 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white py-2 rounded-lg font-black text-[8px] uppercase tracking-widest border border-red-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                            >
                               Gagal
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => triggerUpdateStatus(item, 'READY')}
                            className="w-full mt-3 sm:mt-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 py-2 rounded-lg font-black text-[8px] uppercase tracking-widest active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                             Batalkan Status <X size={12} />
                          </button>
                        )}
                     </div>
                  </div>
               );
             })
           ) : (
              <div className="col-span-2 bg-[#fffdf7] border-2 border-dashed border-[#d8d3c2] rounded-[40px] p-16 text-center space-y-4">
                 <div className="w-16 h-16 bg-[#f7f5ed] text-slate-400 rounded-3xl flex items-center justify-center mx-auto border border-[#d8d3c2]">
                    <Sprout size={28} />
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Tidak Menemukan Siklus Panen</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                      Silakan sesuaikan filter pencarian atau pastikan tanggal panen sudah dikonfigurasi di halaman Produk Saya.
                    </p>
                 </div>
              </div>
           )}
        </div>

        {/* Production Timeline Widget */}
        <div className="bg-[#1a4d2e] rounded-[40px] p-12 text-white relative overflow-hidden">
           <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                 <h2 className="text-3xl font-black uppercase tracking-tight italic">Timeline Produksi AI</h2>
                 <p className="text-emerald-100/70 font-medium leading-relaxed">
                    Sistem visi komputer kami memprediksi puncak kematangan lahan blok Utara dalam 3 hari lagi. Pastikan logistik siap untuk pengiriman ke Jakarta.
                 </p>
                 <div className="flex gap-4">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex-1">
                       <Clock className="text-emerald-300 mb-2" size={20} />
                       <p className="text-[10px] font-black uppercase mb-1">Peak Time</p>
                       <p className="text-lg font-black">15 Mei</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex-1">
                       <Zap className="text-emerald-300 mb-2" size={20} />
                       <p className="text-[10px] font-black uppercase mb-1">Health Index</p>
                       <p className="text-lg font-black">94/100</p>
                    </div>
                 </div>
              </div>
              
              <div className="flex-1 bg-white/5 backdrop-blur-3xl rounded-[32px] p-8 border border-white/10 w-full">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-emerald-400">Log Aktivitas Terakhir</h4>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-2 h-2 bg-emerald-400 rounded-full mt-1 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                       <div>
                          <p className="text-xs font-bold leading-none">Penyemprotan Nutrisi Organik Lahan A</p>
                          <p className="text-[10px] text-emerald-300/50 mt-1 uppercase font-black">Selesai • 2 Jam yang lalu</p>
                       </div>
                    </div>
                    <div className="flex gap-4 opacity-50">
                       <div className="w-2 h-2 bg-white rounded-full mt-1 shrink-0" />
                       <div>
                          <p className="text-xs font-bold leading-none">Pengecekan Kelembaban Tanah AI</p>
                          <p className="text-[10px] text-emerald-300/50 mt-1 uppercase font-black">Selesai • 5 Jam yang lalu</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-emerald-500/10 rounded-full blur-[120px]" />
              <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-emerald-500/20 rounded-full blur-[120px]" />
           </div>
        </div>
      </div>

      <AnimatePresence>
        {/* Safety Confirmation Modal: Update Harvest Status */}
        {isConfirmOpen && confirmTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#fffdf7] border-2 border-[#d8d3c2] rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl p-8 text-center"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setIsConfirmOpen(false)} className="p-2 hover:bg-[#e6e2d6] rounded-xl transition-colors border-0 bg-transparent cursor-pointer">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 shadow-md ${
                confirmTarget.action === 'HARVESTED' 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : confirmTarget.action === 'FAILED'
                    ? 'bg-red-50 text-red-600 border-red-100'
                    : 'bg-orange-50 text-orange-600 border-orange-100'
              }`}>
                 {confirmTarget.action === 'HARVESTED' ? <CheckCircle2 size={40} /> : <AlertTriangle size={40} />}
              </div>

              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-3 font-display">
                 {confirmTarget.action === 'HARVESTED' ? 'Panen Selesai' : confirmTarget.action === 'FAILED' ? 'Gagal Panen' : 'Batalkan Status'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-semibold">
                 Apakah Anda yakin ingin memperbarui status panen komoditas <span className="font-extrabold text-brand-900">{confirmTarget.item.product.name}</span> pada tanggal <span className="font-extrabold">{ensureDayMonthYear(confirmTarget.item.date)}</span>?
              </p>



              <div className="flex gap-4">
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="flex-1 bg-white text-slate-600 border border-[#d8d3c2] py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#f3efe4] transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleExecuteStatusUpdate}
                  className={`flex-1 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all cursor-pointer border-0 ${
                    confirmTarget.action === 'HARVESTED' 
                      ? 'bg-[#1a4d2e] hover:bg-black shadow-emerald-950/20'
                      : confirmTarget.action === 'FAILED'
                        ? 'bg-red-500 hover:bg-red-700 shadow-red-950/20'
                        : 'bg-orange-500 hover:bg-orange-600 shadow-orange-950/20'
                  }`}
                >
                  YA
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal: Manage Dates directly on Harvest Screen */}
        {isManageDatesOpen && selectedProductForDates && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManageDatesOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#fffdf7] border-2 border-[#d8d3c2] rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl p-8 z-10 flex flex-col max-h-[85vh]"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setIsManageDatesOpen(false)} className="p-2 hover:bg-[#e6e2d6] rounded-xl transition-colors border-0 bg-transparent cursor-pointer">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              <div className="mb-6">
                 <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight font-display mb-1">Jadwal Panen</h3>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedProductForDates.name}</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-1 custom-scrollbar">
                  {manageDatesList.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Jadwal #{idx + 1}</span>
                        {manageDatesList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setManageDatesList(manageDatesList.filter((_, i) => i !== idx))}
                            className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border-0 cursor-pointer flex items-center justify-center"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Date Input */}
                        <div className="relative">
                          <input 
                            type="date"
                            value={item.date}
                            onChange={e => {
                              const newList = [...manageDatesList];
                              newList[idx].date = e.target.value;
                              setManageDatesList(newList);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none text-slate-700"
                          />
                          <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        
                        {/* Status Select */}
                        <select
                          value={item.status}
                          onChange={e => {
                            const newList = [...manageDatesList];
                            newList[idx].status = e.target.value;
                            setManageDatesList(newList);
                          }}
                          className="bg-white border border-slate-200 rounded-xl p-3 text-[10px] font-black uppercase text-slate-600 outline-none cursor-pointer"
                        >
                          <option value="READY">MENUNGGU</option>
                          <option value="HARVESTED">SELESAI</option>
                          <option value="FAILED">GAGAL</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5 items-center">
                        {/* Stock Input */}
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stok ({selectedProductForDates?.unit || 'kg'})</span>
                          <input 
                            type="number"
                            value={item.stock}
                            onChange={e => {
                              const newList = [...manageDatesList];
                              newList[idx].stock = Number(e.target.value);
                              setManageDatesList(newList);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-black text-slate-700 outline-none"
                            placeholder="Stok"
                            min="0"
                          />
                        </div>
                        
                        {/* Price Input */}
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Harga (Rp)</span>
                          <input 
                            type="text"
                            value={formatCurrencyInput(item.price)}
                            onChange={e => {
                              const newList = [...manageDatesList];
                              newList[idx].price = parseCurrencyInput(e.target.value);
                              setManageDatesList(newList);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-black text-slate-700 outline-none"
                            placeholder="Harga"
                            required
                          />
                        </div>
                        
                        {/* Pre-Order Toggle Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const newList = [...manageDatesList];
                            newList[idx].isPreOrder = !newList[idx].isPreOrder;
                            setManageDatesList(newList);
                          }}
                          className={`mt-4 py-2 px-1 rounded-xl font-black text-[8px] uppercase tracking-widest border transition-all cursor-pointer text-center h-[34px] flex items-center justify-center ${
                            item.isPreOrder 
                              ? 'bg-brand-50 text-brand-600 border-brand-200' 
                              : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          {item.isPreOrder ? 'PO AKTIF ✓' : 'PO OFF'}
                        </button>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="pt-4 border-t border-slate-200 mt-4 space-y-4">
                  <button
                    type="button"
                    onClick={() => setManageDatesList([...manageDatesList, { date: getTodayISODate(), status: 'READY', stock: selectedProductForDates?.stock || 0, price: selectedProductForDates?.price || 0, isPreOrder: true }])}
                    className="text-xs font-black text-[#1a4d2e] hover:text-black uppercase tracking-widest flex items-center gap-1 bg-transparent border-0 cursor-pointer pl-1"
                  >
                    + Tambah Jadwal Baru
                  </button>
                 
                 <div className="flex gap-4">
                    <button
                      onClick={() => setIsManageDatesOpen(false)}
                      className="flex-1 bg-white text-slate-600 border border-[#d8d3c2] py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#f3efe4] transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveDates}
                      className="flex-1 bg-[#1a4d2e] text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-colors border-0"
                    >
                      Simpan
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal: Select Product to Manage/Add Harvest Schedule */}
        {isSelectProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSelectProductOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#fffdf7] border-2 border-[#d8d3c2] rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl p-8 z-10 flex flex-col max-h-[80vh]"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setIsSelectProductOpen(false)} className="p-2 hover:bg-[#e6e2d6] rounded-xl transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-center">
                  <X size={20} className="text-slate-650" />
                </button>
              </div>

              <div className="mb-6">
                 <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight font-display mb-1">Pilih Komoditas</h3>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Pilih produk untuk mengelola & menambah jadwal panen</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 custom-scrollbar">
                {products.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => {
                      setIsSelectProductOpen(false);
                      openManageDates(p);
                    }}
                    className="bg-white hover:bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 cursor-pointer transition-all shadow-xs hover:border-brand-200 hover:shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight truncate">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Stok Tanam: {p.stock} {p.unit} • Harga: Rp {p.price.toLocaleString('id-ID')}</p>
                    </div>
                    <span className="text-[10px] font-black text-[#1a4d2e] uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full shrink-0">Pilih</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 mt-6">
                <button
                  onClick={() => setIsSelectProductOpen(false)}
                  className="w-full bg-white text-slate-650 border border-[#d8d3c2] py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#f3efe4] transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Universal Success Alert Modal */}
        {isSuccessOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSuccessOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#fffdf7] border-2 border-[#d8d3c2] rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl p-8 text-center"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setIsSuccessOpen(false)} className="p-2 hover:bg-[#e6e2d6] rounded-xl transition-colors border-0 bg-transparent cursor-pointer">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100 shadow-md">
                <CheckCircle2 size={40} />
              </div>

              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-3 font-display">{successTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-semibold">
                {successMessage}
              </p>

              <button
                onClick={() => setIsSuccessOpen(false)}
                className="w-full bg-[#1a4d2e] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer border-0"
              >
                Selesai
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
