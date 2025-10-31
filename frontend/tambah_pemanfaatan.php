<?php
include 'templates/header.php';
// Hanya Admin yang bisa akses dan harus ada ID tanah
if ($_SESSION['role_id'] != 1 || !isset($_GET['tanah_id'])) {
    header('Location: index.php');
    exit();
}
$tanah_id = $_GET['tanah_id'];

// Ambil info singkat tanah untuk judul
$sql_tanah = "SELECT kode_barang, lokasi FROM tanah_kas_desa WHERE id = ?";
$stmt_tanah = mysqli_prepare($conn, $sql_tanah);
mysqli_stmt_bind_param($stmt_tanah, "i", $tanah_id);
mysqli_stmt_execute($stmt_tanah);
$result_tanah = mysqli_stmt_get_result($stmt_tanah);
$tanah = mysqli_fetch_assoc($result_tanah);
if (!$tanah) { echo "Aset tanah tidak ditemukan."; exit(); }
?>

<div class="content-header">
    <h1>Tambah Riwayat Pemanfaatan</h1>
    <a href="detail.php?id=<?php echo $tanah_id; ?>" class="btn btn-secondary">Kembali ke Detail Aset</a>
</div>
<div class="card">
    <div class="card-header">
        <h4>Aset: <?php echo htmlspecialchars($tanah['kode_barang']); ?> - <?php echo htmlspecialchars($tanah['lokasi']); ?></h4>
    </div>
    <div class="card-body">
        <form action="proses_pemanfaatan.php" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="tanah_id" value="<?php echo $tanah_id; ?>">
            <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
            
            <div class="form-group">
                <label for="bentuk_pemanfaatan">Bentuk Pemanfaatan</label>
                <select name="bentuk_pemanfaatan" id="bentuk_pemanfaatan" class="form-control" required>
                    <option value="Sewa">Sewa</option>
                    <option value="Pinjam Pakai">Pinjam Pakai</option>
                    <option value="Kerja Sama Pemanfaatan (KSP)">Kerja Sama Pemanfaatan (KSP)</option>
                    <option value="Bangun Guna Serah (BGS)">Bangun Guna Serah (BGS)</option>
                    <option value="Lain-lain">Lain-lain</option>
                </select>
            </div>
            <div class="form-group">
                <label for="pihak_ketiga">Nama Pihak Ketiga (Penyewa, Peminjam, dll)</label>
                <input type="text" id="pihak_ketiga" name="pihak_ketiga" class="form-control" required>
            </div>
            <div class="grid-2-col">
                <div class="form-group">
                    <label for="tanggal_mulai">Tanggal Mulai</label>
                    <input type="date" id="tanggal_mulai" name="tanggal_mulai" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="tanggal_selesai">Tanggal Selesai</label>
                    <input type="date" id="tanggal_selesai" name="tanggal_selesai" class="form-control" required>
                </div>
            </div>
            <div class="grid-2-col">
                <div class="form-group">
                    <label for="nilai_kontribusi">Nilai Kontribusi/Sewa (Rp)</label>
                    <input type="number" id="nilai_kontribusi" name="nilai_kontribusi" class="form-control" value="0">
                </div>
                <div class="form-group">
                    <label for="status_pembayaran">Status Pembayaran</label>
                    <select name="status_pembayaran" id="status_pembayaran" class="form-control" required>
                        <option value="Belum Lunas">Belum Lunas</option>
                        <option value="Lunas">Lunas</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="path_bukti">Upload Bukti (Kwitansi, Perjanjian, dll) - Opsional</label>
                <input type="file" id="path_bukti" name="path_bukti" class="form-control">
                <small>Tipe file: PDF, JPG, PNG. Maks: 5MB</small>
            </div>
            <div class="form-group">
                <label for="keterangan">Keterangan Tambahan</label>
                <textarea name="keterangan" id="keterangan" class="form-control"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Simpan Data Pemanfaatan</button>
        </form>
    </div>
</div>

<?php include 'templates/footer.php'; ?>