<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Panggil RolesTableSeeder DULU
        $this->call(RolesTableSeeder::class);

        // BARU panggil UserSeeder (karena User butuh Role)
        $this->call(UserSeeder::class);
    }
}