<?php

namespace App\Livewire\Aset;

use Livewire\Component;
use Livewire\Attributes\Layout;
use App\Models\TanahKasDesa;
use App\Models\DokumenPendukung;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

#[Layout('layouts.app')]
class EditAset extends Component
{
    use WithFileUploads;

    // Properti untuk menyimpan ID aset
    public TanahKasDesa $aset;

    // Properti untuk semua field (sama seperti FormAset)
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
    public $new_dokumen; 
    public $existing_dokumen = []; 

    /**
     * Fungsi MOUNT()
     */
    public function mount(TanahKasDesa $aset)
    {
        $this->aset = $aset;
        $this->fill($aset);

        // Muat dokumen HANYA jika admin
        // Kita juga akan cek ini di file blade
        if (Auth::user()->role->nama_role === 'Admin') {
            $this->loadExistingDokumen();
        }
    }

    /**
     * Fungsi helper untuk mengambil daftar dokumen dari DB
     */
    public function loadExistingDokumen()
    {
        // Pastikan lagi hanya admin yang bisa memuat ini
        if (Auth::user()->role->nama_role !== 'Admin') {
            return;
        }
        $this->existing_dokumen = $this->aset->dokumen()->get();
    }

    /**
     * Fungsi SAVE()
     * Menyimpan perubahan data aset (data teks, angka, dll)
     */
    public function save()
    {
        // VALIDASI (Sama seperti FormAset)
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

        try {
            // UPDATE DATA ASET
            $this->aset->update($validatedData);
            session()->flash('success', 'Data aset berhasil diperbarui.');
        } catch (\Exception $e) {
            session()->flash('error', 'Terjadi kesalahan saat memperbarui data: ' . $e->getMessage());
        }
    }

    /**
     * Fungsi untuk UPLOAD DOKUMEN BARU
     */

        public function uploadDokumen()
    {
        if (Auth::user()->role->nama_role !== 'Admin Desa') {
            abort(403, 'Anda tidak memiliki hak akses untuk melakukan tindakan ini.');
        }

        $this->validate([
            'new_dokumen' => 'required|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:10240' 
        ]);

        try {
            $path = $this->new_dokumen->store('dokumen_aset/' . $this->aset->id, 'public');
            $this->aset->dokumen()->create([
                'nama_dokumen' => $this->new_dokumen->getClientOriginalName(), 
                'file_path' => $path,
                'tipe_file' => $this->new_dokumen->getMimeType()
            ]);

            $this->reset('new_dokumen');
            $this->loadExistingDokumen();
            session()->flash('dokumen_success', 'Dokumen berhasil di-upload.');

        } catch (\Exception $e) {
            session()->flash('dokumen_error', 'Gagal meng-upload dokumen: ' . $e->getMessage());
        }
    }

    /**
     * Fungsi untuk HAPUS DOKUMEN
     */
    public function hapusDokumen($dokumenId)
    {
        if (Auth::user()->role->nama_role !== 'Admin Desa') {
            abort(403, 'Anda tidak memiliki hak akses untuk melakukan tindakan ini.');
        }

        try {
            $dokumen = DokumenPendukung::find($dokumenId);
            if ($dokumen && $dokumen->tanah_id == $this->aset->id) {
                Storage::disk('public')->delete($dokumen->file_path);
                $dokumen->delete();
                $this->loadExistingDokumen();
                session()->flash('dokumen_success', 'Dokumen berhasil dihapus.');
            }
        } catch (\Exception $e) {
            session()->flash('dokumen_error', 'Gagal menghapus dokumen: ' . $e->getMessage());
        }
    }

    /**
     * Fungsi RENDER
     */
    public function render()
    {
        return view('livewire.aset.edit-aset');
    }
}
