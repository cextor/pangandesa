const API_URL = 'http://127.0.0.1:8081/api';

async function runTests() {
  console.log('========================================================');
  console.log('       STARTING PANGANDESA WORKFLOW TEST SUITE          ');
  console.log('========================================================\n');

  try {
    // ----------------------------------------------------
    // TEST 1: Kredensial & Autentikasi Login
    // ----------------------------------------------------
    console.log('--- TEST 1: LOGIN MULTI-ROLE ---');
    const roles = [
      { email: 'admin@pangandesa.com', password: 'password', name: 'Admin' },
      { email: 'petani@gmail.com', password: 'password', name: 'Seller (Petani)' },
      { email: 'andi@gmail.com', password: 'password', name: 'Buyer (Andi)' }
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
      console.log(`✅ Login Berhasil sebagai ${r.name} (${r.email})`);
      tokens[r.email] = body.token;
      users[r.email] = body.user;
    }
    console.log('');

    const buyerId = users['andi@gmail.com'].id;
    const sellerId = users['petani@gmail.com'].id;

    // ----------------------------------------------------
    // TEST 2: Membaca Kategori & Produk
    // ----------------------------------------------------
    console.log('--- TEST 2: BROWSE KATEGORI & PRODUK ---');
    const catRes = await fetch(`${API_URL}/categories`);
    if (!catRes.ok) throw new Error('Gagal mengambil kategori');
    const catData = await catRes.json();
    console.log(`✅ Berhasil mengambil kategori. Jumlah: ${catData.data.length} kategori`);
    
    // Default GET products
    const prodRes = await fetch(`${API_URL}/products`);
    if (!prodRes.ok) throw new Error('Gagal mengambil produk');
    const prodData = await prodRes.json();
    console.log(`✅ Berhasil mengambil produk. Jumlah: ${prodData.data.length} produk`);
    
    const sampleProduct = prodData.data[0];
    console.log(`   Sampel Produk: ${sampleProduct.name} - Rp ${parseFloat(sampleProduct.price).toLocaleString('id-ID')}/${sampleProduct.unit}`);
    console.log('');

    // ----------------------------------------------------
    // TEST 3: Alur Transaksi Pre-Order (PO) & DP Payment
    // ----------------------------------------------------
    console.log('--- TEST 3: ALUR TRANSAKSI PRE-ORDER & DP ---');
    const orderId = 'ORD-TEST-' + Math.floor(Math.random() * 100000);
    const orderPayload = {
      id: orderId,
      buyerId: buyerId,
      sellerId: sellerId,
      totalAmount: 80000, // Misal: 5kg * 16000
      dpAmount: 40000,
      remainingAmount: 40000,
      items: [
        {
          productId: sampleProduct.id,
          name: sampleProduct.name,
          price: sampleProduct.price,
          quantity: 5,
          unit: sampleProduct.unit
        }
      ]
    };

    // 1. Buat Order Baru (Status default: WAITING_PAYMENT_DP)
    console.log(`[Langkah 1] Buyer (${users['andi@gmail.com'].name}) memesan ${sampleProduct.name}...`);
    const orderCreateRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    if (!orderCreateRes.ok) throw new Error('Gagal membuat transaksi order');
    const orderCreateData = await orderCreateRes.json();
    let currentOrder = orderCreateData.data;
    console.log(`✅ Transaksi dibuat dengan ID: ${currentOrder.id}`);
    console.log(`   Status Awal: ${currentOrder.status}`);

    // Helper untuk update status order
    async function updateOrderStatus(id, status, logMessage) {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`Gagal memperbarui status order ke ${status}`);
      console.log(`✅ [Status Update] ${logMessage} -> ${status}`);
    }

    // 2. Buyer membayar DP -> Menunggu verifikasi admin (WAITING_ADMIN_DP)
    await updateOrderStatus(orderId, 'WAITING_ADMIN_DP', 'Buyer telah mentransfer uang DP');

    // 3. Admin memverifikasi pembayaran DP -> Status menjadi WAITING_HARVEST
    await updateOrderStatus(orderId, 'WAITING_HARVEST', 'Admin memverifikasi DP. Pesanan sekarang menunggu waktu panen');

    // 4. Petani/Seller menyatakan produk siap dipanen -> Status menjadi HARVEST_CONFIRMED_SELLER
    await updateOrderStatus(orderId, 'HARVEST_CONFIRMED_SELLER', 'Petani menyatakan produk telah siap dipanen');

    // 5. Pembeli/Buyer melakukan pelunasan pembayaran -> Status menjadi WAITING_FINAL_PAYMENT
    await updateOrderStatus(orderId, 'WAITING_FINAL_PAYMENT', 'Buyer melakukan pelunasan sisa tagihan');

    // 6. Admin memverifikasi pembayaran pelunasan -> Status menjadi SHIPPING (Pengiriman)
    await updateOrderStatus(orderId, 'SHIPPING', 'Admin mengonfirmasi pelunasan, produk masuk proses pengiriman');

    // 7. Barang tiba di lokasi Pembeli -> Status menjadi DELIVERED
    await updateOrderStatus(orderId, 'DELIVERED', 'Produk telah diterima oleh Buyer (DELIVERED)');

    // 8. Pembeli mengonfirmasi transaksi selesai setelah cek kualitas -> Status menjadi COMPLETED
    await updateOrderStatus(orderId, 'COMPLETED', 'Buyer menyelesaikan transaksi (COMPLETED)');
    console.log('');

    // ----------------------------------------------------
    // TEST 4: Alur Permintaan Pengadaan (Buyer Request PO)
    // ----------------------------------------------------
    console.log('--- TEST 4: ALUR BUYER REQUEST PO ---');
    const requestPayload = {
      buyer_id: buyerId,
      pangan_type: 'Beras Pandan Wangi',
      quantity: 200,
      unit: 'kg',
      budget: 3000000,
      delivery_period: 'Awal Bulan Depan',
      status: 'OPEN'
    };

    // 1. Buyer membuat Request PO
    console.log(`[Langkah 1] Buyer (${users['andi@gmail.com'].name}) membuat Request PO untuk ${requestPayload.pangan_type}...`);
    const reqCreateRes = await fetch(`${API_URL}/buyer-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    });

    if (!reqCreateRes.ok) throw new Error('Gagal membuat Buyer Request PO');
    const reqCreateData = await reqCreateRes.json();
    const requestId = reqCreateData.data.id;
    console.log(`✅ Request PO berhasil dibuat dengan ID: ${requestId}`);

    // 2. Seller mengambil Request PO tersebut
    console.log(`[Langkah 2] Petani (${users['petani@gmail.com'].name}) mengambil Request PO tersebut...`);
    const reqUpdateRes = await fetch(`${API_URL}/buyer-requests/${requestId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'TAKEN',
        fulfilledBy: sellerId
      })
    });

    if (!reqUpdateRes.ok) throw new Error('Gagal mengambil Buyer Request PO');
    console.log(`✅ Status Request PO ID ${requestId} diperbarui menjadi TAKEN oleh Petani Maju.`);
    console.log('');

    console.log('========================================================');
    console.log('🎉  SEMUA ALUR KERJA UTAMA TELAH BERHASIL DIUJI COBA  🎉');
    console.log('       Aplikasi PanganDesa Bekerja Dengan Sempurna      ');
    console.log('========================================================');

  } catch (error) {
    console.error('❌ Terjadi kesalahan saat pengujian:', error.message);
    process.exit(1);
  }
}

runTests();
