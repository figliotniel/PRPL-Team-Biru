<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TanahKasDesa; // <-- Import model Aset yang benar

// Nama class harus sama dengan nama file: PemanfaatanTanah
class PemanfaatanTanah extends Model
{
    use HasFactory;
    
    // Tentukan nama tabel jika tidak jamak (e.g. pemanfaatan_tanah)
    // Ini harus sama dengan nama tabel di file migrasi
    protected $table = 'pemanfaatan_tanah';

    /**
     * Kolom yang boleh diisi.
     */
    protected $fillable = [
        'tanah_id', // Kunci relasi
        'user_id',  // Kunci relasi (Siapa yang input)
        'bentuk_pemanfaatan',
        'pihak_ketiga',
        'tanggal_mulai',
        'tanggal_selesai',
        'nilai_kontribusi',
        'status_pembayaran',
    ];

    /**
     * Tentukan tipe data (Casting).
     */
    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'nilai_kontribusi' => 'float',
    ];

    /**
     * Relasi ke Tanah (Riwayat ini milik aset mana).
     */
    public function tanah()
    {
        // Relasi ini harus ke Model TanahKasDesa
        return $this->belongsTo(TanahKasDesa::class, 'tanah_id');
    }

    /**
     * Relasi ke User (Siapa yang menginput data pemanfaatan ini).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}