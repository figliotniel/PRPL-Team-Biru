<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LogAktivitas;
use App\Models\TanahKasDesa;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\DokumenPendukung;

class TanahController extends Controller
{
    /**
     * Menampilkan daftar semua data tanah dengan filter dan pagination
     */
    public function index(Request $request)
    {
        try {
            $query = TanahKasDesa::query();

            $user = Auth::user();
            $isAdmin = $user->role_id === 1;

            if ($isAdmin) {
                // Filter Arsip untuk Admin
                if ($request->has('with_archived') && $request->with_archived === 'true') {
                    $query->withTrashed();
                } else if ($request->has('archived_only') && $request->archived_only === 'true') {
                    $query->onlyTrashed();
                } else {
                    $query->withoutTrashed(); 
                }
            } else {
                $query->withoutTrashed(); // Non-Admin hanya lihat yang aktif
            }
            
            $query->with(['penginput', 'validator']);
            
            // Filter berdasarkan status validasi
            if ($request->filled('status')) {
                $query->where('status_validasi', $request->status);
            }
            
            // Search (Maksimal)
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('kode_barang', 'like', "%{$search}%")
                      ->orWhere('asal_perolehan', 'like', "%{$search}%")
                      ->orWhere('nomor_sertifikat', 'like', "%{$search}%")
                      ->orWhere('lokasi', 'like', "%{$search}%")
                      ->orWhere('penggunaan', 'like', "%{$search}%") // Tambahan Penggunaan
                      ->orWhere('status_validasi', 'like', "%{$search}%"); 
                });
            }
            
            // Pagination
            if ($request->has('page')) {
                $tanah = $query->orderBy('created_at', 'desc')->paginate(10);
            } else {
                $tanah = $query->orderBy('created_at', 'desc')->get();
            }
            
            return response()->json($tanah);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memuat data tanah',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan satu data tanah dengan semua relasi (View Detail).
     */
    public function show(string $id)
    {
        try {
            // Gunakan withTrashed() agar data yang diarsip tetap bisa dilihat
            $tanah = TanahKasDesa::withTrashed()->with([
                'penginput', 
                'validator', 
                'pemanfaatan', 
                'dokumen', 
                'histori'
            ])->find($id);

            if (!$tanah) {
                return response()->json(['message' => 'Data tanah tidak ditemukan'], 404);
            }

            return response()->json($tanah);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memuat detail tanah',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mengupdate data tanah di database (Edit).
     */
    public function update(Request $request, string $id)
    {
        $tanah = TanahKasDesa::find($id);
        if (!$tanah) {
            return response()->json(['message' => 'Data tanah tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'kode_barang' => 'nullable|string|max:255|unique:tanah_kas_desa,kode_barang,' . $id,
            'nup' => 'nullable|string|max:255',
            'asal_perolehan' => 'required|string|max:255',
            'tanggal_perolehan' => 'nullable|date',
            'harga_perolehan' => 'nullable|numeric|min:0',
            'bukti_perolehan' => 'nullable|string|max:255',
            'status_sertifikat' => 'nullable|string|max:255',
            'nomor_sertifikat' => 'nullable|string|max:255',
            'luas' => 'required|numeric|min:0',
            'lokasi' => 'nullable|string',
            'penggunaan' => 'nullable|string|max:255',
            'kondisi' => 'nullable|string|max:100',
            'koordinat' => 'nullable|string|max:255',
            'batas_utara' => 'nullable|string|max:255',
            'batas_timur' => 'nullable|string|max:255',
            'batas_selatan' => 'nullable|string|max:255',
            'batas_barat' => 'nullable|string|max:255',
            'keterangan' => 'nullable|string',
            'status_validasi' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        try {
            $tanah->update($validator->validated());
            
            // Catat Log
            try {
                LogAktivitas::create([
                    'user_id' => Auth::id(),
                    'aksi' => 'Edit Data',
                    'deskripsi' => 'Mengupdate data tanah: ' . ($tanah->kode_barang ?? 'Tanpa Kode')
                ]);
            } catch (\Exception $e) { /* Abaikan error */ }
            
            $tanah->load(['penginput', 'validator']);
            return response()->json($tanah);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengupdate data tanah',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menghapus data tanah dari database (Soft Delete/Arsip).
     */
    public function destroy(string $id)
    {
        try {
            $tanah = TanahKasDesa::find($id); 
            if (!$tanah) {
                $tanah = TanahKasDesa::withTrashed()->find($id);
                if (!$tanah) {
                    return response()->json(['message' => 'Data tanah tidak ditemukan'], 404);
                }
            }
            
            $kodeBarang = $tanah->kode_barang ?? 'Tanpa Kode';
            $tanah->delete(); // Soft Delete

            // Catat Log
            try {
                LogAktivitas::create([
                    'user_id' => Auth::id(),
                    'aksi' => 'Soft Delete Data', 
                    'deskripsi' => 'Mengarsip data tanah: ' . $kodeBarang
                ]);
            } catch (\Exception $e) { /* Abaikan error */ }
            
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengarsip data tanah',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mengembalikan data tanah dari arsip (Restore).
     */
    public function restore(string $id)
    {
        try {
            $tanah = TanahKasDesa::onlyTrashed()->find($id); 
            if (!$tanah) {
                return response()->json(['message' => 'Data tanah tidak ditemukan di arsip'], 404);
            }
            
            $tanah->restore();

            // Catat Log
            try {
                LogAktivitas::create([
                    'user_id' => Auth::id(),
                    'aksi' => 'Restore Data',
                    'deskripsi' => 'Mengembalikan data tanah dari arsip: ' . ($tanah->kode_barang ?? 'Tanpa Kode')
                ]);
            } catch (\Exception $e) { /* Abaikan error */ }
            
            return response()->json($tanah->load(['penginput', 'validator']), 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengembalikan data tanah dari arsip',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ... (fungsi store dan validate tidak diubah)
    public function store(Request $request) { /* ... */ }
    public function validate(Request $request, string $id) { /* ... */ }
}