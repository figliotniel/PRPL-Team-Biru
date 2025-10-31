-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 28, 2025 at 01:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_sitanas`
--

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_pendukung`
--

CREATE TABLE `dokumen_pendukung` (
  `id` int(11) NOT NULL,
  `tanah_id` int(11) NOT NULL,
  `nama_dokumen` varchar(255) NOT NULL,
  `path_file` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log_aktivitas`
--

CREATE TABLE `log_aktivitas` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `aksi` varchar(50) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pemanfaatan_tanah`
--

CREATE TABLE `pemanfaatan_tanah` (
  `id` int(11) NOT NULL,
  `tanah_id` int(11) NOT NULL,
  `bentuk_pemanfaatan` varchar(100) NOT NULL,
  `pihak_ketiga` varchar(255) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `nilai_kontribusi` decimal(15,2) DEFAULT 0.00,
  `status_pembayaran` enum('Lunas','Belum Lunas') NOT NULL DEFAULT 'Belum Lunas',
  `path_bukti` varchar(255) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `diinput_oleh` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nama_role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `nama_role`) VALUES
(1, 'Admin Desa'),
(3, 'BPD (Pengawas)'),
(2, 'Kepala Desa');

-- --------------------------------------------------------

--
-- Table structure for table `tanah_kas_desa`
--

CREATE TABLE `tanah_kas_desa` (
  `id` int(11) NOT NULL,
  `kode_barang` varchar(100) DEFAULT NULL,
  `nup` varchar(50) DEFAULT NULL,
  `asal_perolehan` varchar(255) NOT NULL,
  `tanggal_perolehan` date DEFAULT NULL,
  `harga_perolehan` decimal(15,2) DEFAULT 0.00,
  `nomor_sertifikat` varchar(100) DEFAULT NULL,
  `status_sertifikat` varchar(100) DEFAULT NULL,
  `luas` decimal(15,2) NOT NULL,
  `lokasi` text DEFAULT NULL,
  `penggunaan` varchar(255) DEFAULT NULL,
  `koordinat` varchar(100) DEFAULT NULL,
  `kondisi` enum('Baik','Rusak Ringan','Rusak Berat') DEFAULT 'Baik',
  `batas_utara` varchar(255) DEFAULT NULL,
  `batas_timur` varchar(255) DEFAULT NULL,
  `batas_selatan` varchar(255) DEFAULT NULL,
  `batas_barat` varchar(255) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `status_validasi` enum('Diproses','Disetujui','Ditolak') DEFAULT 'Diproses',
  `catatan_validasi` text DEFAULT NULL,
  `diinput_oleh` int(11) DEFAULT NULL,
  `divalidasi_oleh` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `foto_profil` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `dokumen_pendukung`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tanah_id` (`tanah_id`);

--
-- Indexes for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `pemanfaatan_tanah`
--
ALTER TABLE `pemanfaatan_tanah`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tanah_id` (`tanah_id`),
  ADD KEY `diinput_oleh` (`diinput_oleh`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama_role` (`nama_role`);

--
-- Indexes for table `tanah_kas_desa`
--
ALTER TABLE `tanah_kas_desa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `diinput_oleh` (`diinput_oleh`),
  ADD KEY `divalidasi_oleh` (`divalidasi_oleh`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dokumen_pendukung`
--
ALTER TABLE `dokumen_pendukung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pemanfaatan_tanah`
--
ALTER TABLE `pemanfaatan_tanah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tanah_kas_desa`
--
ALTER TABLE `tanah_kas_desa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dokumen_pendukung`
--
ALTER TABLE `dokumen_pendukung`
  ADD CONSTRAINT `dokumen_pendukung_ibfk_1` FOREIGN KEY (`tanah_id`) REFERENCES `tanah_kas_desa` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pemanfaatan_tanah`
--
ALTER TABLE `pemanfaatan_tanah`
  ADD CONSTRAINT `pemanfaatan_tanah_ibfk_1` FOREIGN KEY (`tanah_id`) REFERENCES `tanah_kas_desa` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pemanfaatan_tanah_ibfk_2` FOREIGN KEY (`diinput_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tanah_kas_desa`
--
ALTER TABLE `tanah_kas_desa`
  ADD CONSTRAINT `tanah_kas_desa_ibfk_1` FOREIGN KEY (`diinput_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `tanah_kas_desa_ibfk_2` FOREIGN KEY (`divalidasi_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
