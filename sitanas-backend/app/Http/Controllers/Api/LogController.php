<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LogController extends Controller
{
    /**
     * Get paginated logs with filters
     */
    public function index(Request $request)
    {
        $query = LogAktivitas::with('user:id,nama_lengkap,email');

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by action
        if ($request->filled('aksi')) {
            $query->where('aksi', $request->aksi);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search in description
        if ($request->filled('search')) {
            $query->where('deskripsi', 'like', '%' . $request->search . '%');
        }

        // Order by latest
        $query->orderBy('created_at', 'desc');

        // Paginate
        $logs = $query->paginate(20);

        return response()->json($logs);
    }

    /**
     * Get log statistics
     */
    public function stats()
    {
        $stats = [
            'total_logs' => LogAktivitas::count(),
            'today_logs' => LogAktivitas::whereDate('created_at', today())->count(),
            'this_week_logs' => LogAktivitas::whereBetween('created_at', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
            'this_month_logs' => LogAktivitas::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'by_action' => LogAktivitas::select('aksi', DB::raw('count(*) as total'))
                ->groupBy('aksi')
                ->get(),
            'by_user' => LogAktivitas::select('user_id', DB::raw('count(*) as total'))
                ->with('user:id,nama_lengkap')
                ->groupBy('user_id')
                ->orderBy('total', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Delete old logs
     */
    public function cleanup(Request $request)
    {
        $request->validate([
            'days' => 'required|integer|min:1'
        ]);

        $date = now()->subDays($request->days);
        $deleted = LogAktivitas::where('created_at', '<', $date)->delete();

        return response()->json([
            'message' => "Berhasil menghapus {$deleted} log lebih dari {$request->days} hari.",
            'deleted_count' => $deleted
        ]);
    }

    /**
     * Export logs to Excel
     */
    public function export(Request $request)
    {
        // Install package: composer require maatwebsite/excel
        // Implementasi export ke Excel bisa pakai Laravel Excel
        
        return response()->json([
            'message' => 'Export feature coming soon'
        ]);
    }
}