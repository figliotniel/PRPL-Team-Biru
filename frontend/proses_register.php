<?php
require_once 'config.php';

// Verifikasi CSRF Token
if (!isset($_POST['csrf_token']) || !verify_csrf_token($_POST['csrf_token'])) {
    set_flash_message('error', 'Sesi tidak valid. Silakan coba mendaftar lagi.');
    header('Location: register.php');
    exit();
}

$nama_lengkap = $_POST['nama_lengkap'];
$username = $_POST['username'];
$password = $_POST['password'];
$role_id = $_POST['role_id'];

if (empty($nama_lengkap) || empty($username) || empty($password) || empty($role_id)) {
    set_flash_message('error', 'Semua kolom wajib diisi.');
    header('Location: register.php');
    exit();
}

// Cek apakah username sudah ada
$sql_check = "SELECT id FROM users WHERE username = ?";
$stmt_check = mysqli_prepare($conn, $sql_check);
mysqli_stmt_bind_param($stmt_check, "s", $username);
mysqli_stmt_execute($stmt_check);
mysqli_stmt_store_result($stmt_check);

if (mysqli_stmt_num_rows($stmt_check) > 0) {
    set_flash_message('error', 'Username sudah digunakan, silakan pilih yang lain.');
    header('Location: register.php');
    exit();
}
mysqli_stmt_close($stmt_check);

// Insert user baru
$hashed_password = password_hash($password, PASSWORD_BCRYPT);
$sql_insert = "INSERT INTO users (nama_lengkap, username, password, role_id) VALUES (?, ?, ?, ?)";
$stmt_insert = mysqli_prepare($conn, $sql_insert);
mysqli_stmt_bind_param($stmt_insert, "sssi", $nama_lengkap, $username, $hashed_password, $role_id);

if (mysqli_stmt_execute($stmt_insert)) {
    $new_user_id = mysqli_insert_id($conn);
    buat_log($conn, $new_user_id, 'REGISTER', "User baru '{$username}' telah terdaftar.");
    set_flash_message('success', 'Akun berhasil dibuat! Silakan login.');
    header('Location: login.php');
} else {
    set_flash_message('error', 'Terjadi kesalahan. Gagal membuat akun.');
    header('Location: register.php');
}
mysqli_stmt_close($stmt_insert);
exit();