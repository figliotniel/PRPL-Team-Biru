<div>
    <div class="content-header">
        <h1>Edit Aset Tanah</h1>
        <a href="{{ route('dashboard') }}" wire:navigate class="btn btn-secondary" style="margin-left: auto;">
            <i class="fas fa-arrow-left"></i> Kembali
        </a>
    </div>

    <div class="card">
        <div class="card-header">
            <h4><i class="fas fa-edit"></i> Formulir Edit Data Aset</h4>
        </div>
        <div class="card-body">
            <form wire:submit="save">

                {{-- Tampilkan pesan sukses --}}
                @if (session()->has('success'))
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle"></i> {{ session('success') }}
                    </div>
                @endif
                
                {{-- Tampilkan pesan error validasi (jika ada) --}}
                @if ($errors->any())
                    <div class="alert alert-danger">
                        <strong><i class="fas fa-exclamation-triangle"></i> Terjadi Kesalahan:</strong>
                        <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <div class="form-row">
                    {{-- Bagian Kiri Form --}}
                    <div class="form-group col-md-6">
                        <label for="kode_barang">Kode Barang</label>
                        <input type="text" wire:model="kode_barang" class="form-control" id="kode_barang" placeholder="Masukkan Kode Barang">
                        @error('kode_barang') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    
                    <div class="form-group col-md-6">
                        <label for="nup">NUP (Nomor Urut Pendaftaran)</label>
                        <input type="text" wire:model="nup" class="form-control" id="nup" placeholder="Masukkan NUP (jika ada)">
                        @error('nup') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="form-group col-md-12">
                        <label for="asal_perolehan">Asal Perolehan</label>
                        <input type="text" wire:model="asal_perolehan" class="form-control" id="asal_perolehan" placeholder="Cth: Bantuan, Beli, Hibah, dll">
                        @error('asal_perolehan') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="form-group col-md-6">
                        <label for="tanggal_perolehan">Tanggal Perolehan</label>
                        <input type="date" wire:model="tanggal_perolehan" class="form-control" id="tanggal_perolehan">
                        @error('tanggal_perolehan') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="form-group col-md-6">
                        <label for="harga_perolehan">Harga Perolehan (Rp)</label>
                        <input type="number" wire:model="harga_perolehan" class="form-control" id="harga_perolehan" placeholder="Cth: 150000000">
                        @error('harga_perolehan') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    
                    <div class="form-group col-md-12">
                        <label for="lokasi">Lokasi/Alamat</label>
                        <textarea wire:model="lokasi" class="form-control" id="lokasi" rows="3" placeholder="Masukkan alamat lengkap atau nama lokasi"></textarea>
                        @error('lokasi') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="form-group col-md-6">
                        <label for="luas">Luas (m²)</label>
                        <input type="number" step="0.01" wire:model="luas" class="form-control" id="luas" placeholder="Cth: 1500.50">
                        @error('luas') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="form-group col-md-6">
                        <label for="koordinat">Koordinat</label>
                        <input type="text" wire:model="koordinat" class="form-control" id="koordinat" placeholder="Cth: -7.7956, 110.3695">
                        @error('koordinat') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    
                    <div class="form-group col-md-6">
                        <label for="penggunaan">Penggunaan</label>
                        <input type="text" wire:model="penggunaan" class="form-control" id="penggunaan" placeholder="Cth: Sawah, Balai Desa, dll">
                        @error('penggunaan') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    
                    <div class="form-group col-md-6">
                        <label for="kondisi">Kondisi</label>
                        <select wire:model="kondisi" class="form-control" id="kondisi">
                            <option value="Baik">Baik</option>
                            <option value="Kurang Baik">Kurang Baik</option>
                            <option value="Rusak Berat">Rusak Berat</option>
                        </select>
                        @error('kondisi') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                </div>

                <hr style="margin: 1.5rem 0;">
                <h5>Data Legalitas (Sertifikat)</h5>

                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="nomor_sertifikat">Nomor Sertifikat</label>
                        <input type="text" wire:model="nomor_sertifikat" class="form-control" id="nomor_sertifikat" placeholder="Masukkan Nomor Sertifikat">
                        @error('nomor_sertifikat') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="form-group col-md-6">
                        <label for="tanggal_sertifikat">Tanggal Sertifikat</label>
                        <input type="date" wire:model="tanggal_sertifikat" class="form-control" id="tanggal_sertifikat">
                        @error('tanggal_sertifikat') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="form-group col-md-6">
                        <label for="status_sertifikat">Status Sertifikat</label>
                        <input type="text" wire:model="status_sertifikat" class="form-control" id="status_sertifikat" placeholder="Cth: SHM, HGB, dll">
                        @error('status_sertifikat') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>

                    <div class="form-group col-md-6">
                        <label for="bukti_perolehan">Bukti Perolehan</label>
                        <input type="text" wire:model="bukti_perolehan" class="form-control" id="bukti_perolehan" placeholder="Cth: Akta Jual Beli, Hibah, dll">
                        @error('bukti_perolehan') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                </div>
                
                <hr style="margin: 1.5rem 0;">
                <h5>Data Batas Tanah</h5>

                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="batas_utara">Batas Utara</label>
                        <input type="text" wire:model="batas_utara" class="form-control" id="batas_utara" placeholder="Cth: Tanah Bapak Budi">
                        @error('batas_utara') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    <div class="form-group col-md-6">
                        <label for="batas_timur">Batas Timur</label>
                        <input type="text" wire:model="batas_timur" class="form-control" id="batas_timur" placeholder="Cth: Jalan Desa">
                        @error('batas_timur') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    <div class="form-group col-md-6">
                        <label for="batas_selatan">Batas Selatan</label>
                        <input type="text" wire:model="batas_selatan" class="form-control" id="batas_selatan" placeholder="Cth: Sawah Ibu Ani">
                        @error('batas_selatan') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                    <div class="form-group col-md-6">
                        <label for="batas_barat">Batas Barat</label>
                        <input type="text" wire:model="batas_barat" class="form-control" id="batas_barat" placeholder="Cth: Sungai">
                        @error('batas_barat') <small class="text-danger">{{ $message }}</small> @enderror
                    </div>
                </div>

                <hr style="margin: 1.5rem 0;">
                
                <div class="form-group">
                    <label for="keterangan">Keterangan Tambahan</label>
                    <textarea wire:model="keterangan" class="form-control" id="keterangan" rows="3" placeholder="Info tambahan (jika ada)"></textarea>
                    @error('keterangan') <small class="text-danger">{{ $message }}</small> @enderror
                </div>

                <button type="submit" class="btn btn-primary" wire:loading.attr="disabled">
                    <span wire:loading.remove wire:target="save">
                        <i class="fas fa-save"></i> Simpan Perubahan
                    </span>
                    <span wire:loading wire:target="save">
                        <i class="fas fa-spinner fa-spin"></i> Menyimpan...
                    </span>
                </button>
            </form>
        </div>
    </div>

    @if(auth()->user()->role?->nama_role === 'Admin Desa')

    <div class="card" style="margin-top: 2rem;">
        <div class="card-header">
            <h4><i class="fas fa-file-upload"></i> Dokumen Pendukung (Hanya Admin)</h4>
        </div>
        <div class="card-body">

            {{-- Tampilkan pesan sukses upload/hapus --}}
            @if (session()->has('dokumen_success'))
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> {{ session('dokumen_success') }}
                </div>
            @endif
            
            {{-- Tampilkan pesan error upload/hapus --}}
            @if (session()->has('dokumen_error'))
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> {{ session('dokumen_error') }}
                </div>
            @endif

            {{-- 1. FORMULIR UPLOAD BARU --}}
            <form wire:submit="uploadDokumen">
                <div class="form-group">
                    <label for="new_dokumen">Upload Dokumen Baru (Maks 10MB)</label>
                    <input type="file" wire:model="new_dokumen" class="form-control-file" id="new_dokumen">
                    
                    {{-- Indikator loading saat upload --}}
                    <div wire:loading wire:target="new_dokumen" style="color: var(--primary-color); margin-top: 5px;">
                        <i class="fas fa-spinner fa-spin"></i> Mengupload...
                    </div>

                    @error('new_dokumen') <small class="text-danger">{{ $message }}</small> @enderror
                </div>

                <button type="submit" class="btn btn-success">
                    <i class="fas fa-upload"></i> Upload
                </button>
            </form>

            <hr style="margin: 2rem 0;">

            {{-- 2. DAFTAR DOKUMEN YANG SUDAH ADA --}}
            <h5>Dokumen Tersimpan</h5>
            @if($existing_dokumen->isEmpty())
                <p style="color: #888;">Belum ada dokumen pendukung yang di-upload.</p>
            @else
                <ul class="list-group">
                    @foreach($existing_dokumen as $dokumen)
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
                                
                                {{-- Link ke file --}}
                                <a href="{{ Storage::url($dokumen->file_path) }}" target="_blank" style="margin-left: 10px;">
                                    {{ $dokumen->nama_dokumen }}
                                </a>
                            </div>

                            {{-- Tombol Hapus --}}
                            <button 
                                class="btn btn-sm btn-danger" 
                                wire:click="hapusDokumen({{ $dokumen->id }})"
                                wire:confirm="Anda yakin ingin menghapus file '{{ $dokumen->nama_dokumen }}'? Tindakan ini tidak dapat dibatalkan."
                                wire:loading.attr="disabled"
                                wire:target="hapusDokumen({{ $dokumen->id }})">
                                
                                {{-- Tampilkan spinner saat loading hapus --}}
                                <span wire:loading.remove wire:target="hapusDokumen({{ $dokumen->id }})">
                                    <i class="fas fa-trash-alt"></i>
                                </span>
                                <span wire:loading wire:target="hapusDokumen({{ $dokumen->id }})">
                                    <i class="fas fa-spinner fa-spin"></i>
                                </span>
                            </button>
                        </li>
                    @endforeach
                </ul>
            @endif
        </div>
    </div>
    @endif
</div>