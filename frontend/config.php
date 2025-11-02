<?php
session_start();

$db_host = '127.0.0.1';
$db_user = 'root';
$db_pass = 'root';
$db_name = 'sitanas';
$port = 3306;

define('BASE_URL', 'http://127.0.0.1:8000');
define('UPLOAD_DIR', __DIR__ . '/uploads/');

// --- KONEKSI KE DATABASE ---
$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name, $port);
if (!$conn) {
    die("Koneksi Gagal: " . mysqli_connect_error());
}

// --- FUNGSI HELPER ---
function set_flash_message($key, $message) {
    $_SESSION['flash_messages'][$key] = $message;
}

function get_flash_message($key) {
    if (isset($_SESSION['flash_messages'][$key])) {
        $message = $_SESSION['flash_messages'][$key];
        unset($_SESSION['flash_messages'][$key]);
        return $message;
    }
    return null;
}

// --- FUNGSI KEAMANAN CSRF ---
function generate_csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// --- FUNGSI LOG & NOTIFIKASI TERPUSAT ---
function buat_log($conn, $user_id, $aksi, $deskripsi) {
    $sql = "INSERT INTO log_aktivitas (user_id, aksi, deskripsi) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "iss", $user_id, $aksi, $deskripsi);
    mysqli_stmt_execute($stmt);
}

function buat_histori($conn, $tanah_id, $user_id, $aksi, $deskripsi) {
    $sql = "INSERT INTO histori_tanah (tanah_id, user_id, aksi, deskripsi_perubahan) VALUES (?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "iiss", $tanah_id, $user_id, $aksi, $deskripsi);
    mysqli_stmt_execute($stmt);
}

function buat_notifikasi($conn, $user_id_tujuan, $pesan, $link) {
    $sql = "INSERT INTO notifikasi (user_id_tujuan, pesan, link) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "iss", $user_id_tujuan, $pesan, $link);
    mysqli_stmt_execute($stmt);
}

// --- FUNGSI UNTUK MENGAMBIL NOTIFIKASI ---
function get_notifications($conn, $user_id) {
    $sql = "SELECT * FROM notifikasi WHERE user_id_tujuan = ? ORDER BY timestamp DESC LIMIT 10";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $user_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    return mysqli_fetch_all($result, MYSQLI_ASSOC);
}
