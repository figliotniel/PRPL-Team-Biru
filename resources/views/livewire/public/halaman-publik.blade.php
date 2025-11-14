<div>
    <div class="content-header">
        <h1>Informasi Publik Tanah Kas Desa</h1>
        <a href="{{ route('login') }}" wire:navigate class="btn btn-primary">
            <i class="fas fa-sign-in-alt"></i> Login Aparatur
        </a>
    </div>

    <div class="card">
        <div class="card-header">
            <h4><i class="fas fa-list-ul"></i> Daftar Aset Tanah Kas Desa</h4>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Asal Perolehan</th>
                            <th>Nomor Sertifikat</th>
                            <th>Luas (m²)</th>
                            <th>Lokasi</th>
                            <th>Penggunaan</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($asetPublik as $aset)
                        <tr>
                            <td>{{ $loop->iteration + ($asetPublik->firstItem() - 1) }}</td>
                            <td>{{ $aset->asal_perolehan }}</td>
                            <td>{{ $aset->nomor_sertifikat ?? '-' }}</td>
                            <td>{{ number_format($aset->luas, 0, ',', '.') }}</td>
                            <td>{{ $aset->lokasi ?? '-' }}</td>
                            <td>{{ $aset->penggunaan ?? '-' }}</td>
                        </tr>
                        @empty
                        <tr><td colspan="6" style="text-align:center; padding: 2rem;">Tidak ada data publik yang tersedia saat ini.</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div style="margin-top: 1.5rem;">
                {{ $asetPublik->links() }}
            </div>

        </div>
    </div>
</div>