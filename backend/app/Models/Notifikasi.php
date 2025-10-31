<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    use HasFactory;

    protected $table = 'notifikasi';
    public $timestamps = false;

    protected $fillable = [
        'user_id_tujuan',
        'pesan',
        'link',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'timestamp' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id_tujuan');
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function markAsRead()
    {
        $this->update(['is_read' => true]);
    }
}