import React from 'react';
import { 
  ChevronLeft, 
  ChevronDown, 
  Calendar, 
  Image as ImageIcon,
  X,
  Plus,
  Star,
  AlertCircle
} from 'lucide-react';
import { APP_LOGO } from '../../constants';
import { Product, HarvestSchedule, ProductImage } from '../../types';
import { ProductService } from '../../services/ProductService';
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
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

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
      setErrorMsg("Maksimal gambar produk yang diperbolehkan adalah 5 foto.");
      return;
    }
    
    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg(`File "${file.name}" melebihi batas ukuran 2MB. Silakan pilih foto dengan ukuran yang lebih kecil.`);
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
              isMain: prev.length === 0 || !hasMain,
              file: file
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    try {
      // 1. Upload files that have a raw file object
      const updatedImages = await Promise.all(
        productImages.map(async (img) => {
          if (img.file) {
            const uploadedUrl = await ProductService.uploadProductImage(img.file);
            return {
              imagePath: uploadedUrl,
              isMain: img.isMain,
            };
          }
          return {
            imagePath: img.imagePath,
            isMain: img.isMain,
          };
        })
      );

      // 2. Auto-calculate base fields from schedules
      const activeSchedules = harvestDateList.filter(s => s.status === 'READY');
      const isPreOrder = harvestDateList.some(s => s.isPreOrder && s.status === 'READY');
      const totalStock = activeSchedules.reduce((sum, s) => sum + s.stock, 0);
      
      const preOrderSchedules = harvestDateList.filter(s => s.isPreOrder && s.status === 'READY');
      const calculatedPrice = preOrderSchedules.length > 0 
        ? Math.min(...preOrderSchedules.map(s => s.price)) 
        : (harvestDateList.length > 0 ? harvestDateList[0].price : formData.price || 0);

      const friendlyHarvestDates = serializeHarvestSchedules(harvestDateList);
      const mainImg = updatedImages.find(img => img.isMain)?.imagePath || (updatedImages.length > 0 ? updatedImages[0].imagePath : '');

      onSave({
        ...formData,
        isPreOrder,
        stock: totalStock,
        price: calculatedPrice,
        harvestDate: friendlyHarvestDates,
        image: mainImg,
        images: updatedImages,
      });
    } catch (err) {
      console.error('Failed to save product images', err);
      setErrorMsg('Gagal mengunggah gambar produk. Harap coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white flex-1 lg:flex-none lg:h-auto lg:max-h-[90vh] lg:rounded-[40px] flex flex-col shadow-2xl overflow-hidden w-full">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-800 border border-slate-100 bg-white shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">
            {product ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-5 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 flex items-center gap-3 text-xs font-semibold animate-fade-in no-print">
             <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
             <div className="flex-1">{errorMsg}</div>
             <button type="button" onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-700 bg-transparent border-0 cursor-pointer text-base select-none">×</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Media & Basic Information */}
          <div className="lg:col-span-7 space-y-5">
            {/* Multi Image Upload Grid */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Foto Produk ({productImages.length}/5)</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Maks 5 foto, maks 2MB per foto</p>
                </div>
                {productImages.length < 5 && (
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-brand-600 hover:border-brand-500 hover:text-brand-650 transition-all shadow-sm cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={10} /> Tambah Foto
                  </button>
                )}
              </div>

              <div className="grid grid-cols-5 gap-2">
                {productImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`relative aspect-square rounded-xl border-2 overflow-hidden bg-white shadow-xs group transition-all ${
                      img.isMain ? 'border-brand-500 ring-2 ring-brand-100' : 'border-slate-150 hover:border-brand-200'
                    }`}
                  >
                    <img src={img.imagePath} className="w-full h-full object-cover" alt={`Preview ${index + 1}`} />
                    
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-550 text-red-500 hover:text-white rounded transition-all shadow-sm border-0 cursor-pointer flex items-center justify-center"
                      title="Hapus"
                    >
                      <X size={10} />
                    </button>
                    
                    {/* Main image label */}
                    <button
                      type="button"
                      onClick={() => handleSetMainImage(index)}
                      className={`absolute bottom-1 left-1 right-1 py-0.5 rounded text-[6px] font-black uppercase tracking-wider text-center transition-all border-0 cursor-pointer flex items-center justify-center gap-0.5 ${
                        img.isMain 
                          ? 'bg-brand-600 text-white shadow-sm' 
                          : 'bg-white/85 backdrop-blur-xs text-slate-700 hover:bg-white'
                      }`}
                    >
                      <Star size={6} className={img.isMain ? 'fill-white text-white' : 'text-slate-400'} />
                      {img.isMain ? 'Utama' : 'Set'}
                    </button>
                  </div>
                ))}
                
                {productImages.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-400 bg-white flex flex-col items-center justify-center p-2 text-slate-400 hover:text-brand-600 transition-all cursor-pointer shadow-xs gap-1"
                  >
                    <ImageIcon size={18} className="text-slate-350" />
                    <span className="text-[7px] font-black uppercase tracking-widest text-center">Tambah</span>
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

            {/* Basic Info Fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama produk..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner placeholder:text-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                  <div className="relative">
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-10 text-slate-700"
                    >
                      <option>Buah</option>
                      <option>Sayur</option>
                      <option>Beras & Biji</option>
                      <option>Rempah</option>
                      <option>Lainnya</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Satuan Jual</label>
                  <div className="relative">
                    <select 
                      value={formData.unit}
                      onChange={e => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-10 text-slate-700"
                    >
                      <option>kg</option>
                      <option>gram</option>
                      <option>ikat</option>
                      <option>karung</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga Per Satuan</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[9px] uppercase tracking-widest">Rp</div>
                    <input 
                      type="text"
                      value={formatCurrencyInput(formData.price || '')}
                      onChange={e => setFormData({ ...formData, price: parseCurrencyInput(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs font-black focus:ring-2 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Jumlah Stok</label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={formData.stock || ''}
                      onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-4 pr-10 text-xs font-black focus:ring-2 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner"
                      placeholder="0"
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[9px] uppercase tracking-widest">{formData.unit}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Metode Penanaman</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner appearance-none pr-10 text-slate-700"
                    >
                      <option>Organik Bersertifikat</option>
                      <option>Konvensional Aman</option>
                      <option>Hidroponik Modern</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Detail</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-brand-500/5 focus:border-brand-300 outline-none transition-all shadow-inner min-h-[46px] h-[46px] resize-none leading-relaxed text-slate-700"
                    placeholder="Kualitas produk..."
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Harvest Schedules & Aggregate Pre-Order Status */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-3">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-1 ml-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Siklus Jadwal Panen & Estimasi Produksi
                </label>
                <span className="text-[7.5px] font-bold text-slate-450 uppercase tracking-wider italic">
                  *Auto aggregate
                </span>
              </div>
              
              <div className="space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
                {harvestDateList.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-3 shadow-sm relative group">
                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-1.5">
                      <span className="text-[9px] font-black text-[#1a4d2e] uppercase tracking-widest">Siklus #{idx + 1}</span>
                      {harvestDateList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setHarvestDateList(harvestDateList.filter((_, i) => i !== idx))}
                          className="p-1 bg-red-50 text-red-500 hover:bg-red-550 hover:text-white rounded transition-all border-0 cursor-pointer flex items-center justify-center"
                          title="Hapus"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Tanggal Panen</span>
                        <div className="relative">
                          <input 
                            type="date"
                            value={item.date}
                            onChange={e => {
                              const newList = [...harvestDateList];
                              newList[idx].date = e.target.value;
                              setHarvestDateList(newList);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[11px] font-bold focus:ring-2 focus:ring-brand-500/5 focus:border-brand-300 outline-none text-slate-700"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Pre-Order</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newList = [...harvestDateList];
                            newList[idx].isPreOrder = !newList[idx].isPreOrder;
                            setHarvestDateList(newList);
                          }}
                          className={`w-full py-2 px-3 rounded-lg font-black text-[8px] uppercase tracking-widest transition-all border flex items-center justify-center cursor-pointer h-[32px] ${
                            item.isPreOrder 
                              ? 'bg-brand-50 text-brand-600 border-brand-200 shadow-xs' 
                              : 'bg-white text-slate-450 border-slate-200'
                          }`}
                        >
                          {item.isPreOrder ? 'Aktif ✓' : 'Nonaktif'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Harga Per Satuan</span>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[8px] uppercase tracking-widest">Rp</div>
                          <input 
                            type="text"
                            value={formatCurrencyInput(item.price)}
                            onChange={e => {
                              const newList = [...harvestDateList];
                              newList[idx].price = parseCurrencyInput(e.target.value);
                              setHarvestDateList(newList);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-8 pr-3 text-[11px] font-black text-slate-700 outline-none shadow-xs focus:ring-2 focus:ring-brand-500/5 focus:border-brand-300 transition-all"
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Jumlah Stok</span>
                        <div className="relative">
                          <input 
                            type="number"
                            value={item.stock}
                            onChange={e => {
                              const newList = [...harvestDateList];
                              newList[idx].stock = Number(e.target.value);
                              setHarvestDateList(newList);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-3 pr-10 text-[11px] font-black text-slate-700 outline-none shadow-xs focus:ring-2 focus:ring-brand-500/5 focus:border-brand-300 transition-all"
                            placeholder="0"
                            min="0"
                            required
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[8px] uppercase tracking-widest">{formData.unit}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={() => setHarvestDateList([...harvestDateList, { date: getTodayISODate(), status: 'READY', stock: formData.stock || 0, price: formData.price || 0, isPreOrder: true }])}
                className="text-[9px] font-black text-[#1a4d2e] hover:text-black uppercase tracking-widest flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              >
                + Tambah Siklus Baru
              </button>
            </div>

            {/* Read-only Aggregate Pre-Order Status box */}
            <div 
              className={`p-3.5 rounded-xl border-2 transition-all flex items-center justify-between ${
                 harvestDateList.some(s => s.isPreOrder && s.status === 'READY') 
                  ? 'bg-brand-50 border-brand-200' 
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                   harvestDateList.some(s => s.isPreOrder && s.status === 'READY') ? 'bg-brand-650 text-white shadow-md' : 'bg-slate-200 text-slate-400'
                }`}>
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Status Pre-Order Utama</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">Ditentukan oleh jadwal aktif</p>
                </div>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${harvestDateList.some(s => s.isPreOrder && s.status === 'READY') ? 'bg-brand-600' : 'bg-slate-300'}`}>
                 <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-xs transition-all ${harvestDateList.some(s => s.isPreOrder && s.status === 'READY') ? 'left-4.5' : 'left-0.5'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <button 
            type="submit"
            disabled={isSaving}
            className={`flex-2 bg-brand-900 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black active:scale-95 transition-all cursor-pointer ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Mengunggah Gambar...' : (product ? 'Simpan Perubahan' : 'Terbitkan Produk Baru')}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 border border-slate-250 text-slate-500 hover:bg-slate-50 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all cursor-pointer bg-white"
          >
             Batalkan & Buang Draft
          </button>
        </div>
      </form>
    </div>
  );
}
