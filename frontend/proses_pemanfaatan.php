<?php
require_once 'config.php';
if (!isset($_SESSION['user_id']) || $_SESSION['role_id'] != 1) {
    header('Location: index.php');
    exit();
}

// Verifikasi CSRF Token
if (!isset($_POST['csrf_token']) || !verify_csrf_token($_POST['csrf_token'])) {
    set_flash_message('error', 'Aksi tidak valid atau sesi telah berakhir.');
    header('Location: ' . ($_SERVER['HTTP_REFERER'] ?? 'index.php'));
    exit();
}

// Pastikan semua data yang dibutuhkan ada
if (!isset($_POST['tanah_id'])) {
    set_flash_message('error', 'Aksi tidak valid, ID tanah tidak ditemukan.');
    header('Location: index.php');
    exit();
}

$tanah_id = $_POST['tanah_id'];
$current_user_id = $_SESSION['user_id'];
$current_username = $_SESSION['username'];
$db_path = null;

// --- PROSES UPLOAD FILE BUKTI (JIKA ADA) ---
if (isset($_FILES['path_bukti']) && $_FILES['path_bukti']['error'] == 0) {
    $allowed_types = ['application/pdf', 'image/jpeg', 'image/png'];
    $max_size = 5 * 1024 * 1024; // 5 MB

    if (in_array($_FILES['path_bukti']['type'], $allowed_types) && $_FILES['path_bukti']['size'] <= $max_size) {
        $upload_subdir = UPLOAD_DIR . 'pemanfaatan/';
        if (!file_exists($upload_subdir)) {
            mkdir($upload_subdir, 0777, true);
        }

        $filename = time() . '_' . basename(str_replace(' ', '_', $_FILES["path_bukti"]["name"]));
        $target_file = $upload_subdir . $filename;
        $db_path = 'uploads/pemanfaatan/' . $filename; 

        if (!move_uploaded_file($_FILES['path_bukti']['tmp_name'], $target_file)) {
            set_flash_message('error', 'Gagal memindahkan file bukti yang diunggah.');
            header('Location: tambah_pemanfaatan.php?tanah_id=' . $tanah_id);
            exit();
        }
    } else {
        set_flash_message('error', 'Tipe file bukti tidak diizinkan atau ukuran terlalu besar (Maks 5MB).');
        header('Location: tambah_pemanfaatan.php?tanah_id=' . $tanah_id);
        exit();
    }
}

// --- PROSES INSERT DATA KE DATABASE ---
$sql = "INSERT INTO pemanfaatan_tanah (tanah_id, bentuk_pemanfaatan, pihak_ketiga, tanggal_mulai, tanggal_selesai, nilai_kontribusi, status_pembayaran, path_bukti, keterangan, diinput_oleh)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql);

// Ambil semua data dari POST
$bentuk = $_POST['bentuk_pemanfaatan'];
$pihak_ketiga = $_POST['pihak_ketiga'];
$tgl_mulai = $_POST['tanggal_mulai'];
$tgl_selesai = $_POST['tanggal_selesai'];
$nilai = $_POST['nilai_kontribusi'] ?? 0;
$status_bayar = $_POST['status_pembayaran'];
$keterangan = $_POST['keterangan'];

mysqli_stmt_bind_param($stmt, "issssdsdsi",
    $tanah_id, $bentuk, $pihak_ketiga, $tgl_mulai, $tgl_selesai,
    $nilai, $status_bayar, $db_path, $keterangan, $current_user_id
);

if (mysqli_stmt_execute($stmt)) {
    set_flash_message('success', 'Data pemanfaatan berhasil ditambahkan.');
    $log_deskripsi = "Menambahkan riwayat pemanfaatan '$bentuk' oleh '$pihak_ketiga' untuk aset ID: $tanah_id.";
    buat_log($conn, $current_user_id, 'TAMBAH_PEMANFAATAN', $log_deskripsi);
    buat_histori($conn, $tanah_id, $current_user_id, 'PEMANFAATAN', $log_deskripsi);
} else {
    set_flash_message('error', 'Gagal menyimpan data pemanfaatan: ' . mysqli_error($conn));
}

mysqli_stmt_close($stmt);
header('Location: detail.php?id=' . $tanah_id);
exit();