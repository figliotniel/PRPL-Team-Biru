<?php 
include 'templates/header.php'; 
if ($_SESSION['role_id'] != 1) { header('Location: index.php'); exit(); }

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
?>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<div class="content-header">
    <h1>Tambah Data Tanah Baru</h1>
    <a href="index.php" class="btn btn-secondary">Kembali</a>
</div>
<div class="card">
    <div class="card-body">
        <form action="proses_crud.php" method="POST">
            <input type="hidden" name="aksi" value="tambah">
            <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
            <input type="hidden" id="kode_barang" name="kode_barang" required>

            <div class="grid-2-col">
                <div class="form-group">
                    <label for="kategori_utama">Kategori Utama Tanah</label>
                    <select id="kategori_utama" class="form-control" required>
                        <option value="" selected disabled>-- Pilih Kategori Utama --</option>
                        <?php mysqli_data_seek($master_kode_utama, 0); while ($row = mysqli_fetch_assoc($master_kode_utama)): ?>
                            <option value="<?php echo $row['kode_utama']; ?>"><?php echo htmlspecialchars($row['nama_utama']); ?></option>
                        <?php endwhile; ?>
                    </select>
                </div>
                <div class="form-group">
                    <label for="sub_kategori">Sub-Kategori Tanah</label>
                    <select id="sub_kategori" class="form-control" required>
                        <option value="" selected disabled>-- Pilih Kategori Utama Dulu --</option>
                    </select>
                </div>
                
                <div class="form-group"><label for="nup">NUP (Nomor Urut Pendaftaran)</label><input type="text" id="nup" name="nup" class="form-control" placeholder="Contoh: 001"></div>
                
                <div class="form-group">
                    <label for="asal_perolehan">Asal Perolehan</label>
                    <input type="text" id="asal_perolehan" name="asal_perolehan" class="form-control" list="asal-list" required placeholder="Pilih atau ketik baru...">
                    <datalist id="asal-list">
                        <?php mysqli_data_seek($master_asal, 0); while ($row = mysqli_fetch_assoc($master_asal)): ?>
                            <option value="<?php echo htmlspecialchars($row['nama_asal']); ?>">
                        <?php endwhile; ?>
                    </datalist>
                </div>

                <div class="form-group"><label for="tanggal_perolehan">Tgl. Perolehan</label><input type="date" id="tanggal_perolehan" name="tanggal_perolehan" class="form-control"></div>
                <div class="form-group"><label for="harga_perolehan">Harga Perolehan (Rp)</label><input type="number" id="harga_perolehan" name="harga_perolehan" class="form-control" placeholder="Contoh: 50000000"></div>
                
                <div class="form-group" style="grid-column: span 2;"><label for="bukti_perolehan">Bukti Perolehan</label><input type="text" id="bukti_perolehan" name="bukti_perolehan" class="form-control" placeholder="Contoh: No. Akta Hibah / No. BAST / Lainnya"></div>

                <div class="form-group"><label for="nomor_sertifikat">Nomor Sertifikat</label><input type="text" id="nomor_sertifikat" name="nomor_sertifikat" class="form-control"></div>
                <div class="form-group"><label for="tanggal_sertifikat">Tanggal Sertifikat</label><input type="date" id="tanggal_sertifikat" name="tanggal_sertifikat" class="form-control"></div>

                <div class="form-group">
                    <label for="status_sertifikat">Status Tanah (Hak)</label>
                     <input type="text" id="status_sertifikat" name="status_sertifikat" class="form-control" list="status-sertifikat-list" placeholder="Pilih atau ketik baru...">
                     <datalist id="status-sertifikat-list">
                        <?php mysqli_data_seek($master_status_sertifikat, 0); while ($row = mysqli_fetch_assoc($master_status_sertifikat)): ?>
                            <option value="<?php echo htmlspecialchars($row['nama_status']); ?>">
                        <?php endwhile; ?>
                    </datalist>
                </div>
                
                <div class="form-group"><label for="luas">Luas (m²)</label><input type="number" step="0.01" id="luas" name="luas" class="form-control" required></div>
                
                <div class="form-group">
                    <label for="penggunaan">Penggunaan Lahan</label>
                    <input type="text" id="penggunaan" name="penggunaan" class="form-control" list="penggunaan-list" placeholder="Pilih atau ketik baru...">
                    <datalist id="penggunaan-list">
                        <?php mysqli_data_seek($master_penggunaan, 0); while ($row = mysqli_fetch_assoc($master_penggunaan)): ?>
                            <option value="<?php echo htmlspecialchars($row['nama_penggunaan']); ?>">
                        <?php endwhile; ?>
                    </datalist>
                </div>
                
                <div class="form-group"><label for="koordinat">Koordinat (Lat, Long)</label><input type="text" id="koordinat" name="koordinat" class="form-control" placeholder="Klik peta atau isi manual"></div>
                
                <div class="form-group">
                    <label for="kondisi">Kondisi Aset</label>
                    <select id="kondisi" name="kondisi" class="form-control">
                        <option value="Baik" selected>Baik (B)</option>
                        <option value="Kurang Baik">Kurang Baik (KB)</option>
                        <option value="Rusak Berat">Rusak Berat (RB)</option>
                    </select>
                </div>

                <div class="form-group" style="grid-column: span 2;"><label for="lokasi">Lokasi/Alamat</label><textarea id="lokasi" name="lokasi" class="form-control"></textarea></div>
                <div class="form-group"><label for="batas_utara">Batas Utara</label><input type="text" id="batas_utara" name="batas_utara" class="form-control"></div>
                <div class="form-group"><label for="batas_timur">Batas Timur</label><input type="text" id="batas_timur" name="batas_timur" class="form-control"></div>
                <div class="form-group"><label for="batas_selatan">Batas Selatan</label><input type="text" id="batas_selatan" name="batas_selatan" class="form-control"></div>
                <div class="form-group"><label for="batas_barat">Batas Barat</label><input type="text" id="batas_barat" name="batas_barat" class="form-control"></div>
                <div class="form-group" style="grid-column: span 2;"><label for="keterangan">Keterangan Tambahan</label><textarea id="keterangan" name="keterangan" class="form-control"></textarea></div>
            </div>
            
            <div class="form-group" style="grid-column: 1 / -1; margin-top: 1rem;">
                <label>Pilih Lokasi di Peta</label>
                <div id="map" style="height: 350px; width: 100%; border-radius: 8px; z-index: 1;"></div>
            </div>

            <button type="submit" class="btn btn-primary">Simpan Data</button>
        </form>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const kodefikasiData = <?php echo json_encode($kodefikasi_js); ?>;

    const katUtamaSelect = document.getElementById('kategori_utama');
    const subKatSelect = document.getElementById('sub_kategori');
    const kodeBarangInput = document.getElementById('kode_barang');

    katUtamaSelect.addEventListener('change', function() {
        const selectedKat = this.value;
        subKatSelect.innerHTML = '<option value="" selected disabled>-- Pilih Sub-Kategori --</option>';
        kodeBarangInput.value = '';

        if (selectedKat && kodefikasiData[selectedKat]) {
            const subs = kodefikasiData[selectedKat];
            for (const kode in subs) {
                const option = document.createElement('option');
                option.value = kode;
                option.textContent = subs[kode];
                subKatSelect.appendChild(option);
            }
        }
    });

    subKatSelect.addEventListener('change', function() {
        const katUtama = katUtamaSelect.value;
        const subKat = this.value;
        if (katUtama && subKat) {
            kodeBarangInput.value = `${katUtama}.${subKat}`;
        }
    });

    const map = L.map('map').setView([-7.7956, 110.3695], 13); // Center di Yogyakarta
    const koordinatInput = document.getElementById('koordinat');
    let marker;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
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