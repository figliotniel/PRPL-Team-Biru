<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan tabelnya kosong sebelum diisi (Opsional, tapi aman)
        // DB::table('roles')->truncate(); 
        
        DB::table('roles')->insert([
            ['id' => 1, 'nama_role' => 'Administrator Desa'],
            ['id' => 2, 'nama_role' => 'Kepala Desa'],
            ['id' => 3, 'nama_role' => 'BPD (Pengawas)'],
        ]);
    }
}