<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogAktivitas extends Model
{
    use HasFactory;

    // Nama tabel
    protected $table = 'log_aktivitas';

    // Kolom yang boleh diisi
    protected $fillable = ['user_id', 'aksi', 'deskripsi', 'timestamp'];

    // Kita tidak pakai created_at/updated_at, tapi 'timestamp'
    // Jadi, kita matikan timestamps bawaan Laravel
    public $timestamps = false;
}