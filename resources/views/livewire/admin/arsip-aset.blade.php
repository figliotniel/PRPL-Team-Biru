<div>
    <div class="content-header">
        <h1>Arsip Aset Tanah</h1>
    </div>

    @if (session('success'))
        <div class="notification success" style="margin-bottom: 1.5rem;">{{ session('success') }}</div>
    @endif

    <div class="card">
        <div class="card-header">
            <h4>Data Aset yang Telah Diarsipkan</h4>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table>
                     <thead>
                        <tr>
                            <th>No</th>
                            <th>Kode</th>
                            <th>Asal</th>
                            <th>Luas (m²)</th>
                            <th>Lokasi</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($asetArsip as $aset)
                        <tr wire:key="aset-{{ $aset->id }}">
                            <td>{{ $loop->iteration + ($asetArsip->firstItem() - 1) }}</td>
                            <td>{{ $aset->kode_barang ?? '-' }}</td>
                            <td>{{ $aset->asal_perolehan }}</td>
                            <td>{{ number_format($aset->luas, 2, ',', '.') }}</td>
                            <td>{{ $aset->lokasi ?? '-' }}</td>
                            <td class="action-buttons">
                                <button 
                                    wire:click="pulihkan({{ $aset->id }})" 
                                    wire:confirm="Anda yakin ingin memulihkan data ini?"
                                    class="btn btn-sm btn-success" 
                                    title="Pulihkan Data">
                                    <i class="fas fa-undo"></i>
                                </button>

                                <button 
                                    wire:click="hapusPermanen({{ $aset->id }})" 
                                    wire:confirm="PERINGATAN: Data ini akan dihapus permanen dan tidak bisa dikembalikan. Lanjutkan?"
                                    class="btn btn-sm btn-danger" 
                                    title="Hapus Permanen">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="6" style="text-align:center; padding: 1rem;">Arsip kosong.</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div style="margin-top: 1.5rem;">
                {{ $asetArsip->links() }}
            </div>
        </div>
    </div>
</div>