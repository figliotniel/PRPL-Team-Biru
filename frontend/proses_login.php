<?php
require_once 'config.php';
$username = $_POST['username'];
$password = $_POST['password'];
$role_id = $_POST['role_id'];

if (empty($username) || empty($password) || empty($role_id)) {
    set_flash_message('error', 'Semua kolom harus diisi.');
    header('Location: login.php');
    exit();
}

$sql = "SELECT users.*, roles.nama_role FROM users JOIN roles ON users.role_id = roles.id WHERE username = ? AND users.role_id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "si", $username, $role_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($user = mysqli_fetch_assoc($result)) {
    if (password_verify($password, $user['password'])) {
        // Regenerate session ID on login to prevent session fixation
        session_regenerate_id(true);

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['nama_lengkap'] = $user['nama_lengkap'];
        $_SESSION['role_id'] = $user['role_id'];
        $_SESSION['role_name'] = $user['nama_role'];
        $_SESSION['foto_profil'] = $user['foto_profil'];

        // Buat log aktivitas login
        buat_log($conn, $user['id'], 'LOGIN', "User '{$user['username']}' berhasil login.");

        header('Location: index.php');
        exit();
    }
}
set_flash_message('error', 'Kombinasi Peran, Username, atau Password salah.');
header('Location: login.php');
exit();