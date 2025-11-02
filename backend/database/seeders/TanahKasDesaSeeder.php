<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TanahKasDesa;
use Illuminate\Support\Str;

class TanahKasDesaSeeder extends Seeder
{
    public function run()
    {
        $tanah = [
            [
                'uuid' => Str::uuid(),
                'kode_barang' => '1.3.1.01',
                'nup' => '001',
                'asal_perolehan' => 'Hibah',
                'tanggal_perolehan' => '2020-05-15',
                'harga_perolehan' => 50000000,
                'bukti_perolehan' => 'Akta Hibah No. 123/2020',
                'nomor_sertifikat' => 'SHM No. 456/2020',
                'tanggal_sertifikat' => '2020-06-01',
                'status_sertifikat' => 'Hak Milik',
                'luas' => 2500.00,
                'lokasi' => 'Jl. Raya Desa No. 123, Desa Makmur Jaya',
                'penggunaan' => 'Kantor Desa',
                'koordinat' => '-7.7956,110.3695',
                'kondisi' => 'Baik',
                'batas_utara' => 'Jalan Raya',
                'batas_timur' => 'Rumah Pak RT',
                'batas_selatan' => 'Sawah',
                'batas_barat' => 'Balai Desa',
                'keterangan' => 'Tanah untuk kantor desa',
                'status_validasi' => 'Disetujui',
                'catatan_validasi' => 'Data lengkap dan valid',
                'diinput_oleh' => 1,
                'divalidasi_oleh' => 2,
            ],
            [
                'uuid' => Str::uuid(),
                'kode_barang' => '1.3.1.03',
                'nup' => '002',
                'asal_perolehan' => 'Pembelian',
                'tanggal_perolehan' => '2021-03-10',
                'harga_perolehan' => 75000000,
                'bukti_perolehan' => 'Akta Jual Beli No. 789/2021',
                'nomor_sertifikat' => 'SHM No. 321/2021',
                'tanggal_sertifikat' => '2021-04-15',
                'status_sertifikat' => 'Hak Milik',
                'luas' => 5000.00,
                'lokasi' => 'Blok Sawah Dusun Selatan',
                'penggunaan' => 'Sawah',
                'koordinat' => '-7.8010,110.3720',
                'kondisi' => 'Baik',
                'batas_utara' => 'Sawah milik warga',
                'batas_timur' => 'Irigasi',
                'batas_selatan' => 'Jalan setapak',
                'batas_barat' => 'Sawah milik warga',
                'keterangan' => 'Tanah produktif untuk kas desa',
                'status_validasi' => 'Disetujui',
                'catatan_validasi' => 'Disetujui untuk produktivitas desa',
                'diinput_oleh' => 1,
                'divalidasi_oleh' => 2,
            ],
            [
                'uuid' => Str::uuid(),
                'kode_barang' => '1.3.1.04',
                'nup' => '003',
                'asal_perolehan' => 'Sumbangan',
                'tanggal_perolehan' => '2023-01-20',
                'harga_perolehan' => 0,
                'bukti_perolehan' => 'Surat Hibah Warga',
                'nomor_sertifikat' => null,
                'tanggal_sertifikat' => null,
                'status_sertifikat' => 'Belum Bersertifikat',
                'luas' => 1500.00,
                'lokasi' => 'Dusun Utara RT 02',
                'penggunaan' => 'Lapangan Olahraga',
                'koordinat' => '-7.7890,110.3650',
                'kondisi' => 'Kurang Baik',
                'batas_utara' => 'Rumah warga',
                'batas_timur' => 'Kebun',
                'batas_selatan' => 'Jalan desa',
                'batas_barat' => 'Rumah warga',
                'keterangan' => 'Perlu perbaikan untuk lapangan',
                'status_validasi' => 'Diproses',
                'catatan_validasi' => null,
                'diinput_oleh' => 1,
                'divalidasi_oleh' => null,
            ],
        ];

        foreach ($tanah as $item) {
            TanahKasDesa::create($item);
        }
    }
}