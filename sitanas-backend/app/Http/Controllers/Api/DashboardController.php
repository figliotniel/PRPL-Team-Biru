<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // WAJIB untuk query statistik

class DashboardController extends Controller
{
    /**
     * Mengambil data statistik dashboard.
     */
    public function stats(Request $request)
    {
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

        // Kembalikan JSON (sesuai yang diharapkan DashboardPage.jsx)
        return response()->json([
            'total_aset' => $total_aset,
            'total_luas' => (float) $total_luas, 
            'aset_diproses' => $aset_diproses,
            'aset_disetujui' => $aset_disetujui,
        ]);
    }
}