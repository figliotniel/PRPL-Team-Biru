<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Detail Aset - {{ $aset->kode_barang ?? 'N/A' }}</title>
    <style>
        /* CSS dari cetak_detail.php lama */
        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; margin: 2cm; }
        .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 30px; }
        .header h3, .header h4 { margin: 0; }
        .content-table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        .content-table td { padding: 8px; border: 1px solid #ccc; vertical-align: top; }
        .content-table td:first-child { font-weight: bold; width: 30%; background-color: #f2f2f2; }
        h5 { background-color: #e7e7e7; padding: 10px; margin-top: 20px; margin-bottom: 10px; border-left: 5px solid #555; }
        .footer { margin-top: 50px; font-size: 11pt; text-align: right; }
    </style>
</head>
<body>

    <div class="header">
        <h3>PEMERINTAH DESA MAKMUR JAYA</h3>
        <h4>DETAIL LAPORAN ASET TANAH KAS DESA</h4>
    </div>

    <h5>A. DATA UTAMA ASET</h5>
    <table class="content-table">
        <tr><td>Kode Barang</td><td>{{ $aset->kode_barang ?? '-' }}</td></tr>
        <tr><td>Nomor Urut Pendaftaran (NUP)</td><td>{{ $aset->nup ?? '-' }}</td></tr>
        <tr><td>Asal Perolehan</td><td>{{ $aset->asal_perolehan ?? '-' }}</td></tr>
        <tr><td>Tanggal Perolehan</td><td>{{ $aset->tanggal_perolehan ? \Carbon\Carbon::parse($aset->tanggal_perolehan)->format('d F Y') : '-' }}</td></tr>
        <tr><td>Harga Perolehan</td><td>Rp {{ number_format($aset->harga_perolehan ?? 0, 0, ',', '.') }}</td></tr>
        <tr><td>Bukti Perolehan</td><td>{{ $aset->bukti_perolehan ?? '-' }}</td></tr>
    </table>

    <h5>B. DATA YURIDIS (LEGALITAS)</h5>
    <table class="content-table">
        <tr><td>Nomor Sertifikat</td><td>{{ $aset->nomor_sertifikat ?? '-' }}</td></tr>
        <tr><td>Tanggal Sertifikat</td><td>{{ $aset->tanggal_sertifikat ? \Carbon\Carbon::parse($aset->tanggal_sertifikat)->format('d F Y') : '-' }}</td></tr>
        <tr><td>Status Sertifikat</td><td>{{ $aset->status_sertifikat ?? '-' }}</td></tr>
    </table>

    <h5>C. DATA FISIK ASET</h5>
    <table class="content-table">
        <tr><td>Luas</td><td>{{ number_format($aset->luas, 2, ',', '.') }} m²</td></tr>
        <tr><td>Lokasi / Alamat</td><td>{{ $aset->lokasi ?? '-' }}</td></tr>
        <tr><td>Penggunaan</td><td>{{ $aset->penggunaan ?? '-' }}</td></tr>
        <tr><td>Koordinat</td><td>{{ $aset->koordinat ?? '-' }}</td></tr>
        <tr><td>Kondisi</td><td>{{ $aset->kondisi ?? '-' }}</td></tr>
        <tr><td>Batas Utara</td><td>{{ $aset->batas_utara ?? '-' }}</td></tr>
        <tr><td>Batas Timur</td><td>{{ $aset->batas_timur ?? '-' }}</td></tr>
        <tr><td>Batas Selatan</td><td>{{ $aset->batas_selatan ?? '-' }}</td></tr>
        <tr><td>Batas Barat</td><td>{{ $aset->batas_barat ?? '-' }}</td></tr>
    </table>

    <h5>D. STATUS & KETERANGAN</h5>
    <table class="content-table">
        <tr><td>Status Validasi</td><td>{{ $aset->status_validasi }}</td></tr>
        <tr><td>Catatan Validasi</td><td>{{ $aset->catatan_validasi ?? '-' }}</td></tr>
        <tr><td>Diinput oleh</td><td>{{ $aset->diinput_oleh_user->nama_lengkap ?? '(data lama)' }}</td></tr>
        <tr><td>Divalidasi oleh</td><td>{{ $aset->divalidasi_oleh_user->nama_lengkap ?? '-' }}</td></tr>
        <tr><td>Keterangan Lain</td><td>{!! nl2br(e($aset->keterangan ?? '-')) !!}</td></tr>
    </table>

    <div class="footer">
        Dicetak pada: {{ date('d F Y, H:i:s') }}
    </div>

</body>
</html>