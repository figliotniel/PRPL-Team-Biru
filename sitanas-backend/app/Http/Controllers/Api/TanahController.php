<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\TanahKasDesa;
use App\Models\PemanfaatanTanah;
use App\Models\Log;
use App\Models\User;

class TanahController extends Controller
{
    /**
     * Helper untuk mencatat log
     */
    private function logActivity($tanah_id, $aksi, $deskripsi)
    {
        Log::create([
            'tanah_id' => $tanah_id,
            'user_id' => Auth::id(),
            'aksi' => $aksi,
            'deskripsi' => $deskripsi,
            'ip_address' => request()->ip(),
        ]);
    }

    /**
     * Menampilkan daftar aset tanah dengan paginasi dan filter.
     * GET /api/tanah
     */
    public function index(Request $request)
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $query = TanahKasDesa::query();

        // Relasi ke penginput
        $query->with('penginput:id,nama_lengkap');

        if ($status) {
            $query->where('status_validasi', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kode_barang', 'like', "%{$search}%")
                  ->orWhere('asal_perolehan', 'like', "%{$search}%")
                  ->orWhere('lokasi', 'like', "%{$search}%")
                  ->orWhere('nomor_sertifikat', 'like', "%{$search}%");
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
        $tanah = TanahKasDesa::with([
            'penginput:id,nama_lengkap',
            'validator:id,nama_lengkap',
            'pemanfaatan', // Menggunakan nama relasi 'pemanfaatan'
            'histori.user:id,nama_lengkap',
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
                'nup' => 'nullable|string|max:50',
            ]);

            // Tambahkan field sistem
            $validated['diinput_oleh'] = Auth::id();
            $validated['status_validasi'] = 'Diproses';

            $tanah = TanahKasDesa::create($validated);

            // Log Aktivitas
            $this->logActivity($tanah->id, 'Tambah', 'Aset baru telah ditambahkan.');

            return response()->json(['message' => 'Data tanah berhasil ditambahkan dan menunggu validasi.', 'tanah_id' => $tanah->id], 201);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Tangkap error lainnya
            return response()->json(['message' => 'Gagal menyimpan data: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Mengupdate data aset tanah. (Admin Only)
     * PUT /api/tanah/{id}
     */
    public function update(Request $request, $id)
    {
        $tanah = TanahKasDesa::findOrFail($id);

        try {
            $validated = $request->validate([
                // Kode barang unik, tapi abaikan ID saat ini
                'kode_barang' => 'required|string|max:100|unique:tanah_kas_desa,kode_barang,' . $id,
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
                'nup' => 'nullable|string|max:50',
            ]);

            $tanah->update($validated);

            // Log Aktivitas
            $this->logActivity($tanah->id, 'Update', 'Data aset telah diperbarui.');

            return response()->json(['message' => 'Data tanah berhasil diperbarui.', 'tanah' => $tanah]);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memperbarui data: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Menghapus (Soft Delete) data aset tanah. (Admin Only)
     * DELETE /api/tanah/{id}
     */
    public function destroy($id)
    {
        $tanah = TanahKasDesa::findOrFail($id);
        
        // Log aktivitas sebelum dihapus
        $this->logActivity($tanah->id, 'Hapus', 'Aset telah dihapus (soft delete).');

        $tanah->delete(); // Soft delete

        return response()->json(['message' => 'Aset berhasil dihapus (nonaktif).']);
    }

    /**
     * Validasi aset oleh Kades. (Kades Only)
     * POST /api/tanah/{id}/validate
     */
    public function validateTanah(Request $request, $id)
    {
        $tanah = TanahKasDesa::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:Disetujui,Ditolak',
            'catatan_validasi' => 'nullable|string',
        ]);

        // Kades (Role 2) tidak boleh memvalidasi asetnya sendiri (jika dia admin)
        if ($tanah->diinput_oleh == Auth::id()) {
        }

        $tanah->status_validasi = $validated['status'];
        $tanah->catatan_validasi = $validated['catatan_validasi'];
        $tanah->validator_id = Auth::id(); // Catat siapa yang validasi
        $tanah->save();

        // Log Aktivitas
        $this->logActivity($tanah->id, 'Validasi', 'Aset telah di-' . $validated['status'] . '.');

        return response()->json(['message' => 'Status aset berhasil diperbarui menjadi ' . $validated['status']]);
    }

    /**
     * Menambah data pemanfaatan aset. (Admin Only)
     * POST /api/tanah/{id}/pemanfaatan
     */
    public function storePemanfaatan(Request $request, $id)
    {
        $tanah = TanahKasDesa::findOrFail($id);

        $validated = $request->validate([
            'bentuk_pemanfaatan' => 'required|string|max:255',
            'pihak_ketiga' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'nilai_kontribusi' => 'required|numeric|min:0',
            'status_pembayaran' => 'required|string|max:100',
        ]);

        // Tambahkan ID tanah dan ID user
        $validated['tanah_id'] = $tanah->id;
        $validated['user_id'] = Auth::id(); // Catat siapa yang input

        $pemanfaatan = PemanfaatanTanah::create($validated);
        // Log Aktivitas
        $this->logActivity($tanah->id, 'Pemanfaatan', 'Riwayat pemanfaatan baru ditambahkan.');

        return response()->json(['message' => 'Data pemanfaatan berhasil ditambahkan.', 'data' => $pemanfaatan], 201);
    }
}