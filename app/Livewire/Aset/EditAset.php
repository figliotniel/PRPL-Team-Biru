<?php

namespace App\Livewire\Aset;

use Livewire\Component;
use Livewire\Attributes\Layout;
use App\Models\TanahKasDesa;

#[Layout('layouts.app')]
class EditAset extends Component
{
    // 0. Properti untuk menyimpan ID aset
    public TanahKasDesa $aset;

    // 1. Properti untuk semua field (sama seperti FormAset)
    public $kode_barang = '';
    public $asal_perolehan = '';
    public $luas = '';
    public $tanggal_perolehan = '';
    public $lokasi = '';
    public $nup = null;
    public $harga_perolehan = null;
    public $bukti_perolehan = null;
    public $nomor_sertifikat = null;
    public $tanggal_sertifikat = null;
    public $status_sertifikat = null;
    public $penggunaan = null;
    public $koordinat = null;
    public $kondisi = 'Baik';
    public $batas_utara = null;
    public $batas_timur = null;
    public $batas_selatan = null;
    public $batas_barat = null;
    public $keterangan = null;

    /**
     * 2. Fungsi MOUNT()
     * Ini berjalan PERTAMA KALI saat komponen dimuat.
     * Tugasnya: Mengambil data dari DB dan mengisi semua properti.
     */
    public function mount(TanahKasDesa $aset)
    {
        $this->aset = $aset;

        // Mengisi semua properti dari data $aset
        $this->kode_barang = $aset->kode_barang;
        $this->asal_perolehan = $aset->asal_perolehan;
        $this->luas = $aset->luas;
        $this->tanggal_perolehan = $aset->tanggal_perolehan;
        $this->lokasi = $aset->lokasi;
        $this->nup = $aset->nup;
        $this->harga_perolehan = $aset->harga_perolehan;
        $this->bukti_perolehan = $aset->bukti_perolehan;
        $this->nomor_sertifikat = $aset->nomor_sertifikat;
        $this->tanggal_sertifikat = $aset->tanggal_sertifikat;
        $this->status_sertifikat = $aset->status_sertifikat;
        $this->penggunaan = $aset->penggunaan;
        $this->koordinat = $aset->koordinat;
        $this->kondisi = $aset->kondisi;
        $this->batas_utara = $aset->batas_utara;
        $this->batas_timur = $aset->batas_timur;
        $this->batas_selatan = $aset->batas_selatan;
        $this->batas_barat = $aset->batas_barat;
        $this->keterangan = $aset->keterangan;
    }

    /**
     * 3. Fungsi UPDATE()
     * Ini adalah pengganti `aksi=edit` di proses_crud.php
     */
    public function update()
    {
        // 4. ATURAN VALIDASI (Sama seperti FormAset)
        $validatedData = $this->validate([
            'kode_barang' => 'required|string|max:100',
            'asal_perolehan' => 'required|string|max:255',
            'luas' => 'required|numeric',
            'tanggal_perolehan' => 'required|date',
            'lokasi' => 'required|string',
            'nup' => 'nullable|string|max:50',
            'harga_perolehan' => 'nullable|numeric',
            'bukti_perolehan' => 'nullable|string|max:255',
            'nomor_sertifikat' => 'nullable|string|max:100',
            'tanggal_sertifikat' => 'nullable|date',
            'status_sertifikat' => 'nullable|string|max:100',
            'penggunaan' => 'nullable|string|max:255',
            'koordinat' => 'nullable|string|max:100',
            'kondisi' => 'required|string',
            'batas_utara' => 'nullable|string|max:255',
            'batas_timur' => 'nullable|string|max:255',
            'batas_selatan' => 'nullable|string|max:255',
            'batas_barat' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string',
        ]);

        // 5. UPDATE DATABASE
        $this->aset->update($validatedData);

        // 6. Buat pesan sukses
        session()->flash('success', 'Data aset berhasil diperbarui.');

        // 7. Redirect ke Dashboard
        return $this->redirect('/', navigate: true);
    }

    public function render()
    {
        return view('livewire.aset.edit-aset');
    }
}