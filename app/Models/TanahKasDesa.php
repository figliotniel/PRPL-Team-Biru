<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // 1. IMPORT FITUR ARSIP

class TanahKasDesa extends Model
{
    use HasFactory, SoftDeletes; // 2. AKTIFKAN FITUR ARSIP

    /**
     * Nama tabel yang terhubung ke model ini.
     */
    protected $table = 'tanah_kas_desa'; // 3. BERI TAHU NAMA TABELNYA

    /**
     * Kolom yang boleh diisi secara massal (untuk form tambah/edit).
     */
    protected $fillable = [
        'kode_barang', 'nup', 'asal_perolehan', 'tanggal_perolehan', 
        'harga_perolehan', 'bukti_perolehan', 'nomor_sertifikat', 
        'tanggal_sertifikat', 'status_sertifikat', 'luas', 'lokasi', 
        'penggunaan', 'koordinat', 'kondisi', 'batas_utara', 'batas_timur', 
        'batas_selatan', 'batas_barat', 'keterangan', 'diinput_oleh', 'status_validasi',
        'catatan_validasi', 'divalidasi_oleh',
    ];

        public function pemanfaatan()
    {
        // Urutkan berdasarkan yang paling baru
        return $this->hasMany(PemanfaatanTanah::class, 'tanah_id')
                    ->orderBy('tanggal_mulai', 'desc');
    }
        public function dokumen()
    {
        return $this->hasMany(DokumenPendukung::class, 'tanah_id');
    }

        public function diinput_oleh_user()
    {
        return $this->belongsTo(User::class, 'diinput_oleh');
    }
    public function divalidasi_oleh_user()
    {
        return $this->belongsTo(User::class, 'divalidasi_oleh');
    }
}