<div>
    <div class="content-header">
        <h1>Dashboard Aset Tanah</h1>
        <div>
            @if(auth()->user()->role_id == 1)
            <a href="{{ route('aset.tambah') }}" wire:navigate class="btn btn-primary"><i class="fas fa-plus"></i> Tambah Data Tanah</a>
            @endif
        </div>
    </div>

    <div class="card">
        <div class="card-body filter-form" style="margin-bottom: 0;">
            <input type="text" 
                   wire:model.live.debounce.300ms="searchTerm" 
                   class="form-control" 
                   placeholder="Cari kode, asal, atau lokasi...">
            
            <select wire:model.live="filterStatus" class="form-control">
                <option value="">Semua Status</option>
                <option value="Diproses">Diproses</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Ditolak">Ditolak</option>
            </select>
        </div>
    </div>

    @if (session('success'))
        <div class="notification success" style="margin-bottom: 1.5rem;">{{ session('success') }}</div>
    @endif

    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table>
                     <thead>
                        <tr>
                            <th>No</th>
                            <th>Kode</th>
                            <th>Asal</th>
                            <th>Luas (m²)</th>
                            <th>Penggunaan</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($aset_tanah as $aset)
                        
                        <tr wire:key="aset-{{ $aset->id }}">
                            <td>{{ $loop->iteration + ($aset_tanah->firstItem() - 1) }}</td>
                            
                            <td>{{ $aset->kode_barang ?? '-' }}</td>
                            <td>{{ $aset->asal_perolehan }}</td>
                            <td>{{ number_format($aset->luas, 2, ',', '.') }}</td>
                            <td>{{ $aset->penggunaan ?? '-' }}</td>

                            <td>
                                <span class="status {{ strtolower($aset->status_validasi) }}">
                                    {{ $aset->status_validasi }}
                                </span>
                            </td>

                            <td class="action-buttons">
                                <a href="{{ route('aset.detail', ['aset' => $aset->id]) }}" wire:navigate class="btn btn-sm btn-primary" title="Lihat Detail"><i class="fas fa-eye"></i></a>

                                @if(auth()->user()->role_id == 1)
                                    <a href="{{ route('aset.edit', ['aset' => $aset->id]) }}" wire:navigate class="btn btn-sm btn-warning" title="Edit Data"><i class="fas fa-pencil-alt"></i></a>
                                    
                                    <button 
                                        wire:click="arsipkan({{ $aset->id }})" 
                                        wire:confirm="Anda yakin ingin mengarsipkan data ini?"
                                        class="btn btn-sm btn-secondary" 
                                        title="Arsipkan">
                                        <i class="fas fa-archive"></i>
                                    </button>
                                @endif

                                @if(auth()->user()->role_id == 2 && $aset->status_validasi == 'Diproses')
                                    <button 
                                        wire:click="openValidasiModal({{ $aset->id }}, 'Disetujui')"
                                        class="btn btn-sm btn-success" title="Setujui">
                                        <i class="fas fa-check"></i>
                                    </button>
                                    <button 
                                        wire:click="openValidasiModal({{ $aset->id }}, 'Ditolak')"
                                        class="btn btn-sm btn-danger" title="Tolak">
                                        <i class="fas fa-times"></i>
                                    </button>
                                @endif
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="7" style="text-align:center; padding: 1rem;">Data tidak ditemukan.</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div style="margin-top: 1.5rem;">
                {{ $aset_tanah->links() }}
            </div>
        </div>
    </div>

    @if($showValidasiModal)
    <div class="modal" style="display: flex;">
        <div class="modal-content">
            <span class="close-button" wire:click="closeValidasiModal">&times;</span>

            <h3 id="modalTitle">
                Konfirmasi {{ $validasiStatus == 'Disetujui' ? 'Persetujuan' : 'Penolakan' }} Aset
            </h3>
            <p>Anda akan memvalidasi aset ini. Berikan catatan jika diperlukan (opsional).</p>

            <form wire:submit="prosesValidasi">
                <div class="form-group">
                    <label for="validasiCatatan">Catatan Validasi</label>
                    <textarea id="validasiCatatan" wire:model="validasiCatatan" class="form-control" rows="3"></textarea>
                </div>

                <button type="submit" class="btn {{ $validasiStatus == 'Disetujui' ? 'btn-success' : 'btn-danger' }}">
                    Ya, {{ $validasiStatus }} Aset
                </button>
                <button type="button" class="btn btn-secondary" wire:click="closeValidasiModal">Batal</button>
            </form>
        </div>
    </div>
    @endif
</div>