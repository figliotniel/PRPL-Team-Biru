<div>
    <div class="content-header">
        <h1>Laporan Aset Desa</h1>
    </div>

    {{-- Card untuk Download PDF --}}
    <div class="card">
        <div class="card-header">
            <h4><i class="fas fa-book"></i> Buku Inventaris Aset Desa</h4>
        </div>
        <div class="card-body">
            <p>Klik tombol di bawah ini untuk mengunduh Laporan Buku Inventaris Aset Desa (Bidang Tanah) dalam format PDF. Laporan ini hanya berisi data aset yang telah divalidasi dan disetujui.</p>
            <hr style="margin: 1rem 0;">

            <button wire:click="downloadPdf" class="btn btn-primary">
                <i class="fas fa-download"></i> Download Laporan PDF
            </button>

            {{-- Indikator loading saat PDF dibuat --}}
            <div wire:loading wire:target="downloadPdf" style="margin-top: 1rem; color: var(--primary-color);">
                <i class="fas fa-spinner fa-spin"></i> Mohon tunggu, sedang membuat PDF...
            </div>

            {{-- Tampilkan pesan error jika download gagal --}}
            @if (session()->has('error'))
                <div style="margin-top: 1rem; color: var(--danger-color);">
                    <i class="fas fa-exclamation-triangle"></i> {{ session('error') }}
                </div>
            @endif
        </div>
    </div>

    {{-- 
      ===============================================================
      BAGIAN BARU: Tabel untuk menampilkan data aset yang disetujui
      ===============================================================
    --}}
    <div class="card" style="margin-top: 2rem;">
        <div class="card-header">
            <h4><i class="fas fa-list"></i> Daftar Aset Yang Telah Disetujui</h4>
        </div>
        <div class="card-body">
            
            {{-- Cek apakah variabel $daftar_aset ada isinya --}}
            @if($daftar_aset->isEmpty())
                {{-- Tampilkan pesan jika tidak ada data --}}
                <div class="text-center" style="padding: 2rem; background-color: #f9f9f9; border-radius: 8px;">
                    <i class="fas fa-folder-open" style="font-size: 2rem; color: #888;"></i>
                    <p style="margin-top: 1rem; color: #555;">Belum ada data aset yang disetujui untuk ditampilkan.</p>
                </div>
            @else
                {{-- Jika ada data, tampilkan tabel --}}
                <div class="table-responsive">
                    <table class="table table-bordered table-striped">
                        <thead style="background-color: #f4f6f9;">
                            <tr>
                                <th>No</th>
                                <th>Kode Barang</th>
                                <th>Asal Perolehan</th>
                                <th>Luas (m²)</th>
                                <th>Lokasi</th>
                                <th>Penggunaan</th>
                                <th style="width: 100px;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{-- Loop data aset --}}
                            @foreach($daftar_aset as $index => $aset)
                                <tr>
                                    <td>{{ $index + 1 }}</td>
                                    <td>{{ $aset->kode_barang ?? '-' }}</td>
                                    <td>{{ $aset->asal_perolehan }}</td>
                                    <td>{{ number_format($aset->luas, 2, ',', '.') }}</td>
                                    <td>{{ Str::limit($aset->lokasi, 50) }}</td>
                                    <td>{{ $aset->penggunaan ?? '-' }}</td>
                                    <td>
                                        {{-- Berikan link ke halaman detail aset --}}
                                        <a href="{{ route('aset.detail', $aset->id) }}" class="btn btn-sm btn-info" title="Lihat Detail">
                                            <i class="fas fa-eye"></i>
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
            
        </div>
    </div>
</div>