<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// 1. Import Model dan Facade yang diperlukan
use App\Models\DokumenPendukung;
use App\Models\TanahKasDesa;
use App\Models\LogAktivitas;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; // Untuk upload & delete file
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\URL; // Untuk get full URL

class DokumenPendukungController extends Controller
{
    /**
     * Menampilkan daftar dokumen, difilter berdasarkan tanah_id.
     */
    public function index(Request $request)
    {
        // 2. Wajibkan filter 'tanah_id'
        $validator = Validator::make($request->all(), [
            'tanah_id' => 'required|integer|exists:tanah_kas_desa,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'tanah_id wajib ada'], 422);
        }

        $data = DokumenPendukung::where('tanah_id', $request->tanah_id)
                                ->latest()
                                ->get();
        
        return response()->json($data);
    }

    /**
     * Menyimpan dokumen baru (Upload File).
     */
    public function store(Request $request)
    {
        // 3. Validasi (termasuk validasi file)
        $validator = Validator::make($request->all(), [
            'tanah_id' => 'required|integer|exists:tanah_kas_desa,id',
            'nama_dokumen' => 'required|string|max:255',
            'jenis_dokumen' => 'required|string|max:100', // misal: Sertifikat, Peta
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // Wajib file, tipe: pdf/img, max: 5MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        try {
            // 4. Proses Upload File
            // Simpan file di 'storage/app/public/dokumen'
            // 'dokumen' adalah nama foldernya
            $filePath = $request->file('file')->store('dokumen', 'public');
            
            // Dapatkan URL publik ke file (setelah 'php artisan storage:link')
            $fileUrl = Storage::url($filePath);

            // 5. Simpan data ke Database
            $dokumen = DokumenPendukung::create([
                'tanah_id' => $validated['tanah_id'],
                'nama_dokumen' => $validated['nama_dokumen'],
                'jenis_dokumen' => $validated['jenis_dokumen'],
                'file_path' => $filePath, // Simpan path internal
                'url' => $fileUrl,      // Simpan URL publik
            ]);

            // 6. Catat Log
            $tanah = TanahKasDesa::find($validated['tanah_id']);
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Upload dokumen (' . $dokumen->nama_dokumen . ') untuk ' . $tanah->nama_bidang
            ]);

            return response()->json($dokumen, 201);

        } catch (\Exception $e) {
            // Jika upload/simpan gagal
            return response()->json(['message' => 'Upload file gagal.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Menghapus data dokumen DAN file fisiknya.
     */
    public function destroy(string $id)
    {
        $dokumen = DokumenPendukung::find($id);
        if (!$dokumen) {
            return response()->json(['message' => 'Dokumen tidak ditemukan'], 404);
        }

        try {
            // 7. Hapus file fisik dari storage
            // Gunakan 'public' disk dan 'file_path' yang kita simpan
            Storage::disk('public')->delete($dokumen->file_path);

            // Simpan info log sebelum dihapus
            $infoLog = $dokumen->nama_dokumen;

            // 8. Hapus data dari database
            $dokumen->delete();

            // 9. Catat Log
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Menghapus dokumen: ' . $infoLog
            ]);

            return response()->json(null, 204);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menghapus file.', 'error' => $e->getMessage()], 500);
        }
    }
}