<div> <div class="content-header">
        <h1>Detail Aset Tanah (Kode: {{ $aset->kode_barang ?? 'N/A' }})</h1>
        <div>
            <button wire:click="downloadDetailPdf" class="btn btn-secondary">
                <i class="fas fa-print"></i> Cetak Detail
            </button>
            <a href="{{ route('dashboard') }}" wire:navigate class="btn btn-primary">Kembali ke Dashboard</a>
        </div>
    </div>

    @if ($aset->koordinat)
    <div class="card">
        <div class="card-header"><h4>Visualisasi Peta Lokasi</h4></div>
        <div class="card-body">
            <div wire:ignore id="map" style="height: 400px; width: 100%; border-radius: 8px; z-index: 1;"></div>
        </div>
    </div>
    @endif

    <div class="card">
        <div class="card-header"><h4>Informasi Detail Aset</h4></div>
        <div class="card-body grid-2-col">
            <div>
                <h5>Data Utama</h5>
                <ul class="detail-list">
                    <li><strong>Kode Barang</strong><span>{{ $aset->kode_barang ?? '-' }}</span></li>
                    <li><strong>NUP</strong><span>{{ $aset->nup ?? '-' }}</span></li>
                    <li><strong>Asal Perolehan</strong><span>{{ $aset->asal_perolehan ?? '-' }}</span></li>
                    <li><strong>Tgl. Perolehan</strong><span>{{ $aset->tanggal_perolehan ? \Carbon\Carbon::parse($aset->tanggal_perolehan)->format('d M Y') : '-' }}</span></li>
                    <li><strong>Harga Perolehan</strong><span>Rp {{ number_format($aset->harga_perolehan ?? 0, 0, ',', '.') }}</span></li>
                    <li><strong>Bukti Perolehan</strong><span>{{ $aset->bukti_perolehan ?? '-' }}</span></li>
                </ul>
            </div>
            <div>
                <h5>Data Yuridis (Legalitas)</h5>
                <ul class="detail-list">
                    <li><strong>Status Tanah (Hak)</strong><span>{{ $aset->status_sertifikat ?? '-' }}</span></li>
                    <li><strong>No. Sertifikat</strong><span>{{ $aset->nomor_sertifikat ?? '-' }}</span></li>
                    <li><strong>Tgl. Sertifikat</strong><span>{{ $aset->tanggal_sertifikat ? \Carbon\Carbon::parse($aset->tanggal_sertifikat)->format('d M Y') : '-' }}</span></li>
                </ul>
            </div>
            <div>
                <h5>Data Fisik</h5>
                <ul class="detail-list">
                    <li><strong>Luas</strong><span>{{ number_format($aset->luas ?? 0, 2, ',', '.') }} m²</span></li>
                    <li><strong>Lokasi / Alamat</strong><span>{{ $aset->lokasi ?? '-' }}</span></li>
                    <li><strong>Penggunaan</strong><span>{{ $aset->penggunaan ?? '-' }}</span></li>
                    <li><strong>Koordinat</strong><span>{{ $aset->koordinat ?? '-' }}</span></li>
                    <li><strong>Kondisi</strong><span>{{ $aset->kondisi ?? '-' }}</span></li>
                </ul>
            </div>
            <div>
                <h5>Batas Wilayah</h5>
                <ul class="detail-list">
                    <li><strong>Batas Utara</strong><span>{{ $aset->batas_utara ?? '-' }}</span></li>
                    <li><strong>Batas Timur</strong><span>{{ $aset->batas_timur ?? '-' }}</span></li>
                    <li><strong>Batas Selatan</strong><span>{{ $aset->batas_selatan ?? '-' }}</span></li>
                    <li><strong>Batas Barat</strong><span>{{ $aset->batas_barat ?? '-' }}</span></li>
                </ul>
            </div>
            <div style="grid-column: 1 / -1;">
                <h5>Status & Keterangan</h5>
                <ul class="detail-list">
                    <li><strong>Status Validasi</strong><span><span class="status {{ strtolower($aset->status_validasi) }}">{{ $aset->status_validasi }}</span></span></li>
                    <li><strong>Catatan Validasi</strong><span>{{ $aset->catatan_validasi ?? '-' }}</span></li>
                    <li><strong>Diinput oleh</strong><span>{{ $aset->diinput_oleh_user->nama_lengkap ?? '(data lama)' }}</span></li>
                    <li><strong>Divalidasi oleh</strong><span>{{ $aset->divalidasi_oleh_user->nama_lengkap ?? '-' }}</span></li>
                    <li><strong>Keterangan</strong><span>{!! nl2br(e($aset->keterangan ?? '-')) !!}</span></li>
                </ul>
            </div>
        </div>
    </div>

    <div class="card">
        </div>

    <div class="card">
        </div>
@script
<script>
    document.addEventListener('livewire:navigated', () => {

        // Hanya jalankan jika ada div#map
        if (document.getElementById('map')) {

            // Hancurkan peta lama jika ada
            if (window.sitanasMap) {
                window.sitanasMap.remove();
                window.sitanasMap = null;
            }

            // Ambil koordinat dari Livewire
            const koordinatString = @js($aset->koordinat);

            if (koordinatString) {
                const parts = koordinatString.split(',');
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);

                if (!isNaN(lat) && !isNaN(lng)) {
                    // Buat peta baru
                    window.sitanasMap = L.map('map').setView([lat, lng], 17); // Zoom 17

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(window.sitanasMap);

                    // Tambahkan marker di lokasi aset
                    L.marker([lat, lng]).addTo(window.sitanasMap)
                        .bindPopup('<b>Lokasi Aset</b><br>{{ $aset->kode_barang }}')
                        .openPopup();
                }
            }
        }
    });
</script>
@endscript