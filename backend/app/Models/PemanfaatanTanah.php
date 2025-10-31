<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PemanfaatanTanah extends Model
{
    use HasFactory;

    protected $table = 'pemanfaatan_tanah';

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

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'nilai_kontribusi' => 'decimal:2',
    ];

    protected $appends = ['is_active', 'durasi_hari'];

    public function tanah()
    {
        return $this->belongsTo(TanahKasDesa::class, 'tanah_id');
    }

    public function penginput()
    {
        return $this->belongsTo(User::class, 'diinput_oleh');
    }

    public function getIsActiveAttribute()
    {
        $now = now();
        return $now->between($this->tanggal_mulai, $this->tanggal_selesai);
    }

    public function getDurasiHariAttribute()
    {
        return $this->tanggal_mulai->diffInDays($this->tanggal_selesai);
    }
}