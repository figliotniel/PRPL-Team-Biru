<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\PemanfaatanTanah;
use App\Models\Log;
use App\Models\User;


class TanahKasDesa extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Tentukan nama tabel secara eksplisit agar sesuai dengan file controller Anda
     * (unique:tanah_kas_desa)
     */
    protected $table = 'tanah_kas_desa';

    /**
     * Kolom yang boleh diisi secara massal (mass assignable).
     */
    protected $fillable = [
        // Data Utama
        'diinput_oleh', // ID Penginput (dari Auth::id())
        'kode_barang',
        'nup',
        'asal_perolehan',
        'tanggal_perolehan',
        'harga_perolehan',
        'bukti_perolehan',
        
        // Data Yuridis
        'status_sertifikat',
        'nomor_sertifikat',
        'tanggal_sertifikat',
        
        // Data Fisik
        'luas',
        'lokasi',
        'penggunaan',
        'kondisi',
        'koordinat',
        
        // Batas
        'batas_utara',
        'batas_timur',
        'batas_selatan',
        'batas_barat',
        
        // Status & Keterangan
        'keterangan',
        'status_validasi', // Diproses, Disetujui, Ditolak
        'catatan_validasi',
        'validator_id', // ID Kades yang validasi
    ];

    /**
     * Tentukan tipe data untuk kolom tertentu (Casting).
     * Ini membantu Laravel otomatis mengubah data.
     */
    protected $casts = [
        'tanggal_perolehan' => 'date',
        'tanggal_sertifikat' => 'date',
        'luas' => 'float',
        'harga_perolehan' => 'float',
    ];

    /**
     * Relasi ke User (Penginput).
     * Nama fungsi: 'penginput'
     * Foreign Key: 'diinput_oleh'
     */
    public function penginput()
    {
        return $this->belongsTo(User::class, 'diinput_oleh');
    }

    /**
     * Relasi ke User (Validator Kades).
     * Nama fungsi: 'validator'
     * Foreign Key: 'validator_id'
     */
    public function validator()
    {
        return $this->belongsTo(User::class, 'validator_id');
    }

    /**
     * Relasi ke Pemanfaatan (Satu aset punya banyak riwayat pemanfaatan).
     * Nama fungsi: 'pemanfaatan'
     * Model Terkait: 'PemanfaatanTanah'
     * Foreign Key: 'tanah_id'
     */
    public function pemanfaatan()
    {
        return $this->hasMany(PemanfaatanTanah::class, 'tanah_id');
    }

    public function dokumen()
    {
        return $this->hasMany(DokumenPendukung::class, 'tanah_id');
    }

    /**
     * Relasi ke Histori/Log (Satu aset punya banyak histori).
     * Nama fungsi: 'histori'
     * Model Terkait: 'Log'
     * Foreign Key: 'tanah_id'
     */
    public function histori()
    {
        // Pastikan Anda punya Model Log
        return $this->hasMany(Log::class, 'tanah_id')->orderBy('timestamp', 'desc');
    }
}