import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ChevronLeft, MapPin, CreditCard, Wallet, Landmark, Smartphone, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { ensureDayMonthYear } from '../../utils/harvestHelper';

interface CartProps {
  onBack: () => void;
  onCheckout: () => void;
}

export default function Cart({ onBack, onCheckout }: CartProps) {
  const { cartItems, removeFromCart } = useCart();

  const totalProduk = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const ongkir = cartItems.length > 0 ? 15000 : 0;
  const totalPembayaran = totalProduk + ongkir;

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
      <div className="max-w-6xl mx-auto p-8">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold text-sm mb-8 transition-colors group"
        >
          <div className="p-2 rounded-xl bg-white group-hover:bg-brand-50 transition-colors shadow-sm">
            <ChevronLeft size={18} />
          </div>
          Kembali Belanja
        </button>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-800 font-display">Keranjang Belanja</h2>
                 <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">{cartItems.length} Produk</span>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedHarvestDate || ''}`} className="flex gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-800">{item.name}</h3>
                        <p className="font-black text-brand-600">{formatter.format(item.price * item.quantity)}</p>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mb-1">{item.quantity} {item.unit} x {formatter.format(item.price)}</p>
                      
                      {item.selectedHarvestDate && (
                        <div className="flex items-center gap-1.5 text-orange-600 mb-2 mt-0.5">
                           <Clock size={12} />
                           <span className="text-[10px] font-black uppercase tracking-wider">Estimasi Panen: {ensureDayMonthYear(item.selectedHarvestDate)}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1.5 text-yellow-500">
                             <CheckCircle2 size={12} fill="currentColor" className="text-white" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Ready for Harvest</span>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedHarvestDate)}
                            className="text-[10px] font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer border-0 bg-transparent"
                          >
                            <Trash2 size={12} /> Hapus
                          </button>
                      </div>
                    </div>
                  </div>
                ))}
                {cartItems.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <p className="font-bold uppercase tracking-widest">Keranjang Anda masih kosong</p>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span>Total Produk</span>
                  <span className="font-bold text-slate-800">{formatter.format(totalProduk)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-medium">
                  <span>Ongkir (Estimasi)</span>
                  <span className="font-bold text-slate-800">{formatter.format(ongkir)}</span>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-800 font-display">Total Pembayaran</span>
                  <span className="text-2xl font-black text-brand-600 font-display">{formatter.format(totalPembayaran)}</span>
                </div>
                
                <button 
                  onClick={onCheckout}
                  disabled={cartItems.length === 0}
                  className={`w-full py-5 rounded-[24px] font-black text-lg shadow-xl transition-all mt-4 ${
                    cartItems.length === 0 
                      ? 'bg-slate-300 text-slate-450 cursor-not-allowed shadow-none' 
                      : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/30'
                  }`}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Info */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            {/* Alamat Pengiriman */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <MapPin size={18} className="text-brand-500" />
                  Alamat Pengiriman
                </h3>
                <button className="text-xs font-bold text-brand-600 hover:underline">Ubah</button>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-xs font-black text-slate-800">Rumah</p>
                   <span className="px-2 py-0.5 bg-brand-100 text-brand-600 text-[9px] font-bold rounded uppercase">Utama</span>
                </div>
                <p className="text-sm font-bold text-slate-700">Andi Wijaya</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Jl. Melati No. 12, Cilandak, Jakarta Selatan</p>
                <p className="text-xs text-slate-500 mt-1">0812-3456-7890</p>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard size={18} className="text-brand-500" />
                <h3 className="font-bold text-slate-800">Metode Pembayaran</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-brand-50 border-2 border-brand-500 rounded-2xl">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white">
                        <Wallet size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-brand-700">Saldo PanganDesa</p>
                        <p className="text-[10px] font-bold text-brand-500 uppercase">Rp 250.000</p>
                      </div>
                   </div>
                   <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center text-white ring-4 ring-brand-100">
                      <CheckCircle2 size={12} strokeWidth={3} />
                   </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-brand-200 transition-all cursor-pointer group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all">
                        <Landmark size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-600">Transfer Bank</p>
                   </div>
                   <div className="w-5 h-5 border-2 border-slate-200 rounded-full" />
                </div>

                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-brand-200 transition-all cursor-pointer group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all">
                        <Smartphone size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-600">e-Wallet (OVO, DANA, GoPay)</p>
                   </div>
                   <div className="w-5 h-5 border-2 border-slate-200 rounded-full" />
                </div>
              </div>
            </div>

            {/* Ringkasan & Estimasi */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-brand-400" />
                    Ringkasan Pengiriman
                  </h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-6">
                    <span className="text-brand-400 font-bold">Pre-order:</span> Produk akan dipanen dan dikirim sesuai jadwal petani untuk menjamin kesegaran maksimal.
                  </p>
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <Calendar size={20} className="text-brand-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Estimasi Kirim</p>
                      <p className="text-sm font-black text-brand-100">11 - 12 Mei 2024</p>
                    </div>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Calendar } from 'lucide-react';
