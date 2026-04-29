import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Plus, 
  ChevronLeft, 
  ChevronDown, 
  Calendar, 
  Info,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '../../types';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = React.useState<Partial<Product>>(
    product || {
      name: '',
      category: 'Buah',
      unit: 'kg',
      price: 0,
      stock: 0,
      description: '',
      harvestDate: '2024-05-10',
      isPreOrder: false,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white min-h-screen lg:min-h-0 lg:rounded-[40px] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex items-center gap-4">
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">{product ? 'Edit Produk' : 'Tambah Produk'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Image Upload Area */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="relative w-24 h-24 shrink-0">
            <img 
              src={formData.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=200'} 
              className="w-full h-full object-cover rounded-2xl border border-slate-100" 
              alt="Preview"
            />
          </div>
          <div className="relative w-24 h-24 shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1588252391480-496af0cdbc7a?q=80&w=200" 
              className="w-full h-full object-cover rounded-2xl border border-slate-100" 
              alt="Preview"
            />
          </div>
          <div className="relative w-24 h-24 shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=200" 
              className="w-full h-full object-cover rounded-2xl border border-slate-100" 
              alt="Preview"
            />
          </div>
          <button 
            type="button"
            className="w-24 h-24 shrink-0 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-brand-500 hover:text-brand-600 transition-all bg-slate-50/50"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
            <input 
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Tomat Segar"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
              <div className="relative">
                <select 
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-10"
                >
                  <option>Buah</option>
                  <option>Sayur</option>
                  <option>Beras & Biji</option>
                  <option>Rempah</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Satuan</label>
              <div className="relative">
                <select 
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-10"
                >
                  <option>kg</option>
                  <option>gram</option>
                  <option>ikat</option>
                  <option>karung</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</div>
                <input 
                  type="number"
                  value={formData.price || ''}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stok</label>
              <div className="relative">
                <input 
                  type="number"
                  value={formData.stock || ''}
                  onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-4 pr-12 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner"
                  placeholder="0"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">kg</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-[32px] p-6 text-sm font-medium focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner min-h-[140px] resize-none"
              placeholder="Ceritakan tentang kesegaran produk Anda..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jadwal Panen</label>
              <div className="relative">
                <input 
                  type="text"
                  value={formData.harvestDate}
                  onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner"
                  placeholder="10 Mei 2024"
                />
                <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metode Tanam</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-10"
                >
                  <option>Organik</option>
                  <option>Hidroponik</option>
                  <option>Konvensional</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2 cursor-pointer group" onClick={() => setFormData({ ...formData, isPreOrder: !formData.isPreOrder })}>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.isPreOrder ? 'bg-brand-600' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isPreOrder ? 'left-7' : 'left-1'}`} />
            </div>
            <span className="text-sm font-bold text-slate-700">Buka untuk Pre-Order</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit"
          className="w-full bg-[#1a4d2e] text-white py-5 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all mt-4"
        >
          {product ? 'Simpan Perubahan' : 'Simpan Produk'}
        </button>
      </form>
    </div>
  );
}
