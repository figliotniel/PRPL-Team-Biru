<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Log; // <-- Pastikan Anda punya model Log

class LogController extends Controller
{
    /**
     * Menangani permintaan GET /api/logs
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Log::with('user'); // Ambil relasi user

        // Terapkan filter
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('tanggal_mulai')) {
            $query->where('timestamp', '>=', $request->tanggal_mulai);
        }

        if ($request->filled('tanggal_selesai')) {
            // Tambahkan 23:59:59 untuk mencakup seluruh hari
            $query->where('timestamp', '<=', $request->tanggal_selesai . ' 23:59:59');
        }

        // Urutkan dari yang terbaru
        $logs = $query->orderBy('timestamp', 'desc')->paginate(15); // 15 log per halaman

        return response()->json($logs);
    }
}