<?php
include 'templates/header.php';
if ($_SESSION['role_id'] != 1 || !isset($_GET['id'])) { header('Location: index.php'); exit(); }

$id = $_GET['id'];
// Ambil data aset yang akan diedit
$sql = "SELECT * FROM tanah_kas_desa WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$data = mysqli_fetch_assoc($result);
if (!$data) {
    set_flash_message('error', 'Data aset tidak ditemukan.');
    header('Location: index.php');
    exit();
}

// Ambil data master dari database
$master_kode_utama = mysqli_query($conn, "SELECT DISTINCT kode_utama, nama_utama FROM master_kodefikasi ORDER BY kode_utama");
$master_asal = mysqli_query($conn, "SELECT nama_asal FROM master_asal_perolehan ORDER BY id");
$master_status_sertifikat = mysqli_query($conn, "SELECT nama_status FROM master_status_sertifikat ORDER BY id");
$master_penggunaan = mysqli_query($conn, "SELECT nama_penggunaan FROM master_penggunaan ORDER BY id");

// Data kodefikasi untuk Javascript
$kodefikasi_js = [];
$result_js = mysqli_query($conn, "SELECT kode_utama, kode_sub, nama_sub FROM master_kodefikasi");
while($row_js = mysqli_fetch_assoc($result_js)){
    $kodefikasi_js[$row_js['kode_utama']][$row_js['kode_sub']] = $row_js['nama_sub'];
}

// Logika untuk memecah kode barang yang ada untuk pre-selection
$kode_utama_terpilih = ''; $sub_kode_terpilih = '';
if (!empty($data['kode_barang']) && strpos($data['kode_barang'], '.') !== false) {
    $parts = explode('.', $data['kode_barang']);
    if(count($parts) === 4) { $sub_kode_terpilih = array_pop($parts); $kode_utama_terpilih = implode('.', $parts); }
}
?>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<div class="content-header">
    <h1>Edit Data Tanah (Kode: <?php echo htmlspecialchars($data['kode_barang']); ?>)</h1>
    <a href="detail.php?id=<?php echo $id; ?>" class="btn btn-secondary">Kembali</a>
</div>
<div class="card">
    <div class="card-body">
        <form action="proses_crud.php" method="POST">
            <input type="hidden" name="aksi" value="edit">
            <input type="hidden" name="id" value="<?php echo $data['id']; ?>">
            <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
            <input type="hidden" id="kode_barang" name="kode_barang" value="<?php echo htmlspecialchars($data['kode_barang']); ?>" required>
            
            <div class="grid-2-col">
                <div class="form-group">
                    <label for="kategori_utama">Kategori Utama Tanah</label>
                    <select id="kategori_utama" class="form-control" required>
                        <option value="" disabled>-- Pilih Kategori Utama --</option>
                        <?php mysqli_data_seek($master_kode_utama, 0); while ($row = mysqli_fetch_assoc($master_kode_utama)): ?>
                            <option value="<?php echo $row['kode_utama']; ?>" <?php if ($row['kode_utama'] == $kode_utama_terpilih) echo 'selected'; ?>>
                                <?php echo htmlspecialchars($row['nama_utama']); ?>
                            </option>
                        <?php endwhile; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label for="sub_kategori">Sub-Kategori Tanah</label>
                    <select id="sub_kategori" class="form-control" required>
                        <option value="" disabled>-- Pilih Kategori Utama Dulu --</option>
                    </select>
                </div>
                
                <div class="form-group"><label>NUP</label><input type="text" name="nup" class="form-control" value="<?php echo htmlspecialchars($data['nup']); ?>"></div>
                
                <div class="form-group">
                    <label for="asal_perolehan">Asal Perolehan</label>
                    <input type="text" id="asal_perolehan" name="asal_perolehan" class="form-control" list="asal-list" required value="<?php echo htmlspecialchars($data['asal_perolehan']); ?>" placeholder="Pilih atau ketik baru...">
                    <datalist id="asal-list">
                        <?php mysqli_data_seek($master_asal, 0); while($row = mysqli_fetch_assoc($master_asal)): ?>
                        <option value="<?php echo htmlspecialchars($row['nama_asal']); ?>">
                        <?php endwhile; ?>
                    </datalist>
                </div>

                <div class="form-group"><label>Tgl. Perolehan</label><input type="date" name="tanggal_perolehan" class="form-control" value="<?php echo htmlspecialchars($data['tanggal_perolehan']); ?>"></div>
                <div class="form-group"><label>Harga Perolehan (Rp)</label><input type="number" name="harga_perolehan" class="form-control" value="<?php echo htmlspecialchars($data['harga_perolehan']); ?>"></div>
                <div class="form-group" style="grid-column: span 2;"><label>Bukti Perolehan</label><input type="text" name="bukti_perolehan" class="form-control" placeholder="No. Akta Hibah/No. BAST/dll" value="<?php echo htmlspecialchars($data['bukti_perolehan']); ?>"></div>
                
                <div class="form-group"><label>Nomor Sertifikat</label><input type="text" name="nomor_sertifikat" class="form-control" value="<?php echo htmlspecialchars($data['nomor_sertifikat']); ?>"></div>
                <div class="form-group"><label>Tanggal Sertifikat</label><input type="date" name="tanggal_sertifikat" class="form-control" value="<?php echo htmlspecialchars($data['tanggal_sertifikat']); ?>"></div>

                <div class="form-group">
                    <label for="status_sertifikat">Status Tanah (Hak)</label>
                    <input type="text" id="status_sertifikat" name="status_sertifikat" class="form-control" list="status-sertifikat-list" value="<?php echo htmlspecialchars($data['status_sertifikat']); ?>" placeholder="Pilih atau ketik baru...">
                    <datalist id="status-sertifikat-list">
                        <?php mysqli_data_seek($master_status_sertifikat, 0); while($row = mysqli_fetch_assoc($master_status_sertifikat)): ?>
                        <option value="<?php echo htmlspecialchars($row['nama_status']); ?>">
                        <?php endwhile; ?>
                    </datalist>
                </div>
                
                <div class="form-group"><label>Luas (m²)</label><input type="number" step="0.01" name="luas" class="form-control" value="<?php echo htmlspecialchars($data['luas']); ?>" required></div>
                
                <div class="form-group">
                    <label for="penggunaan">Penggunaan</label>
                    <input type="text" id="penggunaan" name="penggunaan" class="form-control" list="penggunaan-list" value="<?php echo htmlspecialchars($data['penggunaan']); ?>" placeholder="Pilih atau ketik baru...">
                     <datalist id="penggunaan-list">
                        <?php mysqli_data_seek($master_penggunaan, 0); while($row = mysqli_fetch_assoc($master_penggunaan)): ?>
                        <option value="<?php echo htmlspecialchars($row['nama_penggunaan']); ?>">
                        <?php endwhile; ?>
                    </datalist>
                </div>
                
                <div class="form-group"><label>Koordinat (Lat, Long)</label><input type="text" id="koordinat" name="koordinat" class="form-control" value="<?php echo htmlspecialchars($data['koordinat']); ?>"></div>
                
                <div class="form-group">
                    <label for="kondisi">Kondisi</label>
                    <select id="kondisi" name="kondisi" class="form-control">
                        <option value="Baik" <?php if($data['kondisi'] == 'Baik') echo 'selected'; ?>>Baik (B)</option>
                        <option value="Kurang Baik" <?php if($data['kondisi'] == 'Kurang Baik') echo 'selected'; ?>>Kurang Baik (KB)</option>
                        <option value="Rusak Berat" <?php if($data['kondisi'] == 'Rusak Berat') echo 'selected'; ?>>Rusak Berat (RB)</option>
                    </select>
                </div>
                <div class="form-group" style="grid-column: span 2;"><label>Lokasi/Alamat</label><textarea name="lokasi" class="form-control"><?php echo htmlspecialchars($data['lokasi']); ?></textarea></div>
                <div class="form-group"><label>Batas Utara</label><input type="text" name="batas_utara" class="form-control" value="<?php echo htmlspecialchars($data['batas_utara']); ?>"></div>
                <div class="form-group"><label>Batas Timur</label><input type="text" name="batas_timur" class="form-control" value="<?php echo htmlspecialchars($data['batas_timur']); ?>"></div>
                <div class="form-group"><label>Batas Selatan</label><input type="text" name="batas_selatan" class="form-control" value="<?php echo htmlspecialchars($data['batas_selatan']); ?>"></div>
                <div class="form-group"><label>Batas Barat</label><input type="text" name="batas_barat" class="form-control" value="<?php echo htmlspecialchars($data['batas_barat']); ?>"></div>
                <div class="form-group" style="grid-column: span 2;"><label>Keterangan Tambahan</label><textarea name="keterangan" class="form-control"><?php echo htmlspecialchars($data['keterangan']); ?></textarea></div>
            </div>

            <div class="form-group" style="grid-column: 1 / -1; margin-top: 1rem;"><label>Pilih Lokasi di Peta</label><div id="map" style="height: 350px; width: 100%; border-radius: 8px; z-index: 1;"></div></div>
            <button type="submit" class="btn btn-primary">Update Data</button>
        </form>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const kodefikasiData = <?php echo json_encode($kodefikasi_js); ?>;
    const katUtamaSelect = document.getElementById('kategori_utama');
    const subKatSelect = document.getElementById('sub_kategori');
    const kodeBarangInput = document.getElementById('kode_barang');
    const subKodeTerpilih = "<?php echo $sub_kode_terpilih; ?>";

    function populateSubKategori(selectedKat) {
        subKatSelect.innerHTML = '<option value="" disabled>-- Pilih Sub-Kategori --</option>';
        if (selectedKat && kodefikasiData[selectedKat]) {
            const subs = kodefikasiData[selectedKat];
            for (const kode in subs) {
                const option = document.createElement('option');
                option.value = kode;
                option.textContent = subs[kode];
                if (kode === subKodeTerpilih) { option.selected = true; }
                subKatSelect.appendChild(option);
            }
        }
    }

    if (katUtamaSelect.value) {
        populateSubKategori(katUtamaSelect.value);
    }

    katUtamaSelect.addEventListener('change', function() {
        populateSubKategori(this.value);
        kodeBarangInput.value = '';
        subKatSelect.value = '';
    });

    subKatSelect.addEventListener('change', function() {
        const katUtama = katUtamaSelect.value;
        const subKat = this.value;
        if (katUtama && subKat) {
            kodeBarangInput.value = `${katUtama}.${subKat}`;
        }
    });
    
    // --- MAP LOGIC ---
    const koordinatInput = document.getElementById('koordinat');
    const koordinatString = koordinatInput.value;
    let initialLat = -7.7956, initialLng = 110.3695, initialZoom = 13, marker;
    
    if (koordinatString) {
        const parts = koordinatString.split(',');
        if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
            initialLat = parseFloat(parts[0].trim());
            initialLng = parseFloat(parts[1].trim());
            initialZoom = 17;
        }
    }

    const map = L.map('map').setView([initialLat, initialLng], initialZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);

    if (initialZoom === 17) {
        marker = L.marker([initialLat, initialLng]).addTo(map);
    }

    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(6), lng = e.latlng.lng.toFixed(6);
        koordinatInput.value = `${lat},${lng}`;
        if (!marker) {
            marker = L.marker(e.latlng).addTo(map);
        } else {
            marker.setLatLng(e.latlng);
        }
        map.panTo(e.latlng);
    });
});
</script>

<?php include 'templates/footer.php'; ?>