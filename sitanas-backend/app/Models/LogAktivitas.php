<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogAktivitas extends Model
{
    use HasFactory;

    // Nama tabel (jika berbeda dari 'log_aktivitas')
    // protected $table = 'log_aktivitas';

    /**
     * Tentukan field yang boleh diisi (mass assignable).
     * Sesuai dengan migrasi Anda.
     */
    protected $fillable = [
        'user_id',
        'deskripsi',
    ];

    /**
     * Tentukan relasi 'belongsTo' ke User.
     * (Setiap log dimiliki oleh satu user)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}