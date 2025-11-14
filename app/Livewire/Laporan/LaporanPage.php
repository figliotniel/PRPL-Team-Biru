<?php

namespace App\Livewire\Laporan;

use Livewire\Component;
use Livewire\Attributes\Layout;
use App\Models\TanahKasDesa;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log; // Tambahkan ini untuk debugging jika perlu

#[Layout('layouts.app')]
class LaporanPage extends Component
{
    /**
     * Fungsi untuk mendownload PDF
     * (Tidak ada perubahan di sini, sudah benar)
     */
    public function downloadPdf()
    {
        try {
            // Ambil semua data aset yang "Disetujui" (tidak termasuk arsip/soft delete)
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

        } catch (\Exception $e) {
            // Jika ada error, catat di log
            Log::error('Gagal membuat PDF Laporan: ' . $e->getMessage());
            // Beri tahu pengguna
            session()->flash('error', 'Gagal membuat PDF. Silakan hubungi administrator.');
        }
    }

    /**
     * 3. Fungsi untuk menampilkan halaman
     * (PERUBAHAN DI SINI)
     */
    public function render()
    {
        // Ambil data aset yang "Disetujui" untuk ditampilkan di halaman web
        // Ini tidak akan mengambil data yang di-soft-delete (diarsipkan), yang mana
        // seharusnya sudah benar untuk laporan inventaris aktif.
        $asetYangDisetujui = TanahKasDesa::where('status_validasi', 'Disetujui')
                                        ->orderBy('tanggal_perolehan', 'desc')
                                        ->get();

        // Kirim data ke view
        return view('livewire.laporan.laporan-page', [
            'daftar_aset' => $asetYangDisetujui
        ]);
    }
}