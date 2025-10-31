<?php
include 'templates/header.php';

// Ambil data user yang sedang login dari database untuk memastikan data terbaru
$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM users WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$user_data = mysqli_stmt_get_result($stmt)->fetch_assoc();

// Set path foto profil default jika tidak ada atau file tidak ditemukan
$foto_profil = $user_data['foto_profil'] ?? 'assets/images/default-avatar.png';
if (empty($user_data['foto_profil']) || !file_exists($user_data['foto_profil'])) {
    $foto_profil = 'assets/images/default-avatar.png';
}
?>

<div class="content-header">
    <h1>Profil Pengguna</h1>
</div>

<div class="profile-grid">
    <div class="card profile-card">
        <div class="card-body">
            <img src="<?php echo htmlspecialchars($foto_profil); ?>" alt="Foto Profil" class="profile-avatar-lg">
            <h3 class="profile-name"><?php echo htmlspecialchars($user_data['nama_lengkap']); ?></h3>
            <p class="profile-role"><?php echo htmlspecialchars($_SESSION['role_name']); ?></p>
            
            <hr>
            
            <form action="proses_profile.php" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="aksi" value="update_foto">
                <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                <div class="form-group">
                    <label for="foto">Ubah/Upload Foto Profil (JPG/PNG, Maks 2MB)</label>
                    <input type="file" name="foto" id="foto" class="form-control" required accept=".jpg,.jpeg,.png">
                </div>
                <button type="submit" class="btn btn-primary btn-block">Upload Foto</button>
            </form>

            <?php if (!empty($user_data['foto_profil']) && file_exists($user_data['foto_profil'])): ?>
                <form action="proses_profile.php" method="POST" onsubmit="return confirm('Anda yakin ingin menghapus foto profil?');" style="margin-top: 10px;">
                    <input type="hidden" name="aksi" value="hapus_foto">
                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                    <button type="submit" class="btn btn-danger btn-sm btn-block">Hapus Foto</button>
                </form>
            <?php endif; ?>

        </div>
    </div>

    <div class="profile-details">
        <div class="card">
            <div class="card-header"><h4>Ubah Data Diri</h4></div>
            <div class="card-body">
                <form action="proses_profile.php" method="POST">
                    <input type="hidden" name="aksi" value="update_data">
                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                    <div class="form-group">
                        <label for="nama_lengkap">Nama Lengkap</label>
                        <input type="text" id="nama_lengkap" name="nama_lengkap" class="form-control" value="<?php echo htmlspecialchars($user_data['nama_lengkap']); ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" class="form-control" value="<?php echo htmlspecialchars($user_data['username']); ?>" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Simpan Perubahan Data</button>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h4>Ubah Password</h4></div>
            <div class="card-body">
                <form action="proses_profile.php" method="POST">
                    <input type="hidden" name="aksi" value="update_password">
                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                    <div class="form-group">
                        <label for="password_lama">Password Saat Ini</label>
                        <input type="password" id="password_lama" name="password_lama" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="password_baru">Password Baru (Min. 6 karakter)</label>
                        <input type="password" id="password_baru" name="password_baru" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="konfirmasi_password">Konfirmasi Password Baru</label>
                        <input type="password" id="konfirmasi_password" name="konfirmasi_password" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-danger">Ubah Password</button>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include 'templates/footer.php'; ?>