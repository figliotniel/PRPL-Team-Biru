<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// 1. Import Model dan helper
use App\Models\PemanfaatanTanah;
use App\Models\TanahKasDesa; // Untuk cek relasi
use App\Models\LogAktivitas;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class PemanfaatanTanahController extends Controller
{
    /**
     * Menampilkan semua data pemanfaatan.
     * Bisa difilter berdasarkan tanah_id.
     */
    public function index(Request $request)
    {
        // 2. Cek apakah ada query parameter 'tanah_id'
        if ($request->has('tanah_id')) {
            $data = PemanfaatanTanah::where('tanah_id', $request->tanah_id)
                                    ->with('tanahKasDesa') // Ambil relasi nama tanah
                                    ->latest() // Urutkan dari yg terbaru
                                    ->get();
        } else {
            // Jika tidak ada filter, ambil semua
            $data = PemanfaatanTanah::with('tanahKasDesa')
                                    ->latest()
                                    ->get();
        }
        
        return response()->json($data);
    }

    /**
     * Menyimpan data pemanfaatan baru.
     */
    public function store(Request $request)
    {
        // 3. Validasi (sesuai migrasi)
        $validator = Validator::make($request->all(), [
            'tanah_id' => 'required|integer|exists:tanah_kas_desa,id',
            'nama_pemanfaat' => 'required|string|max:255',
            'bentuk_pemanfaatan' => 'required|string|max:100', // misal: Sewa, Pinjam Pakai
            'tanggal_mulai' => 'required|date_format:Y-m-d',
            'tanggal_selesai' => 'nullable|date_format:Y-m-d|after_or_equal:tanggal_mulai',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $pemanfaatan = PemanfaatanTanah::create($validator->validated());

        // 4. Catat Log
        try {
            // Ambil nama tanah untuk log
            $tanah = TanahKasDesa::find($pemanfaatan->tanah_id);
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Mencatat pemanfaatan baru (' . $pemanfaatan->bentuk_pemanfaatan . ') di ' . $tanah->nama_bidang
            ]);
        } catch (\Exception $e) { /* Abaikan jika log gagal */ }

        // Kembalikan data baru lengkap dengan relasinya
        $pemanfaatan->load('tanahKasDesa');
        return response()->json($pemanfaatan, 201);
    }

    /**
     * Menampilkan satu data pemanfaatan.
     */
    public function show(string $id)
    {
        $pemanfaatan = PemanfaatanTanah::with('tanahKasDesa')->find($id);

        if (!$pemanfaatan) {
            return response()->json(['message' => 'Data pemanfaatan tidak ditemukan'], 404);
        }

        return response()->json($pemanfaatan);
    }

    /**
     * Mengupdate data pemanfaatan.
     */
    public function update(Request $request, string $id)
    {
        $pemanfaatan = PemanfaatanTanah::find($id);
        if (!$pemanfaatan) {
            return response()->json(['message' => 'Data pemanfaatan tidak ditemukan'], 404);
        }

        // 5. Validasi update
        $validator = Validator::make($request->all(), [
            'tanah_id' => 'required|integer|exists:tanah_kas_desa,id',
            'nama_pemanfaat' => 'required|string|max:255',
            'bentuk_pemanfaatan' => 'required|string|max:100',
            'tanggal_mulai' => 'required|date_format:Y-m-d',
            'tanggal_selesai' => 'nullable|date_format:Y-m-d|after_or_equal:tanggal_mulai',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $pemanfaatan->update($validator->validated());

        // 6. Catat Log
        try {
            $tanah = TanahKasDesa::find($pemanfaatan->tanah_id);
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Mengupdate data pemanfaatan (' . $pemanfaatan->bentuk_pemanfaatan . ') di ' . $tanah->nama_bidang
            ]);
        } catch (\Exception $e) { /* Abaikan jika log gagal */ }

        $pemanfaatan->load('tanahKasDesa');
        return response()->json($pemanfaatan);
    }

    /**
     * Menghapus data pemanfaatan.
     */
    public function destroy(string $id)
    {
        $pemanfaatan = PemanfaatanTanah::find($id);
        if (!$pemanfaatan) {
            return response()->json(['message' => 'Data pemanfaatan tidak ditemukan'], 404);
        }

        // Simpan info sebelum dihapus
        $infoLog = $pemanfaatan->bentuk_pemanfaatan . ' oleh ' . $pemanfaatan->nama_pemanfaat;

        $pemanfaatan->delete();

        // 7. Catat Log
        try {
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Menghapus data pemanfaatan: ' . $infoLog
            ]);
        } catch (\Exception $e) { /* Abaikan jika log gagal */ }

        return response()->json(null, 204);
    }
}