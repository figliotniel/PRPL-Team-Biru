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

#[Layout('layouts.app')]
class DetailPage extends Component
{
    use WithFileUploads;
    public TanahKasDesa $aset;
    public $fileUpload;
    public $nama_dokumen;
    public $kategori_dokumen = 'Lain-lain';
    public $tanggal_kadaluarsa;
    public $p_bentuk_pemanfaatan = 'Sewa';
    public $p_pihak_ketiga;
    public $p_tanggal_mulai;
    public $p_tanggal_selesai;
    public $p_nilai_kontribusi = 0;
    public $p_status_pembayaran = 'Belum Lunas';
    public $p_path_bukti;
    public $p_keterangan;

    public function mount(TanahKasDesa $aset)
    {
        $this->aset = $aset->load(['diinput_oleh_user', 'divalidasi_oleh_user']);
    }

    public function simpanDokumen()
    {
        // Validasi (mirip upload.php)
        $validated = $this->validate([
            'nama_dokumen' => 'required|string|max:255',
            'fileUpload' => 'required|file|max:5120', // 5MB max
            'kategori_dokumen' => 'nullable|string',
            'tanggal_kadaluarsa' => 'nullable|date',
            
        ]);

        $path = $this->fileUpload->store('dokumen', 'public');
        
        DokumenPendukung::create([
            'tanah_id' => $this->aset->id,
            'nama_dokumen' => $validated['nama_dokumen'],
            'kategori_dokumen' => $validated['kategori_dokumen'],
            'tanggal_kadaluarsa' => $validated['tanggal_kadaluarsa'],
            'path_file' => $path,
        ]);

        // Reset form dan refresh data aset
        $this->reset('fileUpload', 'nama_dokumen', 'kategori_dokumen', 'tanggal_kadaluarsa');
        $this->aset->refresh(); // Ini akan memuat ulang relasi 'dokumen'

        session()->flash('success_upload', 'Dokumen berhasil diunggah.');
    }

    public function simpanPemanfaatan()
    {
        $validated = $this->validate([
            'p_bentuk_pemanfaatan' => 'required|string',
            'p_pihak_ketiga' => 'required|string',
            'p_tanggal_mulai' => 'required|date',
            'p_tanggal_selesai' => 'required|date|after_or_equal:p_tanggal_mulai',
            'p_nilai_kontribusi' => 'required|numeric|min:0',
            'p_status_pembayaran' => 'required|string',
            'p_path_bukti' => 'nullable|file|max:5120', // Opsional, maks 5MB
            'p_keterangan' => 'nullable|string',
        ]);

        $pathBukti = null;
        if ($this->p_path_bukti) {
            // Simpan file di storage/app/public/pemanfaatan
            $pathBukti = $this->p_path_bukti->store('pemanfaatan', 'public');
        }

        PemanfaatanTanah::create([
            'tanah_id' => $this->aset->id,
            'bentuk_pemanfaatan' => $validated['p_bentuk_pemanfaatan'],
            'pihak_ketiga' => $validated['p_pihak_ketiga'],
            'tanggal_mulai' => $validated['p_tanggal_mulai'],
            'tanggal_selesai' => $validated['p_tanggal_selesai'],
            'nilai_kontribusi' => $validated['p_nilai_kontribusi'],
            'status_pembayaran' => $validated['p_status_pembayaran'],
            'path_bukti' => $pathBukti,
            'keterangan' => $validated['p_keterangan'],
            'diinput_oleh' => Auth::id(), // Simpan siapa yg input
        ]);

        // Reset form (kecuali field 'p_')
        $this->reset(
            'p_bentuk_pemanfaatan', 'p_pihak_ketiga', 'p_tanggal_mulai', 
            'p_tanggal_selesai', 'p_nilai_kontribusi', 'p_status_pembayaran', 
            'p_path_bukti', 'p_keterangan'
        );
        $this->aset->refresh(); // Refresh data riwayat
        session()->flash('success_pemanfaatan', 'Riwayat pemanfaatan berhasil ditambahkan.');
    }

    public function downloadDetailPdf()
    {
        // Siapkan data
        $data = ['aset' => $this->aset];

        // Buat PDF
        $pdf = Pdf::loadView('pdf.detail_aset', $data)
                  ->setPaper('a4', 'portrait'); // Set kertas A4 portrait

        // Download PDF-nya
        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->stream();
        }, 'detail-aset-'.$this->aset->kode_barang.'.pdf');
    }

    public function render()
    {
        return view('livewire.aset.detail-page');
    }
}