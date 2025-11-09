<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LogAktivitas;
use App\Models\TanahKasDesa;
use Illuminate\Support\Facades\Validator; // Kita gunakan Validator untuk fleksibilitas
use Illuminate\Support\Facades\Auth; // Untuk log aktivitas (jika perlu)

class TanahController extends Controller
{
    /**
     * Menampilkan daftar semua data tanah.
     * (Dipanggil oleh 'getAllTanah' di frontend)
     */
    public function index()
    {
        // 2. Ambil semua data tanah
        $tanah = TanahKasDesa::all();
        
        return response()->json($tanah);
    }

    /**
     * Menyimpan data tanah baru ke database.
     * (Dipanggil oleh 'createTanah' di frontend)
     */
    public function store(Request $request)
    {
        // 3. Validasi data
        //    (Sesuaikan dengan kolom di migrasi 'create_tanah_kas_desa_table')
        $validator = Validator::make($request->all(), [
            'nama_bidang' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'luas' => 'required|numeric|min:0',
            'status_kepemilikan' => 'required|string|max:100',
            'koordinat_bidang' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422); // 422 = Unprocessable Entity
        }

        // 4. Buat dan simpan data
        $tanah = TanahKasDesa::create($validator->validated());

       try {
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Menambah data tanah baru: ' . $tanah->nama_bidang
            ]);
        } catch (\Exception $e) {
            // Abaikan error jika log gagal
        }
        return response()->json($tanah, 201); // 201 = Created
    }

    /**
     * Menampilkan satu data tanah.
     */
    public function show(string $id)
    {
        $tanah = TanahKasDesa::find($id);

        if (!$tanah) {
            return response()->json(['message' => 'Data tanah tidak ditemukan'], 404);
        }

        return response()->json($tanah);
    }

    /**
     * Mengupdate data tanah di database.
     * (Dipanggil oleh 'updateTanah' di frontend)
     */
    public function update(Request $request, string $id)
    {
        $tanah = TanahKasDesa::find($id);
        if (!$tanah) {
            return response()->json(['message' => 'Data tanah tidak ditemukan'], 404);
        }

        // 6. Validasi untuk update
        $validator = Validator::make($request->all(), [
            'nama_bidang' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'luas' => 'required|numeric|min:0',
            'status_kepemilikan' => 'required|string|max:100',
            'koordinat_bidang' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 7. Update data
        $tanah->update($validator->validated());
        
try {
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Mengupdate data tanah: ' . $tanah->nama_bidang
            ]);
        } catch (\Exception $e) {
            // Abaikan error jika log gagal
        }
        return response()->json($tanah);
    }

    /**
     * Menghapus data tanah dari database.
     * (Dipanggil oleh 'deleteTanah' di frontend)
     */
    public function destroy(string $id)
    {
        $tanah = TanahKasDesa::find($id);
        if (!$tanah) {
            return response()->json(['message' => 'Data tanah tidak ditemukan'], 404);
        }
        $namaBidangDihapus = $tanah->nama_bidang;
        $tanah->delete();

        try {
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Menghapus data tanah: ' . $namaBidangDihapus
            ]);
        } catch (\Exception $e) {
            // Abaikan error jika log gagal
        }
        return response()->json(null, 204);
    }
}