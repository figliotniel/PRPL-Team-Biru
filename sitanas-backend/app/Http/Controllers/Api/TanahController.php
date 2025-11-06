<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TanahKasDesa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException; // Untuk penanganan error validasi

class TanahController extends Controller
{
    /**
     * Menampilkan daftar aset tanah dengan paginasi dan filter.
     */
    public function index(Request $request)
    {
        $status = $request->query('status');
        $search = $request->query('search');

        // Pastikan Model TanahKasDesa sudah diimpor (sudah diimpor di atas)
        $query = TanahKasDesa::query();

        // Relasi 'penginput' (diaktifkan)
        $query->with('penginput:id,nama_lengkap'); 

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
        
        $tanahList = $query->orderBy('created_at', 'desc')->paginate(10); 

        return $tanahList; // Laravel otomatis format ini menjadi JSON
    }
    
    /**
     * Menyimpan data aset tanah baru. (Admin Only)
     */
    public function store(Request $request)
    {
        // 1. Validasi Data
        // Menambahkan validasi untuk semua field form yang penting
        try {
            $validated = $request->validate([
                'kode_barang' => 'required|string|max:100|unique:tanah_kas_desa,kode_barang',
                'luas' => 'required|numeric|min:0.01',
                'asal_perolehan' => 'required|string|max:255',
                'tanggal_perolehan' => 'nullable|date',
                'harga_perolehan' => 'nullable|numeric|min:0',
                'bukti_perolehan' => 'nullable|string|max:255',
                'nomor_sertifikat' => 'nullable|string|max:100',
                'tanggal_sertifikat' => 'nullable|date',
                'status_sertifikat' => 'nullable|string|max:100',
                'penggunaan' => 'nullable|string|max:255',
                'koordinat' => 'nullable|string|max:100',
                'kondisi' => 'required|in:Baik,Rusak Ringan,Rusak Berat',
                'lokasi' => 'nullable|string',
                // Batas-batas biasanya tidak mandatory
            ]);
        } catch (ValidationException $e) {
            // Mengirim error validasi 422 (Unprocessable Entity)
            return response()->json(['errors' => $e->errors()], 422);
        }

        // 2. Simpan ke database
        try {
            $tanah = TanahKasDesa::create([
                // Data utama
                'kode_barang' => $validated['kode_barang'],
                'luas' => $validated['luas'],
                'asal_perolehan' => $validated['asal_perolehan'],
                
                // Data form lainnya
                'nup' => $request->nup,
                'tanggal_perolehan' => $validated['tanggal_perolehan'],
                'harga_perolehan' => $validated['harga_perolehan'],
                'bukti_perolehan' => $validated['bukti_perolehan'],
                'nomor_sertifikat' => $validated['nomor_sertifikat'],
                'tanggal_sertifikat' => $validated['tanggal_sertifikat'],
                'status_sertifikat' => $validated['status_sertifikat'],
                'penggunaan' => $validated['penggunaan'],
                'koordinat' => $validated['koordinat'],
                'kondisi' => $validated['kondisi'],
                'lokasi' => $validated['lokasi'],
                'batas_utara' => $request->batas_utara,
                'batas_timur' => $request->batas_timur,
                'batas_selatan' => $request->batas_selatan,
                'batas_barat' => $request->batas_barat,
                'keterangan' => $request->keterangan,
                
                // Status Sistem
                'diinput_oleh' => auth::id(),
                'status_validasi' => 'Diproses',
            ]);

            // 3. Log Aktivitas (Opsional: Butuh Model LogAktivitas)
            // Logika Log Aktivitas dan Notifikasi akan diimplementasikan di sini
            
        } catch (\Exception $e) {
            // Jika terjadi kesalahan saat menyimpan (misal: koneksi DB putus)
            return response()->json(['message' => 'Gagal menyimpan data karena kesalahan server.'], 500);
        }

        return response()->json(['message' => 'Data tanah berhasil ditambahkan dan menunggu validasi.', 'tanah_id' => $tanah->id], 201);
    }
}