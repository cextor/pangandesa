import React from 'react';
import { 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Wallet,
  Plus,
  Trash2,
  Edit2,
  X
} from 'lucide-react';

export default function SystemConfiguration() {
  const [serviceFee, setServiceFee] = React.useState<number>(() => Number(localStorage.getItem('service_fee') || '7'));
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [simulationTotal, setSimulationTotal] = React.useState('150000');

  // Bank accounts states
  const [bankAccounts, setBankAccounts] = React.useState<any[]>(() => {
    const raw = localStorage.getItem('admin_bank_accounts');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return [
          { id: '1', bankName: 'BNI', accountNumber: '1384354499', accountHolder: 'SRIWIJAYA DIGITAL INDONESIA', isActive: true }
        ];
      }
    }
    const defaultAccounts = [
      { id: '1', bankName: 'BNI', accountNumber: '1384354499', accountHolder: 'SRIWIJAYA DIGITAL INDONESIA', isActive: true }
    ];
    localStorage.setItem('admin_bank_accounts', JSON.stringify(defaultAccounts));
    return defaultAccounts;
  });

  const [isBankModalOpen, setIsBankModalOpen] = React.useState(false);
  const [editingBankAccount, setEditingBankAccount] = React.useState<any | null>(null);

  // Bank Account Form fields
  const [formBankName, setFormBankName] = React.useState('BNI');
  const [formAccountNumber, setFormAccountNumber] = React.useState('');
  const [formAccountHolder, setFormAccountHolder] = React.useState('');
  const [formIsActive, setFormIsActive] = React.useState(true);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('service_fee', String(serviceFee));
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const saveBankAccounts = (newAccounts: any[]) => {
    setBankAccounts(newAccounts);
    localStorage.setItem('admin_bank_accounts', JSON.stringify(newAccounts));
  };

  const openAddBankModal = () => {
    setEditingBankAccount(null);
    setFormBankName('BNI');
    setFormAccountNumber('');
    setFormAccountHolder('');
    setFormIsActive(true);
    setIsBankModalOpen(true);
  };

  const openEditBankModal = (acc: any) => {
    setEditingBankAccount(acc);
    setFormBankName(acc.bankName);
    setFormAccountNumber(acc.accountNumber);
    setFormAccountHolder(acc.accountHolder);
    setFormIsActive(acc.isActive);
    setIsBankModalOpen(true);
  };

  const handleDeleteBankAccount = (id: string) => {
    const updated = bankAccounts.filter(acc => acc.id !== id);
    saveBankAccounts(updated);
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAccountNumber.trim() || !formAccountHolder.trim()) return;

    if (editingBankAccount) {
      // Edit
      const updated = bankAccounts.map(acc => {
        if (acc.id === editingBankAccount.id) {
          return {
            ...acc,
            bankName: formBankName,
            accountNumber: formAccountNumber.trim(),
            accountHolder: formAccountHolder.trim().toUpperCase(),
            isActive: formIsActive
          };
        }
        return acc;
      });
      saveBankAccounts(updated);
    } else {
      // Add
      const newAcc = {
        id: String(Date.now()),
        bankName: formBankName,
        accountNumber: formAccountNumber.trim(),
        accountHolder: formAccountHolder.trim().toUpperCase(),
        isActive: formIsActive
      };
      saveBankAccounts([...bankAccounts, newAcc]);
    }
    setIsBankModalOpen(false);
  };

  const toggleBankActive = (id: string) => {
    const updated = bankAccounts.map(acc => {
      if (acc.id === id) {
        return { ...acc, isActive: !acc.isActive };
      }
      return acc;
    });
    saveBankAccounts(updated);
  };

  const simSubtotal = Number(simulationTotal) || 0;
  const simFee = Math.round(simSubtotal * (serviceFee / 100));
  const simOngkir = simSubtotal > 0 ? 15000 : 0;
  const simTotal = simSubtotal + simFee + simOngkir;
  const simDP = Math.round(simTotal * 0.3);
  const simPelunasan = simTotal - simDP;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden font-display">
      {/* Header */}
      <div className="p-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8">
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <Settings className="text-brand-600 animate-spin-slow" size={26} />
                 <h1 className="text-2xl font-black text-slate-800 font-display">Konfigurasi Sistem</h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">Pengaturan parameter operasional finansial dan penyesuaian biaya layanan global.</p>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar pb-32">
        <div className="max-w-6xl mx-auto space-y-8">

          {showSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-3xl flex items-center gap-3 text-xs font-bold shadow-md shadow-emerald-500/5">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              Konfigurasi biaya layanan berhasil diperbarui menjadi {serviceFee}% dan telah disinkronisasikan!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Configuration Controls */}
            <div className="lg:col-span-7 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
               <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                 <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Biaya Layanan Transaksi</h3>
                 <span className="text-[10px] font-black bg-brand-50 text-brand-600 px-3 py-1 rounded-full uppercase tracking-wider">Escrow Aktif</span>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Persentase Biaya Layanan</label>
                  <div className="flex items-center gap-6">
                     <input 
                       type="range" 
                       min="0" 
                       max="50" 
                       value={serviceFee}
                       onChange={(e) => setServiceFee(Number(e.target.value))}
                       className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-900"
                     />
                     <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          value={serviceFee}
                          onChange={(e) => setServiceFee(Math.max(0, Math.min(100, Number(e.target.value))))}
                          className="w-20 bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm font-black text-slate-800 text-center focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 outline-none transition-all"
                        />
                        <span className="font-bold text-slate-500 text-sm">%</span>
                     </div>
                  </div>
               </div>

               <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                     Biaya layanan dibebankan kepada pembeli pada saat checkout keranjang belanja. Nilai ini dihitung berdasarkan persentase dari total harga produk yang dipesan.
                  </p>
               </div>

               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="w-full bg-brand-900 hover:bg-black text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
               </button>
            </div>

            {/* Transaction Simulator */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-[32px] p-8 space-y-6 relative overflow-hidden flex flex-col justify-between shadow-xl">
               <div className="relative z-10 space-y-6">
                  <div>
                     <h4 className="font-black uppercase tracking-widest text-[10px] text-emerald-400">Simulator Transaksi</h4>
                     <p className="text-[10px] text-slate-400 font-medium mt-0.5">Uji dampak konfigurasi biaya layanan secara langsung.</p>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Simulasi Total Belanja</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                        <input 
                          type="text" 
                          value={simulationTotal}
                          onChange={(e) => setSimulationTotal(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="0"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-xs font-black text-white outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-white/5 text-[11px] font-medium text-slate-300">
                     <div className="flex justify-between items-center">
                        <span>Subtotal Produk</span>
                        <span className="font-bold text-white">Rp {simSubtotal.toLocaleString('id-ID')}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span>Ongkir (Estimasi)</span>
                        <span className="font-bold text-white">Rp {simOngkir.toLocaleString('id-ID')}</span>
                     </div>
                     <div className="flex justify-between items-center text-emerald-400">
                        <span>Biaya Layanan ({serviceFee}%)</span>
                        <span className="font-bold">Rp {simFee.toLocaleString('id-ID')}</span>
                     </div>
                     <div className="flex justify-between items-center border-t border-white/5 pt-2.5 text-xs font-black text-white uppercase">
                        <span>Total Transaksi</span>
                        <span className="text-sm font-black text-emerald-400 font-display">Rp {simTotal.toLocaleString('id-ID')}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-[10px]">
                     <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                        <p className="font-black text-slate-400 uppercase tracking-widest text-[8px] mb-0.5">DP Pembeli (30%)</p>
                        <p className="font-black text-white text-xs">Rp {simDP.toLocaleString('id-ID')}</p>
                     </div>
                     <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                        <p className="font-black text-slate-400 uppercase tracking-widest text-[8px] mb-0.5">Pelunasan (70%)</p>
                        <p className="font-black text-white text-xs">Rp {simPelunasan.toLocaleString('id-ID')}</p>
                     </div>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
            </div>
          </div>

          {/* BANK ACCOUNTS CONFIGURATION (CRUD) SECTION */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Daftar Rekening Bank Tujuan Transfer</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Atur nomor rekening escrow resmi yang dapat dilihat dan dipilih oleh pembeli saat checkout.</p>
              </div>
              <button 
                onClick={openAddBankModal}
                className="bg-brand-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border-0 cursor-pointer shadow-sm"
              >
                <Plus size={14} /> Tambah Rekening
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bankAccounts.map((acc) => (
                <div 
                  key={acc.id}
                  className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                    acc.isActive 
                      ? 'border-emerald-200 bg-emerald-50/5 shadow-sm shadow-emerald-500/5' 
                      : 'border-slate-100 bg-slate-50/30'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase text-slate-700 bg-white border border-slate-150 px-2 py-0.5 rounded shadow-2xs">
                        {acc.bankName}
                      </span>
                      <button 
                        onClick={() => toggleBankActive(acc.id)}
                        className={`text-[8px] font-black px-2 py-0.5 rounded-full border cursor-pointer ${
                          acc.isActive 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                      >
                        {acc.isActive ? 'AKTIF' : 'NON-AKTIF'}
                      </button>
                    </div>

                    <div>
                      <p className="text-base font-mono font-black text-slate-800 tracking-wider select-all">{acc.accountNumber}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 leading-none">Nomor Rekening</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-700 truncate">{acc.accountHolder}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 leading-none">Nama Pemilik Rekening</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-100/60 mt-4 shrink-0 justify-end">
                    <button 
                      onClick={() => openEditBankModal(acc)}
                      className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-slate-50 rounded-lg border-0 bg-transparent cursor-pointer transition-colors"
                      title="Edit Rekening"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={() => handleDeleteBankAccount(acc.id)}
                      className="p-2 text-slate-350 hover:text-red-500 hover:bg-slate-50 rounded-lg border-0 bg-transparent cursor-pointer transition-colors"
                      title="Hapus Rekening"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}

              {bankAccounts.length === 0 && (
                <div className="col-span-full py-10 text-center text-slate-400 font-bold uppercase tracking-wider">
                  Belum ada rekening bank yang didaftarkan. Harap tambahkan satu agar pembeli bisa melakukan pembayaran.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bank Account CRUD Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsBankModalOpen(false)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-[450px] overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-800 font-display">
                {editingBankAccount ? 'Edit Rekening Bank Escrow' : 'Tambah Rekening Bank Escrow'}
              </h3>
              <button 
                onClick={() => setIsBankModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-all border-0 bg-transparent cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBankSubmit} className="p-8 space-y-5">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nama Bank</label>
                <select 
                  value={formBankName}
                  onChange={(e) => setFormBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-650 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="BNI">BNI (Bank Negara Indonesia)</option>
                  <option value="BCA">BCA (Bank Central Asia)</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BRI">BRI (Bank Rakyat Indonesia)</option>
                  <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nomor Rekening</label>
                <input 
                  type="text" 
                  value={formAccountNumber} 
                  onChange={(e) => setFormAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Contoh: 1384354499"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-650 text-xs font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nama Pemilik Rekening (Atas Nama)</label>
                <input 
                  type="text" 
                  value={formAccountHolder} 
                  onChange={(e) => setFormAccountHolder(e.target.value)}
                  placeholder="Contoh: SRIWIJAYA DIGITAL INDONESIA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-650 text-xs font-semibold text-slate-800 uppercase"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  id="formIsActive"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-650 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer accent-emerald-650 shrink-0"
                />
                <label htmlFor="formIsActive" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  Setel Rekening Bank Sebagai Aktif
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all text-xs border-0 bg-transparent cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="bg-brand-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-950/10 transition-all text-xs border-0 cursor-pointer"
                >
                  {editingBankAccount ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
