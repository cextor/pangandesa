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
  Plus,
  Ticket,
  X,
  Edit2
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { ensureDayMonthYear } from '../../utils/harvestHelper';
import { CartItem, Promo } from '../../types';
import { PromoService } from '../../services/PromoService';

interface CartProps {
  onBack: () => void;
  onCheckout: (selectedItems: CartItem[], appliedPromo?: Promo | null) => void;
}

export default function Cart({ onBack, onCheckout }: CartProps) {
  const { cartItems, removeFromCart, updateCartQuantity } = useCart();
  const [tempQuantities, setTempQuantities] = React.useState<Record<string, string>>({});
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });

  // Address states
  const [addresses, setAddresses] = React.useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = React.useState<any>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false);
  const [addressModalView, setAddressModalView] = React.useState<'list' | 'form'>('list');
  const [editingAddress, setEditingAddress] = React.useState<any | null>(null);

  // Address Form fields
  const [addrType, setAddrType] = React.useState('Rumah');
  const [addrName, setAddrName] = React.useState('');
  const [addrPhone, setAddrPhone] = React.useState('');
  const [addrStreet, setAddrStreet] = React.useState('');
  const [addrDistrict, setAddrDistrict] = React.useState('');
  const [addrCity, setAddrCity] = React.useState('');

  const saveAddresses = (newAddrs: any[]) => {
    setAddresses(newAddrs);
    localStorage.setItem('user_addresses', JSON.stringify(newAddrs));
    // If the active selected address was deleted or updated, sync it!
    if (selectedAddress) {
      const stillExists = newAddrs.find((a: any) => a.id === selectedAddress.id);
      if (stillExists) {
        setSelectedAddress(stillExists);
      } else if (newAddrs.length > 0) {
        setSelectedAddress(newAddrs.find((a: any) => a.isDefault) || newAddrs[0]);
      } else {
        setSelectedAddress(null);
      }
    } else if (newAddrs.length > 0) {
      setSelectedAddress(newAddrs.find((a: any) => a.isDefault) || newAddrs[0]);
    }
  };

  const openAddAddressForm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddress(null);
    setAddrType('Rumah');
    setAddrName('');
    setAddrPhone('');
    setAddrStreet('');
    setAddrDistrict('');
    setAddrCity('');
    setAddressModalView('form');
  };

  const openEditAddressForm = (e: React.MouseEvent, addr: any) => {
    e.stopPropagation();
    setEditingAddress(addr);
    setAddrType(addr.type || 'Rumah');
    setAddrName(addr.name || '');
    setAddrPhone(addr.phone || '');
    setAddrStreet(addr.street || '');
    setAddrDistrict(addr.district || '');
    setAddrCity(addr.city || '');
    setAddressModalView('form');
  };

  const handleDeleteAddress = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    const updated = addresses.filter((a: any) => a.id !== id);
    const deletedAddr = addresses.find((a: any) => a.id === id);
    if (deletedAddr?.isDefault && updated.length > 0) {
      updated[0].isDefault = true;
    }
    saveAddresses(updated);
    showToastMsg('Alamat berhasil dihapus!');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName.trim() || !addrPhone.trim() || !addrStreet.trim() || !addrDistrict.trim() || !addrCity.trim()) {
      showToastMsg('Harap lengkapi semua bidang!', 'error');
      return;
    }

    if (editingAddress) {
      // Edit
      const updated = addresses.map((addr: any) => {
        if (addr.id === editingAddress.id) {
          return {
            ...addr,
            type: addrType,
            name: addrName.trim(),
            phone: addrPhone.trim(),
            street: addrStreet.trim(),
            district: addrDistrict.trim(),
            city: addrCity.trim(),
          };
        }
        return addr;
      });
      saveAddresses(updated);
      showToastMsg('Alamat berhasil diperbarui!');
    } else {
      // Add
      const newAddr = {
        id: String(Date.now()),
        type: addrType,
        name: addrName.trim(),
        phone: addrPhone.trim(),
        street: addrStreet.trim(),
        district: addrDistrict.trim(),
        city: addrCity.trim(),
        isDefault: addresses.length === 0
      };
      saveAddresses([...addresses, newAddr]);
      showToastMsg('Alamat baru berhasil ditambahkan!');
    }
    setAddressModalView('list');
  };

  // Promo states
  const [promoCode, setPromoCode] = React.useState('');
  const [appliedPromo, setAppliedPromo] = React.useState<Promo | null>(null);
  const [promoError, setPromoError] = React.useState('');
  const [availablePromos, setAvailablePromos] = React.useState<Promo[]>([]);

  const showToastMsg = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Manage checkbox selection state. Default selected all on mount
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedKeys(cartItems.map(item => `${item.id}-${item.selectedHarvestDate || ''}`));
    }
  }, [cartItems.length]);

  // Load addresses & promos
  React.useEffect(() => {
    // Addresses
    const rawAddr = localStorage.getItem('user_addresses');
    if (rawAddr) {
      try {
        const parsed = JSON.parse(rawAddr);
        setAddresses(parsed);
        const def = parsed.find((a: any) => a.isDefault) || parsed[0];
        setSelectedAddress(def);
      } catch (e) {
        console.error(e);
      }
    } else {
      const fallback = {
        type: 'Rumah',
        name: 'Andi Wijaya',
        phone: '0812-3456-7890',
        street: 'Jl. Melati No. 12, Perumahan Asri',
        district: 'Cilandak',
        city: 'Jakarta Selatan',
        isDefault: true
      };
      setSelectedAddress(fallback);
      setAddresses([fallback]);
    }

    // Promos
    PromoService.getAllPromos().then(data => {
      setAvailablePromos(data);
    });
  }, []);

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

  // Promo calculations
  let discountAmount = 0;
  const isPromoValid = appliedPromo && totalProduk >= appliedPromo.minPurchase;
  if (isPromoValid) {
    discountAmount = Math.round(totalProduk * (appliedPromo.discountPercent / 100));
  }

  const totalPembayaran = totalProduk + ongkir + biayaLayanan - discountAmount;

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError('Masukkan kode promo terlebih dahulu.');
      return;
    }
    const found = availablePromos.find(p => p.code.toUpperCase() === promoCode.toUpperCase().trim());
    if (!found) {
      setPromoError('Kode promo tidak valid.');
      setAppliedPromo(null);
      return;
    }
    if (totalProduk < found.minPurchase) {
      setPromoError(`Batas minimum belanja tidak terpenuhi (Min. Belanja: ${formatter.format(found.minPurchase)}).`);
      setAppliedPromo(null);
      return;
    }
    setAppliedPromo(found);
    setPromoError('');
    showToastMsg(`Promo ${found.code} berhasil diterapkan!`);
  };

  const selectAddress = (addr: any) => {
    setSelectedAddress(addr);
    setIsAddressModalOpen(false);
    showToastMsg(`Alamat pengiriman diubah ke ${addr.type}!`);
  };

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
                      className={`flex gap-4 sm:gap-6 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl hover:bg-slate-55 transition-all border ${
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
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 shrink-0 bg-slate-55">
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
                                    showToastMsg(`Stok tidak mencukupi! Stok maksimal tersedia: ${item.stock} ${item.unit}`, 'error');
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
                                  showToastMsg(`Stok tidak mencukupi! Stok maksimal tersedia: ${item.stock} ${item.unit}`, 'error');
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
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold text-xs sm:text-sm animate-in fade-in duration-200">
                    <span>Diskon Promo ({appliedPromo?.code})</span>
                    <span className="font-bold">-{formatter.format(discountAmount)}</span>
                  </div>
                )}
                {appliedPromo && totalProduk < appliedPromo.minPurchase && (
                  <div className="p-2 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-lg border border-amber-200">
                    Belum memenuhi batas minimum belanja untuk promo ini (Batas Min: {formatter.format(appliedPromo.minPurchase)})
                  </div>
                )}
                <div className="pt-3 flex items-center justify-between border-t border-slate-50">
                  <span className="text-sm sm:text-base font-black text-slate-800 uppercase font-display">Total Pembayaran</span>
                  <span className="text-lg sm:text-xl font-black text-[#1a4d2e] font-display">{formatter.format(totalPembayaran)}</span>
                </div>
                
                <button 
                  onClick={() => onCheckout(selectedCartItems, appliedPromo)}
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
                {addresses.length > 0 && (
                  <button 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-xs font-bold text-emerald-700 hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Ubah
                  </button>
                )}
              </div>
              {selectedAddress ? (
                <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                     <p className="text-[10px] sm:text-xs font-black text-slate-800 uppercase">{selectedAddress.type}</p>
                     {selectedAddress.isDefault && (
                       <span className="px-2 py-0.5 bg-emerald-50 text-[#1a4d2e] border border-emerald-100 text-[8px] font-bold rounded uppercase">Utama</span>
                     )}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-700">{selectedAddress.name}</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">{selectedAddress.street}, {selectedAddress.district}, {selectedAddress.city}</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1">{selectedAddress.phone}</p>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 text-center rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold">Belum ada alamat dipilih</p>
                </div>
              )}
            </div>

            {/* Voucher / Kode Promo */}
            <div className="bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Ticket size={18} className="text-[#1a4d2e]" />
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">Gunakan Kode Promo</h3>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan kode promo..."
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoError('');
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-semibold text-slate-800 uppercase"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-[#1a4d2e] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border-0 shadow-sm"
                  >
                    Terapkan
                  </button>
                </div>
                {promoError && (
                  <p className="text-[10px] text-red-500 font-bold">{promoError}</p>
                )}
                {appliedPromo && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between animate-in fade-in zoom-in-95 duration-200">
                    <div>
                      <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">{appliedPromo.code}</p>
                      <p className="text-[9px] text-slate-500 font-semibold">Diskon {appliedPromo.discountPercent}% (Min. Belanja {formatter.format(appliedPromo.minPurchase)})</p>
                    </div>
                    <button
                      onClick={() => setAppliedPromo(null)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
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

      {/* Address Selection Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => { setIsAddressModalOpen(false); setAddressModalView('list'); }} />
          <div className="relative bg-white rounded-[32px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 font-display">
                {addressModalView === 'list' ? 'Pilih Alamat Pengiriman' : editingAddress ? 'Edit Alamat Pengiriman' : 'Tambah Alamat Baru'}
              </h3>
              <button 
                onClick={() => {
                  setIsAddressModalOpen(false);
                  setAddressModalView('list');
                }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-all border-0 bg-transparent cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {addressModalView === 'list' ? (
              <div className="p-8 max-h-[450px] overflow-y-auto custom-scrollbar space-y-4">
                <div className="space-y-3">
                  {addresses.map((addr, index) => (
                    <div 
                      key={addr.id || index}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between hover:border-emerald-350 hover:bg-emerald-50/5 ${
                        selectedAddress && (selectedAddress.id === addr.id || selectedAddress.street === addr.street)
                          ? 'border-emerald-600 bg-emerald-50/10 ring-2 ring-emerald-50'
                          : 'border-slate-100 bg-slate-50'
                      }`}
                    >
                      <div 
                        onClick={() => selectAddress(addr)}
                        className="flex-1 cursor-pointer text-left mr-4"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[9px] font-black uppercase text-slate-700 bg-white border border-slate-100 px-1.5 py-0.5 rounded">{addr.type}</span>
                          {addr.isDefault && (
                            <span className="text-[8px] font-black uppercase text-emerald-600 tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded">Utama</span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-800">{addr.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{addr.street}, {addr.district}, {addr.city}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{addr.phone}</p>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <button 
                          onClick={(e) => openEditAddressForm(e, addr)}
                          className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-white rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                          title="Edit Alamat"
                        >
                          <Edit2 size={13} />
                        </button>
                        {!addr.isDefault && (
                          <button 
                            onClick={(e) => handleDeleteAddress(e, addr.id)}
                            className="p-2 text-slate-350 hover:text-red-500 hover:bg-white rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                            title="Hapus Alamat"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={openAddAddressForm}
                  className="w-full py-3 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/10 hover:text-emerald-700 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <Plus size={14} /> Tambah Alamat Baru
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddressSubmit} className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Tipe</label>
                    <select 
                      value={addrType} 
                      onChange={(e) => setAddrType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-650 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="Rumah">Rumah</option>
                      <option value="Kantor">Kantor</option>
                      <option value="Apartemen">Apartemen</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Penerima</label>
                    <input 
                      type="text" 
                      value={addrName} 
                      onChange={(e) => setAddrName(e.target.value)}
                      placeholder="Contoh: Andi Wijaya"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-650 text-xs font-semibold text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nomor Telepon</label>
                  <input 
                    type="tel" 
                    value={addrPhone} 
                    onChange={(e) => setAddrPhone(e.target.value)}
                    placeholder="Contoh: 0812-3456-7890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-650 text-xs font-semibold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Alamat Lengkap</label>
                  <textarea 
                    value={addrStreet} 
                    onChange={(e) => setAddrStreet(e.target.value)}
                    placeholder="Contoh: Jl. Melati No. 12, Perumahan Asri Blok C4"
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-650 text-xs font-semibold text-slate-800 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Kecamatan</label>
                    <input 
                      type="text" 
                      value={addrDistrict} 
                      onChange={(e) => setAddrDistrict(e.target.value)}
                      placeholder="Contoh: Cilandak"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-650 text-xs font-semibold text-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Kota / Kabupaten</label>
                    <input 
                      type="text" 
                      value={addrCity} 
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="Contoh: Jakarta Selatan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-650 text-xs font-semibold text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setAddressModalView('list')}
                    className="px-4 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-55 transition-all text-xs border-0 bg-transparent cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#1a4d2e] hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-950/10 transition-all text-xs border-0 cursor-pointer"
                  >
                    {editingAddress ? 'Simpan Perubahan' : 'Tambah Alamat'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl shadow-[#1a4d2e]/10 border transition-all duration-300 transform translate-y-0 animate-fade-in ${
          toast.type === 'success' 
            ? 'bg-[#1a4d2e] text-white border-emerald-800 shadow-emerald-950/10' 
            : 'bg-red-900 text-white border-red-800 shadow-red-950/10'
        }`}>
          <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-400" />
            ) : (
              <AlertCircle size={18} className="text-red-400" />
            )}
          </div>
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-wider">{toast.type === 'success' ? 'Berhasil' : 'Gagal'}</p>
            <p className="text-[11px] text-slate-150 font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
