import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, Home, Briefcase, Heart, X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AddressService, Address } from '../../services/AddressService';

export default function AddressPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // Custom delete confirmation modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Form fields
  const [type, setType] = useState('Rumah');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; show: boolean }>({
    message: '',
    type: 'success',
    show: false
  });

  useEffect(() => {
    if (user?.id) {
      AddressService.getAddresses(user.id)
        .then(setAddresses)
        .catch(err => {
          console.error("Failed to load addresses", err);
          showToastMsg("Gagal memuat daftar alamat.", "error");
        });
    }
  }, [user?.id]);

  const showToastMsg = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'rumah':
        return <Home className="w-5 h-5" />;
      case 'kantor':
        return <Briefcase className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setType('Rumah');
    setName('');
    setPhone('');
    setStreet('');
    setDistrict('');
    setCity('');
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setType(addr.type);
    setName(addr.name);
    setPhone(addr.phone);
    setStreet(addr.street);
    setDistrict(addr.district);
    setCity(addr.city);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !street.trim() || !district.trim() || !city.trim()) {
      showToastMsg('Harap lengkapi semua bidang!', 'error');
      return;
    }
    if (!user?.id) return;

    try {
      if (editingAddress) {
        // Edit mode
        const updatedAddr = await AddressService.updateAddress(editingAddress.id, {
          type,
          name,
          phone,
          street,
          district,
          city,
          isDefault: editingAddress.isDefault
        });
        setAddresses(addresses.map(addr => addr.id === editingAddress.id ? updatedAddr : addr));
        showToastMsg('Alamat berhasil diperbarui!');
      } else {
        // Add mode
        const newAddr = await AddressService.createAddress({
          userId: user.id,
          type,
          name,
          phone,
          street,
          district,
          city,
          isDefault: addresses.length === 0
        });
        setAddresses([...addresses, newAddr]);
        showToastMsg('Alamat baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToastMsg('Gagal menyimpan alamat.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await AddressService.deleteAddress(id);
      const addrToDelete = addresses.find(a => a.id === id);
      let updated = addresses.filter(a => a.id !== id);
      if (addrToDelete?.isDefault && updated.length > 0) {
        updated[0].isDefault = true;
      }
      setAddresses(updated);
      showToastMsg('Alamat berhasil dihapus!');
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      showToastMsg('Gagal menghapus alamat.', 'error');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await AddressService.setDefault(id);
      const updated = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
      setAddresses(updated);
      showToastMsg('Alamat utama berhasil diubah!');
    } catch (err) {
      console.error(err);
      showToastMsg('Gagal mengubah alamat utama.', 'error');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1000px] mx-auto p-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-800 font-display mb-2">Alamat Pengiriman</h1>
            <p className="text-slate-500 font-medium">Atur ke mana hasil tani Anda akan dikirimkan.</p>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-[#1a4d2e] hover:bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-brand-600/10 active:scale-95 transition-all cursor-pointer border-0"
          >
             <Plus size={20} />
             Tambah Alamat
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              className={`bg-white rounded-[40px] p-10 border transition-all duration-300 relative group overflow-hidden ${
                addr.isDefault 
                  ? 'border-emerald-200 ring-4 ring-emerald-50' 
                  : 'border-slate-100 shadow-sm hover:shadow-md'
              }`}
            >
               {addr.isDefault && (
                 <div className="absolute top-0 right-0">
                    <div className="bg-emerald-600 text-white text-[10px] font-black uppercase py-2 px-8 rotate-45 translate-x-6 -translate-y-2 shadow-md">
                       Utama
                    </div>
                 </div>
               )}

               <div className="flex gap-8">
                  <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-105 shadow-md ${
                    addr.isDefault ? 'bg-emerald-600 text-white shadow-emerald-250/20' : 'bg-slate-50 text-slate-400'
                  }`}>
                     {getIcon(addr.type)}
                  </div>
                  
                  <div className="flex-1">
                     <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-xl font-black text-slate-800 font-display">{addr.type}</h3>
                        {addr.isDefault && (
                           <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                              <CheckCircle2 size={12} /> Utama
                           </div>
                        )}
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Penerima</p>
                           <p className="text-sm font-bold text-slate-800">{addr.name}</p>
                           <p className="text-xs text-slate-500 mt-1">{addr.phone}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lokasi Detail</p>
                           <p className="text-sm font-bold text-slate-800 line-clamp-1">{addr.street}</p>
                           <p className="text-xs text-slate-500 mt-1">{addr.district}, {addr.city}</p>
                        </div>
                     </div>

                     <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           {!addr.isDefault && (
                             <button 
                               onClick={() => handleSetDefault(addr.id)}
                               className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline bg-transparent border-0 cursor-pointer p-0"
                             >
                               Jadikan Utama
                             </button>
                           )}
                           <button 
                             onClick={() => openEditModal(addr)}
                             className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-850 hover:border-slate-300 transition-all flex items-center gap-1.5 border border-slate-100 px-4 py-2 rounded-xl bg-white cursor-pointer"
                           >
                              <Edit2 size={12} /> Edit
                           </button>
                        </div>
                        <button 
                          onClick={() => setDeleteConfirmId(addr.id)}
                          className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer border-0 bg-transparent"
                        >
                           <Trash2 size={20} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          ))}
          {addresses.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100 p-8 shadow-xs">
              <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="font-bold text-slate-700 text-lg mb-2">Belum Ada Alamat Pengiriman</p>
              <p className="text-slate-400 max-w-sm mx-auto text-sm mb-6">Tambahkan alamat pertama Anda ke mana hasil tani premium akan dikirimkan.</p>
              <button 
                onClick={openAddModal}
                className="bg-[#1a4d2e] hover:bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 mx-auto cursor-pointer border-0 shadow-lg shadow-emerald-950/10"
              >
                <Plus size={16} /> Tambah Alamat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-[600px] overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 font-display">
                {editingAddress ? 'Edit Alamat Pengiriman' : 'Tambah Alamat Baru'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-all border-0 bg-transparent cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tipe Alamat</label>
                  <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-bold text-slate-800 bg-white"
                  >
                    <option value="Rumah">Rumah</option>
                    <option value="Kantor">Kantor</option>
                    <option value="Apartemen">Apartemen</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Penerima</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Andi Wijaya"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-medium text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nomor Telepon</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-medium text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Alamat Jalan & Detail Rumah</label>
                <textarea 
                  value={street} 
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Contoh: Jl. Melati No. 12, Perumahan Asri Blok C4"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-medium text-slate-800 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Kecamatan</label>
                  <input 
                    type="text" 
                    value={district} 
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Contoh: Cilandak"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-medium text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Kota / Kabupaten</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Contoh: Jakarta Selatan"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-sm font-medium text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-55 transition-all text-sm border-0 bg-transparent cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="bg-[#1a4d2e] hover:bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-950/10 transition-all text-sm border-0 cursor-pointer"
                >
                  {editingAddress ? 'Simpan Perubahan' : 'Tambah Alamat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-[400px] overflow-hidden shadow-2xl border border-slate-100 p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-[24px] flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-800 font-display mb-2">Hapus Alamat?</h3>
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Apakah Anda yakin ingin menghapus alamat pengiriman ini? Tindakan ini tidak dapat dibatalkan.</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 border border-slate-105 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all cursor-pointer bg-white"
              >
                Batal
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-3 bg-red-650 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all cursor-pointer border-0 shadow-lg shadow-red-950/10 animate-pulse-subtle"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl shadow-slate-900/10 border transition-all duration-300 transform translate-y-0 animate-fade-in ${
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

