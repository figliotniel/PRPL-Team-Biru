<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * Mengambil data statistik dashboard.
     */
    public function stats(Request $request)
    {
        try {
            // Ambil data dari tabel tanah_kas_desa
            $total_aset = DB::table('tanah_kas_desa')->count();

            $total_luas = DB::table('tanah_kas_desa')
                ->where('status_validasi', 'Disetujui')
                ->sum('luas');

            $aset_diproses = DB::table('tanah_kas_desa')
                ->where('status_validasi', 'Diproses')
                ->count();
                
            $aset_disetujui = DB::table('tanah_kas_desa')
                ->where('status_validasi', 'Disetujui')
                ->count();

            // Kembalikan JSON
            return response()->json([
                'total_aset' => $total_aset,
                'total_luas' => (float) $total_luas, 
                'aset_diproses' => $aset_diproses,
                'aset_disetujui' => $aset_disetujui,
            ], 200);

        } catch (\Exception $e) {
            // Log error untuk debugging
            Log::error('Error in DashboardController@stats: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Gagal memuat data statistik',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mengambil aktivitas terbaru (OPTIONAL - untuk dashboard)
     */
    public function recentActivities(Request $request)
    {
        try {
            $activities = DB::table('log_aktivitas')
                ->join('users', 'log_aktivitas.user_id', '=', 'users.id')
                ->select(
                    'log_aktivitas.id',
                    'log_aktivitas.aksi',
                    'log_aktivitas.deskripsi',
                    'log_aktivitas.created_at',
                    'users.nama_lengkap as user_name'
                )
                ->orderBy('log_aktivitas.created_at', 'desc')
                ->limit(10)
                ->get();

            return response()->json($activities, 200);

        } catch (\Exception $e) {
            Log::error('Error in DashboardController@recentActivities: ' . $e->getMessage());
            
            // Return empty array jika tabel belum ada
            return response()->json([], 200);
        }
    }
}