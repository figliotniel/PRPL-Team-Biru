<?php
include 'templates/header.php';
if ($_SESSION['role_id'] != 1 || !isset($_GET['id'])) { header('Location: index.php'); exit(); }
$tanah_id = $_GET['id'];

// Ambil info singkat tanah untuk judul
$sql_tanah = "SELECT kode_barang FROM tanah_kas_desa WHERE id = ?";
$stmt_tanah = mysqli_prepare($conn, $sql_tanah);
mysqli_stmt_bind_param($stmt_tanah, "i", $tanah_id);
mysqli_stmt_execute($stmt_tanah);
$tanah = mysqli_stmt_get_result($stmt_tanah)->fetch_assoc();
?>
<div class="content-header">
    <h1>Upload Dokumen Pendukung</h1>
    <a href="detail.php?id=<?php echo $tanah_id; ?>" class="btn btn-secondary">Kembali ke Detail Aset</a>
</div>
<div class="card">
    <div class="card-header"><h4>Upload File Baru untuk Aset: <?php echo htmlspecialchars($tanah['kode_barang'] ?? 'N/A'); ?></h4></div>
    <div class="card-body">
        <form action="proses_crud.php" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="aksi" value="upload">
            <input type="hidden" name="tanah_id" value="<?php echo $tanah_id; ?>">
            <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
            
            <div class="form-group"><label for="nama_dokumen">Nama Dokumen</label><input type="text" name="nama_dokumen" id="nama_dokumen" class="form-control" required placeholder="Cth: Sertifikat Hak Milik Asli"></div>
            
            <div class="grid-2-col">
                <div class="form-group">
                    <label for="kategori_dokumen">Kategori Dokumen</label>
                    <select name="kategori_dokumen" id="kategori_dokumen" class="form-control">
                        <option value="Sertifikat">Sertifikat</option>
                        <option value="Akta Jual Beli">Akta Jual Beli</option>
                        <option value="Girik / Petok D">Girik / Petok D</option>
                        <option value="Peta Bidang">Peta Bidang</option>
                        <option value="Lain-lain" selected>Lain-lain</option>
                    </select>
                </div>
                 <div class="form-group">
                    <label for="tanggal_kadaluarsa">Tgl. Kadaluarsa (jika ada)</label>
                    <input type="date" name="tanggal_kadaluarsa" id="tanggal_kadaluarsa" class="form-control">
                </div>
            </div>

            <div class="form-group"><label for="file">Pilih File (PDF, JPG, PNG, DOCX - Maks 5MB)</label><input type="file" name="file" id="file" class="form-control" required></div>
            <button type="submit" class="btn btn-primary">Upload Dokumen</button>
        </form>
    </div>
</div>
<div class="card">
    <div class="card-header"><h4>Dokumen Ter-upload</h4></div>
    <div class="card-body">
        <div class="table-responsive">
            <table>
                <thead>
                    <tr><th>Nama Dokumen</th><th>Kategori</th><th>Tgl Kadaluarsa</th><th>Tgl Upload</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                <?php
                $sql_docs = "SELECT * FROM dokumen_pendukung WHERE tanah_id = ? ORDER BY uploaded_at DESC";
                $stmt_docs = mysqli_prepare($conn, $sql_docs); 
                mysqli_stmt_bind_param($stmt_docs, "i", $tanah_id);
                mysqli_stmt_execute($stmt_docs); 
                $result_docs = mysqli_stmt_get_result($stmt_docs);
                if(mysqli_num_rows($result_docs) > 0) {
                    while($doc = mysqli_fetch_assoc($result_docs)) {
                        echo "<tr>";
                        echo "<td>" . htmlspecialchars($doc['nama_dokumen']) . "</td>";
                        echo "<td>" . htmlspecialchars($doc['kategori_dokumen']) . "</td>";
                        echo "<td>" . (!empty($doc['tanggal_kadaluarsa']) ? date('d M Y', strtotime($doc['tanggal_kadaluarsa'])) : '-') . "</td>";
                        echo "<td>" . date('d M Y, H:i', strtotime($doc['uploaded_at'])) . "</td>";
                        echo "<td><a href='".htmlspecialchars($doc['path_file'])."' target='_blank' class='btn btn-sm btn-info'><i class='fas fa-download'></i> Lihat</a></td>";
                        echo "</tr>";
                    }
                } else { 
                    echo "<tr><td colspan='5' style='text-align:center;'>Belum ada dokumen yang diunggah.</td></tr>";
                }
                ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<?php include 'templates/footer.php'; ?>