<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TanahKasDesa; // WAJIB: Model untuk query
use App\Models\User; // WAJIB: Untuk relasi penginput
use Illuminate\Http\Request;

class TanahController extends Controller
{
    /**
     * Menampilkan daftar aset tanah dengan paginasi dan filter.
     */
    public function index(Request $request)
    {
        // Ambil parameter dari query string (dari React)
        $status = $request->query('status');
        $search = $request->query('search');

        $query = TanahKasDesa::query();

        // Relasi 'penginput' (jika sudah didefinisikan di Model)
        // $query->with('penginput:id,nama_lengkap'); 

        // Terapkan filter status
        if ($status) {
            $query->where('status_validasi', $status);
        }

        // Terapkan filter pencarian
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kode_barang', 'like', "%{$search}%")
                  ->orWhere('asal_perolehan', 'like', "%{$search}%")
                  ->orWhere('lokasi', 'like', "%{$search}%");
            });
        }
        
        // Paginasi: Mengembalikan data dan metadata paginasi
        $tanahList = $query->orderBy('created_at', 'desc')->paginate(10); 

        return $tanahList; // Laravel otomatis format ini menjadi JSON
    }
}