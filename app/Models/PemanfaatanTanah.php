<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PemanfaatanTanah extends Model
{
    use HasFactory;

    // Nama tabel
    protected $table = 'pemanfaatan_tanah';

    // Kolom yang boleh diisi (dari tambah_pemanfaatan.php)
    protected $fillable = [
        'tanah_id',
        'bentuk_pemanfaatan',
        'pihak_ketiga',
        'tanggal_mulai',
        'tanggal_selesai',
        'nilai_kontribusi',
        'status_pembayaran',
        'path_bukti',
        'keterangan',
        'diinput_oleh',
    ];

    // Sesuai DB lama, kita hanya pakai created_at
    const UPDATED_AT = null;

    // Relasi: Riwayat ini milik 1 Aset
    public function tanah()
    {
        return $this->belongsTo(TanahKasDesa::class, 'tanah_id');
    }
}