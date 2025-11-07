<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterStatusSertifikat extends Model
{
    use HasFactory;
    
    // Asumsi nama tabelnya 'master_status_sertifikats'
    protected $table = 'master_status_sertifikats';
    public $timestamps = false;
}