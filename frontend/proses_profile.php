<?php
require_once 'config.php';
if (!isset($_SESSION['user_id'])) { header('Location: login.php'); exit(); }

// Verifikasi CSRF Token untuk semua request POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf_token']) || !verify_csrf_token($_POST['csrf_token'])) {
        set_flash_message('error', 'Aksi tidak valid atau sesi telah berakhir. Silakan coba lagi.');
        header('Location: profile.php');
        exit();
    }
}

$aksi = $_POST['aksi'] ?? $_GET['aksi'] ?? '';
$user_id = $_SESSION['user_id'];

// --- Aksi: Update Data Diri ---
if ($aksi == 'update_data') {
    $nama_lengkap = trim($_POST['nama_lengkap']);
    $username = trim($_POST['username']);
    
    // Cek duplikasi username
    $sql_check = "SELECT id FROM users WHERE username = ? AND id != ?";
    $stmt_check = mysqli_prepare($conn, $sql_check);
    mysqli_stmt_bind_param($stmt_check, "si", $username, $user_id);
    mysqli_stmt_execute($stmt_check);
    mysqli_stmt_store_result($stmt_check);

    if (mysqli_stmt_num_rows($stmt_check) > 0) {
        set_flash_message('error', 'Username sudah digunakan oleh pengguna lain.');
    } else {
        $sql = "UPDATE users SET nama_lengkap = ?, username = ? WHERE id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ssi", $nama_lengkap, $username, $user_id);
        if (mysqli_stmt_execute($stmt)) {
            $_SESSION['nama_lengkap'] = $nama_lengkap; 
            $_SESSION['username'] = $username;
            set_flash_message('success', 'Data diri berhasil diperbarui.');
            buat_log($conn, $user_id, 'UPDATE_PROFIL', "User '{$_SESSION['username']}' memperbarui data dirinya.");
        } else {
            set_flash_message('error', 'Gagal memperbarui data diri.');
        }
    }
    mysqli_stmt_close($stmt_check);
}

// --- Aksi: Update Password ---
elseif ($aksi == 'update_password') {
    $password_lama = $_POST['password_lama'];
    $password_baru = $_POST['password_baru'];
    $konfirmasi_password = $_POST['konfirmasi_password'];

    $sql_user = "SELECT password FROM users WHERE id = ?";
    $stmt_user = mysqli_prepare($conn, $sql_user);
    mysqli_stmt_bind_param($stmt_user, "i", $user_id);
    mysqli_stmt_execute($stmt_user);
    $result_user = mysqli_stmt_get_result($stmt_user);
    $user = mysqli_fetch_assoc($result_user);

    if (!password_verify($password_lama, $user['password'])) {
        set_flash_message('error', 'Password saat ini salah.');
    } elseif (strlen($password_baru) < 6) {
        set_flash_message('error', 'Password baru minimal harus 6 karakter.');
    } elseif ($password_baru !== $konfirmasi_password) {
        set_flash_message('error', 'Konfirmasi password baru tidak cocok.');
    } else {
        $hashed_password = password_hash($password_baru, PASSWORD_BCRYPT);
        $sql_update = "UPDATE users SET password = ? WHERE id = ?";
        $stmt_update = mysqli_prepare($conn, $sql_update);
        mysqli_stmt_bind_param($stmt_update, "si", $hashed_password, $user_id);
        if (mysqli_stmt_execute($stmt_update)) {
            set_flash_message('success', 'Password berhasil diubah.');
            buat_log($conn, $user_id, 'UPDATE_PASSWORD', "User '{$_SESSION['username']}' mengubah passwordnya.");
        } else { 
            set_flash_message('error', 'Gagal mengubah password.'); 
        }
        mysqli_stmt_close($stmt_update);
    }
    mysqli_stmt_close($stmt_user);
}

// --- Aksi: Update Foto Profil ---
elseif ($aksi == 'update_foto') {
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0) {
        $allowed = ['jpg', 'jpeg', 'png'];
        $filename = $_FILES['foto']['name'];
        $filetype = pathinfo($filename, PATHINFO_EXTENSION);
        $filesize = $_FILES['foto']['size'];

        if (!in_array(strtolower($filetype), $allowed)) {
            set_flash_message('error', 'Tipe file foto harus JPG, JPEG, atau PNG.');
        } elseif ($filesize > 2 * 1024 * 1024) { // Maks 2MB
            set_flash_message('error', 'Ukuran file foto tidak boleh lebih dari 2MB.');
        } else {
            // Hapus foto lama jika ada
            $sql_get_old = "SELECT foto_profil FROM users WHERE id = ?";
            $stmt_get_old = mysqli_prepare($conn, $sql_get_old);
            mysqli_stmt_bind_param($stmt_get_old, "i", $user_id);
            mysqli_stmt_execute($stmt_get_old);
            $old_photo_path = mysqli_stmt_get_result($stmt_get_old)->fetch_assoc()['foto_profil'];
            if (!empty($old_photo_path) && file_exists($old_photo_path)) {
                unlink($old_photo_path);
            }
            mysqli_stmt_close($stmt_get_old);

            // Proses upload foto baru
            $upload_dir = 'uploads/profiles/';
            if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);
            $new_filename = 'profile_' . $user_id . '_' . time() . '.' . $filetype;
            $target_file = $upload_dir . $new_filename;
            
            if (move_uploaded_file($_FILES['foto']['tmp_name'], $target_file)) {
                $sql = "UPDATE users SET foto_profil = ? WHERE id = ?";
                $stmt = mysqli_prepare($conn, $sql);
                mysqli_stmt_bind_param($stmt, "si", $target_file, $user_id);
                if(mysqli_stmt_execute($stmt)) {
                    $_SESSION['foto_profil'] = $target_file;
                    set_flash_message('success', 'Foto profil berhasil diubah.');
                    buat_log($conn, $user_id, 'UPDATE_FOTO', "User '{$_SESSION['username']}' mengubah foto profilnya.");
                } else { 
                    set_flash_message('error', 'Gagal menyimpan path foto ke database.'); 
                }
                mysqli_stmt_close($stmt);
            } else { 
                set_flash_message('error', 'Gagal mengunggah foto. Cek folder permission.'); 
            }
        }
    } else { 
        set_flash_message('error', 'Tidak ada file yang diunggah atau terjadi error.'); 
    }
}

// --- Aksi: Hapus Foto Profil ---
elseif ($aksi == 'hapus_foto') {
    // Ambil path foto saat ini dari database
    $sql_get = "SELECT foto_profil FROM users WHERE id = ?";
    $stmt_get = mysqli_prepare($conn, $sql_get);
    mysqli_stmt_bind_param($stmt_get, "i", $user_id);
    mysqli_stmt_execute($stmt_get);
    $user = mysqli_stmt_get_result($stmt_get)->fetch_assoc();
    mysqli_stmt_close($stmt_get);

    if ($user && !empty($user['foto_profil'])) {
        // Hapus file fisik dari server
        if (file_exists($user['foto_profil'])) {
            unlink($user['foto_profil']);
        }
        // Update database, set kolom foto_profil menjadi NULL
        $sql_update = "UPDATE users SET foto_profil = NULL WHERE id = ?";
        $stmt_update = mysqli_prepare($conn, $sql_update);
        mysqli_stmt_bind_param($stmt_update, "i", $user_id);
        if (mysqli_stmt_execute($stmt_update)) {
            $_SESSION['foto_profil'] = null;
            set_flash_message('success', 'Foto profil berhasil dihapus.');
            buat_log($conn, $user_id, 'HAPUS_FOTO', "User '{$_SESSION['username']}' menghapus foto profilnya.");
        } else {
            set_flash_message('error', 'Gagal menghapus data foto dari database.');
        }
        mysqli_stmt_close($stmt_update);
    } else {
        set_flash_message('error', 'Tidak ada foto profil untuk dihapus.');
    }
}

header('Location: profile.php');
exit();