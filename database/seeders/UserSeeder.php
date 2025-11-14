<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Membuat 1 akun Admin
        DB::table('users')->insert([
            'nama_lengkap' => 'Admin Utama',
            'email' => 'admin@sitanas.com',
            'password' => Hash::make('password'), // Password defaultnya "password"
            'role_id' => 1, // ID 1 = Admin Desa
            'status' => 'aktif',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}