<div>
    <div class="content-header">
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
                    <li><strong>Tgl. Perolehan</strong><span>{{ $aset->tanggal_perolehan ? \Carbon\Carbon::parse($aset->tanggal_perolehan)->isoFormat('DD MMMM YYYY') : '-' }}</span></li>
                    <li><strong>Harga Perolehan</strong><span>Rp {{ $aset->harga_perolehan ? number_format($aset->harga_perolehan, 0, ',', '.') : '0' }}</span></li>
                    <li><strong>Luas</strong><span>{{ $aset->luas ? number_format($aset->luas, 2, ',', '.') : '0' }} m²</span></li>
                    <li><strong>Lokasi/Alamat</strong><span>{{ $aset->lokasi ?? '-' }}</span></li>
                    <li><strong>Koordinat</strong><span>{{ $aset->koordinat ?? '-' }}</span></li>
                    <li><strong>Penggunaan</strong><span>{{ $aset->penggunaan ?? '-' }}</span></li>
                    <li><strong>Kondisi</strong><span>{{ $aset->kondisi ?? '-' }}</span></li>
                    <li><strong>Keterangan</strong><span>{{ $aset->keterangan ?? '-' }}</span></li>
                </ul>
            </div>
            <div>
                <h5>Data Legalitas</h5>
                <ul class="detail-list">
                    <li><strong>Nomor Sertifikat</strong><span>{{ $aset->nomor_sertifikat ?? '-' }}</span></li>
                    <li><strong>Tgl. Sertifikat</strong><span>{{ $aset->tanggal_sertifikat ? \Carbon\Carbon::parse($aset->tanggal_sertifikat)->isoFormat('DD MMMM YYYY') : '-' }}</span></li>
                    <li><strong>Status Sertifikat</strong><span>{{ $aset->status_sertifikat ?? '-' }}</span></li>
                    <li><strong>Bukti Perolehan</strong><span>{{ $aset->bukti_perolehan ?? '-' }}</span></li>
                </ul>
                <hr>
                <h5>Batas-Batas</h5>
                <ul class="detail-list">
                    <li><strong>Batas Utara</strong><span>{{ $aset->batas_utara ?? '-' }}</span></li>
                    <li><strong>Batas Timur</strong><span>{{ $aset->batas_timur ?? '-' }}</span></li>
                    <li><strong>Batas Selatan</strong><span>{{ $aset->batas_selatan ?? '-' }}</span></li>
                    <li><strong>Batas Barat</strong><span>{{ $aset->batas_barat ?? '-' }}</span></li>
                </ul>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h4>Status Validasi</h4></div>
        <div class="card-body">
            <ul class="detail-list">
                <li><strong>Status</strong>
                    <span 
                        @class([
                            'badge',
                            'badge-success' => $aset->status_validasi == 'Disetujui',
                            'badge-danger' => $aset->status_validasi == 'Ditolak',
                            'badge-warning' => $aset->status_validasi == 'Diproses',
                        ])>
                        {{ $aset->status_validasi }}
                    </span>
                </li>
                <li><strong>Catatan Validasi</strong><span>{{ $aset->catatan_validasi ?? '-' }}</span></li>
                <li><strong>Diinput Oleh</strong><span>{{ $aset->diinput_oleh_user->nama_lengkap ?? 'N/A' }}</span></li>
                <li><strong>Divalidasi Oleh</strong><span>{{ $aset->divalidasi_oleh_user->nama_lengkap ?? '-' }}</span></li>
            </ul>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h4>Riwayat Pemanfaatan</h4></div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <thead style="background-color: #f4f6f9;">
                        <tr>
                            <th>Bentuk Pemanfaatan</th>
                            <th>Pihak Ketiga</th>
                            <th>Mulai</th>
                            <th>Selesai</th>
                            <th>Nilai Kontribusi</th>
                            <th>Status Bayar</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($aset->pemanfaatan as $item)
                            <tr>
                                <td>{{ $item->bentuk_pemanfaatan }}</td>
                                <td>{{ $item->pihak_ketiga }}</td>
                                <td>{{ $item->tanggal_mulai ? \Carbon\Carbon::parse($item->tanggal_mulai)->isoFormat('DD MMM YYYY') : '-' }}</td>
                                <td>{{ $item->tanggal_selesai ? \Carbon\Carbon::parse($item->tanggal_selesai)->isoFormat('DD MMM YYYY') : '-' }}</td>
                                <td>Rp {{ number_format($item->nilai_kontribusi, 0, ',', '.') }}</td>
                                <td><span class="badge {{ $item->status_pembayaran == 'Lunas' ? 'badge-success' : 'badge-danger' }}">{{ $item->status_pembayaran }}</span></td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center" style="color: #888;">Belum ada riwayat pemanfaatan.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header"><h4>Tambah Riwayat Pemanfaatan</h4></div>
        <div class="card-body">
            @if (session()->has('success_pemanfaatan'))
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> {{ session('success_pemanfaatan') }}
                </div>
            @endif
            <form wire:submit="simpanPemanfaatan">
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label>Bentuk Pemanfaatan</label>
                        <select wire:model="p_bentuk_pemanfaatan" class="form-control">
                            <option value="Sewa">Sewa</option>
                            <option value="Pinjam Pakai">Pinjam Pakai</option>
                            <option value="Kerja Sama Pemanfaatan">Kerja Sama Pemanfaatan</option>
                            <option value="Bangun Guna Serah">Bangun Guna Serah</option>
                            <option value="Bangun Serah Guna">Bangun Serah Guna</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                        @error('p_bentuk_pemanfaatan') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    <div class="form-group col-md-6">
                        <label>Pihak Ketiga</label>
                        <input type="text" wire:model="p_pihak_ketiga" class="form-control" placeholder="Nama Pihak Ketiga">
                        @error('p_pihak_ketiga') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    <div class="form-group col-md-6">
                        <label>Tanggal Mulai</label>
                        <input type="date" wire:model="p_tanggal_mulai" class="form-control">
                        @error('p_tanggal_mulai') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    <div class="form-group col-md-6">
                        <label>Tanggal Selesai</label>
                        <input type="date" wire:model="p_tanggal_selesai" class="form-control">
                        @error('p_tanggal_selesai') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    <div class="form-group col-md-6">
                        <label>Nilai Kontribusi (Rp)</label>
                        <input type="number" wire:model="p_nilai_kontribusi" class="form-control">
                        @error('p_nilai_kontribusi') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    <div class="form-group col-md-6">
                        <label>Status Pembayaran</label>
                        <select wire:model="p_status_pembayaran" class="form-control">
                            <option value="Belum Lunas">Belum Lunas</option>
                            <option value="Lunas">Lunas</option>
                        </select>
                        @error('p_status_pembayaran') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    <div class="form-group col-md-12">
                        <label>Keterangan</label>
                        <textarea wire:model="p_keterangan" class="form-control" rows="2" placeholder="Keterangan tambahan..."></textarea>
                        @error('p_keterangan') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    <div class="form-group col-md-12">
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-plus-circle"></i> Tambah Riwayat
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    @php
        // Ambil role pengguna saat ini
        $userRole = auth()->user()->role?->nama_role;
    @endphp

    @if(in_array($userRole, ['Admin Desa', 'Kepala Desa', 'BPN']))
        <div class="card" style="margin-top: 2rem;">
            <div class="card-header">
                <h4><i class="fas fa-file-alt"></i> Dokumen Pendukung</h4>
            </div>
            <div class="card-body">
                
                {{-- Cek apakah properti $dokumen_pendukung (dari DetailPage.php) ada isinya --}}
                @if($dokumen_pendukung->isEmpty())
                    <p style="color: #888;">Belum ada dokumen pendukung yang di-upload untuk aset ini.</p>
                @else
                    {{-- Jika ada, tampilkan sebagai daftar --}}
                    <ul class="list-group">
                        @foreach($dokumen_pendukung as $dokumen)
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    {{-- Ikon berdasarkan tipe file --}}
                                    @if(Str::contains($dokumen->tipe_file, 'image'))
                                        <i class="fas fa-file-image text-success"></i>
                                    @elseif(Str::contains($dokumen->tipe_file, 'pdf'))
                                        <i class="fas fa-file-pdf text-danger"></i>
                                    @elseif(Str::contains($dokumen->tipe_file, 'word'))
                                        <i class="fas fa-file-word text-primary"></i>
                                    @else
                                        <i class="fas fa-file-alt text-secondary"></i>
                                    @endif
                                    
                                    {{-- Link ke file, buka di tab baru --}}
                                    <a href="{{ Storage::url($dokumen->file_path) }}" target="_blank" style="margin-left: 10px;">
                                        {{ $dokumen->nama_dokumen }}
                                    </a>
                                </div>

                                {{-- Tampilkan ukuran file jika perlu (opsional) --}}
                                <small style="color: #6c757d;">
                                    ({{ Str::upper($dokumen->tipe_file) }})
                                </small>
                            </li>
                        @endforeach
                    </ul>
                @endif
                
            </div>
        </div>
    @endif

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
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'
                    }).addTo(window.sitanasMap);

                    // Tambahkan marker di lokasi aset
                    L.marker([lat, lng]).addTo(window.sitanasMap)
                        .bindPopup('<b>Lokasi Aset</b><br>{{ $aset->kode_barang }}')
                        .openPopup();
                } else {
                    document.getElementById('map').innerHTML = '<p class="text-danger">Format koordinat tidak valid.</p>';
                }
            } else {
                 document.getElementById('map').innerHTML = '<p style="color: #888;">Koordinat untuk aset ini tidak tersedia.</p>';
            }
        }
    });

    // Event listener untuk membersihkan peta sebelum navigasi
    document.addEventListener('livewire:navigate', () => {
        if (window.sitanasMap) {
            window.sitanasMap.remove();
            window.sitanasMap = null;
        }
    });
</script>
@endscript
</div>