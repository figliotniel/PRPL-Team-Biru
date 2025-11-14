<div>
    <div class="content-header">
        <h1>Laporan Aset Desa</h1>
    </div>

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

            <div wire:loading wire:target="downloadPdf" style="margin-top: 1rem; color: var(--primary-color);">
                <i class="fas fa-spinner fa-spin"></i> Mohon tunggu, sedang membuat PDF...
            </div>
        </div>
    </div>
</div>