<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterAsalPerolehan extends Model
{
    use HasFactory;
    
    // Asumsi nama tabelnya 'master_asal_perolehans'
    protected $table = 'master_asal_perolehans'; 
    public $timestamps = false; // Asumsi tidak pakai created_at/updated_at
}