<?php require_once 'config.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buat Akun - SITANAS</title>
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
                    <h2>Buat Akun Baru</h2>
                    <p>Lengkapi data di bawah untuk mendaftar.</p>
                </div>
                <?php $error = get_flash_message('error'); if ($error): ?><div class="notification error" style="margin: 0 0 1.5rem 0;"><?php echo $error; ?></div><?php endif; ?>

                <form action="proses_register.php" method="POST">
                    <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">
                    <div class="input-group">
                        <label for="nama_lengkap">Nama Lengkap</label>
                        <input type="text" id="nama_lengkap" name="nama_lengkap" class="input-field" required>
                    </div>
                    <div class="input-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" class="input-field" required>
                    </div>
                    <div class="input-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" class="input-field" required>
                         <span class="password-toggle" onclick="togglePasswordVisibility('password')"><i class="fas fa-eye"></i></span>
                    </div>
                     <div class="input-group">
                        <label for="role_id">Daftar Sebagai</label>
                        <select id="role_id" name="role_id" class="input-field" required>
                            <option value="" disabled selected>-- Pilih Peran --</option>
                            <option value="1">Admin Desa</option>
                            <option value="2">Kepala Desa</option>
                            <option value="3">BPD (Pengawas)</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Buat Akun</button>
                </form>
                <div class="form-footer" style="text-align: center; margin-top: 1.5rem;">
                    <p>Sudah punya akun? <a href="login.php"><b>Login di sini</b></a></p>
                </div>
            </div>
        </div>
    </div>
    <script src="assets/js/script.js"></script>
</body>
</html>