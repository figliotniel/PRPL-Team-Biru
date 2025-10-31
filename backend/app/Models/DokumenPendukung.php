<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DokumenPendukung extends Model
{
    use HasFactory;

    protected $table = 'dokumen_pendukung';

    protected $fillable = [
        'tanah_id',
        'nama_dokumen',
        'kategori_dokumen',
        'path_file',
        'file_size',
        'mime_type',
        'tanggal_kadaluarsa',
    ];

    protected $casts = [
        'tanggal_kadaluarsa' => 'date',
        'file_size' => 'integer',
    ];

    protected $appends = ['file_url', 'is_expired'];

    public function tanah()
    {
        return $this->belongsTo(TanahKasDesa::class, 'tanah_id');
    }

    public function getFileUrlAttribute()
    {
        return asset('storage/' . $this->path_file);
    }

    public function getIsExpiredAttribute()
    {
        if (!$this->tanggal_kadaluarsa) return false;
        return now()->isAfter($this->tanggal_kadaluarsa);
    }

    public function getFileSizeHumanAttribute()
    {
        if (!$this->file_size) return '-';
        
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
}