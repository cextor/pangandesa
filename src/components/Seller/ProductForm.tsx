import React from 'react';
import { 
  ChevronLeft, 
  ChevronDown, 
  Calendar, 
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
      category: 'Sayur',
      unit: 'kg',
      price: 0,
      stock: 0,
      description: '',
      harvestDate: '2024-05-10',
      isPreOrder: true,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white min-h-screen lg:min-h-0 lg:max-h-[90vh] lg:rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={onCancel}
            className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-800 border border-slate-100"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            {product ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        {/* Simple Image Selector - More compact */}
        <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-6 flex flex-col sm:flex-row items-center gap-6">
           <div className="w-24 h-24 shrink-0 rounded-2xl border-2 border-white shadow-sm overflow-hidden bg-white flex items-center justify-center">
              {formData.image ? (
                <img src={formData.image} className="w-full h-full object-cover" alt="Selected" />
              ) : (
                <ImageIcon size={32} className="text-slate-200" />
              )}
           </div>
           <div className="flex-1 text-center sm:text-left">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">Foto Produk Utama</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Gunakan foto berkualitas tinggi untuk hasil terbaik</p>
              <button 
                type="button"
                className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm"
              >
                Ganti Foto
              </button>
           </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Informasi Dasar</label>
            <input 
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama produk..."
              className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner placeholder:text-slate-300"
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
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-12 text-slate-700"
                >
                  <option>Buah</option>
                  <option>Sayur</option>
                  <option>Beras & Biji</option>
                  <option>Rempah</option>
                </select>
                <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Satuan Jual</label>
              <div className="relative">
                <select 
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-12 text-slate-700"
                >
                  <option>kg</option>
                  <option>gram</option>
                  <option>ikat</option>
                  <option>karung</option>
                </select>
                <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga Per Satuan</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs uppercase tracking-widest">Rp</div>
                <input 
                  type="number"
                  value={formData.price || ''}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-5 pl-14 pr-5 text-sm font-black focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jumlah Stok</label>
              <div className="relative">
                <input 
                  type="number"
                  value={formData.stock || ''}
                  onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-5 pl-5 pr-14 text-sm font-black focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner"
                  placeholder="0"
                  required
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px] uppercase tracking-widest">{formData.unit}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Detail</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50/50 border border-slate-100 rounded-[32px] p-6 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner min-h-[140px] resize-none leading-relaxed text-slate-700"
              placeholder="Jelaskan kualitas, metode tanam, dan keunggulan produk Anda..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estimasi Panen</label>
              <div className="relative">
                <input 
                  type="text"
                  value={formData.harvestDate}
                  onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner text-slate-700"
                  placeholder="Contoh: 10 Mei 2024"
                />
                <Calendar size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metode Penanaman</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-12 text-slate-700"
                >
                  <option>Organik Berertifikat</option>
                  <option>Konvensional Aman</option>
                  <option>Hidroponik Modern</option>
                </select>
                <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div 
            className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer flex items-center justify-between ${
               formData.isPreOrder 
                ? 'bg-brand-50 border-brand-200' 
                : 'bg-slate-50 border-slate-100'
            }`}
            onClick={() => setFormData({ ...formData, isPreOrder: !formData.isPreOrder })}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                 formData.isPreOrder ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'bg-slate-200 text-slate-400'
              }`}>
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Aktifkan Pre-Order</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pembeli dapat memesan sebelum panen</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full relative transition-colors ${formData.isPreOrder ? 'bg-brand-600' : 'bg-slate-300'}`}>
               <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${formData.isPreOrder ? 'left-7' : 'left-1'}`} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 pb-12 flex flex-col gap-4">
          <button 
            type="submit"
            className="w-full bg-brand-900 text-white py-6 rounded-[28px] font-black uppercase tracking-widest shadow-2xl shadow-brand-900/20 active:scale-95 transition-all hover:bg-black"
          >
            {product ? 'Perbarui Data Produk' : 'Terbitkan Produk Baru'}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="w-full text-slate-400 py-4 font-black uppercase tracking-widest text-[10px] hover:text-red-500 transition-colors"
          >
             Batalkan & Buang Draft
          </button>
        </div>
      </form>
    </div>
  );
}
