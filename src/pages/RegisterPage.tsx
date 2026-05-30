import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  
  // Form fields state
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  
  // Buyer profile fields
  const [jenisPembeli, setJenisPembeli] = useState('');
  const [kotaPembeli, setKotaPembeli] = useState('');
  const [kecamatanPembeli, setKecamatanPembeli] = useState('');
  const [alamatKirim, setAlamatKirim] = useState('');

  // Seller profile fields
  const [jenisPenjual, setJenisPenjual] = useState('');
  const [namaUsaha, setNamaUsaha] = useState('');
  const [desa, setDesa] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kabupaten, setKabupaten] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [kategoriProduk, setKategoriProduk] = useState('');

  // Checkbox agreement
  const [agree, setAgree] = useState(false);

  // Visibility toggles
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  // Real-time strength messages
  const [pwMsg, setPwMsg] = useState('');
  const [pwMsgClass, setPwMsgClass] = useState('msg bad');
  const [pw2Err, setPw2Err] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [hpErr, setHpErr] = useState(false);

  // Submission statuses
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);
  const [successText, setSuccessText] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');

  // Error markers for individual fields (for styling border red)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hpRe = /^(\+62|62|0)8[0-9]{7,12}$/;

  const [emailTaken, setEmailTaken] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);

  const checkEmailAvailability = async (emailVal: string) => {
    if (!emailVal || !emailRe.test(emailVal.trim())) {
      setEmailTaken(false);
      return;
    }
    
    setEmailChecking(true);
    try {
      const res = await AuthService.checkEmail(emailVal.trim());
      if (res.exists) {
        setEmailTaken(true);
        setFieldErrors(prev => ({ ...prev, email: true }));
      } else {
        setEmailTaken(false);
        setFieldErrors(prev => ({ ...prev, email: false }));
      }
    } catch (err) {
      console.error('Error checking email availability:', err);
    } finally {
      setEmailChecking(false);
    }
  };

  // Load Google Fonts
  useEffect(() => {
    const link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://fonts.googleapis.com';
    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    const link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
    
    document.head.appendChild(link1);
    document.head.appendChild(link2);
    document.head.appendChild(link3);
    
    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
      document.head.removeChild(link3);
    };
  }, []);

  // Real-time strength check
  useEffect(() => {
    if (!pw) {
      setPwMsg('');
      return;
    }
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const txt = ['Sangat lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat kuat'][score];
    setPwMsg('Kekuatan sandi: ' + txt);
    setPwMsgClass(score >= 2 ? 'msg good' : 'msg bad');
  }, [pw]);

  const setRoleAndReset = (r: 'buyer' | 'seller') => {
    setRole(r);
    setRegSuccess(false);
    setErrorMsg('');
    setFieldErrors({});
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    let ok = true;
    const errorsMap: { [key: string]: boolean } = {};

    // Determine required fields
    const required = ['nama', 'email', 'hp', 'pw', 'pw2'];
    if (role === 'buyer') {
      required.push('jenisPembeli', 'kotaPembeli');
    } else {
      required.push('jenisPenjual', 'namaUsaha', 'desa', 'kecamatan', 'kabupaten', 'provinsi', 'kategoriProduk');
    }

    // Verify empty values
    required.forEach(f => {
      let value = '';
      if (f === 'nama') value = nama;
      else if (f === 'email') value = email;
      else if (f === 'hp') value = hp;
      else if (f === 'pw') value = pw;
      else if (f === 'pw2') value = pw2;
      else if (f === 'jenisPembeli') value = jenisPembeli;
      else if (f === 'kotaPembeli') value = kotaPembeli;
      else if (f === 'jenisPenjual') value = jenisPenjual;
      else if (f === 'namaUsaha') value = namaUsaha;
      else if (f === 'desa') value = desa;
      else if (f === 'kecamatan') value = kecamatan;
      else if (f === 'kabupaten') value = kabupaten;
      else if (f === 'provinsi') value = provinsi;
      else if (f === 'kategoriProduk') value = kategoriProduk;

      if (!value.trim()) {
        errorsMap[f] = true;
        ok = false;
      }
    });

    // Validasi format email
    const emBad = email && !emailRe.test(email.trim());
    setEmailErr(!!emBad);
    if (emBad) {
      errorsMap['email'] = true;
      ok = false;
    }

    // Validasi format HP
    const cleanHp = hp.replace(/[^\d+]/g, '');
    const hpBad = hp && !hpRe.test(cleanHp);
    setHpErr(!!hpBad);
    if (hpBad) {
      errorsMap['hp'] = true;
      ok = false;
    }

    // Validasi password length
    const pwShort = pw && pw.length < 8;
    if (pwShort) {
      setPwMsg('Sandi minimal 8 karakter');
      setPwMsgClass('msg bad');
      errorsMap['pw'] = true;
      ok = false;
    }

    // Validasi match password
    const mism = pw && pw2 && pw !== pw2;
    setPw2Err(!!mism);
    if (mism) {
      errorsMap['pw2'] = true;
      ok = false;
    }

    setFieldErrors(errorsMap);

    // Terms agreement validation
    if (!agree) {
      alert('Mohon setujui Syarat & Ketentuan untuk melanjutkan.');
      return;
    }

    if (!ok) {
      setErrorMsg('Pendaftaran gagal. Harap periksa kembali isian formulir Anda.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const emailAvailability = await AuthService.checkEmail(email.trim());
      if (emailAvailability.exists) {
        setEmailTaken(true);
        setFieldErrors(prev => ({ ...prev, email: true }));
        setErrorMsg('Alamat email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk ke akun Anda.');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error('Error validating email availability during submit:', err);
    }

    try {
      // Build dynamic combined address to store in database
      const buyerAddressStr = role === 'buyer' 
        ? `${alamatKirim || ''}, Kec. ${kecamatanPembeli || ''}, ${kotaPembeli || ''}`.replace(/^,\s*|\s*,\s*$/g, '') 
        : `${desa || ''}, Kec. ${kecamatan || ''}, ${kabupaten || ''}, ${provinsi || ''}`.replace(/^,\s*|\s*,\s*$/g, '');

      const payload = {
        role,
        email: email.trim(),
        password: pw,
        phone: cleanHp,
        pic_name: nama.trim(),
        company_name: role === 'buyer' ? jenisPembeli : namaUsaha.trim(),
        address: buyerAddressStr,
        village: role === 'seller' ? desa.trim() : undefined,
        kategori_produk: role === 'seller' ? kategoriProduk : undefined,
      };

      const res = await register(payload);
      
      // Construct exact output preview like user's HTML
      const outputData = {
        _meta: {
          platform: 'PanganDesa',
          situs: 'pangandesa.com',
          peran: role === 'buyer' ? 'Pembeli' : 'Penjual',
          waktu_daftar: new Date().toLocaleString('id-ID')
        },
        akun: {
          nama: nama.trim(),
          email: email.trim(),
          hp_whatsapp: cleanHp
        },
        ...(role === 'buyer' ? {
          profil_pembeli: {
            jenis: jenisPembeli,
            kota: kotaPembeli.trim(),
            kecamatan: kecamatanPembeli.trim(),
            alamat_pengiriman: alamatKirim.trim()
          }
        } : {
          profil_penjual: {
            jenis: jenisPenjual,
            nama_usaha: namaUsaha.trim(),
            desa: desa.trim(),
            kecamatan: kecamatan.trim(),
            kabupaten: kabupaten.trim(),
            provinsi: provinsi.trim(),
            kategori_produk_utama: kategoriProduk,
            status: 'Menunggu verifikasi'
          }
        })
      };

      setSuccessText(role === 'buyer'
        ? 'Akun pembeli siap dibuat. Silakan tunggu pengalihan otomatis atau masuk langsung.'
        : 'Akun penjual didaftarkan. Tim PangaDesa akan memverifikasi sebelum Anda mulai berjualan.'
      );
      
      setJsonOutput(JSON.stringify(outputData, null, 2));
      setRegSuccess(true);
      
      setTimeout(() => {
        navigate(`/${role}`);
      }, 5000);

    } catch (err: any) {
      console.error(err);
      if (err.response) {
        const msg = err.response.data?.message || err.response.data?.messages?.email || '';
        if (msg.toLowerCase().includes('terdaftar') || msg.toLowerCase().includes('already') || msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('exist')) {
          setErrorMsg('Alamat email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk ke akun Anda.');
          setFieldErrors(prev => ({ ...prev, email: true }));
        } else {
          setErrorMsg(msg || 'Pendaftaran gagal. Email sudah terdaftar.');
        }
      } else {
        setErrorMsg('Tidak dapat menghubungi server. Pastikan koneksi dan backend menyala.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daftar-${role === 'buyer' ? 'buyer' : 'seller'}-pangandesa.json`;
    a.click();
  };

  const handleCopy = async () => {
    if (!jsonOutput) return;
    try {
      await navigator.clipboard.writeText(jsonOutput);
      alert('Berhasil menyalin data JSON!');
    } catch {
      alert('Salin manual dari kotak data yang tersedia.');
    }
  };

  return (
    <div className="register-root-custom">
      <div className="wrap">
        <div className="brand">
          <div className="logo">🌾 PanganDesa</div>
          <div className="url">pangandesa.com</div>
        </div>

        <div className="card">
          <h1>Buat Akun</h1>
          <p className="lead">Bergabung dengan PangaDesa untuk membeli atau menjual hasil pangan desa.</p>

          <div className="toggle">
            <button 
              type="button" 
              className={role === 'buyer' ? 'active' : ''} 
              onClick={() => setRoleAndReset('buyer')}
            >
              Pembeli<small>Membeli hasil pangan</small>
            </button>
            <button 
              type="button" 
              className={role === 'seller' ? 'active' : ''} 
              onClick={() => setRoleAndReset('seller')}
            >
              Penjual<small>BUMDes / petani / UMKM</small>
            </button>
          </div>

          {errorMsg && (
            <div className="msg bad" style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '15px' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} noValidate>
            {/* Common fields */}
            <div className="field">
              <label>
                {role === 'buyer' ? 'Nama lengkap' : 'Nama penanggung jawab'}{' '}
                <span className="req">*</span>
              </label>
              <input 
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className={fieldErrors['nama'] ? 'err' : ''}
                required
              />
            </div>
            
            <div className="row">
              <div className="field">
                <label>Email <span className="req">*</span></label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailTaken) {
                      setEmailTaken(false);
                      setFieldErrors(prev => ({ ...prev, email: false }));
                    }
                  }}
                  onBlur={(e) => checkEmailAvailability(e.target.value)}
                  className={(fieldErrors['email'] || emailTaken) ? 'err' : ''}
                  required
                />
                {emailChecking && <div className="msg" style={{ color: '#6b7167', fontSize: '12px' }}>🔄 Memeriksa ketersediaan email...</div>}
                {emailTaken && <div className="msg bad" style={{ fontWeight: '500' }}>⚠️ Alamat email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk ke akun Anda.</div>}
                {emailErr && <div className="msg bad">Format email tidak valid</div>}
              </div>
              
              <div className="field">
                <label>No. HP / WhatsApp <span className="req">*</span></label>
                <input 
                  type="tel" 
                  placeholder="08xxxxxxxxxx"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  className={fieldErrors['hp'] ? 'err' : ''}
                  required
                />
                {hpErr && <div className="msg bad">Nomor HP tidak valid</div>}
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Kata sandi <span className="req">*</span></label>
                <div className="pw-wrap">
                  <input 
                    type={showPw1 ? 'text' : 'password'}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    className={fieldErrors['pw'] ? 'err' : ''}
                    required
                  />
                  <button 
                    type="button" 
                    className="pw-toggle" 
                    onClick={() => setShowPw1(!showPw1)}
                  >
                    {showPw1 ? 'Sembunyikan' : 'Lihat'}
                  </button>
                </div>
                {pwMsg && <div className={pwMsgClass}>{pwMsg}</div>}
              </div>
              
              <div className="field">
                <label>Ulangi sandi <span className="req">*</span></label>
                <div className="pw-wrap">
                  <input 
                    type={showPw2 ? 'text' : 'password'}
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    className={fieldErrors['pw2'] ? 'err' : ''}
                    required
                  />
                  <button 
                    type="button" 
                    className="pw-toggle" 
                    onClick={() => setShowPw2(!showPw2)}
                  >
                    {showPw2 ? 'Sembunyikan' : 'Lihat'}
                  </button>
                </div>
                {pw2Err && <div className="msg bad">Sandi tidak cocok</div>}
              </div>
            </div>

            {/* ===== BUYER FIELDS ===== */}
            {role === 'buyer' && (
              <div className="buyer-fields-section">
                <div className="group-title">Profil Pembeli</div>
                <div className="field">
                  <label>Jenis pembeli <span className="req">*</span></label>
                  <select 
                    value={jenisPembeli} 
                    onChange={(e) => setJenisPembeli(e.target.value)}
                    className={fieldErrors['jenisPembeli'] ? 'err' : ''}
                  >
                    <option value="">Pilih…</option>
                    <option>Individu / Rumah tangga</option>
                    <option>Warung / Toko kelontong</option>
                    <option>Restoran / Katering</option>
                    <option>Pedagang / Reseller</option>
                    <option>Instansi / Lembaga</option>
                  </select>
                </div>
                <div className="row">
                  <div className="field">
                    <label>Kota / Kabupaten <span className="req">*</span></label>
                    <input 
                      value={kotaPembeli} 
                      onChange={(e) => setKotaPembeli(e.target.value)}
                      className={fieldErrors['kotaPembeli'] ? 'err' : ''}
                    />
                  </div>
                  <div className="field">
                    <label>Kecamatan</label>
                    <input 
                      value={kecamatanPembeli} 
                      onChange={(e) => setKecamatanPembeli(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Alamat pengiriman</label>
                  <input 
                    placeholder="Jalan, RT/RW, patokan"
                    value={alamatKirim}
                    onChange={(e) => setAlamatKirim(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ===== SELLER FIELDS ===== */}
            {role === 'seller' && (
              <div className="seller-fields-section">
                <div className="group-title">Profil Penjual</div>
                <div className="field">
                  <label>Jenis penjual <span className="req">*</span></label>
                  <select 
                    value={jenisPenjual} 
                    onChange={(e) => setJenisPenjual(e.target.value)}
                    className={fieldErrors['jenisPenjual'] ? 'err' : ''}
                  >
                    <option value="">Pilih…</option>
                    <option>BUMDes</option>
                    <option>Petani perorangan</option>
                    <option>Kelompok tani / Gapoktan</option>
                    <option>UMKM pangan</option>
                    <option>Peternak / Pembudidaya ikan</option>
                  </select>
                </div>
                <div className="field">
                  <label>Nama usaha / BUMDes <span className="req">*</span></label>
                  <input 
                    placeholder="Contoh: BUMDes Maju Bersama"
                    value={namaUsaha}
                    onChange={(e) => setNamaUsaha(e.target.value)}
                    className={fieldErrors['namaUsaha'] ? 'err' : ''}
                  />
                </div>
                <div className="row">
                  <div className="field">
                    <label>Desa <span className="req">*</span></label>
                    <input 
                      value={desa} 
                      onChange={(e) => setDesa(e.target.value)}
                      className={fieldErrors['desa'] ? 'err' : ''}
                    />
                  </div>
                  <div className="field">
                    <label>Kecamatan <span className="req">*</span></label>
                    <input 
                      value={kecamatan} 
                      onChange={(e) => setKecamatan(e.target.value)}
                      className={fieldErrors['kecamatan'] ? 'err' : ''}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="field">
                    <label>Kabupaten / Kota <span className="req">*</span></label>
                    <input 
                      value={kabupaten} 
                      onChange={(e) => setKabupaten(e.target.value)}
                      className={fieldErrors['kabupaten'] ? 'err' : ''}
                    />
                  </div>
                  <div className="field">
                    <label>Provinsi <span className="req">*</span></label>
                    <input 
                      value={provinsi} 
                      onChange={(e) => setProvinsi(e.target.value)}
                      className={fieldErrors['provinsi'] ? 'err' : ''}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Kategori produk utama <span className="req">*</span></label>
                  <select 
                    value={kategoriProduk} 
                    onChange={(e) => setKategoriProduk(e.target.value)}
                    className={fieldErrors['kategoriProduk'] ? 'err' : ''}
                  >
                    <option value="">Pilih…</option>
                    <option>Sayuran</option>
                    <option>Buah-buahan</option>
                    <option>Beras / Padi</option>
                    <option>Palawija</option>
                    <option>Umbi-umbian</option>
                    <option>Rempah & bumbu</option>
                    <option>Hasil ternak</option>
                    <option>Hasil perikanan</option>
                    <option>Pangan olahan</option>
                    <option>Lainnya</option>
                  </select>
                  <div className="hint">Detail produk lengkap diisi setelah akun diverifikasi (Form Pendataan Mitra).</div>
                </div>
              </div>
            )}

            <label className="terms">
              <input 
                type="checkbox" 
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>Saya menyetujui <a href="#">Syarat &amp; Ketentuan</a> serta <a href="#">Kebijakan Privasi</a> PangaDesa.</span>
            </label>

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading 
                ? 'Sedang Mendaftarkan...' 
                : role === 'buyer' 
                  ? 'Daftar sebagai Pembeli' 
                  : 'Daftar sebagai Penjual'
              }
            </button>
            <p className="signin">Sudah punya akun? <a href="#" onClick={() => navigate('/login')}>Masuk di sini</a></p>
          </form>

          {regSuccess && (
            <div className="result show" id="result">
              <div className="success">
                <h3>✓ Pendaftaran berhasil dibuat</h3>
                <p id="successText">{successText}</p>
              </div>
              <pre id="output">{jsonOutput}</pre>
              <div className="mini">
                <button type="button" className="solid" onClick={handleDownload}>⬇ Unduh data (.json)</button>
                <button type="button" onClick={handleCopy}>Salin</button>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        .register-root-custom {
          width: 100%;
          min-height: 100vh;
          background: #f7f3e8;
          color: #22271f;
          line-height: 1.55;
          background-image: radial-gradient(circle at 1px 1px, rgba(47,90,63,.06) 1px, transparent 0);
          background-size: 22px 22px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          padding: 30px 10px;
        }
        .register-root-custom .wrap {
          max-width: 560px;
          margin: 0 auto;
          padding: 30px 18px 70px;
        }
        .register-root-custom .brand {
          text-align: center;
          margin-bottom: 18px;
        }
        .register-root-custom .brand .logo {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 26px;
          color: #2f5a3f;
        }
        .register-root-custom .brand .url {
          font-size: 13px;
          color: #6b7167;
          letter-spacing: .04em;
        }
        .register-root-custom .card {
          background: #fffdf7;
          border: 1px solid #d8d3c2;
          border-radius: 20px;
          padding: 28px 26px 30px;
          box-shadow: 0 1px 2px rgba(29,58,42,.06), 0 10px 34px rgba(29,58,42,.10);
        }
        .register-root-custom h1 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 24px;
          margin-bottom: 4px;
          color: #1d3a2a;
        }
        .register-root-custom .lead {
          font-size: 14px;
          color: #6b7167;
          margin-bottom: 20px;
        }
        .register-root-custom .toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          background: #e3ede4;
          padding: 6px;
          border-radius: 14px;
          margin-bottom: 24px;
        }
        .register-root-custom .toggle button {
          font-family: inherit;
          font-size: 15px;
          font-weight: 600;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: #2f5a3f;
          cursor: pointer;
          transition: .18s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          line-height: 1.25;
        }
        .register-root-custom .toggle button small {
          font-weight: 400;
          font-size: 11.5px;
          opacity: .75;
        }
        .register-root-custom .toggle button.active {
          background: #2f5a3f;
          color: #fff;
          box-shadow: 0 4px 12px rgba(47,90,63,.25);
        }
        .register-root-custom .toggle button.active small {
          opacity: .85;
        }
        .register-root-custom .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 15px;
          text-align: left;
        }
        .register-root-custom label {
          font-size: 13.5px;
          font-weight: 600;
          color: #1d3a2a;
        }
        .register-root-custom label .req {
          color: #c4622d;
        }
        .register-root-custom .hint {
          font-size: 12px;
          color: #6b7167;
          font-weight: 400;
          margin-top: 4px;
        }
        .register-root-custom input, .register-root-custom select {
          font-family: inherit;
          font-size: 14.5px;
          color: #22271f;
          background: #fff;
          border: 1px solid #d8d3c2;
          border-radius: 10px;
          padding: 11px 13px;
          width: 100%;
          transition: .15s;
        }
        .register-root-custom input:focus, .register-root-custom select:focus {
          outline: none;
          border-color: #4a7c59;
          box-shadow: 0 0 0 3px rgba(74,124,89,.15);
        }
        .register-root-custom select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath fill='%236b7167' d='M6 8 0 0h12z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 34px;
        }
        .register-root-custom .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }
        .register-root-custom .pw-wrap {
          position: relative;
        }
        .register-root-custom .pw-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
          color: #2f5a3f;
          font-weight: 600;
          padding: 4px;
        }
        .register-root-custom .msg {
          font-size: 12px;
          margin-top: 2px;
        }
        .register-root-custom .msg.bad {
          color: #b3402f;
        }
        .register-root-custom .msg.good {
          color: #3f7d4f;
        }
        .register-root-custom .err {
          border-color: #b3402f !important;
          box-shadow: 0 0 0 3px rgba(179,64,47,.12) !important;
        }
        .register-root-custom .group-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #4a7c59;
          margin: 22px 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px dashed #d8d3c2;
          text-align: left;
        }
        .register-root-custom .terms {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin: 18px 0 4px;
          font-size: 13px;
          color: #6b7167;
        }
        .register-root-custom .terms input {
          width: auto;
          margin-top: 3px;
          accent-color: #2f5a3f;
        }
        .register-root-custom .terms a {
          color: #2f5a3f;
          font-weight: 600;
        }
        .register-root-custom .btn {
          width: 100%;
          font-family: inherit;
          font-size: 15.5px;
          font-weight: 600;
          padding: 15px;
          border: none;
          border-radius: 12px;
          background: #c4622d;
          color: #fff;
          cursor: pointer;
          transition: .15s;
          margin-top: 16px;
        }
        .register-root-custom .btn:hover {
          background: #a8521f;
        }
        .register-root-custom .signin {
          text-align: center;
          font-size: 13.5px;
          color: #6b7167;
          margin-top: 16px;
        }
        .register-root-custom .signin a {
          color: #2f5a3f;
          font-weight: 600;
          cursor: pointer;
        }
        .register-root-custom .result {
          display: none;
          margin-top: 18px;
          text-align: left;
        }
        .register-root-custom .result.show {
          display: block;
          animation: rise .35s ease;
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        .register-root-custom .success {
          background: #e3ede4;
          border: 1px solid #4a7c59;
          border-radius: 14px;
          padding: 18px;
        }
        .register-root-custom .success h3 {
          font-family: 'Fraunces', serif;
          color: #2f5a3f;
          font-size: 18px;
          margin-bottom: 4px;
        }
        .register-root-custom .success p {
          font-size: 13.5px;
          color: #1d3a2a;
        }
        .register-root-custom pre {
          background: #1d3a2a;
          color: #e8f0e9;
          padding: 16px;
          border-radius: 12px;
          font-size: 12px;
          overflow-x: auto;
          font-family: ui-monospace, monospace;
          margin-top: 12px;
          max-height: 280px;
        }
        .register-root-custom .mini {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }
        .register-root-custom .mini button {
          flex: 1;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 600;
          padding: 11px;
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid #d8d3c2;
          background: #fff;
          color: #1d3a2a;
        }
        .register-root-custom .mini button.solid {
          background: #2f5a3f;
          color: #fff;
          border-color: #2f5a3f;
        }
        @media(max-width: 480px) {
          .register-root-custom .row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
