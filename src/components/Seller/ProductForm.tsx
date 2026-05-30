import React from 'react';
import { 
  ChevronLeft, 
  ChevronDown, 
  Calendar, 
  Image as ImageIcon,
  X,
  Plus,
  Star
} from 'lucide-react';
import { APP_LOGO } from '../../constants';
import { Product, HarvestSchedule, ProductImage } from '../../types';
import { 
  parseHarvestSchedules, 
  serializeHarvestSchedules, 
  getTodayISODate, 
  formatISOToFriendlyDate 
} from '../../utils/harvestHelper';

interface ProductFormProps {
  product?: Product;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
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

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = React.useState<Partial<Product>>(() => {
    if (product) {
      return {
        ...product,
      };
    }
    return {
      name: '',
      category: 'Sayur',
      unit: 'kg',
      price: 0,
      stock: 0,
      description: '',
      isPreOrder: true,
      image: '',
    };
  });

  const [harvestDateList, setHarvestDateList] = React.useState<HarvestSchedule[]>(() => {
    return parseHarvestSchedules(
      product?.harvestDate,
      product?.stock || 0,
      product?.price || 0,
      product?.isPreOrder || false
    );
  });

  const [productImages, setProductImages] = React.useState<ProductImage[]>(() => {
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    if (product?.image) {
      return [{ imagePath: product.image, isMain: true }];
    }
    return [];
  });

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    if (productImages.length + files.length > 5) {
      alert("Maksimal gambar produk yang diperbolehkan adalah 5 foto.");
      return;
    }
    
    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) {
        alert(`File "${file.name}" melebihi batas ukuran 2MB. Silakan pilih foto dengan ukuran yang lebih kecil.`);
        return;
      }
    }
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProductImages((prev) => {
          const hasMain = prev.some(img => img.isMain);
          return [
            ...prev,
            {
              imagePath: base64,
              isMain: prev.length === 0 || !hasMain
            }
          ];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setProductImages((prev) => {
      const updated = prev.filter((_, i) => i !== indexToDelete);
      if (prev[indexToDelete]?.isMain && updated.length > 0) {
        updated[0].isMain = true;
      }
      return updated;
    });
  };

  const handleSetMainImage = (indexToMain: number) => {
    setProductImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isMain: i === indexToMain,
      }))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-calculate base fields from schedules
    const activeSchedules = harvestDateList.filter(s => s.status === 'READY');
    const isPreOrder = harvestDateList.some(s => s.isPreOrder && s.status === 'READY');
    const totalStock = activeSchedules.reduce((sum, s) => sum + s.stock, 0);
    
    const preOrderSchedules = harvestDateList.filter(s => s.isPreOrder && s.status === 'READY');
    const calculatedPrice = preOrderSchedules.length > 0 
      ? Math.min(...preOrderSchedules.map(s => s.price)) 
      : (harvestDateList.length > 0 ? harvestDateList[0].price : formData.price || 0);

    const friendlyHarvestDates = serializeHarvestSchedules(harvestDateList);
    const mainImg = productImages.find(img => img.isMain)?.imagePath || (productImages.length > 0 ? productImages[0].imagePath : '');

    onSave({
      ...formData,
      isPreOrder,
      stock: totalStock,
      price: calculatedPrice,
      harvestDate: friendlyHarvestDates,
      image: mainImg,
      images: productImages,
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
        {/* Multi Image Upload Grid */}
        <div className="bg-slate-50 border border-slate-100 rounded-[24px] md:rounded-[32px] p-5 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h4 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-tight">Foto Produk ({productImages.length}/5)</h4>
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Maksimal 5 foto, ukuran berkas maks 2MB per foto</p>
            </div>
            {productImages.length < 5 && (
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-600 hover:border-brand-500 hover:text-brand-650 transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={12} /> Tambah Foto
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4">
            {productImages.map((img, index) => (
              <div 
                key={index} 
                className={`relative aspect-square rounded-2xl border-2 overflow-hidden bg-white shadow-xs group transition-all ${
                  img.isMain ? 'border-brand-500 ring-4 ring-brand-100' : 'border-slate-150 hover:border-brand-200'
                }`}
              >
                <img src={img.imagePath} className="w-full h-full object-cover" alt={`Preview ${index + 1}`} />
                
                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-50 hover:bg-red-550 text-red-550 hover:text-white rounded-lg transition-all shadow-sm opacity-90 hover:opacity-100 border-0 cursor-pointer flex items-center justify-center"
                  title="Hapus Foto"
                >
                  <X size={12} />
                </button>
                
                {/* Main image label/toggle */}
                <button
                  type="button"
                  onClick={() => handleSetMainImage(index)}
                  className={`absolute bottom-2 left-2 right-2 py-1 px-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider text-center transition-all border-0 cursor-pointer flex items-center justify-center gap-1 ${
                    img.isMain 
                      ? 'bg-brand-600 text-white shadow-sm' 
                      : 'bg-white/85 backdrop-blur-xs text-slate-700 hover:bg-white hover:text-slate-800'
                  }`}
                >
                  <Star size={8} className={img.isMain ? 'fill-white text-white' : 'text-slate-400'} />
                  {img.isMain ? 'Utama' : 'Set Utama'}
                </button>
              </div>
            ))}
            
            {/* Dashed placeholder for additional uploads */}
            {productImages.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-400 bg-white flex flex-col items-center justify-center p-3 text-slate-400 hover:text-brand-600 transition-all cursor-pointer shadow-xs gap-1.5"
              >
                <ImageIcon size={22} className="text-slate-350" />
                <span className="text-[8px] font-black uppercase tracking-widest text-center">Tambah Foto</span>
              </button>
            )}
          </div>
          
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleMultipleFilesChange}
            accept="image/*"
            multiple
            className="hidden"
          />
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
                  type="text"
                  value={formatCurrencyInput(formData.price || '')}
                  onChange={e => setFormData({ ...formData, price: parseCurrencyInput(e.target.value) })}
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

          {/* Metode Penanaman */}
          <div className="space-y-1.5 md:space-y-2">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metode Penanaman</label>
            <div className="relative">
              <select 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 text-sm font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-12 text-slate-700"
              >
                <option>Organik Bersertifikat</option>
                <option>Konvensional Aman</option>
                <option>Hidroponik Modern</option>
              </select>
              <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Jadwal Tanggal Panen - Wide structured layout */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 ml-1">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                Jadwal Tanggal Panen & Informasi Ketersediaan
              </label>
              <span className="text-[8px] md:text-[9px] font-bold text-slate-450 uppercase tracking-wider italic leading-normal">
                *Harga & stok utama otomatis terhitung dari jadwal panen aktif
              </span>
            </div>
            
            <div className="space-y-4">
              {harvestDateList.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-100 space-y-4 shadow-sm relative group">
                  <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-[10px] font-black text-[#1a4d2e] uppercase tracking-widest">Jadwal Siklus #{idx + 1}</span>
                    {harvestDateList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setHarvestDateList(harvestDateList.filter((_, i) => i !== idx))}
                        className="p-1.5 bg-red-50 text-red-500 hover:bg-red-550 hover:text-white rounded-lg transition-all border-0 cursor-pointer flex items-center justify-center"
                        title="Hapus Tanggal"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date Input */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Estimasi Tanggal Panen</span>
                      <div className="relative">
                        <input 
                          type="date"
                          value={item.date}
                          onChange={e => {
                            const newList = [...harvestDateList];
                            newList[idx].date = e.target.value;
                            setHarvestDateList(newList);
                          }}
                          className="w-full bg-white border border-slate-250 rounded-xl p-3.5 text-xs font-bold focus:ring-4 focus:ring-brand-500/5 focus:border-brand-300 outline-none text-slate-700"
                          required
                        />
                        <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    {/* Pre-Order Toggle */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Pre-Order Jadwal</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newList = [...harvestDateList];
                          newList[idx].isPreOrder = !newList[idx].isPreOrder;
                          setHarvestDateList(newList);
                        }}
                        className={`w-full py-3.5 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border flex items-center justify-center gap-1.5 cursor-pointer h-[46px] ${
                          item.isPreOrder 
                            ? 'bg-brand-50 text-brand-600 border-brand-200 shadow-sm shadow-brand-500/5' 
                            : 'bg-white text-slate-400 border-slate-250'
                        }`}
                      >
                        {item.isPreOrder ? 'Pre-Order Aktif ✓' : 'Pre-Order Nonaktif'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Stock Input */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Stok Panen ({formData.unit || 'kg'})</span>
                      <input 
                        type="number"
                        value={item.stock}
                        onChange={e => {
                          const newList = [...harvestDateList];
                          newList[idx].stock = Number(e.target.value);
                          setHarvestDateList(newList);
                        }}
                        className="w-full bg-white border border-slate-250 rounded-xl p-3.5 text-xs font-black text-slate-700 outline-none shadow-sm focus:border-brand-200"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>

                    {/* Price Input */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga per Satuan (Rp)</span>
                      <input 
                        type="text"
                        value={formatCurrencyInput(item.price)}
                        onChange={e => {
                          const newList = [...harvestDateList];
                          newList[idx].price = parseCurrencyInput(e.target.value);
                          setHarvestDateList(newList);
                        }}
                        className="w-full bg-white border border-slate-250 rounded-xl p-3.5 text-xs font-black text-slate-700 outline-none shadow-sm focus:border-brand-200"
                        placeholder="Rp"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={() => setHarvestDateList([...harvestDateList, { date: getTodayISODate(), status: 'READY', stock: formData.stock || 0, price: formData.price || 0, isPreOrder: true }])}
              className="mt-1 text-[10px] font-black text-[#1a4d2e] hover:text-black uppercase tracking-widest flex items-center gap-1.5 bg-transparent border-0 cursor-pointer"
            >
              + Tambah Jadwal Baru
            </button>
          </div>

          {/* Read-only Aggregate Pre-Order Status box */}
          <div 
            className={`p-5 md:p-6 rounded-[24px] md:rounded-[32px] border-2 transition-all flex items-center justify-between ${
               harvestDateList.some(s => s.isPreOrder && s.status === 'READY') 
                ? 'bg-brand-50 border-brand-200' 
                : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${
                 harvestDateList.some(s => s.isPreOrder && s.status === 'READY') ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'bg-slate-200 text-slate-400'
              }`}>
                <Calendar size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-tight">Status Pre-Order Utama</p>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">Otomatis aktif dari ketersediaan jadwal Pre-Order</p>
              </div>
            </div>
            <div className={`w-12 h-7 md:w-14 md:h-8 rounded-full relative transition-colors ${harvestDateList.some(s => s.isPreOrder && s.status === 'READY') ? 'bg-brand-600' : 'bg-slate-300'}`}>
               <div className={`absolute top-0.5 md:top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${harvestDateList.some(s => s.isPreOrder && s.status === 'READY') ? 'left-5.5 md:left-7' : 'left-0.5 md:left-1'}`} />
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
