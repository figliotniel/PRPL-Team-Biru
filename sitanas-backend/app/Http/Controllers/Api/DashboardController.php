<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TanahKasDesa; // <-- TAMBAHKAN IMPORT INI
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Mengambil data statistik untuk kartu dashboard.
     */
    public function stats(Request $request)
    {
        // Logika yang
        $totalAset = TanahKasDesa::count();
        $totalLuas = TanahKasDesa::sum('luas');
        $asetDisetujui = TanahKasDesa::where('status_validasi', 'Disetujui')->count();
        $asetDiproses = TanahKasDesa::where('status_validasi', 'Diproses')->count();

        // Kembalikan data dalam format JSON
        return response()->json([
            'totalAset' => $totalAset,
            'totalLuas' => $totalLuas,
            'asetDisetujui' => $asetDisetujui,
            'asetDiproses' => $asetDiproses,
        ]);
    }
}