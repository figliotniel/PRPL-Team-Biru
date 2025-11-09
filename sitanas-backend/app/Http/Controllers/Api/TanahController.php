<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LogAktivitas;
use App\Models\TanahKasDesa;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class TanahController extends Controller
{
    /**
     * Menampilkan daftar semua data tanah.
     */
    public function index()
    {
        $tanah = TanahKasDesa::all();
        return response()->json($tanah);
    }

    /**
     * Menyimpan data tanah baru ke database.
     */
    public function store(Request $request)
    {
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

        $tanah = TanahKasDesa::create($validator->validated());

        try {
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Menambah data tanah baru: ' . $tanah->nama_bidang
            ]);
        } catch (\Exception $e) {
            // Abaikan error jika log gagal
        }
        
        return response()->json($tanah, 201);
    }

    /**
     * Menampilkan satu data tanah.
     */
    public function show(string $id)
    {
        $tanah = TanahKasDesa::with(['penginput', 'validator', 'pemanfaatan', 'dokumen', 'histori'])
                             ->find($id);

        if (!$tanah) {
            return response()->json(['message' => 'Data tanah tidak ditemukan'], 404);
        }

        return response()->json($tanah);
    }

    /**
     * Mengupdate data tanah di database.
     */
    public function update(Request $request, string $id)
    {
        $tanah = TanahKasDesa::find($id);
        if (!$tanah) {
            return response()->json(['message' => 'Data tanah tidak ditemukan'], 404);
        }

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

    /**
     * Validasi tanah (Khusus untuk Kepala Desa)
     */
    public function validate(Request $request, string $id)
    {
        // Cek apakah user adalah Kepala Desa (role_id = 2)
        if (Auth::user()->role_id !== 2) {
            return response()->json([
                'message' => 'Akses ditolak. Hanya Kepala Desa yang dapat memvalidasi.'
            ], 403);
        }

        $tanah = TanahKasDesa::find($id);
        if (!$tanah) {
            return response()->json(['message' => 'Data tanah tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status_validasi' => 'required|in:Disetujui,Ditolak',
            'catatan_validasi' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tanah->update([
            'status_validasi' => $request->status_validasi,
            'catatan_validasi' => $request->catatan_validasi,
            'validator_id' => Auth::id()
        ]);

        try {
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => "Memvalidasi tanah '{$tanah->nama_bidang}' dengan status: {$request->status_validasi}"
            ]);
        } catch (\Exception $e) {
            // Abaikan error jika log gagal
        }

        return response()->json([
            'message' => 'Validasi berhasil disimpan',
            'data' => $tanah
        ]);
    }
}