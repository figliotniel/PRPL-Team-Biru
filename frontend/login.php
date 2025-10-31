<?php
require_once 'config.php';
// Jika sudah login, redirect ke dashboard
if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - SITANAS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-branding">
            <div class="branding-logo"><i class="fas fa-landmark"></i></div>
            <h1 class="branding-title">SITANAS</h1>
            <p class="branding-description">Sistem Informasi Tanah Kas Desa untuk pengelolaan aset yang transparan dan efisien.</p>
        </div>

        <div class="auth-form-wrapper">
            <div class="auth-form-container">
                <div class="form-header">
                    <h2>Selamat Datang Kembali</h2>
                    <p>Silakan masuk untuk melanjutkan ke dashboard.</p>
                </div>
                <?php $error = get_flash_message('error'); if ($error): ?><div class="notification error" style="margin: 0 0 1.5rem 0;"><?php echo $error; ?></div><?php endif; ?>
                <?php $success = get_flash_message('success'); if ($success): ?><div class="notification success" style="margin: 0 0 1.5rem 0;"><?php echo $success; ?></div><?php endif; ?>

                <form action="proses_login.php" method="POST">
                    <div class="input-group">
                        <label for="role_id">Login Sebagai</label>
                        <select id="role_id" name="role_id" class="input-field" required>
                            <option value="" disabled selected>-- Pilih Peran Anda --</option>
                            <option value="1">Admin Desa</option>
                            <option value="2">Kepala Desa</option>
                            <option value="3">BPD (Pengawas)</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" class="input-field" required placeholder="Masukkan username">
                    </div>
                    <div class="input-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" class="input-field" required placeholder="Masukkan password">
                        <span class="password-toggle" onclick="togglePasswordVisibility('password')"><i class="fas fa-eye"></i></span>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1.5rem;">Login</button>
                </form>
                <div class="form-footer" style="text-align: center; margin-top: 1.5rem;">
                    <p>Belum punya akun? <a href="register.php"><b>Daftar di sini</b></a></p>
                </div>
                <div class="divider">atau</div>
                <a href="publik.php" class="btn btn-secondary btn-block">Lihat Informasi Publik</a>
            </div>
        </div>
    </div>
    <script src="assets/js/script.js"></script>
</body>
</html>