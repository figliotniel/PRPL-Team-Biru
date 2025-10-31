<?php
require_once 'config.php';
if (!isset($_SESSION['user_id'])) { header('Location: login.php'); exit(); }

// Ambil aksi dan user info
$aksi = $_POST['aksi'] ?? $_GET['aksi'] ?? '';
$current_user_id = $_SESSION['user_id'];
$current_username = $_SESSION['username'];

// Verifikasi CSRF Token untuk semua request POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf_token']) || !verify_csrf_token($_POST['csrf_token'])) {
        set_flash_message('error', 'Aksi tidak valid atau sesi telah berakhir. Silakan coba lagi.');
        header('Location: ' . ($_SERVER['HTTP_REFERER'] ?? 'index.php'));
        exit();
    }
}

// === FUNGSI TAMBAH ===
if ($aksi == 'tambah' && $_SESSION['role_id'] == 1) {
    $fields = ['kode_barang', 'nup', 'asal_perolehan', 'tanggal_perolehan', 'harga_perolehan', 'bukti_perolehan', 'nomor_sertifikat', 'tanggal_sertifikat', 'status_sertifikat', 'luas', 'penggunaan', 'koordinat', 'kondisi', 'lokasi', 'batas_utara', 'batas_timur', 'batas_selatan', 'batas_barat', 'keterangan'];
    $params = [];
    foreach ($fields as $field) {
        $val = $_POST[$field] ?? null;
        $params[] = ($val === '') ? null : $val;
    }
    $params[] = $current_user_id;

    $sql = "INSERT INTO tanah_kas_desa (kode_barang, nup, asal_perolehan, tanggal_perolehan, harga_perolehan, bukti_perolehan, nomor_sertifikat, tanggal_sertifikat, status_sertifikat, luas, penggunaan, koordinat, kondisi, lokasi, batas_utara, batas_timur, batas_selatan, batas_barat, keterangan, diinput_oleh) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "sssssssssdsssssssssi", ...$params);
    
    if (mysqli_stmt_execute($stmt)) {
        $last_id = mysqli_insert_id($conn);
        $log_deskripsi = "Menambahkan data aset tanah baru '{$_POST['kode_barang']}' (ID: $last_id).";
        set_flash_message('success', 'Data tanah berhasil ditambahkan dan menunggu validasi.');
        buat_log($conn, $current_user_id, 'TAMBAH', $log_deskripsi);
        buat_histori($conn, $last_id, $current_user_id, 'PEMBUATAN', 'Data aset dibuat pertama kali oleh ' . $current_username);

        $sql_kades = "SELECT id FROM users WHERE role_id = 2";
        $result_kades = mysqli_query($conn, $sql_kades);
        while($kades = mysqli_fetch_assoc($result_kades)){
            buat_notifikasi($conn, $kades['id'], "Aset tanah baru (ID: $last_id) perlu divalidasi.", "detail.php?id=$last_id");
        }

    } else {
        set_flash_message('error', 'Gagal menambahkan data: ' . mysqli_error($conn));
    }
    header('Location: index.php');
}

// === FUNGSI EDIT ===
elseif ($aksi == 'edit' && $_SESSION['role_id'] == 1) {
    $id = $_POST['id'];
    
    $sql_old = "SELECT * FROM tanah_kas_desa WHERE id = ?";
    $stmt_old = mysqli_prepare($conn, $sql_old);
    mysqli_stmt_bind_param($stmt_old, "i", $id);
    mysqli_stmt_execute($stmt_old);
    $result_old = mysqli_stmt_get_result($stmt_old);
    $data_lama = mysqli_fetch_assoc($result_old);

    $fields = ['kode_barang', 'nup', 'asal_perolehan', 'tanggal_perolehan', 'harga_perolehan', 'bukti_perolehan', 'nomor_sertifikat', 'tanggal_sertifikat', 'status_sertifikat', 'luas', 'penggunaan', 'koordinat', 'kondisi', 'lokasi', 'batas_utara', 'batas_timur', 'batas_selatan', 'batas_barat', 'keterangan'];
    $params = [];
    foreach ($fields as $field) {
        $val = $_POST[$field] ?? null;
        $params[] = ($val === '') ? null : $val;
    }
    $params[] = $id;

    $sql = "UPDATE tanah_kas_desa SET kode_barang=?, nup=?, asal_perolehan=?, tanggal_perolehan=?, harga_perolehan=?, bukti_perolehan=?, nomor_sertifikat=?, tanggal_sertifikat=?, status_sertifikat=?, luas=?, penggunaan=?, koordinat=?, kondisi=?, lokasi=?, batas_utara=?, batas_timur=?, batas_selatan=?, batas_barat=?, keterangan=? WHERE id=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "sssssssssdsssssssssi", ...$params);
    
    if (mysqli_stmt_execute($stmt)) {
        set_flash_message('success', 'Data tanah berhasil diperbarui.');

        $perubahan = [];
        foreach ($fields as $field) {
            $nilai_baru = $_POST[$field] ?? '';
            $nilai_lama = $data_lama[$field] ?? '';
            if ($nilai_baru != $nilai_lama) {
                $perubahan[] = ucfirst(str_replace('_', ' ', $field)) . ": dari '{$nilai_lama}' menjadi '{$nilai_baru}'";
            }
        }

        if (!empty($perubahan)) {
            $log_deskripsi = "Mengubah data aset ID: {$id}. Perubahan: " . implode('; ', $perubahan);
            buat_log($conn, $current_user_id, 'EDIT', $log_deskripsi);
            buat_histori($conn, $id, $current_user_id, 'EDIT', $log_deskripsi);
        } else {
            buat_log($conn, $current_user_id, 'EDIT', "Membuka dan menyimpan (tanpa perubahan) data aset ID: {$id}.");
        }
    } else {
        set_flash_message('error', 'Gagal memperbarui data.');
    }
    header('Location: detail.php?id=' . $id);
}

// === FUNGSI HAPUS ===
elseif ($aksi == 'hapus' && $_SESSION['role_id'] == 1) {
    $id = $_POST['id'];
    $sql_get = "SELECT kode_barang FROM tanah_kas_desa WHERE id=?";
    $stmt_get = mysqli_prepare($conn, $sql_get);
    mysqli_stmt_bind_param($stmt_get, "i", $id);
    mysqli_stmt_execute($stmt_get);
    $result_get = mysqli_stmt_get_result($stmt_get);
    $data = mysqli_fetch_assoc($result_get);
    $kode_barang_dihapus = $data['kode_barang'] ?? 'N/A';
    
    buat_histori($conn, $id, $current_user_id, 'HAPUS', "Data aset (Kode: '$kode_barang_dihapus') dihapus oleh " . $current_username);

    $sql = "DELETE FROM tanah_kas_desa WHERE id=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id);
    if (mysqli_stmt_execute($stmt)) {
        set_flash_message('success', 'Data tanah berhasil dihapus.');
        buat_log($conn, $current_user_id, 'HAPUS', "Menghapus data aset tanah ID: $id (Kode: '$kode_barang_dihapus').");
    } else {
        set_flash_message('error', 'Gagal menghapus data.');
    }
    header('Location: index.php');
}

// === FUNGSI VALIDASI ===
elseif ($aksi == 'validasi' && $_SESSION['role_id'] == 2) {
    $id = $_POST['id'];
    $status = $_POST['status']; 
    $catatan = $_POST['catatan_validasi'] ?? '';
    $validator_id = $current_user_id;
    
    $sql_get = "SELECT diinput_oleh, kode_barang FROM tanah_kas_desa WHERE id=?";
    $stmt_get = mysqli_prepare($conn, $sql_get);
    mysqli_stmt_bind_param($stmt_get, "i", $id);
    mysqli_stmt_execute($stmt_get);
    $result_get = mysqli_stmt_get_result($stmt_get);
    $data_aset = mysqli_fetch_assoc($result_get);
    
    $sql = "UPDATE tanah_kas_desa SET status_validasi=?, divalidasi_oleh=?, catatan_validasi=? WHERE id=?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "sisi", $status, $validator_id, $catatan, $id);
    
    if (mysqli_stmt_execute($stmt)) {
        $pesan_status = ($status == 'Disetujui') ? 'disetujui' : 'ditolak';
        set_flash_message('success', 'Data berhasil divalidasi.');
        $log_deskripsi = "Melakukan validasi aset ID: $id (Kode: {$data_aset['kode_barang']}) menjadi status '$status' oleh $current_username.";
        buat_log($conn, $current_user_id, 'VALIDASI', $log_deskripsi);
        buat_histori($conn, $id, $current_user_id, 'VALIDASI', $log_deskripsi . " Catatan: " . $catatan);

        if ($data_aset && $data_aset['diinput_oleh']) {
            $pesan_notif = "Pengajuan aset Anda (ID: $id) telah di-$pesan_status oleh Kepala Desa.";
            buat_notifikasi($conn, $data_aset['diinput_oleh'], $pesan_notif, "detail.php?id=$id");
        }
    } else {
        set_flash_message('error', 'Gagal melakukan validasi.');
    }
    header('Location: index.php');
}

// === FUNGSI UPLOAD DOKUMEN ===
elseif ($aksi == 'upload' && $_SESSION['role_id'] == 1) {
    $tanah_id = $_POST['tanah_id'];
    $nama_dokumen = $_POST['nama_dokumen'];
    $kategori = $_POST['kategori_dokumen'];
    $tgl_kadaluarsa = !empty($_POST['tanggal_kadaluarsa']) ? $_POST['tanggal_kadaluarsa'] : null;

    if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
        $allowed_types = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        $max_size = 5 * 1024 * 1024;
        
        if (in_array($_FILES['file']['type'], $allowed_types) && $_FILES['file']['size'] <= $max_size) {
            if (!file_exists(UPLOAD_DIR)) { mkdir(UPLOAD_DIR, 0777, true); }
            
            $filename = time() . '_' . basename(str_replace(' ', '_', $_FILES["file"]["name"]));
            $target_file = UPLOAD_DIR . $filename;
            $db_path = 'uploads/' . $filename;
            
            if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
                $sql = "INSERT INTO dokumen_pendukung (tanah_id, nama_dokumen, kategori_dokumen, tanggal_kadaluarsa, path_file) VALUES (?, ?, ?, ?, ?)";
                $stmt = mysqli_prepare($conn, $sql);
                mysqli_stmt_bind_param($stmt, "issss", $tanah_id, $nama_dokumen, $kategori, $tgl_kadaluarsa, $db_path);
                
                if (mysqli_stmt_execute($stmt)) {
                    set_flash_message('success', 'Dokumen berhasil diunggah.');
                    $log_desc = "Mengunggah dokumen '$nama_dokumen' untuk aset ID: $tanah_id.";
                    buat_log($conn, $current_user_id, 'UPLOAD', $log_desc);
                    buat_histori($conn, $tanah_id, $current_user_id, 'UPLOAD DOKUMEN', $log_desc);
                } else { 
                    set_flash_message('error', 'Gagal menyimpan info dokumen ke database.'); 
                }
            } else { 
                set_flash_message('error', 'Gagal memindahkan file yang diunggah.'); 
            }
        } else { 
            set_flash_message('error', 'Tipe file tidak diizinkan atau ukuran file terlalu besar (Maks 5MB).'); 
        }
    } else { 
        set_flash_message('error', 'Terjadi error saat mengunggah file.'); 
    }
    header('Location: upload.php?id=' . $tanah_id);
}

// Jika tidak ada aksi yang cocok
else {
    set_flash_message('error', 'Aksi tidak valid atau Anda tidak memiliki izin.');
    header('Location: index.php');
}
exit();