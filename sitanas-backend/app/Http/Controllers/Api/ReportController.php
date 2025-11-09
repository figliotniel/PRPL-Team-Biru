<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// 1. Import Model yang kita perlukan
use App\Models\TanahKasDesa;
use App\Models\LogAktivitas;

// 2. Import Validator dan Carbon (untuk helper tanggal)
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Men-generate laporan berdasarkan tipe dan rentang tanggal.
     * (Dipanggil oleh 'generateReport' di frontend)
     */
    public function generate(Request $request)
    {
        // 3. Validasi input dari frontend
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:tanah,logs', // Tipe harus 'tanah' atau 'logs'
            'startDate' => 'required|date_format:Y-m-d',
            'endDate' => 'required|date_format:Y-m-d|after_or_equal:startDate',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Input tidak valid', 'errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();
        $type = $validated['type'];
        
        // 4. Atur rentang tanggal
        // Kita gunakan Carbon untuk memastikan 'endDate' mencakup hingga akhir hari (23:59:59)
        $startDate = Carbon::parse($validated['startDate'])->startOfDay();
        $endDate = Carbon::parse($validated['endDate'])->endOfDay();

        $data = [];

        // 5. Query data berdasarkan tipe laporan
        try {
            if ($type === 'tanah') {
                // Ambil data tanah yang dibuat di antara rentang tanggal
                $data = TanahKasDesa::whereBetween('created_at', [$startDate, $endDate])
                                    ->orderBy('created_at', 'asc') // Urutkan dari terlama
                                    ->get();
            } 
            
            elseif ($type === 'logs') {
                // Ambil data log yang dibuat di antara rentang tanggal
                $data = LogAktivitas::with('user') // Ambil relasi 'user'
                                    ->whereBetween('created_at', [$startDate, $endDate])
                                    ->orderBy('created_at', 'asc') // Urutkan dari terlama
                                    ->get();
            }

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengambil data dari database', 'error' => $e->getMessage()], 500);
        }

        // 6. Kembalikan data laporan dalam format JSON
        return response()->json($data);
    }
}