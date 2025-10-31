<?php
include 'templates/header.php';
// Hanya Admin yang boleh melihat halaman ini
if ($_SESSION['role_id'] != 1) {
    header('Location: index.php');
    exit();
}

// --- Ambil data untuk filter dropdown ---
// Ambil semua pengguna
$users_result = mysqli_query($conn, "SELECT id, nama_lengkap FROM users ORDER BY nama_lengkap ASC");
// Ambil semua jenis aksi yang unik
$actions_result = mysqli_query($conn, "SELECT DISTINCT aksi FROM log_aktivitas ORDER BY aksi ASC");


// --- Logika Filter & Pencarian ---
$search_term = $_GET['search'] ?? '';
$filter_user = isset($_GET['user_id']) ? (int)$_GET['user_id'] : '';
$filter_aksi = $_GET['aksi'] ?? '';
$start_date = $_GET['start_date'] ?? '';
$end_date = $_GET['end_date'] ?? '';

$base_sql = "FROM log_aktivitas l LEFT JOIN users u ON l.user_id = u.id";
$where_clauses = [];
$bind_types = "";
$bind_params = [];

if (!empty($search_term)) {
    $where_clauses[] = "(u.nama_lengkap LIKE ? OR l.deskripsi LIKE ?)";
    $bind_types .= "ss";
    $search_like = "%" . $search_term . "%";
    $bind_params[] = $search_like;
    $bind_params[] = $search_like;
}
if (!empty($filter_user)) {
    $where_clauses[] = "l.user_id = ?";
    $bind_types .= "i";
    $bind_params[] = $filter_user;
}
if (!empty($filter_aksi)) {
    $where_clauses[] = "l.aksi = ?";
    $bind_types .= "s";
    $bind_params[] = $filter_aksi;
}
if (!empty($start_date)) {
    $where_clauses[] = "DATE(l.timestamp) >= ?";
    $bind_types .= "s";
    $bind_params[] = $start_date;
}
if (!empty($end_date)) {
    $where_clauses[] = "DATE(l.timestamp) <= ?";
    $bind_types .= "s";
    $bind_params[] = $end_date;
}

$where_sql = "";
if (!empty($where_clauses)) {
    $where_sql = " WHERE " . implode(" AND ", $where_clauses);
}

// --- Logika Pagination ---
$limit = 20;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $limit;

// Ambil total data untuk pagination (dengan filter)
$count_sql = "SELECT COUNT(l.id) as total " . $base_sql . $where_sql;
$stmt_count = mysqli_prepare($conn, $count_sql);
if (!empty($bind_params)) {
    mysqli_stmt_bind_param($stmt_count, $bind_types, ...$bind_params);
}
mysqli_stmt_execute($stmt_count);
$total_rows = mysqli_stmt_get_result($stmt_count)->fetch_assoc()['total'];
$total_pages = ceil($total_rows / $limit);

// Ambil data log sesuai halaman (dengan filter)
$sql = "SELECT l.*, u.nama_lengkap, u.username " . $base_sql . $where_sql . " ORDER BY l.timestamp DESC LIMIT ? OFFSET ?";
$bind_types .= "ii";
$bind_params[] = $limit;
$bind_params[] = $offset;

$stmt = mysqli_prepare($conn, $sql);
if (!empty($bind_params)) {
    mysqli_stmt_bind_param($stmt, $bind_types, ...$bind_params);
}
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// Buat query string untuk link pagination agar filter tetap ada
$query_params = $_GET;
unset($query_params['page']);
$query_string = http_build_query($query_params);
?>

<div class="content-header">
    <h1>Log Aktivitas Sistem</h1>
</div>

<div class="card">
    <div class="card-header">
        <h4><i class="fas fa-search"></i> Filter & Cari Log Aktivitas</h4>
    </div>
    <div class="card-body">
        <form method="GET" action="log_aktivitas.php" class="filter-form">
            <div style="flex-grow: 2; min-width: 250px;">
                <input type="text" name="search" class="form-control" placeholder="Cari deskripsi atau nama..." value="<?php echo htmlspecialchars($search_term); ?>">
            </div>
            <div>
                <select name="user_id" class="form-control">
                    <option value="">-- Semua Pengguna --</option>
                    <?php while($user = mysqli_fetch_assoc($users_result)): ?>
                        <option value="<?php echo $user['id']; ?>" <?php if($filter_user == $user['id']) echo 'selected'; ?>>
                            <?php echo htmlspecialchars($user['nama_lengkap']); ?>
                        </option>
                    <?php endwhile; ?>
                </select>
            </div>
            <div>
                <select name="aksi" class="form-control">
                    <option value="">-- Semua Aksi --</option>
                     <?php while($action = mysqli_fetch_assoc($actions_result)): ?>
                        <option value="<?php echo htmlspecialchars($action['aksi']); ?>" <?php if($filter_aksi == $action['aksi']) echo 'selected'; ?>>
                            <?php echo htmlspecialchars(str_replace('_', ' ', $action['aksi'])); ?>
                        </option>
                    <?php endwhile; ?>
                </select>
            </div>
            <div title="Tanggal Mulai"><input type="date" name="start_date" class="form-control" value="<?php echo htmlspecialchars($start_date); ?>"></div>
            <div title="Tanggal Selesai"><input type="date" name="end_date" class="form-control" value="<?php echo htmlspecialchars($end_date); ?>"></div>
            <div>
                <button type="submit" class="btn btn-primary"><i class="fas fa-search"></i> Terapkan</button>
                <a href="log_aktivitas.php" class="btn btn-secondary">Reset</a>
            </div>
        </form>
    </div>
</div>

<div class="card">
    <div class="card-header"><h4>Riwayat Aktivitas (Total ditemukan: <?php echo $total_rows; ?>)</h4></div>
    <div class="card-body">
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Waktu</th>
                        <th>Pengguna</th>
                        <th>Aksi</th>
                        <th>Deskripsi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (mysqli_num_rows($result) > 0): ?>
                        <?php while ($row = mysqli_fetch_assoc($result)): ?>
                        <tr>
                            <td><?php echo date('d M Y, H:i:s', strtotime($row['timestamp'])); ?></td>
                            <td><?php echo htmlspecialchars($row['nama_lengkap'] ?? $row['username'] ?? 'Sistem'); ?></td>
                            <td><span class="status <?php echo strtolower(str_replace('_','-',$row['aksi'])); ?>"><?php echo htmlspecialchars(str_replace('_',' ',$row['aksi'])); ?></span></td>
                            <td><?php echo htmlspecialchars($row['deskripsi']); ?></td>
                        </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="4" style="text-align:center; padding: 2rem;">Tidak ada aktivitas yang cocok dengan kriteria filter Anda.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <?php if($total_pages > 1): ?>
        <div class="pagination" style="margin-top: 1.5rem;">
            <?php if ($page > 1): ?><a href="?page=<?php echo $page - 1; ?>&<?php echo $query_string; ?>">« Sebelumnya</a><?php endif; ?>
            
            <?php for ($i = 1; $i <= $total_pages; $i++): ?>
                <a href="?page=<?php echo $i; ?>&<?php echo $query_string; ?>" class="<?php if ($i == $page) echo 'active'; ?>"><?php echo $i; ?></a>
            <?php endfor; ?>

            <?php if ($page < $total_pages): ?><a href="?page=<?php echo $page + 1; ?>&<?php echo $query_string; ?>">Berikutnya »</a><?php endif; ?>
        </div>
        <?php endif; ?>
    </div>
</div>
<?php include 'templates/footer.php'; ?>