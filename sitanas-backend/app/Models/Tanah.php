<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // Untuk fitur hapus (nonaktifkan)

class Tanah extends Model
{
    use HasFactory, SoftDeletes;

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
        // 'user_id' adalah foreign key di tabel 'tanahs'
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke User (Validator).
     */
    public function validator()
    {
        // 'validator_id' adalah foreign key di tabel 'tanahs'
        return $this->belongsTo(User::class, 'validator_id');
    }

    /**
     * Relasi ke Pemanfaatan (Satu aset punya banyak riwayat pemanfaatan).
     */
    public function pemanfaatan()
    {
        return $this->hasMany(Pemanfaatan::class);
    }

    /**
     * Relasi ke Histori/Log (Satu aset punya banyak histori).
     * Ini adalah relasi untuk 'data.histori' di DetailTanahPage.jsx
     */
    public function histori()
    {
        // 'tanah_id' adalah foreign key di tabel 'logs'
        return $this->hasMany(Log::class, 'tanah_id');
    }
}