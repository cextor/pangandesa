import React from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  ChevronLeft, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Landmark, 
  Smartphone, 
  Trash2, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { ensureDayMonthYear } from '../../utils/harvestHelper';
import { CartItem } from '../../types';

interface CartProps {
  onBack: () => void;
  onCheckout: (selectedItems: CartItem[]) => void;
}

export default function Cart({ onBack, onCheckout }: CartProps) {
  const { cartItems, removeFromCart, updateCartQuantity } = useCart();
  const [tempQuantities, setTempQuantities] = React.useState<Record<string, string>>({});

  // Manage checkbox selection state. Default selected all on mount
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedKeys(cartItems.map(item => `${item.id}-${item.selectedHarvestDate || ''}`));
    }
  }, [cartItems.length]);

  const toggleSelectItem = (id: string, selectedHarvestDate?: string) => {
    const key = `${id}-${selectedHarvestDate || ''}`;
    setSelectedKeys(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key) 
        : [...prev, key]
    );
  };

  const isAllSelected = cartItems.length > 0 && selectedKeys.length === cartItems.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(cartItems.map(item => `${item.id}-${item.selectedHarvestDate || ''}`));
    }
  };

  const selectedCartItems = cartItems.filter(item => 
    selectedKeys.includes(`${item.id}-${item.selectedHarvestDate || ''}`)
  );

  const serviceFeePercent = Number(localStorage.getItem('service_fee') || '7');
  const totalProduk = selectedCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const ongkir = selectedCartItems.length > 0 ? 15000 : 0;
  const biayaLayanan = Math.round(totalProduk * (serviceFeePercent / 100));
  const totalPembayaran = totalProduk + ongkir + biayaLayanan;

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-[#1a4d2e] font-bold text-xs sm:text-sm mb-6 sm:mb-8 transition-colors group bg-transparent border-0 cursor-pointer"
        >
          <div className="p-2 rounded-xl bg-white group-hover:bg-emerald-50 transition-colors shadow-sm">
            <ChevronLeft size={18} />
          </div>
          Kembali Belanja
        </button>
 
        <div className="grid grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Cart Items */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border border-slate-100 shadow-sm">
              
              {/* Header and Master Select All */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                 <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 text-[#1a4d2e] border-slate-350 rounded focus:ring-brand-500 cursor-pointer accent-[#1a4d2e] shrink-0"
                    />
                    <h2 className="text-lg sm:text-2xl font-black text-slate-800 uppercase tracking-tight font-display">Pilih Semua</h2>
                 </div>
                 <span className="px-3.5 py-1 bg-slate-100 text-slate-500 text-[10px] sm:text-xs font-bold rounded-full">{cartItems.length} Produk</span>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const key = `${item.id}-${item.selectedHarvestDate || ''}`;
                  const isChecked = selectedKeys.includes(key);
                  return (
                    <div 
                      key={key} 
                      className={`flex gap-4 sm:gap-6 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl hover:bg-slate-50 transition-all border ${
                        isChecked ? 'border-emerald-100 bg-emerald-50/5' : 'border-transparent'
                      } group relative items-center`}
                    >
                      {/* Checkbox selection */}
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectItem(item.id, item.selectedHarvestDate)}
                        className="w-5 h-5 text-[#1a4d2e] border-slate-300 rounded focus:ring-brand-500 cursor-pointer accent-[#1a4d2e] shrink-0"
                      />

                      {/* Image */}
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Content details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-1">
                          <h3 className="font-bold text-slate-800 text-xs sm:text-sm truncate pr-4">{item.name}</h3>
                          <p className="font-black text-[#1a4d2e] text-xs sm:text-sm shrink-0">{formatter.format(item.price * item.quantity)}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 mb-2">
                          <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">{item.quantity} {item.unit} x {formatter.format(item.price)}</p>
                          
                          {/* Interactive Quantity Selector in Cart */}
                          <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg p-0.5 shadow-xs shrink-0 scale-90 sm:scale-100 origin-left">
                            <button 
                              onClick={() => {
                                const newQty = item.quantity - 1;
                                updateCartQuantity(item.id, newQty, item.selectedHarvestDate);
                                setTempQuantities(prev => ({ ...prev, [key]: String(newQty) }));
                              }}
                              disabled={item.quantity <= 1}
                              className="p-1 text-slate-400 hover:text-[#1a4d2e] hover:bg-white rounded-md transition-all border-0 bg-transparent cursor-pointer disabled:opacity-40"
                            >
                              <Minus size={12} />
                            </button>
                            <input 
                              type="text"
                              value={tempQuantities[key] !== undefined ? tempQuantities[key] : String(item.quantity)}
                              onChange={(e) => {
                                const valStr = e.target.value.replace(/[^0-9]/g, '');
                                setTempQuantities(prev => ({ ...prev, [key]: valStr }));
                                if (valStr !== '') {
                                  const val = parseInt(valStr, 10);
                                  if (val > item.stock) {
                                    alert(`Stok tidak mencukupi! Stok maksimal tersedia: ${item.stock} ${item.unit}`);
                                    updateCartQuantity(item.id, item.stock, item.selectedHarvestDate);
                                    setTempQuantities(prev => ({ ...prev, [key]: String(item.stock) }));
                                  } else {
                                    updateCartQuantity(item.id, Math.max(1, val), item.selectedHarvestDate);
                                  }
                                }
                              }}
                              onBlur={() => {
                                if (tempQuantities[key] === '' || tempQuantities[key] === '0') {
                                  updateCartQuantity(item.id, 1, item.selectedHarvestDate);
                                  setTempQuantities(prev => ({ ...prev, [key]: '1' }));
                                }
                              }}
                              className="w-10 bg-white border border-slate-200 rounded-md py-0.5 text-xs font-black text-slate-800 text-center outline-none focus:ring-1 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] transition-all"
                            />
                            <button 
                              onClick={() => {
                                if (item.quantity >= item.stock) {
                                  alert(`Stok tidak mencukupi! Stok maksimal tersedia: ${item.stock} ${item.unit}`);
                                } else {
                                  const newQty = item.quantity + 1;
                                  updateCartQuantity(item.id, newQty, item.selectedHarvestDate);
                                  setTempQuantities(prev => ({ ...prev, [key]: String(newQty) }));
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-[#1a4d2e] hover:bg-white rounded-md transition-all border-0 bg-transparent cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">Maks: {item.stock}</span>
                        </div>
                        
                        {item.selectedHarvestDate && (
                          <div className="flex items-center gap-1 text-orange-600 mb-1.5 mt-0.5">
                             <Clock size={11} className="shrink-0" />
                             <span className="text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider">Panen: {ensureDayMonthYear(item.selectedHarvestDate)}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between sm:justify-start gap-4 mt-1">
                            <div className="flex items-center gap-1 text-emerald-600">
                               <CheckCircle2 size={11} fill="currentColor" className="text-white shrink-0" />
                               <span className="text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider">Ready for Harvest</span>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id, item.selectedHarvestDate)}
                              className="text-[9px] sm:text-[10px] font-bold text-red-500 transition-opacity flex items-center gap-1 cursor-pointer border-0 bg-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                            >
                              <Trash2 size={11} /> Hapus
                            </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {cartItems.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <p className="font-bold uppercase tracking-widest text-xs">Keranjang Anda masih kosong</p>
                  </div>
                )}
              </div>

              {/* Total break down */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-slate-500 font-semibold text-xs sm:text-sm">
                  <span>Total Produk ({selectedCartItems.length} terpilih)</span>
                  <span className="font-bold text-slate-800">{formatter.format(totalProduk)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-semibold text-xs sm:text-sm">
                  <span>Ongkir (Estimasi)</span>
                  <span className="font-bold text-slate-800">{formatter.format(ongkir)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-semibold text-xs sm:text-sm">
                  <span>Biaya Layanan ({serviceFeePercent}%)</span>
                  <span className="font-bold text-slate-800">{formatter.format(biayaLayanan)}</span>
                </div>
                <div className="pt-3 flex items-center justify-between border-t border-slate-50">
                  <span className="text-sm sm:text-base font-black text-slate-800 uppercase font-display">Total Pembayaran</span>
                  <span className="text-lg sm:text-xl font-black text-[#1a4d2e] font-display">{formatter.format(totalPembayaran)}</span>
                </div>
                
                <button 
                  onClick={() => onCheckout(selectedCartItems)}
                  disabled={selectedCartItems.length === 0}
                  className={`w-full py-4 rounded-xl sm:rounded-[20px] font-black text-sm uppercase tracking-wider shadow-lg transition-all mt-4 border-0 cursor-pointer ${
                    selectedCartItems.length === 0 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                      : 'bg-[#1a4d2e] hover:bg-black text-white shadow-emerald-950/10'
                  }`}
                >
                  Checkout ({selectedCartItems.length})
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Info */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            {/* Alamat Pengiriman */}
            <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                  <MapPin size={18} className="text-[#1a4d2e]" />
                  Alamat Pengiriman
                </h3>
                <button className="text-xs font-bold text-emerald-700 hover:underline bg-transparent border-0 cursor-pointer">Ubah</button>
              </div>
              <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-[10px] sm:text-xs font-black text-slate-800 uppercase">Rumah</p>
                   <span className="px-2 py-0.5 bg-emerald-50 text-[#1a4d2e] border border-emerald-100 text-[8px] font-bold rounded uppercase">Utama</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700">Andi Wijaya</p>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">Jl. Melati No. 12, Cilandak, Jakarta Selatan</p>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">0812-3456-7890</p>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-[#1a4d2e]" />
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">Metode Pembayaran</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-emerald-50/50 border-2 border-[#1a4d2e] rounded-2xl">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#1a4d2e] rounded-xl flex items-center justify-center text-white font-black text-xs font-display">
                        BNI
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-900">Transfer Bank BNI (Manual)</p>
                        <p className="text-[11px] font-black text-[#1a4d2e] tracking-wider">1384354499</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">a.n SRIWIJAYA DIGITAL INDONESIA</p>
                      </div>
                   </div>
                   <div className="w-5 h-5 bg-[#1a4d2e] rounded-full flex items-center justify-center text-white ring-4 ring-emerald-100">
                      <CheckCircle2 size={12} strokeWidth={3} />
                   </div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                  <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[9.5px] text-amber-800 font-medium leading-normal">
                    Ini adalah satu-satunya metode pembayaran resmi yang tersedia saat ini untuk transaksi pre-order PanganDesa.
                  </p>
                </div>
              </div>
            </div>

            {/* Ringkasan & Estimasi */}
            <div className="bg-slate-900 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="font-bold mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Clock size={18} className="text-emerald-400" />
                    Ringkasan Pengiriman
                  </h3>
                  <p className="text-slate-400 text-[10px] sm:text-[11px] leading-relaxed mb-4">
                    <span className="text-emerald-400 font-bold">Pre-order:</span> Produk akan dipanen dan dikirim sesuai jadwal petani untuk menjamin kesegaran maksimal.
                  </p>
                  {selectedCartItems.length > 0 && (
                    <div className="flex items-center gap-3 p-3.5 bg-white/5 rounded-xl border border-white/10">
                      <Clock size={18} className="text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Estimasi Pengiriman Pangan</p>
                        <p className="text-xs font-black text-brand-100 uppercase">
                          Sesuai Jadwal Siklus Panen
                        </p>
                      </div>
                    </div>
                  )}
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
