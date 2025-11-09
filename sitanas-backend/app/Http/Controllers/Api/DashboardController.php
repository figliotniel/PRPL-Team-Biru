<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TanahKasDesa; // Asumsi Model ini ada
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Menampilkan statistik ringkasan dashboard.
     * Rute: GET /api/stats (Terlindungi)
     */
    public function stats()
    {
        try {
            // Menghitung statistik
            $totalUsers = User::count();
            // Ambil hanya user yang Aktif (soft delete null)
            $activeUsers = User::whereNull('deleted_at')->count(); 
            
            // Asumsi model TanahKasDesa sudah dibuat dan diimport
            $totalTanah = TanahKasDesa::count();
            // Asumsi ada kolom 'luas_total' di tabel tanah_kas_desa
            $totalLuasHektar = (float)TanahKasDesa::sum('luas_total') / 10000; 

            // Mengembalikan data ringkasan
            return response()->json([
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'total_tanah_kas_desa' => $totalTanah,
                'total_luas_hektar' => number_format($totalLuasHektar, 2, ',', '.') . ' Ha', // Format ke Hektar
            ]);
            
        } catch (\Exception $e) {
            // Tangani error jika Model/tabel belum ada
            return response()->json([
                'message' => 'Gagal memuat statistik. Pastikan semua tabel database sudah dimigrasi dan diisi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}