<?php require_once 'config.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informasi Publik Aset Desa - SITANAS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="public-page-body">

    <header class="public-header">
        <div class="public-container">
            <div class="public-logo">
                <i class="fas fa-landmark"></i>
                <span>SITANAS</span>
            </div>
            <a href="login.php" class="btn btn-primary"><i class="fas fa-sign-in-alt"></i> Login Aparatur</a>
        </div>
    </header>

    <main>
        <section class="public-hero">
            <div class="public-container">
                <h1>Informasi Publik Tanah Kas Desa</h1>
                <p>Transparansi data aset desa yang telah divalidasi untuk masyarakat.</p>
            </div>
        </section>

        <?php
            // Mengambil data statistik aset yang sudah disetujui
            $stats_query = "SELECT COUNT(id) as total_aset, SUM(luas) as total_luas FROM tanah_kas_desa WHERE status_validasi = 'Disetujui'";
            $stats_result = mysqli_query($conn, $stats_query);
            $stats = mysqli_fetch_assoc($stats_result);
        ?>
        <section class="public-stats">
             <div class="public-container">
                <div class="stat-item">
                    <div class="stat-value"><?php echo $stats['total_aset'] ?? 0; ?></div>
                    <div class="stat-label">Total Aset Publik</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value"><?php echo number_format($stats['total_luas'] ?? 0, 0, ',', '.'); ?> m²</div>
                    <div class="stat-label">Total Luas Tercatat</div>
                </div>
             </div>
        </section>

        <section class="public-table-section">
            <div class="public-container">
                 <div class="card">
                    <div class="card-header">
                        <h4><i class="fas fa-list-ul"></i> Daftar Aset Tanah Kas Desa</h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Asal Perolehan</th>
                                        <th>Nomor Sertifikat</th>
                                        <th>Luas (m²)</th>
                                        <th>Lokasi</th>
                                        <th>Penggunaan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <?php
                                    $sql = "SELECT asal_perolehan, nomor_sertifikat, luas, lokasi, penggunaan FROM tanah_kas_desa WHERE status_validasi = 'Disetujui' ORDER BY id DESC";
                                    $result = mysqli_query($conn, $sql);
                                    $no = 1;
                                    if ($result && mysqli_num_rows($result) > 0) {
                                        while ($row = mysqli_fetch_assoc($result)) {
                                            echo "<tr>";
                                            echo "<td>" . $no++ . "</td>";
                                            echo "<td>" . htmlspecialchars($row['asal_perolehan']) . "</td>";
                                            echo "<td>" . htmlspecialchars($row['nomor_sertifikat'] ?? '-') . "</td>";
                                            echo "<td>" . number_format($row['luas'], 0, ',', '.') . "</td>";
                                            echo "<td>" . htmlspecialchars($row['lokasi'] ?? '-') . "</td>";
                                            echo "<td>" . htmlspecialchars($row['penggunaan'] ?? '-') . "</td>";
                                            echo "</tr>";
                                        }
                                    } else {
                                        echo "<tr><td colspan='6' style='text-align:center; padding: 2rem;'>Tidak ada data publik yang tersedia saat ini.</td></tr>";
                                    }
                                ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="public-footer">
        <div class="public-container">
            <p>&copy; <?php echo date('Y'); ?> Pemerintah Desa Makmur Jaya. Diberdayakan oleh SITANAS.</p>
        </div>
    </footer>

</body>
</html>