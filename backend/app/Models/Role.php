<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['nama_role'];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}

/**
 * ==============================================
 * MODEL 3: TanahKasDesa (Main Model)
 * File: app/Models/TanahKasDesa.php
 * ==============================================
 */
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class TanahKasDesa extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tanah_kas_desa';

    protected $fillable = [
        'uuid',
        'kode_barang',
        'nup',
        'asal_perolehan',
        'tanggal_perolehan',
        'harga_perolehan',
        'bukti_perolehan',
        'nomor_sertifikat',
        'tanggal_sertifikat',
        'status_sertifikat',
        'luas',
        'lokasi',
        'penggunaan',
        'koordinat',
        'kondisi',
        'batas_utara',
        'batas_timur',
        'batas_selatan',
        'batas_barat',
        'keterangan',
        'status_validasi',
        'catatan_validasi',
        'diinput_oleh',
        'divalidasi_oleh',
    ];

    protected $casts = [
        'tanggal_perolehan' => 'date',
        'tanggal_sertifikat' => 'date',
        'harga_perolehan' => 'decimal:2',
        'luas' => 'decimal:2',
    ];

    protected $appends = ['can_delete', 'status_badge'];

    // Auto-generate UUID
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });

        // Prevent deletion before 3 years
        static::deleting(function ($model) {
            if (!$model->can_delete) {
                throw new \Exception(
                    'Data tidak dapat dihapus sebelum 3 tahun dari tanggal input. ' .
                    'Dapat dihapus setelah: ' . $model->created_at->addYears(3)->format('d M Y')
                );
            }
        });

        // Create history on update
        static::updated(function ($model) {
            if ($model->isDirty('status_validasi')) {
                $model->histori()->create([
                    'user_id' => auth()->id(),
                    'aksi' => 'VALIDASI',
                    'deskripsi_perubahan' => "Status berubah dari {$model->getOriginal('status_validasi')} menjadi {$model->status_validasi}",
                    'data_before' => [
                        'status_validasi' => $model->getOriginal('status_validasi'),
                        'catatan_validasi' => $model->getOriginal('catatan_validasi'),
                    ],
                    'data_after' => [
                        'status_validasi' => $model->status_validasi,
                        'catatan_validasi' => $model->catatan_validasi,
                    ],
                ]);
            }
        });
    }

    // Relationships
    public function penginput()
    {
        return $this->belongsTo(User::class, 'diinput_oleh');
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'divalidasi_oleh');
    }

    public function dokumen()
    {
        return $this->hasMany(DokumenPendukung::class, 'tanah_id');
    }

    public function pemanfaatan()
    {
        return $this->hasMany(PemanfaatanTanah::class, 'tanah_id');
    }

    public function histori()
    {
        return $this->hasMany(HistoriTanah::class, 'tanah_id');
    }

    // Scopes
    public function scopeDiproses($query)
    {
        return $query->where('status_validasi', 'Diproses');
    }

    public function scopeDisetujui($query)
    {
        return $query->where('status_validasi', 'Disetujui');
    }

    public function scopeDitolak($query)
    {
        return $query->where('status_validasi', 'Ditolak');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('kode_barang', 'like', "%{$search}%")
              ->orWhere('asal_perolehan', 'like', "%{$search}%")
              ->orWhere('nomor_sertifikat', 'like', "%{$search}%")
              ->orWhere('lokasi', 'like', "%{$search}%");
        });
    }

    // Accessors
    public function getCanDeleteAttribute()
    {
        $threeYearsAgo = now()->subYears(3);
        return $this->created_at->lte($threeYearsAgo);
    }

    public function getStatusBadgeAttribute()
    {
        return [
            'Diproses' => 'warning',
            'Disetujui' => 'success',
            'Ditolak' => 'danger',
        ][$this->status_validasi] ?? 'secondary';
    }

    public function getKoordinatArrayAttribute()
    {
        if (!$this->koordinat) return null;
        
        $coords = explode(',', $this->koordinat);
        return [
            'lat' => (float) trim($coords[0] ?? 0),
            'lng' => (float) trim($coords[1] ?? 0),
        ];
    }
}