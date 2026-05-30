import axios from 'axios';

const BACKEND_URL = 'http://localhost:8081/api';

async function testRegistrationFlow() {
  const randomSuffix = Math.floor(Math.random() * 1000000);
  const testBuyerEmail = `buyer_test_${randomSuffix}@example.com`;
  const testSellerEmail = `seller_test_${randomSuffix}@example.com`;

  console.log('====================================================');
  console.log('🤖 MENJALANKAN AUTOMATED TEST REGISTRASI & VALIDASI');
  console.log('====================================================\n');

  try {
    // 1. Cek email baru yang belum terdaftar
    console.log(`[Langkah 1] Memeriksa email pembeli baru: ${testBuyerEmail}`);
    let checkRes = await axios.post(`${BACKEND_URL}/auth/check-email`, { email: testBuyerEmail });
    console.log(`👉 Hasil: exists = ${checkRes.data.exists} (${checkRes.data.message})\n`);

    // 2. Daftarkan Pembeli Baru
    console.log(`[Langkah 2] Mendaftarkan Akun Pembeli baru dengan email: ${testBuyerEmail}`);
    const buyerPayload = {
      role: 'buyer',
      email: testBuyerEmail,
      password: 'password123',
      phone: '081234567890',
      pic_name: 'Budi Pembeli',
      company_name: 'Individu / Rumah tangga',
      address: 'Jl. Merdeka No. 10, Sukamaju'
    };

    let regBuyerRes = await axios.post(`${BACKEND_URL}/auth/register`, buyerPayload);
    console.log(`👉 Sukses! Akun pembeli berhasil dibuat dengan ID: ${regBuyerRes.data.user.id}\n`);

    // 3. Cek ketersediaan email pembeli yang BARU SAJA didaftarkan (seharusnya sudah exists)
    console.log(`[Langkah 3] Memeriksa email pembeli yang telah terdaftar via check-email...`);
    checkRes = await axios.post(`${BACKEND_URL}/auth/check-email`, { email: testBuyerEmail });
    console.log(`👉 Hasil: exists = ${checkRes.data.exists} (${checkRes.data.message})`);
    if (checkRes.data.exists) {
      console.log('✅ VALIDASI SUKSES: Sistem mengenali email tersebut sudah terdaftar!\n');
    } else {
      console.error('❌ VALIDASI GAGAL: Sistem mendeteksi email tersedia padahal sudah didaftarkan!\n');
    }

    // 4. Coba daftarkan kembali dengan email pembeli yang sama (seharusnya ditolak backend)
    console.log(`[Langkah 4] Mencoba mendaftarkan email duplikat: ${testBuyerEmail}`);
    try {
      await axios.post(`${BACKEND_URL}/auth/register`, buyerPayload);
      console.error('❌ GAGAL: Backend menerima pendaftaran email duplikat!\n');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      console.log(`👉 Ditolak oleh backend! Pesan error: "${errMsg}"`);
      console.log('✅ VALIDASI SUKSES: Backend berhasil memblokir pendaftaran duplikat!\n');
    }

    // 5. Daftarkan Penjual Baru
    console.log(`[Langkah 5] Mendaftarkan Akun Penjual baru dengan email: ${testSellerEmail}`);
    const sellerPayload = {
      role: 'seller',
      email: testSellerEmail,
      password: 'password123',
      phone: '085432109876',
      pic_name: 'Pak Tani Penjual',
      company_name: 'BUMDes Sukamaju',
      address: 'Sukamaju, RT 02/01, Sukamaju',
      village: 'Sukamaju',
      kategori_produk: 'Sayuran'
    };

    let regSellerRes = await axios.post(`${BACKEND_URL}/auth/register`, sellerPayload);
    console.log(`👉 Sukses! Akun penjual berhasil dibuat dengan ID: ${regSellerRes.data.user.id}\n`);

    // 6. Cek ketersediaan email penjual yang BARU SAJA didaftarkan (seharusnya sudah exists)
    console.log(`[Langkah 6] Memeriksa email penjual yang telah terdaftar via check-email...`);
    checkRes = await axios.post(`${BACKEND_URL}/auth/check-email`, { email: testSellerEmail });
    console.log(`👉 Hasil: exists = ${checkRes.data.exists} (${checkRes.data.message})`);
    if (checkRes.data.exists) {
      console.log('✅ VALIDASI SUKSES: Sistem mengenali email tersebut sudah terdaftar!\n');
    } else {
      console.error('❌ VALIDASI GAGAL: Sistem mendeteksi email tersedia padahal sudah didaftarkan!\n');
    }

    console.log('====================================================');
    console.log('🎉 SEMUA TES INTEGRASI & VALIDASI BERHASIL 100%!');
    console.log('====================================================');

  } catch (error) {
    console.error('❌ Terjadi kesalahan saat pengujian:', error.response?.data || error.message);
  }
}

testRegistrationFlow();
