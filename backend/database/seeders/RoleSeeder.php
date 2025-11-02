<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Kosongkan tabel dulu agar bisa dijalankan berulang kali
        Schema::disableForeignKeyConstraints();
        DB::table('roles')->truncate();
        Schema::enableForeignKeyConstraints();

        // 2. Masukkan data role
        DB::table('roles')->insert([
            ['name' => 'Admin', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Kades', 'created_at' => now(), 'updated_at' => now()], // Kepala Desa
            ['name' => 'BPD', 'created_at' => now(), 'updated_at' => now()],   // Badan Permusyawaratan Desa
        ]);
    }
}