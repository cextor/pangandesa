-- phpMyAdmin SQL Dump
-- Database: `db_pangandesa`

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 1. Tabel Users (Menampung Admin, Buyer, dan Seller)
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'buyer', 'seller') NOT NULL,
    `phone` VARCHAR(20),
    `address` TEXT,
    `village` VARCHAR(100),
    `rating` DECIMAL(3,2) DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabel Categories (Kategori Pangan)
CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) UNIQUE NOT NULL,
    `icon` VARCHAR(255)
);

-- 3. Tabel Products
CREATE TABLE `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `seller_id` INT NOT NULL,
    `category_id` INT,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(15,2) NOT NULL,
    `unit` VARCHAR(50) NOT NULL,
    `stock` INT DEFAULT 0,
    `is_preorder` BOOLEAN DEFAULT FALSE,
    `harvest_date` DATE,
    `image` VARCHAR(255),
    `rating` DECIMAL(3,2) DEFAULT 0.00,
    `review_count` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);

-- 4. Tabel Orders (Transaksi)
CREATE TABLE `orders` (
    `id` VARCHAR(50) PRIMARY KEY,
    `buyer_id` INT NOT NULL,
    `seller_id` INT NOT NULL,
    `total_amount` DECIMAL(15,2) NOT NULL,
    `dp_amount` DECIMAL(15,2) NOT NULL,
    `remaining_amount` DECIMAL(15,2) NOT NULL,
    `status` ENUM(
        'WAITING_PAYMENT_DP', 'WAITING_ADMIN_DP', 'WAITING_HARVEST', 
        'HARVEST_CONFIRMED_SELLER', 'WAITING_FINAL_PAYMENT', 
        'WAITING_ADMIN_FINAL', 'SHIPPING', 'DELIVERED', 'COMPLETED'
    ) NOT NULL DEFAULT 'WAITING_PAYMENT_DP',
    `payment_method` VARCHAR(50),
    `tracking_number` VARCHAR(100),
    `bast_url` VARCHAR(255),
    `harvest_confirmed_seller` BOOLEAN DEFAULT FALSE,
    `purchase_confirmed_buyer` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- 5. Tabel Order Items (Detail Produk dalam Transaksi)
CREATE TABLE `order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` VARCHAR(50) NOT NULL,
    `product_id` INT NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `price` DECIMAL(15,2) NOT NULL,
    `quantity` INT NOT NULL,
    `unit` VARCHAR(50),
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT
);

-- 6. Tabel Chat Messages (Forum / Diskusi Transaksi)
CREATE TABLE `chat_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` VARCHAR(50) NOT NULL,
    `sender_id` INT NOT NULL,
    `content` TEXT,
    `attachment_url` VARCHAR(255),
    `attachment_type` ENUM('image', 'file', 'none') DEFAULT 'none',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- 7. Tabel Buyer Requests (Request PO dari Pembeli)
CREATE TABLE `buyer_requests` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `buyer_id` INT NOT NULL,
    `pangan_type` VARCHAR(100) NOT NULL,
    `quantity` INT NOT NULL,
    `unit` VARCHAR(50) NOT NULL,
    `budget` DECIMAL(15,2),
    `delivery_period` VARCHAR(100),
    `status` ENUM('OPEN', 'TAKEN', 'COMPLETED') DEFAULT 'OPEN',
    `fulfilled_by` INT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`fulfilled_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Insert Dummy Data for Testing
INSERT INTO `users` (`name`, `email`, `password`, `role`, `village`) VALUES
('Admin PanganDesa', 'admin@pangandesa.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NULL),
('Petani Maju', 'petani@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seller', 'Sukamaju'),
('Andi Wijaya', 'andi@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer', NULL);

INSERT INTO `categories` (`name`, `slug`, `icon`) VALUES
('Beras', 'beras', 'wheat'),
('Sayur', 'sayur', 'leaf'),
('Buah', 'buah', 'apple');

-- Insert Dummy Products
INSERT INTO `products` (`seller_id`, `category_id`, `name`, `description`, `price`, `unit`, `stock`, `is_preorder`, `harvest_date`, `image`, `rating`, `review_count`) VALUES
(2, 2, 'Tomat Segar', 'Tomat segar pilihan dari kebun mitra, dipanen saat sudah matang sempurna.', 16000.00, 'kg', 50, TRUE, '2026-06-10', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000&auto=format&fit=crop', 4.8, 120),
(2, 2, 'Cabai Merah Keriting', 'Cabai merah keriting organik, pedas mantap dan segar.', 28000.00, 'kg', 20, TRUE, '2026-06-12', 'https://images.unsplash.com/photo-1618161546200-5047b11933c0?q=80&w=1000&auto=format&fit=crop', 4.9, 98),
(2, 1, 'Beras Merah Organik', 'Beras merah organik tanpa pestisida, kaya serat dan sehat.', 22000.00, 'kg', 100, TRUE, '2026-06-15', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1000&auto=format&fit=crop', 4.7, 76),
(2, 2, 'Jagung Manis', 'Jagung manis segar dipetik langsung saat dipesan.', 9500.00, 'kg', 30, TRUE, '2026-06-11', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1000&auto=format&fit=crop', 4.7, 64);

COMMIT;
