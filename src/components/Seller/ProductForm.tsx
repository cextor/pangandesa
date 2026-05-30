import React from 'react';
import { 
  ChevronLeft, 
  ChevronDown, 
  Calendar, 
  Image as ImageIcon
} from 'lucide-react';
import { APP_LOGO } from '../../constants';
import { Product } from '../../types';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const getTodayISODate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const convertToISODate = (dateStr?: string) => {
  if (!dateStr) return getTodayISODate();
  
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  try {
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const monthStr = parts[1].toLowerCase();
      const year = parts[2];
      
      const monthsMap: { [key: string]: string } = {
        januari: '01', jan: '01',
        februari: '02', pebruari: '02', feb: '02',
        maret: '03', mar: '03',
        april: '04', apr: '04',
        mei: '05', may: '05',
        juni: '06', jun: '06',
        juli: '07', jul: '07',
        agustus: '08', agt: '08', aug: '08',
        september: '09', sep: '09',
        oktober: '10', okt: '10', oct: '10',
        november: '11', nov: '11',
        desember: '12', des: '12', dec: '12'
      };
      
      const month = monthsMap[monthStr] || '01';
      return `${year}-${month}-${day}`;
    }
  } catch (e) {
    console.error('Failed to parse date string:', dateStr, e);
  }
  
  return getTodayISODate();
};

const formatISOToFriendlyDate = (isoStr: string) => {
  if (!isoStr) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoStr)) return isoStr;
  
  try {
    const parts = isoStr.split('-');
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    return `${day} ${months[monthIndex]} ${year}`;
  } catch (e) {
    return isoStr;
  }
};

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = React.useState<Partial<Product>>(() => {
    if (product) {
      return {
        ...product,
        harvestDate: convertToISODate(product.harvestDate),
      };
    }
    return {
      name: '',
      category: 'Sayur',
      unit: 'kg',
      price: 0,
      stock: 0,
      description: '',
      harvestDate: getTodayISODate(),
      isPreOrder: true,
      image: '',
    };
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const friendlyHarvestDate = formatISOToFriendlyDate(formData.harvestDate || '');
    onSave({
      ...formData,
      harvestDate: friendlyHarvestDate,
    });
  };

  return (
    <div className="bg-white flex-1 lg:flex-none lg:h-auto lg:max-h-[90vh] lg:rounded-[40px] flex flex-col shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 md:p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            type="button"
            onClick={onCancel}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-slate-50 rounded-xl md:rounded-2xl transition-all text-slate-400 hover:text-slate-800 border border-slate-100 bg-white shadow-sm"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">
            {product ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-6 md:p-10 space-y-8 md:space-y-10 overflow-y-auto custom-scrollbar">
        {/* Simple Image Selector - More compact */}
        <div className="bg-slate-50 border border-slate-100 rounded-[24px] md:rounded-[32px] p-5 md:p-6 flex flex-col sm:flex-row items-center gap-4 md:gap-6">
           <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl md:rounded-2xl border-2 border-white shadow-sm overflow-hidden bg-white flex items-center justify-center">
              {formData.image ? (
                <img src={formData.image} className="w-full h-full object-cover" alt="Selected" />
              ) : (
                <ImageIcon size={28} className="text-slate-200" />
              )}
           </div>
           <div className="flex-1 text-center sm:text-left">
              <h4 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-tight mb-1">Foto Produk Utama</h4>
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 md:mb-4">Gunakan foto berkualitas tinggi</p>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white border border-slate-200 px-5 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm cursor-pointer"
              >
                Ganti Foto
              </button>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
           </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-2 md:space-y-3">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Informasi Dasar</label>
            <input 
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama produk..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner placeholder:text-slate-300"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
              <div className="relative">
                <select 
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-12 text-slate-700"
                >
                  <option>Buah</option>
                  <option>Sayur</option>
                  <option>Beras & Biji</option>
                  <option>Rempah</option>
                  <option>Lainnya</option>
                </select>
                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Satuan Jual</label>
              <div className="relative">
                <select 
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-12 text-slate-700"
                >
                  <option>kg</option>
                  <option>gram</option>
                  <option>ikat</option>
                  <option>karung</option>
                </select>
                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga Per Satuan</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px] uppercase tracking-widest">Rp</div>
                <input 
                  type="number"
                  value={formData.price || ''}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl py-4 md:py-5 pl-14 pr-5 text-sm font-black focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jumlah Stok</label>
              <div className="relative">
                <input 
                  type="number"
                  value={formData.stock || ''}
                  onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl py-4 md:py-5 pl-5 pr-14 text-sm font-black focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner"
                  placeholder="0"
                  required
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest">{formData.unit}</div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Detail</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-[24px] md:rounded-[32px] p-5 md:p-6 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner min-h-[120px] md:min-h-[140px] resize-none leading-relaxed text-slate-700"
              placeholder="Jelaskan kualitas dan keunggulan produk..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estimasi Panen</label>
              <div className="relative">
                <input 
                  type="date"
                  value={formData.harvestDate}
                  onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner text-slate-700"
                />
                <Calendar size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metode Penanaman</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-12 text-slate-700"
                >
                  <option>Organik Berertifikat</option>
                  <option>Konvensional Aman</option>
                  <option>Hidroponik Modern</option>
                </select>
                <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div 
            className={`p-5 md:p-6 rounded-[24px] md:rounded-[32px] border-2 transition-all cursor-pointer flex items-center justify-between ${
               formData.isPreOrder 
                ? 'bg-brand-50 border-brand-200' 
                : 'bg-slate-50 border-slate-100'
            }`}
            onClick={() => setFormData({ ...formData, isPreOrder: !formData.isPreOrder })}
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${
                 formData.isPreOrder ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'bg-slate-200 text-slate-400'
              }`}>
                <Calendar size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-tight">Aktifkan Pre-Order</p>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">Pembeli dapat memesan awal</p>
              </div>
            </div>
            <div className={`w-12 h-7 md:w-14 md:h-8 rounded-full relative transition-colors ${formData.isPreOrder ? 'bg-brand-600' : 'bg-slate-300'}`}>
               <div className={`absolute top-0.5 md:top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${formData.isPreOrder ? 'left-5.5 md:left-7' : 'left-0.5 md:left-1'}`} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 pb-10 flex flex-col gap-3 md:gap-4">
          <button 
            type="submit"
            className="w-full bg-brand-900 text-white py-5 md:py-6 rounded-xl md:rounded-[28px] text-xs md:text-sm font-black uppercase tracking-widest shadow-2xl shadow-brand-900/20 active:scale-95 transition-all hover:bg-black"
          >
            {product ? 'Perbarui Data Produk' : 'Terbitkan Produk Baru'}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="w-full text-slate-400 py-3 md:py-4 font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:text-red-500 transition-colors"
          >
             Batalkan & Buang Draft
          </button>
        </div>
      </form>
    </div>
  );
}
