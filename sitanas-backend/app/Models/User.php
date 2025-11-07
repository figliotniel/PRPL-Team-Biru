<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// --- TAMBAHKAN INI ---
use App\Models\Role; // Import model Role

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes; 

    /**
     * The attributes that are mass assignable.
     */
// ... existing code ...
    protected $fillable = [
        'nama_lengkap',
        'email',
// ... existing code ...
        'password',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
// ... existing code ...
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     */
// ... existing code ...
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed', 
    ];

    // --- TAMBAHKAN FUNGSI INI ---
    /**
     * Mendefinisikan relasi ke model Role.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}