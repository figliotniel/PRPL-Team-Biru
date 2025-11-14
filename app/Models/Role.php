<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    // Relasi: 1 Role punya BANYAK User
    public function users()
    {
        return $this->hasMany(User::class);
    }
}