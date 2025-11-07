<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
// use App\Models\MasterKodefikasi; // Tidak terpakai
use App\Models\MasterAsalPerolehan;
use App\Models\MasterStatusSertifikat;
use App\Models\MasterPenggunaan;

class MasterDataController extends Controller
{
    public function tanah(Request $request)
    {
        // Simulasikan Kodefikasi (Asumsi data kompleks untuk dropdown berantai)
        $kodefikasi = [
            '01.01.01' => [
                'nama_utama' => 'Tanah Sawah',
                'sub_kategori' => [
                    ['kode_sub' => '001', 'nama_sub' => 'Tanah Sawah Kas Desa'],
                    ['kode_sub' => '002', 'nama_sub' => 'Tanah Sawah Adat'],
                ]
            ],
            '01.01.02' => [
                'nama_utama' => 'Tanah Bangunan',
                'sub_kategori' => [
                    ['kode_sub' => '001', 'nama_sub' => 'Kantor Desa'],
                    ['kode_sub' => '002', 'nama_sub' => 'Balai Desa'],
                ]
            ]
        ];

        // --- PERBAIKAN DI BAWAH INI ---
        // Ambil SEMUA data (ID dan Nama), bukan hanya 'select(nama_...)'
        $asal = MasterAsalPerolehan::all();
        $statusSertifikat = MasterStatusSertifikat::all();
        $penggunaan = MasterPenggunaan::all();
        // --- BATAS PERBAIKAN ---

        // Format master kodefikasi untuk form (hanya kode utama)
        $master_kode_utama = collect($kodefikasi)->map(function ($item, $key) {
            return ['kode_utama' => $key, 'nama_utama' => $item['nama_utama']];
        })->values();

        // Format sub-kodefikasi untuk JS (untuk logic kode barang)
        $kodefikasi_js = collect($kodefikasi)->map(function ($item) {
            return collect($item['sub_kategori'])->mapWithKeys(function ($sub) {
                return [$sub['kode_sub'] => $sub['nama_sub']];
            })->toArray();
        })->toArray();


        return response()->json([
            'master_kode_utama' => $master_kode_utama,
            'kodefikasi' => $kodefikasi_js,
            
            // --- PERBAIKAN DI BAWAH INI ---
            // Kirim array objek lengkap
            'asal' => $asal,
            'statusSertifikat' => $statusSertifikat,
            'penggunaan' => $penggunaan
            // --- BATAS PERBAIKAN ---
        ]);
    }
}