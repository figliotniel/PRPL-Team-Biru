<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash; // Kita tetap butuh ini untuk Tinker, tapi tidak di sini

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus data user lama (jika ada)
        User::truncate();

        // Buat user Admin baru
        User::create([
            'nama_lengkap' => 'Admin Utama',
            'email' => 'admin@gmail.com',
            
            // INI PERBAIKANNYA:
            // Jangan di-hash manual. Biarkan 'hashed' cast di Model User
            // yang mengurusnya.
            'password' => 'password', // <-- BERIKAN PLAINTEXT "password"
            
            'role_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        // (User admin@coba.com yang tadi kita buat di Tinker tidak usah dimasukkan ke seeder)
    }
}