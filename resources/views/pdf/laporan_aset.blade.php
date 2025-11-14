<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Inventaris Aset Desa</title>
    <style>
        /* CSS Khusus untuk PDF */
        body { font-family: 'Times New Roman', Times, serif; font-size: 10pt; }
        .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 25px; }
        .header h3, .header h4, .header h5 { margin: 0; }
        .report-table { width: 100%; border-collapse: collapse; font-size: 9pt; }
        .report-table th, .report-table td { border: 1px solid #000; padding: 4px 6px; }
        .report-table th { background-color: #e9ecef; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .footer { margin-top: 50px; font-size: 11pt; width: 100%; }
        .signature-right { float: right; width: 45%; text-align: center; }
        .signature-left { float: left; width: 45%; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h3>BUKU INVENTARIS ASET DESA</h3>
        <h4>BIDANG TANAH</h4>
        <h5>PEMERINTAH DESA MAKMUR JAYA - TAHUN ANGGARAN {{ date('Y') }}</h5>
    </div>

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
            @forelse($aset as $index => $row)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>Tanah Kas Desa</td>
                <td>{{ $row->kode_barang ?? '-' }}</td>
                <td>{{ $row->nup ?? '-' }}</td>
                <td class="text-center">{{ number_format($row->luas, 2, ',', '.') }}</td>
                <td class="text-center">{{ $row->tanggal_perolehan ? \Carbon\Carbon::parse($row->tanggal_perolehan)->format('Y') : '-' }}</td>
                <td>{{ $row->lokasi ?? '-' }}</td>
                <td>{{ $row->status_sertifikat ?? '-' }}</td>
                <td class="text-center">{{ $row->tanggal_sertifikat ? \Carbon\Carbon::parse($row->tanggal_sertifikat)->format('d/m/Y') : '-' }}</td>
                <td>{{ $row->nomor_sertifikat ?? '-' }}</td>
                <td>{{ $row->penggunaan ?? '-' }}</td>
                <td>{{ $row->asal_perolehan }}</td>
                <td class="text-right">{{ number_format($row->harga_perolehan ?? 0, 0, ',', '.') }}</td>
                <td class="text-center">
                    @if($row->kondisi == 'Baik') B @elseif($row->kondisi == 'Kurang Baik') KB @elseif($row->kondisi == 'Rusak Berat') RB @else - @endif
                </td>
                <td>{{ $row->keterangan ?? '-' }}</td>
            </tr>
            @empty
            <tr><td colspan="15" style="text-align:center; padding: 2rem;">Tidak ada data aset yang disetujui untuk ditampilkan.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <div class="signature-block signature-left">
            <p>Mengetahui,</p>
            <p>Sekretaris Desa</p>
            <br><br><br><br>
            <p><strong>( NAMA SEKRETARIS DESA )</strong></p>
        </div>
        <div class="signature-block signature-right">
            <p>Makmur Jaya, {{ date('d F Y') }}</p>
            <p>Kepala Desa</p>
            <br><br><br><br>
            <p><strong>( NAMA KEPALA DESA )</strong></p>
        </div>
    </div>

</body>
</html>