<?php

namespace App\Livewire\Aset;

use Livewire\Component;
use Livewire\Attributes\Layout;
use App\Models\TanahKasDesa;
use Illuminate\Support\Facades\Auth;

#[Layout('layouts.app')]
class FormAset extends Component
{
    // 1. Definisikan SEMUA properti (kolom) dari form
    // (Ini menggantikan $_POST['...'])

    // Data Wajib
    public $kode_barang = '';
    public $asal_perolehan = '';
    public $luas = '';
    public $tanggal_perolehan = '';
    public $lokasi = '';

    // Data Opsional
    public $nup = null;
    public $harga_perolehan = null;
    public $bukti_perolehan = null;
    public $nomor_sertifikat = null;
    public $tanggal_sertifikat = null;
    public $status_sertifikat = null;
    public $penggunaan = null;
    public $koordinat = null;
    public $kondisi = 'Baik'; // Default value
    public $batas_utara = null;
    public $batas_timur = null;
    public $batas_selatan = null;
    public $batas_barat = null;
    public $keterangan = null;

    // 2. Fungsi ini yang akan dipanggil oleh <form wire:submit="simpan">
    public function simpan()
    {
        // 3. ATURAN VALIDASI (Sesuai rencana kita)
        $validatedData = $this->validate([
            // Wajib
            'kode_barang' => 'required|string|max:100',
            'asal_perolehan' => 'required|string|max:255',
            'luas' => 'required|numeric',
            'tanggal_perolehan' => 'required|date',
            'lokasi' => 'required|string',

            // Opsional (boleh null)
            'nup' => 'nullable|string|max:50',
            'harga_perolehan' => 'nullable|numeric',
            'bukti_perolehan' => 'nullable|string|max:255',
            'nomor_sertifikat' => 'nullable|string|max:100',
            'tanggal_sertifikat' => 'nullable|date',
            'status_sertifikat' => 'nullable|string|max:100',
            'penggunaan' => 'nullable|string|max:255',
            'koordinat' => 'nullable|string|max:100',
            'kondisi' => 'required|string', // Tetap wajib, tapi sudah ada default 'Baik'
            'batas_utara' => 'nullable|string|max:255',
            'batas_timur' => 'nullable|string|max:255',
            'batas_selatan' => 'nullable|string|max:255',
            'batas_barat' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        // 4. Tambahkan ID user yang sedang login
        $validatedData['diinput_oleh'] = Auth::id();

        // 5. SIMPAN KE DATABASE (Menggantikan INSERT INTO...)
        TanahKasDesa::create($validatedData);

        // 6. Buat pesan sukses (Pengganti set_flash_message)
        session()->flash('success', 'Data aset baru berhasil disimpan.');

        // 7. Redirect ke Dashboard
        return $this->redirect('/', navigate: true);
    }

    public function render()
    {
        return view('livewire.aset.form-aset');
    }
}