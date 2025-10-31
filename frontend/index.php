<?php
include 'templates/header.php';
$role_id = $_SESSION['role_id'];

// --- STATISTIK DASHBOARD ---
$total_aset = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(id) as total FROM tanah_kas_desa"))['total'];
$total_luas = mysqli_fetch_assoc(mysqli_query($conn, "SELECT SUM(luas) as total FROM tanah_kas_desa WHERE status_validasi = 'Disetujui'"))['total'];
$aset_diproses = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(id) as total FROM tanah_kas_desa WHERE status_validasi = 'Diproses'"))['total'];
$aset_disetujui = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(id) as total FROM tanah_kas_desa WHERE status_validasi = 'Disetujui'"))['total'];


// --- LOGIKA PAGINATION & FILTER ---
$limit = 10; // Jumlah data per halaman
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $limit;

$search_term = $_GET['search'] ?? ''; 
$filter_status = $_GET['status'] ?? '';

$base_sql = "SELECT t.*, u.nama_lengkap as nama_penginput FROM tanah_kas_desa t LEFT JOIN users u ON t.diinput_oleh = u.id";
$count_sql = "SELECT COUNT(t.id) as total FROM tanah_kas_desa t";

$where_clauses = []; 
$bind_types = ""; 
$bind_params = [];

if ($role_id == 3) { $where_clauses[] = "t.status_validasi = 'Disetujui'"; }

if (!empty($filter_status)) { 
    $where_clauses[] = "t.status_validasi = ?"; 
    $bind_types .= "s"; 
    $bind_params[] = $filter_status; 
}
if (!empty($search_term)) {
    $where_clauses[] = "(t.kode_barang LIKE ? OR t.asal_perolehan LIKE ? OR t.nomor_sertifikat LIKE ? OR t.lokasi LIKE ?)";
    $bind_types .= "ssss"; 
    $search_like = "%" . $search_term . "%";
    $bind_params = array_merge($bind_params, [$search_like, $search_like, $search_like, $search_like]);
}

if (!empty($where_clauses)) { 
    $where_sql = " WHERE " . implode(" AND ", $where_clauses);
    $base_sql .= $where_sql;
    $count_sql .= $where_sql;
}

// Get total rows for pagination
$stmt_count = mysqli_prepare($conn, $count_sql);
if (!empty($bind_params)) { mysqli_stmt_bind_param($stmt_count, $bind_types, ...$bind_params); }
mysqli_stmt_execute($stmt_count);
$total_rows = mysqli_stmt_get_result($stmt_count)->fetch_assoc()['total'];
$total_pages = ceil($total_rows / $limit);

// Get data for current page
$base_sql .= " ORDER BY t.status_validasi = 'Diproses' DESC, t.created_at DESC LIMIT ? OFFSET ?";
$bind_types .= "ii";
$bind_params[] = $limit;
$bind_params[] = $offset;

$stmt = mysqli_prepare($conn, $base_sql);
if (!empty($bind_params)) { mysqli_stmt_bind_param($stmt, $bind_types, ...$bind_params); }
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
?>

<div class="content-header">
    <h1>Dashboard Aset Tanah</h1>
    <div>
        <?php if ($role_id == 1): ?><a href="tambah.php" class="btn btn-primary"><i class="fas fa-plus"></i> Tambah Data Tanah</a><?php endif; ?>
        <a href="laporan.php" class="btn btn-info"><i class="fas fa-file-alt"></i> Lihat Laporan</a>
    </div>
</div>

<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-icon" style="background-color: #eaf5ff;"><i class="fas fa-landmark" style="color: #3b82f6;"></i></div>
        <div class="stat-info">
            <span class="stat-value"><?php echo $total_aset; ?></span>
            <span class="stat-label">Total Aset Tercatat</span>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon" style="background-color: #e6f9f0;"><i class="fas fa-ruler-combined" style="color: #22c55e;"></i></div>
        <div class="stat-info">
            <span class="stat-value"><?php echo number_format($total_luas ?? 0, 2, ',', '.'); ?> m²</span>
            <span class="stat-label">Total Luas Disetujui</span>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon" style="background-color: #fffbeb;"><i class="fas fa-hourglass-half" style="color: #f59e0b;"></i></div>
        <div class="stat-info">
            <span class="stat-value"><?php echo $aset_diproses; ?></span>
            <span class="stat-label">Aset Menunggu Validasi</span>
        </div>
    </div>
     <div class="stat-card">
        <div class="stat-icon" style="background-color: #e0f2fe;"><i class="fas fa-check-circle" style="color: #0ea5e9;"></i></div>
        <div class="stat-info">
            <span class="stat-value"><?php echo $aset_disetujui; ?></span>
            <span class="stat-label">Aset Telah Disetujui</span>
        </div>
    </div>
</div>


<div class="card">
    <div class="card-header">
        <h4>Daftar Aset Tanah (<?php echo $total_rows; ?> data ditemukan)</h4>
    </div>
    <div class="card-body">
        <form method="GET" action="index.php" class="filter-form">
            <input type="text" name="search" class="form-control" placeholder="Cari kode, asal, no. sertifikat..." value="<?php echo htmlspecialchars($search_term); ?>">
            <?php if($role_id != 3) : ?>
            <select name="status" class="form-control">
                <option value="">Semua Status</option>
                <option value="Diproses" <?php if($filter_status == 'Diproses') echo 'selected'; ?>>Diproses</option>
                <option value="Disetujui" <?php if($filter_status == 'Disetujui') echo 'selected'; ?>>Disetujui</option>
                <option value="Ditolak" <?php if($filter_status == 'Ditolak') echo 'selected'; ?>>Ditolak</option>
            </select>
            <?php endif; ?>
            <button type="submit" class="btn btn-primary"><i class="fas fa-search"></i> Cari</button>
            <a href="index.php" class="btn btn-secondary">Reset</a>
        </form>

        <div class="table-responsive" style="margin-top: 20px;">
            <table>
                 <thead>
                    <tr><th>No</th><th>Kode</th><th>Asal</th><th>Luas (m²)</th><th>Penggunaan</th><th>Status</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                    <?php if (mysqli_num_rows($result) > 0): 
                        $no = $offset + 1; 
                        while ($row = mysqli_fetch_assoc($result)): ?>
                        <tr>
                            <td><?php echo $no++; ?></td>
                            <td><?php echo htmlspecialchars($row['kode_barang'] ?? '-'); ?></td>
                            <td><?php echo htmlspecialchars($row['asal_perolehan']); ?></td>
                            <td><?php echo number_format($row['luas'], 2, ',', '.'); ?></td>
                            <td><?php echo htmlspecialchars($row['penggunaan'] ?? '-'); ?></td>
                            <td><span class="status <?php echo strtolower($row['status_validasi']); ?>"><?php echo htmlspecialchars($row['status_validasi']); ?></span></td>
                            <td class="action-buttons">
                                <a href="detail.php?id=<?php echo $row['id']; ?>" class="btn btn-sm btn-info" title="Lihat Detail"><i class="fas fa-eye"></i></a>
                                
                                <?php if ($role_id == 1): // Admin Actions ?>
                                    <a href="upload.php?id=<?php echo $row['id']; ?>" class="btn btn-sm btn-secondary" title="Upload Dokumen"><i class="fas fa-upload"></i></a>
                                    <a href="edit.php?id=<?php echo $row['id']; ?>" class="btn btn-sm btn-warning" title="Edit Data"><i class="fas fa-edit"></i></a>
                                    <form action="proses_crud.php" method="POST" style="display:inline;" onsubmit="return confirm('Yakin ingin menghapus data ini secara permanen?');">
                                    <input type="hidden" name="aksi" value="hapus">
                                    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                                    <button type="submit" class="btn btn-sm btn-danger" title="Hapus Data"><i class="fas fa-trash"></i></button>
                                </form>
                                <?php endif; ?>

                                <?php if ($role_id == 2 && $row['status_validasi'] == 'Diproses'): // Kades Actions ?>
                                    <button onclick="openValidationModal('Disetujui', <?php echo $row['id']; ?>)" class="btn btn-sm btn-success" title="Setujui"><i class="fas fa-check"></i></button>
                                    <button onclick="openValidationModal('Ditolak', <?php echo $row['id']; ?>)" class="btn btn-sm btn-danger" title="Tolak"><i class="fas fa-times"></i></button>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endwhile; else: ?>
                        <tr><td colspan="7" style="text-align:center;">Data tidak ditemukan. Coba reset filter atau kata kunci pencarian.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        
        <div class="pagination">
            <?php if ($page > 1): ?>
                <a href="?page=<?php echo $page - 1; ?>&search=<?php echo $search_term; ?>&status=<?php echo $filter_status; ?>">« Sebelumnya</a>
            <?php endif; ?>
            
            <?php for ($i = 1; $i <= $total_pages; $i++): ?>
                <a href="?page=<?php echo $i; ?>&search=<?php echo $search_term; ?>&status=<?php echo $filter_status; ?>" class="<?php if ($i == $page) echo 'active'; ?>"><?php echo $i; ?></a>
            <?php endfor; ?>

            <?php if ($page < $total_pages): ?>
                <a href="?page=<?php echo $page + 1; ?>&search=<?php echo $search_term; ?>&status=<?php echo $filter_status; ?>">Berikutnya »</a>
            <?php endif; ?>
        </div>

    </div>
</div>

<div id="validationModal" class="modal">
    <div class="modal-content">
        <span class="close-button" onclick="closeValidationModal()">&times;</span>
        <h3 id="modalTitle">Konfirmasi Validasi</h3>
        <p>Anda akan memvalidasi aset ini. Berikan catatan jika diperlukan (opsional).</p>
        <form action="proses_crud.php" method="POST">
            <input type="hidden" name="aksi" value="validasi">
            <input type="hidden" name="id" id="modalAsetId">
            <input type="hidden" name="status" id="modalStatus">
            <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
            
            <div class="form-group">
                <label for="catatan_validasi">Catatan Validasi</label>
                <textarea id="catatan_validasi" name="catatan_validasi" class="form-control" rows="3"></textarea>
            </div>
            
            <button type="submit" id="modalSubmitButton" class="btn">Konfirmasi</button>
            <button type="button" class="btn btn-secondary" onclick="closeValidationModal()">Batal</button>
        </form>
    </div>
</div>


<?php include 'templates/footer.php'; ?>