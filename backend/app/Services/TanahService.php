<?php
namespace App\Services;

use App\Models\TanahKasDesa;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class TanahService
{
    protected $logService;
    protected $notificationService;

    public function __construct(
        LogService $logService,
        NotificationService $notificationService
    ) {
        $this->logService = $logService;
        $this->notificationService = $notificationService;
    }

    /**
     * Get filtered data with pagination
     */
    public function getFilteredData($filters)
    {
        $query = TanahKasDesa::with(['penginput:id,nama_lengkap', 'validator:id,nama_lengkap']);

        // Apply role-based filter
        $user = Auth::user();
        if ($user->isBPD()) {
            $query->disetujui();
        }

        // Search filter
        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        // Status filter
        if (!empty($filters['status'])) {
            $query->where('status_validasi', $filters['status']);
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $filters['per_page'] ?? 10;
        return $query->paginate($perPage);
    }

    /**
     * Get single tanah by ID
     */
    public function getTanahById($id)
    {
        return TanahKasDesa::with([
            'penginput',
            'validator',
            'dokumen',
            'pemanfaatan.penginput',
            'histori.user'
        ])->findOrFail($id);
    }

    /**
     * Create new tanah
     */
    public function createTanah(array $data)
    {
        DB::beginTransaction();
        try {
            $data['diinput_oleh'] = Auth::id();
            $data['status_validasi'] = 'Diproses';

            $tanah = TanahKasDesa::create($data);

            // Log activity
            $this->logService->log(
                'TAMBAH',
                "Menambahkan aset tanah baru '{$tanah->kode_barang}' (ID: {$tanah->id})"
            );

            // Create history
            $tanah->histori()->create([
                'user_id' => Auth::id(),
                'aksi' => 'PEMBUATAN',
                'deskripsi_perubahan' => 'Data aset dibuat pertama kali oleh ' . Auth::user()->username,
            ]);

            // Notify Kepala Desa
            $this->notificationService->notifyKepalaDesaNewAsset($tanah);

            DB::commit();
            return $tanah;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update existing tanah
     */
    public function updateTanah($id, array $data)
    {
        DB::beginTransaction();
        try {
            $tanah = TanahKasDesa::findOrFail($id);
            $oldData = $tanah->toArray();

            $tanah->update($data);

            // Detect and log changes
            $changes = $this->detectChanges($oldData, $tanah->fresh()->toArray());
            if (!empty($changes)) {
                $changeDescription = "Mengubah aset ID: {$id}. Perubahan: " . implode('; ', $changes);
                
                $this->logService->log('EDIT', $changeDescription);

                $tanah->histori()->create([
                    'user_id' => Auth::id(),
                    'aksi' => 'EDIT',
                    'deskripsi_perubahan' => $changeDescription,
                    'data_before' => $oldData,
                    'data_after' => $tanah->toArray(),
                ]);
            }

            DB::commit();
            return $tanah->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete tanah (with 3 years validation)
     */
    public function deleteTanah($id)
    {
        DB::beginTransaction();
        try {
            $tanah = TanahKasDesa::findOrFail($id);
            
            // The 3-year check is handled in model boot method
            $kodeBarang = $tanah->kode_barang;
            
            // Create history before deletion
            $tanah->histori()->create([
                'user_id' => Auth::id(),
                'aksi' => 'HAPUS',
                'deskripsi_perubahan' => "Data aset (Kode: '$kodeBarang') dihapus oleh " . Auth::user()->username,
            ]);

            $tanah->delete();

            $this->logService->log('HAPUS', "Menghapus aset ID: {$id} (Kode: {$kodeBarang})");

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Validate tanah (Kepala Desa only)
     */
    public function validateTanah($id, $status, $catatan = null)
    {
        DB::beginTransaction();
        try {
            $tanah = TanahKasDesa::findOrFail($id);

            $tanah->update([
                'status_validasi' => $status,
                'divalidasi_oleh' => Auth::id(),
                'catatan_validasi' => $catatan,
            ]);

            $pesanStatus = $status === 'Disetujui' ? 'disetujui' : 'ditolak';
            
            $this->logService->log(
                'VALIDASI',
                "Melakukan validasi aset ID: {$id} (Kode: {$tanah->kode_barang}) menjadi status '{$status}'"
            );

            // Notify the admin who input the data
            if ($tanah->diinput_oleh) {
                $this->notificationService->notifyValidationResult($tanah, $pesanStatus);
            }

            DB::commit();
            return $tanah->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get statistics
     */
    public function getStatistics()
    {
        return [
            'total_aset' => TanahKasDesa::count(),
            'total_luas' => TanahKasDesa::disetujui()->sum('luas'),
            'aset_diproses' => TanahKasDesa::diproses()->count(),
            'aset_disetujui' => TanahKasDesa::disetujui()->count(),
            'aset_ditolak' => TanahKasDesa::ditolak()->count(),
            'total_nilai' => TanahKasDesa::disetujui()->sum('harga_perolehan'),
        ];
    }

    /**
     * Export to CSV
     */
    public function exportToCsv()
    {
        $tanah = TanahKasDesa::disetujui()->get();

        $filename = 'laporan_tanah_kas_desa_' . now()->format('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($tanah) {
            $file = fopen('php://output', 'w');

            // Header
            fputcsv($file, [
                'Kode Barang', 'NUP', 'Asal Perolehan', 'Tgl Perolehan',
                'Harga Perolehan (Rp)', 'No. Sertifikat', 'Status Sertifikat',
                'Luas (m2)', 'Penggunaan', 'Koordinat', 'Kondisi',
                'Lokasi', 'Status Validasi'
            ]);

            // Data
            foreach ($tanah as $item) {
                fputcsv($file, [
                    $item->kode_barang,
                    $item->nup,
                    $item->asal_perolehan,
                    $item->tanggal_perolehan?->format('Y-m-d'),
                    $item->harga_perolehan,
                    $item->nomor_sertifikat,
                    $item->status_sertifikat,
                    $item->luas,
                    $item->penggunaan,
                    $item->koordinat,
                    $item->kondisi,
                    $item->lokasi,
                    $item->status_validasi,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Detect changes between old and new data
     */
    protected function detectChanges($old, $new)
    {
        $changes = [];
        $fieldsToCheck = [
            'kode_barang', 'luas', 'lokasi', 'koordinat',
            'penggunaan', 'kondisi', 'status_sertifikat'
        ];

        foreach ($fieldsToCheck as $field) {
            if (isset($old[$field]) && isset($new[$field]) && $old[$field] != $new[$field]) {
                $changes[] = ucfirst(str_replace('_', ' ', $field)) . ": '{$old[$field]}' → '{$new[$field]}'";
            }
        }

        return $changes;
    }
}