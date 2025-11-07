<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TanahKasDesa;

class Log extends Model
{
    use HasFactory;

    // Tentukan nama tabel
    protected $table = 'logs';
    public $timestamps = false; 

    /**
     * Kolom yang boleh diisi (mass assignable).
     */
    protected $fillable = [
        'tanah_id',
        'user_id',
        'aksi',
        'deskripsi',
        'ip_address',
        // Kita HAPUS 'timestamp' dari sini karena diisi otomatis oleh database
    ];

    /**
     * Tipe data (Casting).
     */
    protected $casts = [
        'timestamp' => 'datetime',
    ];

    /**
     * Relasi ke User (Log ini milik siapa).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke Tanah (Log ini tentang aset mana).
     */
    public function tanah()
    {
        return $this->belongsTo(TanahKasDesa::class, 'tanah_id');
    }
}