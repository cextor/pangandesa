import React from 'react';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, Home, Briefcase, Heart } from 'lucide-react';

export default function AddressPage() {
  const addresses = [
    { id: 1, type: 'Rumah', icon: <Home />, name: 'Andi Wijaya', phone: '0812-3456-7890', street: 'Jl. Melati No. 12, Perumahan Asri', district: 'Cilandak', city: 'Jakarta Selatan', isDefault: true },
    { id: 2, type: 'Kantor', icon: <Briefcase />, name: 'Andi Wijaya (Office)', phone: '0812-3456-7890', street: 'Sudirman Central Business District, Tower 2', district: 'Senayan', city: 'Jakarta Pusat', isDefault: false },
    { id: 3, type: 'Apartemen', icon: <Heart />, name: 'Andi Wijaya', phone: '0899-7766-5544', street: 'Gading Marina Apartment, Lt 15', district: 'Kelapa Gading', city: 'Jakarta Utara', isDefault: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
      <div className="max-w-[1000px] mx-auto p-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-slate-800 font-display mb-2">Alamat Pengiriman</h1>
            <p className="text-slate-500 font-medium">Atur ke mana hasil tani Anda akan dikirimkan.</p>
          </div>
          <button className="bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-brand-600/20 active:scale-95">
             <Plus size={20} />
             Tambah Alamat
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className={`bg-white rounded-[40px] p-10 border transition-all duration-300 relative group overflow-hidden ${addr.isDefault ? 'border-brand-200 ring-4 ring-brand-50' : 'border-slate-100'}`}>
               {addr.isDefault && (
                 <div className="absolute top-0 right-0">
                    <div className="bg-brand-500 text-white text-[10px] font-black uppercase py-2 px-8 rotate-45 translate-x-6 -translate-y-2 shadow-md">
                       Utama
                    </div>
                 </div>
               )}

               <div className="flex gap-8">
                  <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center text-3xl shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-lg ${addr.isDefault ? 'bg-brand-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                     {addr.icon}
                  </div>
                  
                  <div className="flex-1">
                     <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-xl font-black text-slate-800 font-display">{addr.type}</h3>
                        {addr.isDefault && (
                           <div className="flex items-center gap-1 text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                              <CheckCircle2 size={12} /> Terpilih
                           </div>
                        )}
                     </div>
                     
                     <div className="grid grid-cols-2 gap-8">
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

                     <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex gap-4">
                           {!addr.isDefault && (
                             <button className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline">Jadikan Utama</button>
                           )}
                           <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors flex items-center gap-1.5 border border-slate-100 px-4 py-2 rounded-xl">
                              <Edit2 size={12} /> Edit
                           </button>
                        </div>
                        <button className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                           <Trash2 size={20} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
