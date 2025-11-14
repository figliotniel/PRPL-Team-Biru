<?php

namespace App\Livewire\Aset;

use Livewire\Component;
use Livewire\Attributes\Layout;
use App\Models\TanahKasDesa;
use App\Models\DokumenPendukung;
use App\Models\PemanfaatanTanah;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

#[Layout('layouts.app')]
class DetailPage extends Component
{
    use WithFileUploads;
    public TanahKasDesa $aset;

    // [BARU] Properti untuk menampung daftar dokumen
    public $dokumen_pendukung = [];
    
    // Properti untuk form pemanfaatan (ini sudah ada di file Anda)
    public $p_bentuk_pemanfaatan = 'Sewa';
    public $p_pihak_ketiga;
    public $p_tanggal_mulai;
    public $p_tanggal_selesai;
    public $p_nilai_kontribusi = 0;
    public $p_status_pembayaran = 'Belum Lunas';
    public $p_path_bukti;
    public $p_keterangan;

    // Properti membingungkan dari file Anda (kita abaikan dulu)
    public $fileUpload;
    public $nama_dokumen;
    public $kategori_dokumen = 'Lain-lain';
    public $tanggal_kadaluarsa;


    public function mount(TanahKasDesa $aset)
    {
        $this->aset = $aset->load(['diinput_oleh_user', 'divalidasi_oleh_user']);

        // [BARU] Panggil fungsi untuk memuat dokumen
        $this->loadDokumenPendukung();
    }

    /**
     * [BARU] Fungsi untuk memuat dokumen
     * Ini akan dicek berdasarkan role
     */
    public function loadDokumenPendukung()
    {
        $user = Auth::user();
        
        // Role yang diizinkan melihat dokumen
        $allowedRoles = ['Admin Desa', 'Kepala Desa', 'BPN'];

        // Cek jika user ada DAN rolenya termasuk dalam daftar di atas
        if ($user && in_array($user->role->nama_role, $allowedRoles)) {
            // Muat dokumen dari relasi
            $this->dokumen_pendukung = $this->aset->dokumen()->get();
        }
    }


    /**
     * Fungsi untuk simpan riwayat pemanfaatan
     * (Ini sudah ada di file Anda, tidak diubah)
     */
    public function simpanPemanfaatan()
    {
        $validated = $this->validate([
            'p_bentuk_pemanfaatan' => 'required|string',
            'p_pihak_ketiga' => 'required|string|max:255',
            'p_tanggal_mulai' => 'required|date',
            'p_tanggal_selesai' => 'required|date|after_or_equal:p_tanggal_mulai',
            'p_nilai_kontribusi' => 'required|numeric|min:0',
            'p_status_pembayaran' => 'required|string',
            'p_path_bukti' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048', // maks 2MB
            'p_keterangan' => 'nullable|string',
        ]);

        $pathBukti = null;
        if ($this->p_path_bukti) {
            $pathBukti = $this->p_path_bukti->store('bukti_pemanfaatan/' . $this->aset->id, 'public');
        }

        $this->aset->pemanfaatan()->create([
            'bentuk_pemanfaatan' => $validated['p_bentuk_pemanfaatan'],
            'pihak_ketiga' => $validated['p_pihak_ketiga'],
            'tanggal_mulai' => $validated['p_tanggal_mulai'],
            'tanggal_selesai' => $validated['p_tanggal_selesai'],
            'nilai_kontribusi' => $validated['p_nilai_kontribusi'],
            'status_pembayaran' => $validated['p_status_pembayaran'],
            'path_bukti' => $pathBukti,
            'keterangan' => $validated['p_keterangan'],
            'diinput_oleh' => Auth::id(),
        ]);

        $this->reset(
            'p_bentuk_pemanfaatan', 'p_pihak_ketiga', 'p_tanggal_mulai', 
            'p_tanggal_selesai', 'p_nilai_kontribusi', 'p_status_pembayaran', 
            'p_path_bukti', 'p_keterangan'
        );
        $this->aset->refresh();
        session()->flash('success_pemanfaatan', 'Riwayat pemanfaatan berhasil ditambahkan.');
    }

    /**
     * Fungsi untuk download PDF detail
     * (Ini sudah ada di file Anda, tidak diubah)
     */
    public function downloadDetailPdf()
    {
        $data = ['aset' => $this->aset];
        $pdf = Pdf::loadView('pdf.detail_aset', $data)
                  ->setPaper('a4', 'portrait');

        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->stream();
        }, 'detail-aset-'.$this->aset->kode_barang.'.pdf');
    }

    /**
     * Fungsi render
     * (Tidak diubah)
     */
    public function render()
    {
        return view('livewire.aset.detail-page');
    }

    /**
     * Fungsi simpanDokumen Bawaan Anda
     * (Saya biarkan saja, tapi ini seharusnya tidak ada di DetailPage)
     */
    public function simpanDokumen()
    {
        // Validasi
        $validated = $this->validate([
            'fileUpload' => 'required|file|max:10240', // 10MB Max
            'nama_dokumen' => 'required|string|max:255',
            'kategori_dokumen' => 'required|string',
            'tanggal_kadaluarsa' => 'nullable|date',
        ]);

        // Simpan file
        $path = $this->fileUpload->store('dokumen_pendukung/' . $this->aset->id, 'public');

        // Simpan ke DB
        $this->aset->dokumen()->create([
            'nama_dokumen' => $validated['nama_dokumen'],
            'file_path' => $path,
            'tipe_file' => $this->fileUpload->getMimeType(),
            'kategori' => $validated['kategori_dokumen'],
            'tanggal_kadaluarsa' => $validated['tanggal_kadaluarsa'],
            'diinput_oleh' => Auth::id(),
        ]);

        // Reset form
        $this->reset('fileUpload', 'nama_dokumen', 'kategori_dokumen', 'tanggal_kadaluarsa');
        $this->aset->refresh(); // Refresh data dokumen
        session()->flash('success_dokumen', 'Dokumen pendukung berhasil ditambahkan.');
    }
}