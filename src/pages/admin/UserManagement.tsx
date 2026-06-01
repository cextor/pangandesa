import React from 'react';
import { 
  Users, 
  Search, 
  Eye, 
  Trash2, 
  X, 
  AlertCircle 
} from 'lucide-react';
import apiClient from '../../services/apiClient';

export default function UserManagement() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [usersLoading, setUsersLoading] = React.useState(true);
  const [userSearch, setUserSearch] = React.useState('');
  const [userRoleFilter, setUserRoleFilter] = React.useState<'ALL' | 'buyer' | 'seller'>('ALL');
  
  const [selectedUserDetail, setSelectedUserDetail] = React.useState<any | null>(null);
  const [deleteUserConfirmId, setDeleteUserConfirmId] = React.useState<string | number | null>(null);
  const [isDeletingUser, setIsDeletingUser] = React.useState(false);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await apiClient.get('/users');
      if (res.data && res.data.users) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDeleteUser = async (id: string | number) => {
    try {
      setIsDeletingUser(true);
      await apiClient.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      setDeleteUserConfirmId(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setIsDeletingUser(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const nameLower = (u.name || '').toLowerCase();
    const emailLower = (u.email || '').toLowerCase();
    const villageLower = (u.village || '').toLowerCase();
    const companyLower = (u.company_name || '').toLowerCase();
    const phoneLower = (u.phone || '').toLowerCase();
    const searchLower = userSearch.toLowerCase();
    
    const matchesSearch = nameLower.includes(searchLower) || 
                          emailLower.includes(searchLower) ||
                          villageLower.includes(searchLower) ||
                          companyLower.includes(searchLower) ||
                          phoneLower.includes(searchLower);
                          
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden font-display">
      {/* Header */}
      <div className="p-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <Users className="text-brand-600" size={26} />
                 <h1 className="text-2xl font-black text-slate-800 font-display">Daftar Pengguna</h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">Lihat detail profil, legalitas usaha NIB/NPWP, serta kelola akun produsen dan konsumen.</p>
           </div>
           
           <div className="flex gap-4">
              <div className="bg-brand-50 border border-brand-100 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-xs">
                 <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
                 <span className="text-[10px] font-black text-brand-900 uppercase tracking-widest leading-none">{users.length} Aktivitas Akun</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar pb-32">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Mitra & Pengguna Terdaftar</h3>
             <div className="flex items-center gap-3 shrink-0">
                <select 
                   value={userRoleFilter} 
                   onChange={(e) => setUserRoleFilter(e.target.value as any)}
                   className="bg-white border border-slate-100 rounded-2xl py-3 px-4 text-xs font-black outline-none shadow-sm focus:ring-4 focus:ring-brand-500/5 text-slate-700 cursor-pointer"
                >
                   <option value="ALL">Semua Peran</option>
                   <option value="buyer">Pembeli (Buyer)</option>
                   <option value="seller">Petani (Seller)</option>
                </select>
                <div className="relative">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="Cari Nama/Email/Desa..." 
                     value={userSearch}
                     onChange={(e) => setUserSearch(e.target.value)}
                     className="bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold outline-none focus:ring-4 focus:ring-brand-500/5 transition-all w-64 shadow-sm"
                   />
                </div>
             </div>
          </div>

          {/* User Table Grid */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            {usersLoading ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-wider">
                Memuat data pengguna...
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-8">Pengguna</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kontak</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Peran</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Informasi Tambahan</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-8 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-display">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="p-6 pl-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-brand-600 font-black text-sm overflow-hidden shadow-sm shrink-0">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                user.name?.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{user.name}</p>
                              <p className="text-[10px] font-bold text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="text-xs font-bold text-slate-700">{user.phone || '-'}</p>
                          <p className="text-[10px] text-slate-400 font-medium">No. Telepon Aktif</p>
                        </td>
                        <td className="p-6">
                          <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight ${
                            user.role === 'seller' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {user.role === 'seller' ? 'Petani / Seller' : 'Pembeli / Buyer'}
                          </span>
                        </td>
                        <td className="p-6">
                          {user.role === 'seller' ? (
                            <div>
                              <p className="text-xs font-bold text-slate-700">Desa {user.village || 'Sukamaju'}</p>
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Komunitas Petani</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-xs font-bold text-slate-700">{user.company_name || 'Personal'}</p>
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Tipe Pembeli</p>
                            </div>
                          )}
                        </td>
                        <td className="p-6 pr-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedUserDetail(user)}
                              className="p-2.5 bg-slate-50 hover:bg-brand-50 text-slate-400 hover:text-brand-600 rounded-xl transition-all border-0 cursor-pointer"
                              title="Lihat Detail Profil"
                            >
                              <Eye size={15} />
                            </button>
                            {user.role !== 'admin' && (
                              <button 
                                onClick={() => setDeleteUserConfirmId(user.id)}
                                className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all border-0 cursor-pointer"
                                title="Hapus Pengguna"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-wider">
                Tidak ada pengguna yang cocok dengan kriteria pencarian
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedUserDetail(null)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-[500px] overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 font-display">Detail Profil Pengguna</h3>
              <button 
                onClick={() => setSelectedUserDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl bg-transparent border-0 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center text-brand-600 font-black text-xl overflow-hidden shrink-0">
                  {selectedUserDetail.avatar ? (
                    <img src={selectedUserDetail.avatar} alt={selectedUserDetail.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedUserDetail.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight leading-none mb-1">{selectedUserDetail.name}</h4>
                  <p className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-brand-50 text-brand-600 inline-block">
                    {selectedUserDetail.role === 'seller' ? 'Petani / Seller' : 'Pembeli / Buyer'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Email</span>
                    <span className="font-semibold text-slate-800">{selectedUserDetail.email}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Telepon</span>
                    <span className="font-semibold text-slate-800">{selectedUserDetail.phone || '-'}</span>
                  </div>
                </div>

                {selectedUserDetail.role === 'seller' && (
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Desa Komunitas</span>
                    <span className="font-semibold text-slate-800">Desa {selectedUserDetail.village || 'Sukamaju'}</span>
                  </div>
                )}

                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Alamat Jalan</span>
                  <span className="font-semibold text-slate-800 leading-relaxed block">{selectedUserDetail.address || '-'}</span>
                </div>

                {(selectedUserDetail.company_name || selectedUserDetail.nib) && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                    <p className="text-[9px] font-black text-brand-900 uppercase tracking-wider">Identitas Legalitas Perusahaan</p>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedUserDetail.company_name && (
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Nama PT/CV</span>
                          <span className="font-bold text-slate-800">{selectedUserDetail.company_name}</span>
                        </div>
                      )}
                      {selectedUserDetail.pic_name && (
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Nama PIC</span>
                          <span className="font-bold text-slate-800">{selectedUserDetail.pic_name}</span>
                        </div>
                      )}
                      {selectedUserDetail.nib && (
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Nomor NIB</span>
                          <span className="font-mono text-slate-800 font-bold">{selectedUserDetail.nib}</span>
                        </div>
                      )}
                      {selectedUserDetail.npwp && (
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Nomor NPWP</span>
                          <span className="font-mono text-slate-800 font-bold">{selectedUserDetail.npwp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedUserDetail.role === 'seller' && selectedUserDetail.bank_account && (
                  <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
                    <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block mb-0.5">Rekening Bank Pencairan</span>
                    <span className="font-mono text-slate-800 font-bold text-sm block">{selectedUserDetail.bank_account}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedUserDetail(null)}
                className="bg-brand-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-0 cursor-pointer active:scale-95 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteUserConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setDeleteUserConfirmId(null)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-[400px] overflow-hidden shadow-2xl border border-slate-100 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-[24px] flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-800 font-display mb-2">Hapus Pengguna?</h3>
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Apakah Anda yakin ingin menghapus akun pengguna ini secara permanen dari sistem?</p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteUserConfirmId(null)}
                disabled={isDeletingUser}
                className="flex-1 py-3 border border-slate-105 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all cursor-pointer bg-white"
              >
                Batal
              </button>
              <button 
                onClick={() => handleDeleteUser(deleteUserConfirmId)}
                disabled={isDeletingUser}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all cursor-pointer border-0 shadow-lg shadow-red-950/10"
              >
                {isDeletingUser ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
