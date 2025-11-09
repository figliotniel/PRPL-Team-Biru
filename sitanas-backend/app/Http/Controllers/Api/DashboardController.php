<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\TanahKasDesa;
use App\Models\LogAktivitas; // Import ini sudah ada

class DashboardController extends Controller
{
    /**
     * Mengambil statistik utama untuk dashboard.
     * (Biarkan fungsi ini seperti yang sudah kita buat)
     */
    public function getStats()
    {
        $totalUsers = User::count();
        $totalTanah = TanahKasDesa::count();
        $totalLuas = TanahKasDesa::sum('luas');
        $totalAdmin = User::where('role_id', 1)->count(); 

        return response()->json([
            'total_users' => $totalUsers,
            'total_tanah' => $totalTanah,
            'total_luas' => (float) $totalLuas,
            'total_admin' => $totalAdmin,
        ]);
    }

    /**
     * Mengambil aktivitas terbaru.
     * (FUNGSI INI YANG KITA UBAH)
     */
    public function getRecentActivities()
    {
        // 1. HAPUS KODE LAMA ('$activities = []')
        
        // 2. GANTI DENGAN QUERY ASLI:
        //    'with('user')' -> mengambil relasi user (nama, email, dll)
        //    'latest()' -> mengurutkan dari yang terbaru (created_at DESC)
        //    'take(5)' -> membatasi hanya 5 log teratas
        try {
            $activities = LogAktivitas::with('user') 
                                      ->latest() 
                                      ->take(5) 
                                      ->get();
        } catch (\Exception $e) {
            // Jika terjadi error (misal tabel belum ada), kirim array kosong
            return response()->json([], 500);
        }
                                  
        // 3. Kembalikan data log
        return response()->json($activities);
    }
}