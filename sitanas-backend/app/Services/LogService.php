<?php
namespace App\Services;

use App\Models\LogAktivitas;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class LogService
{
    /**
     * Create log entry
     */
    public function log($aksi, $deskripsi = null)
    {
        return LogAktivitas::create([
            'user_id' => Auth::id(),
            'aksi' => $aksi,
            'deskripsi' => $deskripsi,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    /**
     * Get logs with filters
     */
    public function getFilteredLogs($filters)
    {
        $query = LogAktivitas::with('user:id,nama_lengkap,username');

        // Search filter
        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('deskripsi', 'like', "%{$filters['search']}%")
                  ->orWhereHas('user', function($q) use ($filters) {
                      $q->where('nama_lengkap', 'like', "%{$filters['search']}%");
                  });
            });
        }

        // User filter
        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        // Action filter
        if (!empty($filters['aksi'])) {
            $query->where('aksi', $filters['aksi']);
        }

        // Date range filter
        if (!empty($filters['start_date'])) {
            $query->whereDate('timestamp', '>=', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $query->whereDate('timestamp', '<=', $filters['end_date']);
        }

        $perPage = $filters['per_page'] ?? 20;
        return $query->orderBy('timestamp', 'desc')->paginate($perPage);
    }
}