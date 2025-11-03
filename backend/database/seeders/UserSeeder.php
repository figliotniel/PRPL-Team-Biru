<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Kosongkan tabel users
        Schema::disableForeignKeyConstraints();
        DB::table('users')->truncate();
        Schema::enableForeignKeyConstraints();

        // 2. Masukkan data user
        DB::table('users')->insert([
            // User Admin (role_id = 1)
            [
                'name' => 'Admin User',
                'email' => 'admin@sitanas.com',
                'password' => Hash::make('password'), // Password: "password"
                'role_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            // User Kades (role_id = 2)
            [
                'name' => 'Kades User',
                'email' => 'kades@sitanas.com',
                'password' => Hash::make('password'), // Password: "password"
                'role_id' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            // User BPD (role_id = 3)
            [
                'name' => 'BPD User',
                'email' => 'bpd@sitanas.com',
                'password' => Hash::make('password'), // Password: "password"
                'role_id' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}