<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DokumenPendukung extends Model
{
    use HasFactory;

    // Nama tabel
    protected $table = 'dokumen_pendukung';

    // Kolom yang boleh diisi (dari upload.php)
    protected $fillable = [
        'tanah_id',
        'nama_dokumen',
        'kategori_dokumen',
        'tanggal_kadaluarsa',
        'path_file',
    ];

    // Ganti 'created_at' agar sesuai dengan 'uploaded_at' di DB lama
    const CREATED_AT = 'uploaded_at';
    const UPDATED_AT = null; // Kita tidak pakai updated_at

    // Relasi: Dokumen ini milik 1 Aset
    public function tanah()
    {
        return $this->belongsTo(TanahKasDesa::class, 'tanah_id');
    }
}