<?php
/**
 * Setup Database and Migrations Script for PanganDesa
 */

header('Content-Type: text/html; charset=utf-8');

// Load .env values
$envPath = __DIR__ . '/../.env';
if (!file_exists($envPath)) {
    die("Error: .env file not found at " . realpath($envPath));
}

$env = [];
$lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0) continue;
    $parts = explode('=', $line, 2);
    if (count($parts) === 2) {
        $env[trim($parts[0])] = trim($parts[1]);
    }
}

// Extract DB configuration
$host     = $env['database.default.hostname'] ?? 'localhost';
$dbName   = $env['database.default.database'] ?? 'db_pangandesa';
$username = $env['database.default.username'] ?? 'root';
$password = $env['database.default.password'] ?? '';
$port     = $env['database.default.port'] ?? '3306';

echo "<html><head><title>Database Setup - PanganDesa</title>";
echo "<style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 40px; margin: 0; }
    .card { background: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    h1 { color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 800; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    .success { color: #15803d; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 10px; font-weight: bold; margin-bottom: 20px; }
    .info { background-color: #f1f5f9; border-left: 4px solid #64748b; padding: 12px; margin: 10px 0; font-family: monospace; border-radius: 0 8px 8px 0; font-size: 13px; }
    .btn { display: inline-block; background-color: #10b981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; margin-top: 20px; transition: background 0.2s; }
    .btn:hover { background-color: #059669; }
</style></head><body>";
echo "<div class='card'>";
echo "<h1>PanganDesa Database Migrator</h1>";

try {
    // 1. Connect to MySQL without DB selected
    $dsn = "mysql:host=$host;port=$port;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $pdo = new PDO($dsn, $username, $password, $options);
    echo "<div class='info'>Koneksi ke database server berhasil...</div>";
    
    // 2. Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    echo "<div class='info'>Database '$dbName' siap...</div>";
    
    // 3. Connect with database selected
    $pdo->exec("USE `$dbName`;");
    
    // 4. Check if table 'users' exists, if not import the schema
    $tableExists = false;
    try {
        $result = $pdo->query("SELECT 1 FROM `users` LIMIT 1");
        $tableExists = true;
    } catch (Exception $e) {
        $tableExists = false;
    }
    
    if (!$tableExists) {
        $schemaPath = __DIR__ . '/../../pangandesa_schema.sql';
        if (file_exists($schemaPath)) {
            $sql = file_get_contents($schemaPath);
            $pdo->exec($sql);
            echo "<div class='info'>Skema dasar berhasil diimpor dari pangandesa_schema.sql...</div>";
        } else {
            throw new Exception("File skema sql tidak ditemukan di: " . realpath($schemaPath));
        }
    }
    
    // 5. Add new columns for registration metadata if they do not exist
    $columnsToAdd = [
        'company_name' => "VARCHAR(150) NULL COMMENT 'Nama Perusahaan / BUMDes' AFTER `name`",
        'pic_name'     => "VARCHAR(100) NULL COMMENT 'Nama PIC' AFTER `company_name`",
        'nib'          => "VARCHAR(100) NULL COMMENT 'NIB atau SK Kemenkumham' AFTER `address`",
        'npwp'         => "VARCHAR(50) NULL COMMENT 'NPWP' AFTER `nib`",
        'bank_account' => "VARCHAR(50) NULL COMMENT 'Nomor Rekening' AFTER `npwp`"
    ];
    
    foreach ($columnsToAdd as $colName => $colDef) {
        // Check if column already exists
        $checkCol = $pdo->query("SHOW COLUMNS FROM `users` LIKE '$colName'")->fetch();
        if (!$checkCol) {
            $pdo->exec("ALTER TABLE `users` ADD COLUMN `$colName` $colDef");
            echo "<div class='info'>Kolom '$colName' berhasil ditambahkan...</div>";
        } else {
            echo "<div class='info'>Kolom '$colName' sudah ada...</div>";
        }
    }
    
    // 6. Create notifications table if not exists
    $notifTableExists = false;
    try {
        $pdo->query("SELECT 1 FROM `notifications` LIMIT 1");
        $notifTableExists = true;
    } catch (Exception $e) {
        $notifTableExists = false;
    }

    if (!$notifTableExists) {
        $pdo->exec("CREATE TABLE `notifications` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `title` VARCHAR(150) NOT NULL,
            `message` TEXT NOT NULL,
            `type` VARCHAR(50) NOT NULL,
            `is_read` BOOLEAN DEFAULT FALSE,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
        echo "<div class='info'>Tabel 'notifications' berhasil dibuat...</div>";

        // Seed notifications
        $pdo->exec("INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`, `is_read`) VALUES
        (2, 'Pesanan Pre-Order Baru! 🌾', 'Pembeli Andi Wijaya mengajukan Pre-Order 50kg Cabai Merah Keriting.', 'pre_order', 0),
        (2, 'Estimasi Panen Mendekati Batas! 🚜', 'Tomat Segar Anda dijadwalkan panen dalam 2 hari. Segera siapkan wadah dan logistik.', 'harvest_warning', 0),
        (2, 'Pencairan Dana Berhasil! 💰', 'Penarikan saldo BUMDes sebesar Rp 2.500.000 telah berhasil dikirim ke rekening BRI Anda.', 'finance', 1),
        (3, 'Pre-Order Disetujui! 📦', 'Pre-Order Bumbu Rempah Anda telah dikonfirmasi oleh Petani Sukamaju.', 'pre_order', 0),
        (3, 'Jadwal Panen Besok! 🗓️', 'Sayur Selada pesanan Anda dijadwalkan dipanen besok pagi oleh Petani Maju.', 'harvest_warning', 0),
        (3, 'Profil Anda Belum Lengkap! 👤', 'Silakan lengkapi nomor rekening dan alamat pengiriman Anda untuk memudahkan transaksi.', 'system', 0);");
        echo "<div class='info'>Seed data 'notifications' berhasil diisikan...</div>";
    }
    
    echo "<div class='success'>🎉 Database and table migrations completed successfully!</div>";
    echo "<p>Semua kolom pendaftaran Buyer & Seller serta tabel notifikasi telah ditambahkan ke database.</p>";
    echo "<a href='http://localhost:3000/login' class='btn'>Buka Halaman Login</a>";
    
} catch (Exception $e) {
    echo "<div style='color: #b91c1c; background-color: #fef2f2; border: 1px solid #fca5a5; padding: 12px; border-radius: 10px; font-weight: bold; margin-top: 10px;'>";
    echo "❌ Error Setup Database: " . $e->getMessage();
    echo "</div>";
}

echo "</div></body></html>";
