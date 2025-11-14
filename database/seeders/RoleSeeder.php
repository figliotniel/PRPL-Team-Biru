<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kita masukkan 3 role dari db_sitanas.sql
        DB::table('roles')->insert([
            ['nama_role' => 'Admin Desa'],
            ['nama_role' => 'Kepala Desa'],
            ['nama_role' => 'BPD (Pengawas)'],
        ]);
    }
}