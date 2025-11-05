<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TanahKasDesa extends Model
{
    use HasFactory;

    protected $table = 'tanah_kas_desa'; // Nama tabelmu yang benar

    protected $guarded = ['id']; // Semua kolom boleh diisi kecuali 'id'

    protected $casts = [
        'luas' => 'float',
        'harga_perolehan' => 'float',
        'tanggal_perolehan' => 'date',
        'tanggal_sertifikat' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke User yang menginput data.
     * (Model User kita sudah benar, jadi ini akan bekerja)
     */
    public function penginput()
    {
        return $this->belongsTo(User::class, 'diinput_oleh');
    }
}