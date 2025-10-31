<?php
namespace App\Services;

use App\Models\DokumenPendukung;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class DokumenService
{
    protected $logService;

    public function __construct(LogService $logService)
    {
        $this->logService = $logService;
    }

    /**
     * Upload dokumen
     */
    public function uploadDokumen($tanahId, UploadedFile $file, array $data)
    {
        // Validate file
        $allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        $maxSize = 5 * 1024 * 1024; // 5MB

        if (!in_array($file->getMimeType(), $allowedTypes)) {
            throw new \Exception('Tipe file tidak diizinkan. Hanya PDF, JPG, PNG, DOCX yang diperbolehkan.');
        }

        if ($file->getSize() > $maxSize) {
            throw new \Exception('Ukuran file maksimal 5MB.');
        }

        // Store file
        $path = $file->store('uploads/dokumen', 'public');

        // Create record
        $dokumen = DokumenPendukung::create([
            'tanah_id' => $tanahId,
            'nama_dokumen' => $data['nama_dokumen'],
            'kategori_dokumen' => $data['kategori_dokumen'] ?? 'Lain-lain',
            'tanggal_kadaluarsa' => $data['tanggal_kadaluarsa'] ?? null,
            'path_file' => $path,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);

        $this->logService->log(
            'UPLOAD',
            "Mengunggah dokumen '{$data['nama_dokumen']}' untuk aset ID: {$tanahId}"
        );

        return $dokumen;
    }

    /**
     * Delete dokumen
     */
    public function deleteDokumen($id)
    {
        $dokumen = DokumenPendukung::findOrFail($id);

        // Delete file from storage
        if (Storage::disk('public')->exists($dokumen->path_file)) {
            Storage::disk('public')->delete($dokumen->path_file);
        }

        $dokumen->delete();

        $this->logService->log(
            'HAPUS_DOKUMEN',
            "Menghapus dokumen '{$dokumen->nama_dokumen}' dari aset ID: {$dokumen->tanah_id}"
        );

        return true;
    }
}
