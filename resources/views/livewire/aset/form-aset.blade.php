<div>
    <div class="content-header">
        <h1>Tambah Data Tanah Baru</h1>
        <a href="{{ route('dashboard') }}" wire:navigate class="btn btn-secondary">Kembali</a>
    </div>

    <div class="card">
        <div class="card-body">
            <form wire:submit="simpan">
                <h3>Data Penting (Wajib Diisi)</h3>
                <div class="grid-2-col">
                    <div class="form-group">
                        <label for="kode_barang">Kode Barang</label>
                        <input type="text" id="kode_barang" wire:model="kode_barang" class="form-control">
                        @error('kode_barang') <span class="notification error">{{ $message }}</span> @enderror
                    </div>
                    <div class="form-group">
                        <label for="asal_perolehan">Asal Perolehan</label>
                        <input type="text" id="asal_perolehan" wire:model="asal_perolehan" class="form-control">
                        @error('asal_perolehan') <span class="notification error">{{ $message }}</span> @enderror
                    </div>
                    <div class="form-group">
                        <label for="luas">Luas (m²)</label>
                        <input type="number" step="0.01" id="luas" wire:model="luas" class="form-control">
                        @error('luas') <span class="notification error">{{ $message }}</span> @enderror
                    </div>
                    <div class="form-group">
                        <label for="tanggal_perolehan">Tgl. Perolehan</label>
                        <input type="date" id="tanggal_perolehan" wire:model="tanggal_perolehan" class="form-control">
                        @error('tanggal_perolehan') <span class="notification error">{{ $message }}</span> @enderror
                    </div>
                    <div class="form-group" style="grid-column: span 2;">
                        <label for="lokasi">Lokasi/Alamat</label>
                        <textarea id="lokasi" wire:model="lokasi" class="form-control"></textarea>
                        @error('lokasi') <span class="notification error">{{ $message }}</span> @enderror
                    </div>
                </div>

                <hr style="margin: 1.5rem 0;">

                <h3>Data Opsional (Bisa Diisi Nanti)</h3>
                <div class="grid-2-col">
                    <div class="form-group"><label>NUP</label><input type="text" wire:model="nup" class="form-control"></div>
                    <div class="form-group"><label>Harga Perolehan (Rp)</label><input type="number" wire:model="harga_perolehan" class="form-control"></div>
                    <div class="form-group"><label>Bukti Perolehan</label><input type="text" wire:model="bukti_perolehan" class="form-control"></div>
                    <div class="form-group"><label>Nomor Sertifikat</label><input type="text" wire:model="nomor_sertifikat" class="form-control"></div>
                    <div class="form-group"><label>Tanggal Sertifikat</label><input type="date" wire:model="tanggal_sertifikat" class="form-control"></div>
                    <div class="form-group"><label>Status Tanah (Hak)</label><input type="text" wire:model="status_sertifikat" class="form-control"></div>
                    <div class="form-group"><label>Penggunaan Lahan</label><input type="text" wire:model="penggunaan" class="form-control"></div>
                    <div class="form-group"><label>Koordinat (Lat, Long)</label><input type="text" wire:model="koordinat" class="form-control"></div>
                    <div class="form-group">
                        <label>Kondisi Aset</label>
                        <select wire:model="kondisi" class="form-control">
                            <option value="Baik">Baik</option>
                            <option value="Kurang Baik">Kurang Baik</option>
                            <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                    </div>
                    <div class="form-group"><label>Batas Utara</label><input type="text" wire:model="batas_utara" class="form-control"></div>
                    <div class="form-group"><label>Batas Timur</label><input type="text" wire:model="batas_timur" class="form-control"></div>
                    <div class="form-group"><label>Batas Selatan</label><input type="text" wire:model="batas_selatan" class="form-control"></div>
                    <div class="form-group"><label>Batas Barat</label><input type="text" wire:model="batas_barat" class="form-control"></div>
                    <div class="form-group" style="grid-column: span 2;"><label>Keterangan Tambahan</label><textarea wire:model="keterangan" class="form-control"></textarea></div>
                </div>

                <button type="submit" class="btn btn-primary" style="margin-top: 1.5rem;">Simpan Data</button>
            </form>
                <div class="form-group" style="grid-column: 1 / -1; margin-top: 1rem;">
                <label>Pilih Lokasi di Peta (Klik pada Peta)</label>
                <div id="map" style="height: 350px; width: 100%; border-radius: 8px; z-index: 1;"></div>
                <div wire:ignore id="map" style="height: 350px; width: 100%; border-radius: 8px; z-index: 1;"></div>
            </div>
        </div>
    </div>
</div>

@script
<script>
    // 1. KEMBALIKAN KE 'livewire:navigated'
    // Ini akan berjalan SETIAP KALI kita masuk ke halaman ini
    document.addEventListener('livewire:navigated', () => {

        // 2. CEK & HANCURKAN PETA LAMA (JIKA ADA)
        // Kita gunakan variabel global (window) agar bisa dicek
        if (window.sitanasMap) {
            window.sitanasMap.remove();
            window.sitanasMap = null;
        }

        // 3. Inisialisasi Peta BARU
        // (Kita simpan di variabel global lagi)
        window.sitanasMap = L.map('map').setView([-7.7956, 110.3695], 13);
        var marker;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(window.sitanasMap);

        // 4. Logika Saat Peta Diklik
        window.sitanasMap.on('click', function(e) {
            const lat = e.latlng.lat.toFixed(6);
            const lng = e.latlng.lng.toFixed(6);
            const koordinatString = `${lat},${lng}`;

            // 5. KIRIM DATA KE LIVEWIRE (INI KUNCINYA)
            @this.set('koordinat', koordinatString);

            // 6. Pindahkan marker
            if (!marker) {
                marker = L.marker(e.latlng).addTo(window.sitanasMap);
            } else {
                marker.setLatLng(e.latlng);
            }
            window.sitanasMap.panTo(e.latlng);
        });

        // 7. Bagian "Livewire.on('koordinat-updated')" sudah benar,
        // biarkan saja seperti itu.
        Livewire.on('koordinat-updated', (koordinatString) => {
            if (koordinatString) {
                const parts = koordinatString.split(',');
                // ... (sisa kode ini sudah benar, tapi pastikan pakai 'window.sitanasMap')
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);
                
                if (!isNaN(lat) && !isNaN(lng)) {
                    const latLng = [lat, lng];
                    if (!marker) {
                        marker = L.marker(latLng).addTo(window.sitanasMap);
                    } else {
                        marker.setLatLng(latLng);
                    }
                    window.sitanasMap.setView(latLng, 17); // Zoom ke lokasi
                }
            }
        });

    });
</script>
@endscript