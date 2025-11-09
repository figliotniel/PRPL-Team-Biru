<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TanahKasDesa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str; // WAJIB: Import Str untuk UUID

class TanahController extends Controller
{
    /**
     * Menampilkan daftar aset tanah dengan paginasi dan filter.
     */
    public function index(Request $request)
    {
        $status = $request->query('status');
        $search = $request->query('search');
        $user = Auth::user();

        $query = TanahKasDesa::query();

        // BPD (Role ID 3) hanya bisa lihat yang Disetujui
        if ($user->role_id === 3) {
            $query->where('status_validasi', 'Disetujui');
        } else {
            // Admin & Kades bisa filter
            if ($status) {
                $query->where('status_validasi', $status);
            }
        }

        // Filter pencarian - PERBAIKAN SINTAKSIS DI BLOK INI
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kode_barang', 'like', "%{$search}%") // Hapus '\'
                  ->orWhere('asal_perolehan', 'like', "%{$search}%") // Hapus '\'
                  ->orWhere('lokasi', 'like', "%{$search}%") // Hapus '\'
                  ->orWhere('nomor_sertifikat', 'like', "%{$search}%"); // Hapus '\'
            });
        }
        
        $tanahList = $query->with('penginput:id,nama_lengkap')->orderBy('created_at', 'desc')->paginate(10);

        return $tanahList;
    }

    /**
     * Tambah aset tanah baru (Admin only).
     */
    public function store(Request $request)
    {
        // 1. Validasi Data
        $validated = $request->validate([
            // PERBAIKAN UTAMA: Dibuat nullable dan tidak ada UNIQUE di validasi
            'kode_barang' => 'nullable|string|max:100', 
            'nup' => 'nullable|string|max:50',
            'asal_perolehan' => 'required|string',
            'tanggal_perolehan' => 'nullable|date',
            'harga_perolehan' => 'nullable|numeric|min:0',
            'nomor_sertifikat' => 'nullable|string|max:100',
            'status_sertifikat' => 'nullable|string|max:100',
            'luas' => 'required|numeric|min:0',
            'lokasi' => 'nullable|string',
            'penggunaan' => 'nullable|string',
            'koordinat' => 'nullable|string|max:100',
            'kondisi' => 'nullable|in:Baik,Rusak Ringan,Rusak Berat',
            'batas_utara' => 'nullable|string',
            'batas_timur' => 'nullable|string',
            'batas_selatan' => 'nullable|string',
            'batas_barat' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);
        
        // Ambil data untuk disimpan
        $dataToStore = $validated;
        
        // 2. Logika Pembuatan Kode Barang Unik Otomatis
        // Jika kode_barang kosong di form, kita buat UUID sementara
        // Jika ada isinya, kita biarkan dan asumsikan user sudah memastikan unik
        if (empty($dataToStore['kode_barang'])) {
             // Membuat kode unik menggunakan UUID (Universally Unique Identifier)
             $dataToStore['kode_barang'] = 'TKS-'.Str::uuid()->toString();
        }


        // Tambahkan data non-form
        $dataToStore['harga_perolehan'] = $dataToStore['harga_perolehan'] ?? 0;
        $dataToStore['kondisi'] = $dataToStore['kondisi'] ?? 'Baik';
        $dataToStore['status_validasi'] = 'Diproses';
        $dataToStore['diinput_oleh'] = Auth::id();


        try {
            // 3. Simpan Data
            $tanah = TanahKasDesa::create($dataToStore);

            // 4. Log Aktivitas
            DB::table('log_aktivitas')->insert([
                'user_id' => Auth::id(),
                'aksi' => 'Tambah Aset',
                'deskripsi' => "Menambahkan aset tanah: {$tanah->asal_perolehan} (Kode: {$tanah->kode_barang})",
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'message' => 'Aset tanah berhasil ditambahkan. Kode Barang: ' . $tanah->kode_barang,
                'data' => $tanah
            ], 201);
        } catch (\Exception $e) {
            // Jika ada error lain (misalnya relasi FAILED), kirim error 500
            DB::error('Gagal menyimpan data tanah: ' . $e->getMessage());
            return response()->json(['message' => 'Server error: Gagal menyimpan data.'], 500);
        }
    }

    /**
     * Tampilkan detail aset tanah.
     */
    public function show($id)
    {
        $tanah = TanahKasDesa::with('penginput:id,nama_lengkap')->findOrFail($id);

        // BPD hanya bisa lihat yang Disetujui
        if (Auth::user()->role_id === 3 && $tanah->status_validasi !== 'Disetujui') {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        return response()->json($tanah);
    }

    /**
     * Update aset tanah (Admin only).
     */
    public function update(Request $request, $id)
    {
        $tanah = TanahKasDesa::findOrFail($id);

        $request->validate([
            'kode_barang' => 'nullable|string|max:100',
            'nup' => 'nullable|string|max:50',
            'asal_perolehan' => 'required|string',
            'tanggal_perolehan' => 'nullable|date',
            'harga_perolehan' => 'nullable|numeric|min:0',
            'nomor_sertifikat' => 'nullable|string|max:100',
            'status_sertifikat' => 'nullable|string|max:100',
            'luas' => 'required|numeric|min:0',
            'lokasi' => 'nullable|string',
            'penggunaan' => 'nullable|string',
            'koordinat' => 'nullable|string|max:100',
            'kondisi' => 'nullable|in:Baik,Rusak Ringan,Rusak Berat',
            'batas_utara' => 'nullable|string',
            'batas_timur' => 'nullable|string',
            'batas_selatan' => 'nullable|string',
            'batas_barat' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        $tanah->update($request->all());

        // Log aktivitas
        DB::table('log_aktivitas')->insert([
            'user_id' => Auth::id(),
            'aksi' => 'Edit Aset',
            'deskripsi' => "Mengedit aset tanah: {$tanah->asal_perolehan}",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Aset tanah berhasil diperbarui',
            'data' => $tanah
        ]);
    }

    /**
     * Hapus aset tanah (Admin only).
     */
    public function destroy($id)
    {
        $tanah = TanahKasDesa::findOrFail($id);
        $asal = $tanah->asal_perolehan;

        $tanah->delete();

        // Log aktivitas
        DB::table('log_aktivitas')->insert([
            'user_id' => Auth::id(),
            'aksi' => 'Hapus Aset',
            'deskripsi' => "Menghapus aset tanah: {$asal}",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Aset tanah berhasil dihapus'
        ]);
    }

    /**
     * Setujui aset tanah (Kades only).
     */
    public function approve(Request $request, $id)
    {
        $tanah = TanahKasDesa::findOrFail($id);

        if ($tanah->status_validasi !== 'Diproses') {
            return response()->json(['message' => 'Aset ini sudah divalidasi'], 400);
        }

        $tanah->update([
            'status_validasi' => 'Disetujui',
            'divalidasi_oleh' => Auth::id(),
            'catatan_validasi' => $request->catatan ?? null,
        ]);

        // Log aktivitas
        DB::table('log_aktivitas')->insert([
            'user_id' => Auth::id(),
            'aksi' => 'Setujui Aset',
            'deskripsi' => "Menyetujui aset tanah: {$tanah->asal_perolehan}",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Aset tanah berhasil disetujui',
            'data' => $tanah
        ]);
    }

    /**
     * Tolak aset tanah (Kades only).
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'catatan' => 'required|string',
        ]);

        $tanah = TanahKasDesa::findOrFail($id);

        if ($tanah->status_validasi !== 'Diproses') {
            return response()->json(['message' => 'Aset ini sudah divalidasi'], 400);
        }

        $tanah->update([
            'status_validasi' => 'Ditolak',
            'divalidasi_oleh' => Auth::id(),
            'catatan_validasi' => $request->catatan,
        ]);

        // Log aktivitas
        DB::table('log_aktivitas')->insert([
            'user_id' => Auth::id(),
            'aksi' => 'Tolak Aset',
            'deskripsi' => "Menolak aset tanah: {$tanah->asal_perolehan}",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Aset tanah ditolak',
            'data' => $tanah
        ]);
    }
}