<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'nama_lengkap' => 'Admin',
            'email' => 'admin@sitanas.com', // Gunakan email ini untuk login
            'password' => Hash::make('password'), // Password: 'password'
            'role_id' => 1,
        ]);
        
        User::create([
            'nama_lengkap' => 'Kepala Desa Contoh',
            'email' => 'kades@sitanas.com',
            'password' => Hash::make('password'),
            'role_id' => 2, 
        ]);
    }
}