import React from 'react';
import { Fingerprint, ShieldAlert, Key, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface PinManagementProps {
  onBack: () => void;
}

export default function PinManagementPage({ onBack }: PinManagementProps) {
  const [pin, setPin] = React.useState(['', '', '', '', '', '']);
  const [step, setStep] = React.useState<'current' | 'new' | 'confirm' | 'success'>('new'); // simplify for demo

  const handleInput = (idx: number, val: string) => {
    if (val.length > 1) return;
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    
    // Auto focus next
    if (val && idx < 5) {
      const next = document.getElementById(`pin-${idx + 1}`);
      next?.focus();
    }
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
           <button 
             onClick={onBack}
             className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white rounded-xl md:rounded-2xl transition-all text-slate-400 hover:text-slate-800 border border-slate-100 bg-white/50 shadow-sm"
           >
             <ChevronLeft size={20} className="md:w-6 md:h-6" />
           </button>
           <h1 className="text-xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight">PIN Keamanan</h1>
        </div>

        {step === 'success' ? (
           <div className="bg-white p-8 md:p-16 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm text-center flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-50 text-emerald-600 rounded-[32px] md:rounded-[40px] flex items-center justify-center mb-6 md:mb-8 border-4 border-emerald-100">
                 <CheckCircle2 size={40} className="md:w-12 md:h-12" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">PIN Berhasil Disimpan</h2>
              <p className="text-slate-400 text-xs font-medium mb-8 md:mb-10 leading-relaxed uppercase tracking-widest px-4">Gunakan PIN ini untuk setiap transaksi di PanganDesa.</p>
              <button 
                onClick={onBack}
                className="w-full bg-brand-900 text-white py-4 md:py-5 rounded-xl md:rounded-[24px] text-xs md:text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-900/20 hover:bg-black active:scale-95 transition-all"
              >
                Selesai
              </button>
           </div>
        ) : (
          <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm space-y-8 md:space-y-12">
             <div className="text-center space-y-3 md:space-y-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-[24px] md:rounded-[32px] flex items-center justify-center mx-auto text-slate-400 border border-slate-100 shadow-inner">
                   <Key size={24} className="md:w-8 md:h-8" />
                </div>
                <div>
                   <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">
                      {step === 'new' ? 'Buat PIN Baru' : 'Konfirmasi PIN Baru'}
                   </h3>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Masukkan 6 digit angka rahasia Anda</p>
                </div>
             </div>

             <div className="flex justify-center gap-2 md:gap-3">
                {pin.map((digit, idx) => (
                  <input 
                    key={idx}
                    id={`pin-${idx}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInput(idx, e.target.value)}
                    className="w-10 h-14 md:w-14 md:h-20 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl text-center text-2xl md:text-3xl font-black focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/5 outline-none transition-all shadow-inner"
                  />
                ))}
             </div>

             <div className="space-y-4 md:space-y-6">
                <button 
                  onClick={() => setStep('confirm')}
                  className={`w-full py-4 md:py-5 rounded-xl md:rounded-[24px] text-xs md:text-sm font-black uppercase tracking-widest transition-all ${
                     pin.every(d => d !== '') 
                      ? 'bg-brand-900 text-white shadow-xl shadow-brand-900/20 active:scale-95' 
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                   Lanjutkan
                </button>
                
                <div className="bg-orange-50 p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-orange-100 flex gap-3 md:gap-4 items-start">
                   <ShieldAlert className="text-orange-500 shrink-0 mt-0.5" size={18} />
                   <p className="text-[9px] md:text-[10px] font-bold text-orange-700 uppercase tracking-widest leading-relaxed">
                      Waspada Penipuan! PanganDesa tidak pernah meminta PIN Anda melalui telepon atau media sosial.
                   </p>
                </div>
             </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 md:gap-4 py-4 md:py-8">
           <Fingerprint className="text-slate-200" size={40} />
           <p className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Hardware Secured with AES-256</p>
        </div>
      </div>
    </div>
  );
}
