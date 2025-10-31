<?php
include 'templates/header.php';
if (!isset($_GET['id'])) { header('Location: index.php'); exit(); }
$id = $_GET['id'];

// Query utama untuk detail tanah
$sql = "SELECT t.*, u_input.nama_lengkap as nama_penginput, u_valid.nama_lengkap as nama_validator FROM tanah_kas_desa t LEFT JOIN users u_input ON t.diinput_oleh = u_input.id LEFT JOIN users u_valid ON t.divalidasi_oleh = u_valid.id WHERE t.id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$data = mysqli_fetch_assoc($result);
if (!$data) { echo "Data tidak ditemukan."; exit(); }

// Query untuk data pemanfaatan tanah terkait
$sql_pemanfaatan = "SELECT p.*, u.nama_lengkap as nama_penginput_pemanfaatan FROM pemanfaatan_tanah p LEFT JOIN users u ON p.diinput_oleh = u.id WHERE p.tanah_id = ? ORDER BY p.tanggal_mulai DESC";
$stmt_pemanfaatan = mysqli_prepare($conn, $sql_pemanfaatan);
mysqli_stmt_bind_param($stmt_pemanfaatan, "i", $id);
mysqli_stmt_execute($stmt_pemanfaatan);
$result_pemanfaatan = mysqli_stmt_get_result($stmt_pemanfaatan);

// Query untuk histori aset
$sql_histori = "SELECT h.*, u.username FROM histori_tanah h LEFT JOIN users u ON h.user_id = u.id WHERE h.tanah_id = ? ORDER BY h.timestamp DESC";
$stmt_histori = mysqli_prepare($conn, $sql_histori);
mysqli_stmt_bind_param($stmt_histori, "i", $id);
mysqli_stmt_execute($stmt_histori);
$result_histori = mysqli_stmt_get_result($stmt_histori);
?>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<div class="content-header">
    <h1>Detail Aset Tanah (Kode: <?php echo htmlspecialchars($data['kode_barang'] ?? 'N/A'); ?>)</h1>
    <div>
        <a href="cetak_detail.php?id=<?php echo $id; ?>" target="_blank" class="btn btn-secondary"><i class="fas fa-print"></i> Cetak Detail</a>
        <a href="index.php" class="btn btn-primary">Kembali ke Dashboard</a>
    </div>
</div>

<?php if (!empty($data['koordinat'])): ?>
<div class="card">
    <div class="card-header"><h4>Visualisasi Peta Lokasi</h4></div>
    <div class="card-body">
        <div id="map" style="height: 400px; width: 100%; border-radius: 8px; z-index: 1;"></div>
    </div>
</div>
<?php endif; ?>

<div class="card">
    <div class="card-header"><h4>Informasi Detail Aset</h4></div>
    <div class="card-body grid-2-col">
        <div>
            <h5>Data Utama</h5>
            <ul class="detail-list">
                <li><strong>Kode Barang</strong><span><?php echo htmlspecialchars($data['kode_barang'] ?? '-'); ?></span></li>
                <li><strong>NUP</strong><span><?php echo htmlspecialchars($data['nup'] ?? '-'); ?></span></li>
                <li><strong>Asal Perolehan</strong><span><?php echo htmlspecialchars($data['asal_perolehan'] ?? '-'); ?></span></li>
                <li><strong>Tgl. Perolehan</strong><span><?php echo !empty($data['tanggal_perolehan']) ? date('d M Y', strtotime($data['tanggal_perolehan'])) : '-'; ?></span></li>
                <li><strong>Harga Perolehan</strong><span>Rp <?php echo number_format($data['harga_perolehan'] ?? 0, 0, ',', '.'); ?></span></li>
                <li><strong>Bukti Perolehan</strong><span><?php echo htmlspecialchars($data['bukti_perolehan'] ?? '-'); ?></span></li>
            </ul>
        </div>
        <div>
            <h5>Data Yuridis (Legalitas)</h5>
            <ul class="detail-list">
                <li><strong>Status Tanah (Hak)</strong><span><?php echo htmlspecialchars($data['status_sertifikat'] ?? '-'); ?></span></li>
                <li><strong>No. Sertifikat</strong><span><?php echo htmlspecialchars($data['nomor_sertifikat'] ?? '-'); ?></span></li>
                <li><strong>Tgl. Sertifikat</strong><span><?php echo !empty($data['tanggal_sertifikat']) ? date('d M Y', strtotime($data['tanggal_sertifikat'])) : '-'; ?></span></li>
            </ul>
        </div>
        <div>
            <h5>Data Fisik</h5>
            <ul class="detail-list">
                <li><strong>Luas</strong><span><?php echo number_format($data['luas'] ?? 0, 2, ',', '.'); ?> m²</span></li>
                <li><strong>Lokasi / Alamat</strong><span><?php echo htmlspecialchars($data['lokasi'] ?? '-'); ?></span></li>
                <li><strong>Penggunaan</strong><span><?php echo htmlspecialchars($data['penggunaan'] ?? '-'); ?></span></li>
                <li><strong>Koordinat</strong><span><?php echo htmlspecialchars($data['koordinat'] ?? '-'); ?></span></li>
                <li><strong>Kondisi</strong><span><?php echo htmlspecialchars($data['kondisi'] ?? '-'); ?></span></li>
            </ul>
        </div>
        <div>
            <h5>Batas Wilayah</h5>
            <ul class="detail-list">
                <li><strong>Batas Utara</strong><span><?php echo htmlspecialchars($data['batas_utara'] ?? '-'); ?></span></li>
                <li><strong>Batas Timur</strong><span><?php echo htmlspecialchars($data['batas_timur'] ?? '-'); ?></span></li>
                <li><strong>Batas Selatan</strong><span><?php echo htmlspecialchars($data['batas_selatan'] ?? '-'); ?></span></li>
                <li><strong>Batas Barat</strong><span><?php echo htmlspecialchars($data['batas_barat'] ?? '-'); ?></span></li>
            </ul>
        </div>
        <div style="grid-column: 1 / -1;">
            <h5>Status & Keterangan</h5>
            <ul class="detail-list">
                <li><strong>Status Validasi</strong><span><span class="status <?php echo strtolower($data['status_validasi']); ?>"><?php echo htmlspecialchars($data['status_validasi']); ?></span></span></li>
                <li><strong>Catatan Validasi</strong><span><?php echo htmlspecialchars($data['catatan_validasi'] ?? '-'); ?></span></li>
                <li><strong>Diinput oleh</strong><span><?php echo htmlspecialchars($data['nama_penginput'] ?? '-'); ?> pada <?php echo date('d M Y, H:i', strtotime($data['created_at'])); ?></span></li>
                <li><strong>Divalidasi oleh</strong><span><?php echo htmlspecialchars($data['nama_validator'] ?? '-'); ?></span></li>
                <li><strong>Keterangan</strong><span><?php echo nl2br(htmlspecialchars($data['keterangan'] ?? '-')); ?></span></li>
            </ul>
        </div>
        <div style="grid-column: 1 / -1;">
            <h5>Dokumen Pendukung</h5>
            <ul class="detail-list">
                <?php
                $sql_docs = "SELECT * FROM dokumen_pendukung WHERE tanah_id = ?";
                $stmt_docs = mysqli_prepare($conn, $sql_docs); mysqli_stmt_bind_param($stmt_docs, "i", $id);
                mysqli_stmt_execute($stmt_docs); $result_docs = mysqli_stmt_get_result($stmt_docs);
                if (mysqli_num_rows($result_docs) > 0) {
                    while ($doc = mysqli_fetch_assoc($result_docs)) {
                        echo "<li><strong>" . htmlspecialchars($doc['nama_dokumen']) . "</strong><span><a href='" . htmlspecialchars($doc['path_file']) . "' target='_blank' class='btn btn-sm btn-info'><i class='fas fa-download'></i> Lihat</a></span></li>";
                    }
                } else { echo "<li>Belum ada dokumen yang diunggah.</li>"; }
                ?>
            </ul>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-header d-flex justify-content-between">
        <h4>Riwayat Pemanfaatan Aset</h4>
        <?php if ($_SESSION['role_id'] == 1): ?>
            <a href="tambah_pemanfaatan.php?tanah_id=<?php echo $id; ?>" class="btn btn-primary"><i class="fas fa-plus"></i> Tambah Data Pemanfaatan</a>
        <?php endif; ?>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table>
                <thead>
                    <tr><th>Bentuk</th><th>Pihak Ketiga</th><th>Periode</th><th>Nilai (Rp)</th><th>Status Bayar</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                    <?php if (mysqli_num_rows($result_pemanfaatan) > 0): ?>
                        <?php while($row = mysqli_fetch_assoc($result_pemanfaatan)): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($row['bentuk_pemanfaatan']); ?></td>
                            <td><?php echo htmlspecialchars($row['pihak_ketiga']); ?></td>
                            <td><?php echo date('d M Y', strtotime($row['tanggal_mulai'])) . ' s/d ' . date('d M Y', strtotime($row['tanggal_selesai'])); ?></td>
                            <td><?php echo number_format($row['nilai_kontribusi'], 0, ',', '.'); ?></td>
                            <td><span class="status-bayar <?php echo strtolower(str_replace(' ', '-', $row['status_pembayaran'])); ?>"><?php echo htmlspecialchars($row['status_pembayaran']); ?></span></td>
                            <td>
                                <?php if(!empty($row['path_bukti'])): ?>
                                <a href="<?php echo htmlspecialchars($row['path_bukti']); ?>" target="_blank" class="btn btn-sm btn-info"><i class="fas fa-eye"></i> Lihat Bukti</a>
                                <?php else: echo '-'; endif; ?>
                            </td>
                        </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="6" style="text-align:center;">Belum ada data pemanfaatan untuk aset ini.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-header"><h4>Riwayat & Histori Aset</h4></div>
    <div class="card-body">
        <div class="table-responsive">
            <table>
                <thead>
                    <tr><th>Waktu</th><th>Pengguna</th><th>Aksi</th><th>Deskripsi Perubahan</th></tr>
                </thead>
                <tbody>
                    <?php if (mysqli_num_rows($result_histori) > 0): ?>
                        <?php while($row = mysqli_fetch_assoc($result_histori)): ?>
                        <tr>
                            <td><?php echo date('d M Y, H:i:s', strtotime($row['timestamp'])); ?></td>
                            <td><?php echo htmlspecialchars($row['username'] ?? 'Sistem'); ?></td>
                            <td><span class="status <?php echo strtolower($row['aksi']); ?>"><?php echo htmlspecialchars($row['aksi']); ?></span></td>
                            <td><?php echo htmlspecialchars($row['deskripsi_perubahan']); ?></td>
                        </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="4" style="text-align:center;">Belum ada histori yang tercatat untuk aset ini.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php include 'templates/footer.php'; ?>

<?php if (!empty($data['koordinat'])): ?>
<script>
document.addEventListener('DOMContentLoaded', function () {
    const koordinatString = "<?php echo htmlspecialchars($data['koordinat']); ?>";
    const parts = koordinatString.split(',');
    
    if (parts.length === 2) {
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());

        if (!isNaN(lat) && !isNaN(lng)) {
            const map = L.map('map').setView([lat, lng], 17);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            L.marker([lat, lng]).addTo(map)
                .bindPopup('<b>Lokasi Aset</b><br><?php echo htmlspecialchars(addslashes($data['kode_barang'])); ?>')
                .openPopup();
        } else {
            document.getElementById("map").innerHTML = "<div class='notification error'>Format koordinat tidak valid.</div>";
        }
    } else {
        document.getElementById("map").innerHTML = "<div class='notification error'>Data koordinat tidak ditemukan atau formatnya salah.</div>";
    }
});
</script>
<?php endif; ?>