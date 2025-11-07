<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// GANTI Model Tanah menjadi TanahKasDesa
use App\Models\TanahKasDesa; 

class LaporanController extends Controller
{
    /**
     * Menangani permintaan GET /api/laporan
     */
    public function index(Request $request)
    {
        // GANTI Model Tanah menjadi TanahKasDesa
        $query = TanahKasDesa::query(); 

        // Filter Tanggal Perolehan
        if ($request->filled('tanggal_mulai')) {
// ... (existing code) ...
            $query->where('tanggal_perolehan', '>=', $request->tanggal_mulai);
        }
        if ($request->filled('tanggal_selesai')) {
// ... (existing code) ...
            $query->where('tanggal_perolehan', '<=', $request->tanggal_selesai);
        }

        // Filter Status Validasi
        if ($request->filled('status_validasi')) {
// ... (existing code) ...
            $query->where('status_validasi', $request->status_validasi);
        }

        // Filter Asal Perolehan
        if ($request->filled('asal_perolehan')) {
// ... (existing code) ...
            $query->where('asal_perolehan', $request->asal_perolehan);
        }

        // Ambil data tanpa paginasi untuk laporan
        $laporan = $query->orderBy('tanggal_perolehan', 'asc')->get();

        return response()->json($laporan);
    }
}