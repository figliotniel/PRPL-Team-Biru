<?php
require_once 'config.php';

// Pastikan user sudah login dan ada ID aset
if (!isset($_SESSION['user_id']) || !isset($_GET['id'])) {
    header('Location: index.php');
    exit();
}

$id = $_GET['id'];

// Ambil semua data detail dari database untuk ID yang dipilih
$sql = "SELECT t.*, u_input.nama_lengkap as nama_penginput, u_valid.nama_lengkap as nama_validator 
        FROM tanah_kas_desa t 
        LEFT JOIN users u_input ON t.diinput_oleh = u_input.id 
        LEFT JOIN users u_valid ON t.divalidasi_oleh = u_valid.id 
        WHERE t.id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$data = mysqli_fetch_assoc($result);

if (!$data) {
    echo "Data aset tidak ditemukan.";
    exit();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Detail Aset - <?php echo htmlspecialchars($data['kode_barang'] ?? 'N/A'); ?></title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; margin: 2cm; }
        .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 30px; }
        .header h3, .header h4 { margin: 0; }
        .content-table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        .content-table td { padding: 8px; border: 1px solid #ccc; vertical-align: top; }
        .content-table td:first-child { font-weight: bold; width: 30%; background-color: #f2f2f2; }
        h5 { background-color: #e7e7e7; padding: 10px; margin-top: 20px; margin-bottom: 10px; border-left: 5px solid #555; }
        .footer { margin-top: 50px; font-size: 11pt; text-align: right; }
        @media print {
            body { margin: 1.5cm; }
            .no-print { display: none; }
        }
    </style>
</head>
<body onload="window.print()">

    <div class="header">
        <h3>PEMERINTAH DESA MAKMUR JAYA</h3>
        <h4>DETAIL LAPORAN ASET TANAH KAS DESA</h4>
    </div>

    <h5>A. DATA UTAMA ASET</h5>
    <table class="content-table">
        <tr><td>Kode Barang</td><td><?php echo htmlspecialchars($data['kode_barang'] ?? '-'); ?></td></tr>
        <tr><td>Nomor Urut Pendaftaran (NUP)</td><td><?php echo htmlspecialchars($data['nup'] ?? '-'); ?></td></tr>
        <tr><td>Asal Perolehan</td><td><?php echo htmlspecialchars($data['asal_perolehan'] ?? '-'); ?></td></tr>
        <tr><td>Tanggal Perolehan</td><td><?php echo !empty($data['tanggal_perolehan']) ? date('d F Y', strtotime($data['tanggal_perolehan'])) : '-'; ?></td></tr>
        <tr><td>Harga Perolehan</td><td>Rp <?php echo number_format($data['harga_perolehan'] ?? 0, 0, ',', '.'); ?></td></tr>
        <tr><td>Bukti Perolehan</td><td><?php echo htmlspecialchars($data['bukti_perolehan'] ?? '-'); ?></td></tr>
    </table>

    <h5>B. DATA YURIDIS (LEGALITAS)</h5>
    <table class="content-table">
        <tr><td>Nomor Sertifikat</td><td><?php echo htmlspecialchars($data['nomor_sertifikat'] ?? '-'); ?></td></tr>
        <tr><td>Status Sertifikat</td><td><?php echo htmlspecialchars($data['status_sertifikat'] ?? '-'); ?></td></tr>
    </table>

    <h5>C. DATA FISIK ASET</h5>
    <table class="content-table">
        <tr><td>Luas</td><td><?php echo number_format($data['luas'], 2, ',', '.'); ?> m²</td></tr>
        <tr><td>Lokasi / Alamat</td><td><?php echo htmlspecialchars($data['lokasi'] ?? '-'); ?></td></tr>
        <tr><td>Penggunaan</td><td><?php echo htmlspecialchars($data['penggunaan'] ?? '-'); ?></td></tr>
        <tr><td>Koordinat</td><td><?php echo htmlspecialchars($data['koordinat'] ?? '-'); ?></td></tr>
        <tr><td>Kondisi</td><td><?php echo htmlspecialchars($data['kondisi'] ?? '-'); ?></td></tr>
        <tr><td>Batas Utara</td><td><?php echo htmlspecialchars($data['batas_utara'] ?? '-'); ?></td></tr>
        <tr><td>Batas Timur</td><td><?php echo htmlspecialchars($data['batas_timur'] ?? '-'); ?></td></tr>
        <tr><td>Batas Selatan</td><td><?php echo htmlspecialchars($data['batas_selatan'] ?? '-'); ?></td></tr>
        <tr><td>Batas Barat</td><td><?php echo htmlspecialchars($data['batas_barat'] ?? '-'); ?></td></tr>
    </table>

    <h5>D. STATUS & KETERANGAN</h5>
    <table class="content-table">
        <tr><td>Status Validasi</td><td><?php echo htmlspecialchars($data['status_validasi']); ?></td></tr>
        <tr><td>Catatan Validasi</td><td><?php echo htmlspecialchars($data['catatan_validasi'] ?? '-'); ?></td></tr>
        <tr><td>Diinput oleh</td><td><?php echo htmlspecialchars($data['nama_penginput'] ?? '-'); ?></td></tr>
        <tr><td>Divalidasi oleh</td><td><?php echo htmlspecialchars($data['nama_validator'] ?? '-'); ?></td></tr>
        <tr><td>Keterangan Lain</td><td><?php echo nl2br(htmlspecialchars($data['keterangan'] ?? '-')); ?></td></tr>
    </table>

    <div class="footer">
        Dicetak pada: <?php echo date('d F Y, H:i:s'); ?>
    </div>

</body>
</html>