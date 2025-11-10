<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; 
use App\Models\DokumenPendukung;
use App\Models\LogAktivitas;

class Tanah extends Model
{
    use HasFactory, SoftDeletes; // <-- Kunci Soft Delete

    /**
     * Kolom yang boleh diisi secara massal (mass assignable).
     */
    protected $fillable = [
        // Data Utama
        'user_id', // ID Penginput
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
     * Relasi ke User (Penginput).
     */
    public function penginput()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validator_id');
    }

    /**
     * Relasi ke Pemanfaatan (Satu aset punya banyak riwayat pemanfaatan).
     */
    public function pemanfaatan()
    {
        return $this->hasMany(PemanfaatanTanah::class);
    }

    public function histori()
    {
        return $this->hasMany(LogAktivitas::class, 'tanah_id');
    }

    public function dokumenPendukung() 
    {
        return $this->hasMany(DokumenPendukung::class, 'tanah_id');
    }
}