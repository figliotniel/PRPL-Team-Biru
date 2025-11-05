<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    // Nonaktifkan timestamps karena tabel 'roles' hanya punya id dan nama_role
    public $timestamps = false; 

    // Tentukan nama tabel secara eksplisit (opsional, tapi bagus)
    protected $table = 'roles'; 

    // Tentukan primary key (opsional)
    protected $primaryKey = 'id';

    // Semua kolom boleh diisi
    protected $guarded = [];

    // Relasi ke User
    public function users()
    {
        return $this->hasMany(User::class, 'role_id');
    }
}