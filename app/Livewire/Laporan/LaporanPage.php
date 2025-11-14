<?php

namespace App\Livewire\Laporan;

use Livewire\Component;
use Livewire\Attributes\Layout;
use App\Models\TanahKasDesa;
use Barryvdh\DomPDF\Facade\Pdf; // 1. IMPORT PAKET PDF

#[Layout('layouts.app')]
class LaporanPage extends Component
{
    /**
     * 2. FUNGSI UNTUK MENDOWNLOAD PDF
     */
    public function downloadPdf()
    {
        // Ambil semua data aset yang "Disetujui" (sesuai logika laporan.php)
        $aset = TanahKasDesa::where('status_validasi', 'Disetujui')->get();

        // Siapkan data untuk dikirim ke file Blade PDF
        $data = ['aset' => $aset];

        // Buat PDF
        $pdf = Pdf::loadView('pdf.laporan_aset', $data)
                  ->setPaper('a4', 'landscape'); // Set kertas A4 landscape

        // Download PDF-nya
        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->stream();
        }, 'laporan-inventaris-tanah-'.date('Y-m-d').'.pdf');
    }

    /**
     * 3. Fungsi untuk menampilkan halaman
     */
    public function render()
    {
        return view('livewire.laporan.laporan-page');
    }
}