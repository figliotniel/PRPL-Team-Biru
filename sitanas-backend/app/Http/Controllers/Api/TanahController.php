<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TanahKasDesa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth; // Tetap gunakan facade Auth
use Illuminate\Validation\ValidationException;
use App\Models\PemanfaatanTanah;

class TanahController extends Controller
{
    /**
     * Menampilkan daftar aset tanah dengan paginasi dan filter.
     * GET /api/tanah
     */
    public function index(Request $request)
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $query = TanahKasDesa::query();

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

        return $tanahList; 
    }
    
    /**
     * Menampilkan data detail aset tunggal.
     * GET /api/tanah/{id}
     */
    public function show($id)
    {
        // Eager Loading: Ambil data aset, dan semua data terkaitnya (relasi) sekaligus
        $tanah = TanahKasDesa::with([
            // Data input dan validasi
            'penginput:id,nama_lengkap', 
            'validator:id,nama_lengkap',
            // Data pemanfaatan
            'pemanfaatan' => function ($query) {
                $query->with('user:id,nama_lengkap'); // Ambil juga user yang input pemanfaatan
            },
            // Data dokumen dan histori
            'dokumenPendukung', 
            'histori', 
        ])
        ->findOrFail($id); 

        return response()->json($tanah);
    }

    /**
     * Menyimpan data aset tanah baru. (Admin Only)
     * POST /api/tanah
     */
    public function store(Request $request)
    {
        // 1. Validasi Data
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
                'batas_utara' => 'nullable|string|max:255',
                'batas_timur' => 'nullable|string|max:255',
                'batas_selatan' => 'nullable|string|max:255',
                'batas_barat' => 'nullable|string|max:255',
                'keterangan' => 'nullable|string',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        // 2. Simpan ke database
        try {
            $tanah = TanahKasDesa::create([
                // Data utama
                'kode_barang' => $validated['kode_barang'],
                'luas' => $validated['luas'],
                'asal_perolehan' => $validated['asal_perolehan'],
                
                // Data form lainnya (diambil dari request jika tidak divalidasi, tapi field sudah dicek)
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
                'diinput_oleh' => Auth::id(), // PERBAIKAN UTAMA: Menggunakan Auth::id()
                'status_validasi' => 'Diproses',
            ]);

            // 3. Log Aktivitas & Notifikasi (Implementasi Log)
            // ...

            return response()->json(['message' => 'Data tanah berhasil ditambahkan dan menunggu validasi.', 'tanah_id' => $tanah->id], 201);
            
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menyimpan data karena kesalahan server.'], 500);
        }
    }
}