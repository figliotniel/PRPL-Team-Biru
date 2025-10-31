<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'nama_lengkap',
        'username',
        'email',
        'password',
        'role_id',
        'foto_profil',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function tanahDiinput()
    {
        return $this->hasMany(TanahKasDesa::class, 'diinput_oleh');
    }

    public function tanahDivalidasi()
    {
        return $this->hasMany(TanahKasDesa::class, 'divalidasi_oleh');
    }

    public function logAktivitas()
    {
        return $this->hasMany(LogAktivitas::class);
    }

    public function notifikasi()
    {
        return $this->hasMany(Notifikasi::class, 'user_id_tujuan');
    }

    // Helper Methods
    public function isAdmin()
    {
        return $this->role->nama_role === 'Admin Desa';
    }

    public function isKepalaDesa()
    {
        return $this->role->nama_role === 'Kepala Desa';
    }

    public function isBPD()
    {
        return $this->role->nama_role === 'BPD (Pengawas)';
    }
}
