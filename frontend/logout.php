<?php
require_once 'config.php';

if (isset($_SESSION['user_id'])) {
    buat_log($conn, $_SESSION['user_id'], 'LOGOUT', "User '{$_SESSION['username']}' telah logout.");
}

// Hapus semua variabel session
$_SESSION = [];

// Hancurkan session
session_destroy();

// Redirect ke halaman login dengan pesan
session_start();
set_flash_message('success', 'Anda telah berhasil logout.');
header('Location: login.php');
exit();