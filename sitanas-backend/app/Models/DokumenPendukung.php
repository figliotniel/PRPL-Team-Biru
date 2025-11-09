<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DokumenPendukung extends Model
{
    use HasFactory;

    // Tentukan nama tabel secara eksplisit
    protected $table = 'dokumen_pendukung';

    /**
     * Tentukan field yang boleh diisi (mass assignable).
     * Sesuai dengan migrasi Anda.
     */
    protected $fillable = [
        'tanah_id',
        'nama_dokumen',
        'jenis_dokumen', // misal: Sertifikat, Peta, Akta
        'file_path',
        'url',
    ];

    /**
     * Relasi 'belongsTo' ke TanahKasDesa.
     */
    public function tanahKasDesa()
    {
        return $this->belongsTo(TanahKasDesa::class, 'tanah_id');
    }
}