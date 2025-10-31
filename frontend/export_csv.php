<?php
require_once 'config.php';

// Mengizinkan role 1 (Admin), 2 (Kades), dan 3 (BPD)
if (!isset($_SESSION['user_id']) || $_SESSION['role_id'] > 3) {
    header('Location: index.php');
    exit();
}

// Set header untuk download file
$filename = "laporan_tanah_kas_desa_" . date('Y-m-d') . ".csv";
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=' . $filename);
header('Pragma: no-cache');
header('Expires: 0');

// Buka output stream
$output = fopen('php://output', 'w');

// Tulis header kolom di CSV
fputcsv($output, [
    'Kode Barang', 'NUP', 'Asal Perolehan', 'Tgl Perolehan', 'Harga Perolehan (Rp)',
    'Bukti Perolehan', 'No. Sertifikat', 'Status Sertifikat', 'Luas (m2)', 'Penggunaan', 
    'Koordinat', 'Kondisi', 'Lokasi', 'Batas Utara', 'Batas Timur', 'Batas Selatan', 
    'Batas Barat', 'Keterangan', 'Status Validasi'
]);

// Query data yang akan diexport (hanya yang disetujui)
$sql = "SELECT * FROM tanah_kas_desa WHERE status_validasi = 'Disetujui' ORDER BY id ASC";
$result = mysqli_query($conn, $sql);

// Tulis setiap baris data ke CSV
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        fputcsv($output, [
            $row['kode_barang'], $row['nup'], $row['asal_perolehan'], $row['tanggal_perolehan'],
            $row['harga_perolehan'], $row['bukti_perolehan'], $row['nomor_sertifikat'], 
            $row['status_sertifikat'], $row['luas'], $row['penggunaan'], $row['koordinat'], 
            $row['kondisi'], $row['lokasi'], $row['batas_utara'], $row['batas_timur'], 
            $row['batas_selatan'], $row['batas_barat'], $row['keterangan'], $row['status_validasi']
        ]);
    }
}

fclose($output);
exit();
?>