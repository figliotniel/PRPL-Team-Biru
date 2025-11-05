<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB; // 1. Impor DB facade

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 2. Hapus data lama (jika ada) agar tidak duplikat
        DB::table('roles')->truncate();

        // 3. Masukkan data baru
        DB::table('roles')->insert([
            ['id' => 1, 'nama_role' => 'Admin Desa'],
            ['id' => 2, 'nama_role' => 'Kepala Desa'],
            ['id' => 3, 'nama_role' => 'BPD (Pengawas)'],
        ]);
    }
}