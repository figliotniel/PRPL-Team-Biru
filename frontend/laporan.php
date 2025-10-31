<?php 
include 'templates/header.php';
// Memperbolehkan Admin (1), Kades (2), dan BPD (3) untuk akses
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['role_id'], [1, 2, 3])) { 
    header('Location: index.php'); 
    exit(); 
}
?>

<div class="content-header no-print">
    <h1>Laporan Aset Desa</h1>
    <div>
        <a href="export_csv.php" class="btn btn-success"><i class="fas fa-file-csv"></i> Export ke CSV</a>
        <button onclick="window.print()" class="btn btn-primary"><i class="fas fa-print"></i> Cetak Laporan</button>
    </div>
</div>

<div class="card">
    <div class="card-header no-print">
        <h4><i class="fas fa-book"></i> Buku Inventaris Aset Desa</h4>
        <small class="text-muted">Tampilan di layar dioptimalkan untuk penjelajahan data. Gunakan tombol 'Cetak' untuk format laporan resmi.</small>
    </div>
    <div class="card-body">
        <div class="printable-area">
            <div class="print-header">
                <h3>BUKU INVENTARIS ASET DESA</h3>
                <h4>BIDANG TANAH</h4>
                <h5>PEMERINTAH DESA MAKMUR JAYA - TAHUN ANGGARAN <?php echo date('Y'); ?></h5>
            </div>

            <div class="table-responsive">
                <table class="report-table">
                    <thead>
                        <tr>
                            <th rowspan="2" class="text-center">No</th>
                            <th rowspan="2">Jenis Barang / Nama Barang</th>
                            <th rowspan="2">Kode Barang</th>
                            <th rowspan="2">NUP</th>
                            <th rowspan="2" class="text-center">Luas (M²)</th>
                            <th rowspan="2" class="text-center">Tahun Perolehan</th>
                            <th rowspan="2">Letak / Alamat</th>
                            <th colspan="3" class="text-center">Status Tanah</th>
                            <th rowspan="2">Penggunaan</th>
                            <th rowspan="2">Asal Usul</th>
                            <th rowspan="2" class="text-right">Harga (Rp)</th>
                            <th rowspan="2" class="text-center">Kondisi (B/KB/RB)</th>
                            <th rowspan="2">Keterangan</th>
                        </tr>
                        <tr>
                            <th>Hak</th>
                            <th class="text-center">Tgl. Sertifikat</th>
                            <th>No. Sertifikat</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                        $sql = "SELECT * FROM tanah_kas_desa WHERE status_validasi = 'Disetujui' ORDER BY id ASC";
                        $result = mysqli_query($conn, $sql); 
                        $no = 1;
                        if (mysqli_num_rows($result) > 0): 
                            while ($row = mysqli_fetch_assoc($result)):
                    ?>
                        <tr>
                            <td class="text-center"><?php echo $no++; ?></td>
                            <td>Tanah Kas Desa</td>
                            <td><?php echo htmlspecialchars($row['kode_barang'] ?? '-'); ?></td>
                            <td><?php echo htmlspecialchars($row['nup'] ?? '-'); ?></td>
                            <td class="text-center"><?php echo number_format($row['luas'], 2, ',', '.'); ?></td>
                            <td class="text-center"><?php echo !empty($row['tanggal_perolehan']) ? date('Y', strtotime($row['tanggal_perolehan'])) : '-'; ?></td>
                            <td><?php echo htmlspecialchars($row['lokasi'] ?? '-'); ?></td>
                            <td><?php echo htmlspecialchars($row['status_sertifikat'] ?? '-'); ?></td>
                            <td class="text-center"><?php echo !empty($row['tanggal_sertifikat']) ? date('d/m/Y', strtotime($row['tanggal_sertifikat'])) : '-'; ?></td>
                            <td><?php echo htmlspecialchars($row['nomor_sertifikat'] ?? '-'); ?></td>
                            <td><?php echo htmlspecialchars($row['penggunaan'] ?? '-'); ?></td>
                            <td><?php echo htmlspecialchars($row['asal_perolehan']); ?></td>
                            <td class="text-right"><?php echo number_format($row['harga_perolehan'] ?? 0, 0, ',', '.'); ?></td>
                            <td class="text-center"><?php 
                                $kondisi = htmlspecialchars($row['kondisi'] ?? '');
                                if ($kondisi == 'Baik') echo 'B';
                                elseif ($kondisi == 'Kurang Baik') echo 'KB';
                                elseif ($kondisi == 'Rusak Berat') echo 'RB';
                                else echo '-';
                            ?></td>
                            <td><?php echo htmlspecialchars($row['keterangan'] ?? '-'); ?></td>
                        </tr>
                    <?php 
                            endwhile; 
                        else: 
                    ?>
                        <tr><td colspan="15" style="text-align:center; padding: 2rem;">Tidak ada data aset yang disetujui untuk ditampilkan dalam laporan.</td></tr>
                    <?php endif; ?>
                    </tbody>
                </table>
            </div>
            
            <div class="print-footer">
                <div class="signature-block signature-left">
                    <p>Mengetahui,</p>
                    <p>Sekretaris Desa</p>
                    <br><br><br><br>
                    <p><strong>( NAMA SEKRETARIS DESA )</strong></p>
                </div>
                <div class="signature-block signature-right">
                    <p>Makmur Jaya, <?php echo date('d F Y'); ?></p>
                    <p>Kepala Desa</p>
                    <br><br><br><br>
                    <p><strong>( NAMA KEPALA DESA )</strong></p>
                </div>
                <div style="clear: both;"></div>
            </div>

        </div>
    </div>
</div>
<?php include 'templates/footer.php'; ?>