import React from 'react';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  X, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { Promo } from '../../types';
import { PromoService } from '../../services/PromoService';

export default function PromoManagement() {
  const [promos, setPromos] = React.useState<Promo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPromo, setEditingPromo] = React.useState<Promo | null>(null);
  
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Form states
  const [code, setCode] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [discountPercent, setDiscountPercent] = React.useState(10);
  const [minPurchase, setMinPurchase] = React.useState(50000);
  const [image, setImage] = React.useState('');

  // Toast state
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error'; show: boolean }>({ message: '', type: 'success', show: false });

  const showToastMsg = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const loadPromos = () => {
    setLoading(true);
    PromoService.getAllPromos().then((data) => {
      setPromos(data);
      setLoading(false);
    });
  };

  React.useEffect(() => {
    loadPromos();
  }, []);

  const openAddModal = () => {
    setEditingPromo(null);
    setCode('');
    setTitle('');
    setDescription('');
    setDiscountPercent(10);
    setMinPurchase(50000);
    setImage('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Promo) => {
    setEditingPromo(p);
    setCode(p.code);
    setTitle(p.title);
    setDescription(p.description);
    setDiscountPercent(p.discountPercent);
    setMinPurchase(p.minPurchase);
    setImage(p.image);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim() || !description.trim()) {
      showToastMsg('Harap isi semua kolom wajib!', 'error');
      return;
    }

    try {
      const payload: Partial<Promo> = {
        code: code.trim().toUpperCase(),
        title: title.trim(),
        description: description.trim(),
        discountPercent,
        minPurchase,
        image: image.trim() || undefined
      };

      if (editingPromo) {
        await PromoService.updatePromo(editingPromo.id, payload);
        showToastMsg('Promo berhasil diperbarui!');
      } else {
        await PromoService.createPromo(payload);
        showToastMsg('Promo baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      loadPromos();
    } catch (err) {
      console.error(err);
      showToastMsg('Gagal menyimpan promo.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await PromoService.deletePromo(id);
      setIsDeleting(false);
      setDeleteConfirmId(null);
      showToastMsg('Promo berhasil dihapus!');
      loadPromos();
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
      showToastMsg('Gagal menghapus promo.', 'error');
    }
  };

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden font-display">
      {/* Header */}
      <div className="p-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <Ticket className="text-brand-600" size={26} />
                 <h1 className="text-2xl font-black text-slate-800 font-display">Kelola Promo</h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">Buat kupon potongan belanja, atur batas minimum pembelian, dan pasang banner diskon.</p>
           </div>
           
           <button 
             onClick={openAddModal}
             className="bg-[#1a4d2e] hover:bg-black text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border-0 shadow-lg shadow-emerald-950/10 flex items-center gap-2 self-start sm:self-auto"
           >
              <Plus size={16} /> Tambah Promo
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar pb-32">
        <div className="max-w-6xl mx-auto space-y-8">
           
           {loading ? (
             <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-wider">
               Memuat data promo...
             </div>
           ) : promos.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {promos.map((p) => (
                 <div key={p.id} className="bg-white rounded-[28px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col group relative">
                   <div className="h-40 overflow-hidden bg-slate-50 border-b border-slate-100 relative">
                     <img src={p.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=400&auto=format&fit=crop'} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-4 left-4 bg-emerald-600 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md uppercase tracking-wider">
                       {p.code}
                     </div>
                   </div>
                   <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                     <div>
                       <h4 className="font-black text-slate-800 text-base line-clamp-1 uppercase tracking-tight mb-1">{p.title}</h4>
                       <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">{p.description}</p>
                     </div>
                     
                     <div className="space-y-2.5 pt-4 border-t border-slate-50 text-xs font-semibold text-slate-500">
                       <div className="flex justify-between">
                         <span>Potongan Diskon</span>
                         <span className="font-black text-emerald-600">{p.discountPercent}%</span>
                       </div>
                       <div className="flex justify-between">
                         <span>Min. Pembelian</span>
                         <span className="font-bold text-slate-800">{formatter.format(p.minPurchase)}</span>
                       </div>
                     </div>

                     <div className="pt-4 flex items-center gap-2">
                       <button 
                         onClick={() => openEditModal(p)}
                         className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-650 py-2.5 rounded-xl font-bold text-xs uppercase transition-all cursor-pointer border-0"
                       >
                         Edit
                       </button>
                       <button 
                         onClick={() => setDeleteConfirmId(p.id)}
                         className="p-2.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all cursor-pointer border-0"
                         title="Hapus Promo"
                       >
                         <Trash2 size={16} />
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
               <Ticket size={48} className="mx-auto text-slate-300 mb-4" />
               <p className="font-bold text-slate-700 text-lg mb-2">Belum Ada Kode Promo</p>
               <p className="text-slate-400 max-w-sm mx-auto text-sm mb-6">Tambahkan kode promo baru untuk menarik lebih banyak pembeli dan meningkatkan penjualan.</p>
               <button 
                 onClick={openAddModal}
                 className="bg-[#1a4d2e] hover:bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 mx-auto cursor-pointer border-0 shadow-lg shadow-emerald-950/10"
               >
                 <Plus size={16} /> Tambah Promo
               </button>
             </div>
           )}

        </div>
      </div>

      {/* Add / Edit Promo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 font-display">
                {editingPromo ? 'Edit Kode Promo' : 'Tambah Promo Baru'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl bg-transparent border-0 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Kode Kupon</label>
                  <input 
                    type="text" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Contoh: PANENRAYA"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-black text-slate-800 uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Judul Promo</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Diskon Panen Raya"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-semibold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Deskripsi Singkat</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Potongan belanja 15% untuk menyambut panen padi raya bulan ini."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-semibold text-slate-800 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Diskon (%)</label>
                  <input 
                    type="number" 
                    value={discountPercent} 
                    onChange={(e) => setDiscountPercent(Math.max(1, Math.min(100, Number(e.target.value))))}
                    min={1}
                    max={100}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-bold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Min. Belanja (Rp)</label>
                  <input 
                    type="number" 
                    value={minPurchase} 
                    onChange={(e) => setMinPurchase(Math.max(0, Number(e.target.value)))}
                    min={0}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">URL Gambar Banner (Opsional)</label>
                <input 
                  type="url" 
                  value={image} 
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Contoh: https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-xs font-semibold text-slate-700"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-550 hover:text-slate-800 hover:bg-slate-50 transition-all text-sm border-0 bg-transparent cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="bg-[#1a4d2e] hover:bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-950/10 transition-all text-sm border-0 cursor-pointer"
                >
                  {editingPromo ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-[400px] overflow-hidden shadow-2xl border border-slate-100 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-[24px] flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-800 font-display mb-2">Hapus Promo?</h3>
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Apakah Anda yakin ingin menghapus kode promo ini secara permanen?</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="flex-1 py-3 border border-slate-105 text-slate-555 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all cursor-pointer bg-white"
              >
                Batal
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all cursor-pointer border-0 shadow-lg shadow-red-950/10"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl shadow-slate-950/20 border transition-all duration-300 transform translate-y-0 animate-fade-in ${
          toast.type === 'success' 
            ? 'bg-[#1a4d2e] text-white border-emerald-800' 
            : 'bg-red-900 text-white border-red-800'
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
