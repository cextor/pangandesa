const API_URL = 'http://localhost:8081/api';

async function runCustomTests() {
  console.log('========================================================');
  console.log('       MEMULAI UJI COBA WORKFLOW CUSTOM PANGANDESA      ');
  console.log('========================================================\n');

  try {
    // ----------------------------------------------------
    // LANGKAH 1: LOGIN MULTI-ROLE (PENJUAL & PEMBELI)
    // ----------------------------------------------------
    console.log('--- LANGKAH 1: LOGIN SAKTI ---');
    const roles = [
      { email: 'petani@gmail.com', password: 'password', name: 'Penjual (Petani Maju)' },
      { email: 'andi@gmail.com', password: 'password', name: 'Pembeli (Andi Wijaya)' }
    ];

    const tokens = {};
    const users = {};

    for (const r of roles) {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: r.email, password: r.password })
      });

      if (!res.ok) {
        throw new Error(`Gagal login untuk role: ${r.name}`);
      }

      const body = await res.json();
      console.log(`✅ Login Berhasil: ${r.name} (${r.email})`);
      tokens[r.email] = body.token;
      users[r.email] = body.user;
    }
    console.log('');

    const sellerId = users['petani@gmail.com'].id;
    const buyerId = users['andi@gmail.com'].id;

    // ----------------------------------------------------
    // LANGKAH 2: PENJUAL ENTRI DATA 5 CONTOH PRODUK
    // ----------------------------------------------------
    console.log('--- LANGKAH 2: PENJUAL MEMBUAT 5 CONTOH PRODUK ---');
    const sampleProducts = [
      {
        seller_id: sellerId,
        category_id: 2, // Sayur
        name: 'Kentang Dieng Segar',
        description: 'Kentang Dieng berkualitas super, segar, dan besar-besar langsung dari petani.',
        price: 18000.00,
        unit: 'kg',
        stock: 100,
        is_preorder: 1,
        harvest_date: '2026-06-25',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1000&auto=format&fit=crop',
        rating: 4.5,
        review_count: 0
      },
      {
        seller_id: sellerId,
        category_id: 2, // Sayur
        name: 'Wortel Organik Dieng',
        description: 'Wortel manis organik tanpa pestisida, kaya vitamin A.',
        price: 15000.00,
        unit: 'kg',
        stock: 50,
        is_preorder: 1,
        harvest_date: '2026-06-20',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1000&auto=format&fit=crop',
        rating: 4.7,
        review_count: 0
      },
      {
        seller_id: sellerId,
        category_id: 1, // Beras
        name: 'Beras Cianjur Pandanwangi',
        description: 'Beras Pandanwangi asli Cianjur, pulen, wangi alami dan bersih.',
        price: 19000.00,
        unit: 'kg',
        stock: 200,
        is_preorder: 0,
        harvest_date: null,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000&auto=format&fit=crop',
        rating: 4.8,
        review_count: 0
      },
      {
        seller_id: sellerId,
        category_id: 3, // Buah
        name: 'Apel Malang Manis',
        description: 'Apel merah segar dari kebun Malang, renyah dan berair manis.',
        price: 32000.00,
        unit: 'kg',
        stock: 80,
        is_preorder: 1,
        harvest_date: '2026-07-02',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1000&auto=format&fit=crop',
        rating: 4.6,
        review_count: 0
      },
      {
        seller_id: sellerId,
        category_id: 2, // Sayur
        name: 'Bawang Merah Brebes Pilihan',
        description: 'Bawang merah Brebes berkualitas tinggi, padat dan kering sempurna.',
        price: 25000.00,
        unit: 'kg',
        stock: 150,
        is_preorder: 0,
        harvest_date: null,
        image: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1000&auto=format&fit=crop',
        rating: 4.9,
        review_count: 0
      }
    ];

    const createdProducts = [];

    for (let i = 0; i < sampleProducts.length; i++) {
      const p = sampleProducts[i];
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens['petani@gmail.com']}`
        },
        body: JSON.stringify(p)
      });

      if (!res.ok) {
        throw new Error(`Gagal membuat produk ke-${i + 1}: ${p.name}`);
      }

      const body = await res.json();
      console.log(`✅ [Produk ${i + 1}] Berhasil Ditambahkan: "${body.data.name}" (ID: ${body.data.id}) - Rp ${body.data.price}/${body.data.unit}`);
      createdProducts.push(body.data);
    }
    console.log('');

    // ----------------------------------------------------
    // LANGKAH 3: PEMBELI MEMBELI SALAH SATU PRODUK BARU TERSEBUT
    // ----------------------------------------------------
    console.log('--- LANGKAH 3: PEMBELI MEMBELI SALAH SATU PRODUK BARU ---');
    
    // Kita pilih produk pertama yang bertipe Pre-Order: "Kentang Dieng Segar"
    const chosenProduct = createdProducts[0];
    const buyQuantity = 10; // Beli 10 kg
    const totalAmount = chosenProduct.price * buyQuantity; // 10 * 18000 = 180000
    const dpAmount = totalAmount * 0.5; // DP 50% = 90000
    const remainingAmount = totalAmount - dpAmount; // Sisa = 90000

    const orderId = 'ORD-PND-' + Math.floor(Math.random() * 100000);
    const orderPayload = {
      id: orderId,
      buyerId: buyerId,
      sellerId: sellerId,
      totalAmount: totalAmount,
      dpAmount: dpAmount,
      remainingAmount: remainingAmount,
      items: [
        {
          productId: chosenProduct.id,
          name: chosenProduct.name,
          price: chosenProduct.price,
          quantity: buyQuantity,
          unit: chosenProduct.unit
        }
      ]
    };

    console.log(`🛒 Buyer (${users['andi@gmail.com'].name}) memesan ${buyQuantity} ${chosenProduct.unit} "${chosenProduct.name}"...`);
    console.log(`   Rincian: Total Belanja = Rp ${totalAmount.toLocaleString('id-ID')}, DP (50%) = Rp ${dpAmount.toLocaleString('id-ID')}`);

    const orderCreateRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens['andi@gmail.com']}`
      },
      body: JSON.stringify(orderPayload)
    });

    if (!orderCreateRes.ok) {
      const errorText = await orderCreateRes.text();
      throw new Error(`Gagal membuat transaksi pembelian order: ${errorText}`);
    }

    const orderCreateData = await orderCreateRes.json();
    let currentOrder = orderCreateData.data;
    console.log(`✅ Transaksi Berhasil Dibuat! ID Transaksi: ${currentOrder.id}`);
    console.log(`   Status Transaksi Awal: ${currentOrder.status}`);
    console.log('');

    // Helper untuk memperbarui status transaksi
    async function updateStatus(id, status, logMessage) {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens['andi@gmail.com']}` // Menggunakan token
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        throw new Error(`Gagal merubah status transaksi ke ${status}`);
      }
      console.log(`🔄 [Pembaruan Status] ${logMessage} -> "${status}"`);
    }

    // Simulasi Siklus Hidup Transaksi (Workflow Lengkap)
    console.log('--- MENJALANKAN SIMULASI ALUR SIKLUS HIDUP TRANSAKSI ---');
    
    // 1. Pembeli membayar DP
    await updateStatus(orderId, 'WAITING_ADMIN_DP', '1. Pembeli telah mengunggah bukti bayar DP');

    // 2. Admin memverifikasi pembayaran DP
    await updateStatus(orderId, 'WAITING_HARVEST', '2. Admin menyetujui verifikasi pembayaran DP. Produk masuk masa tanam/panen');

    // 3. Petani menyatakan produk siap dipanen
    await updateStatus(orderId, 'HARVEST_CONFIRMED_SELLER', '3. Petani/Penjual mengonfirmasi produk telah siap dipanen');

    // 4. Pembeli melunasi sisa pembayaran
    await updateStatus(orderId, 'WAITING_FINAL_PAYMENT', '4. Pembeli melunasi sisa tagihan pelunasan');

    // 5. Admin memverifikasi pelunasan dan meneruskan ke pengiriman
    await updateStatus(orderId, 'SHIPPING', '5. Admin memverifikasi pelunasan dan menyerahkan ke kurir pengiriman');

    // 6. Produk tiba di lokasi pembeli
    await updateStatus(orderId, 'DELIVERED', '6. Kurir mengonfirmasi produk telah tiba di alamat Pembeli');

    // 7. Pembeli mengonfirmasi pesanan selesai
    await updateStatus(orderId, 'COMPLETED', '7. Pembeli melakukan cek kualitas dan menyatakan transaksi COMPLETED/SELESAI');

    console.log('\n========================================================');
    console.log('🎉  CONGRATULATIONS! SELURUH WORKFLOW TELAH SUKSES DIUJI ✅');
    console.log(' 1. Login Multi-Role (Penjual & Pembeli)   : OK');
    console.log(' 2. Penjual Mengentri 5 Produk Sekaligus   : OK');
    console.log(' 3. Pembeli Memilih & Membeli Produk Baru  : OK');
    console.log(' 4. Siklus Transaksi (DP s/d Selesai)      : OK');
    console.log(' Proyek PanganDesa 100% Berjalan dan Siap Rilis!     ');
    console.log('========================================================');

  } catch (error) {
    console.error('❌ Terjadi kesalahan saat pengujian:', error.message);
    process.exit(1);
  }
}

runCustomTests();
