<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterDataSeeder extends Seeder
{
    public function run()
    {
        // Master Kodefikasi
        $kodefikasi = [
            ['kode_utama' => '1.3.1', 'nama_utama' => 'Tanah', 'kode_sub' => '01', 'nama_sub' => 'Tanah Kas Desa'],
            ['kode_utama' => '1.3.1', 'nama_utama' => 'Tanah', 'kode_sub' => '02', 'nama_sub' => 'Tanah Bengkok'],
            ['kode_utama' => '1.3.1', 'nama_utama' => 'Tanah', 'kode_sub' => '03', 'nama_sub' => 'Tanah Sawah'],
            ['kode_utama' => '1.3.1', 'nama_utama' => 'Tanah', 'kode_sub' => '04', 'nama_sub' => 'Tanah Kering/Darat'],
            ['kode_utama' => '1.3.1', 'nama_utama' => 'Tanah', 'kode_sub' => '05', 'nama_sub' => 'Tanah Perumahan'],
        ];
        DB::table('master_kodefikasi')->insert($kodefikasi);

        // Master Asal Perolehan
        $asalPerolehan = [
            ['nama_asal' => 'Hibah'],
            ['nama_asal' => 'Pembelian'],
            ['nama_asal' => 'Tukar Menukar'],
            ['nama_asal' => 'Sumbangan'],
            ['nama_asal' => 'Pemberian'],
            ['nama_asal' => 'Warisan'],
            ['nama_asal' => 'Lain-lain'],
        ];
        DB::table('master_asal_perolehan')->insert($asalPerolehan);

        // Master Status Sertifikat
        $statusSertifikat = [
            ['nama_status' => 'Hak Milik'],
            ['nama_status' => 'Hak Guna Bangunan'],
            ['nama_status' => 'Hak Pakai'],
            ['nama_status' => 'Hak Pengelolaan'],
            ['nama_status' => 'Belum Bersertifikat'],
            ['nama_status' => 'Girik'],
            ['nama_status' => 'Petok D'],
        ];
        DB::table('master_status_sertifikat')->insert($statusSertifikat);

        // Master Penggunaan
        $penggunaan = [
            ['nama_penggunaan' => 'Kantor Desa'],
            ['nama_penggunaan' => 'Balai Desa'],
            ['nama_penggunaan' => 'Sawah'],
            ['nama_penggunaan' => 'Kebun'],
            ['nama_penggunaan' => 'Lapangan Olahraga'],
            ['nama_penggunaan' => 'Pemakaman Umum'],
            ['nama_penggunaan' => 'Jalan Desa'],
            ['nama_penggunaan' => 'Pasar Desa'],
            ['nama_penggunaan' => 'Posyandu'],
            ['nama_penggunaan' => 'PAUD'],
            ['nama_penggunaan' => 'Tidak Digunakan'],
            ['nama_penggunaan' => 'Disewakan'],
            ['nama_penggunaan' => 'Lain-lain'],
        ];
        DB::table('master_penggunaan')->insert($penggunaan);
    }
}