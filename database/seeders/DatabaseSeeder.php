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
        // Panggil RoleSeeder dulu, baru UserSeeder
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
        ]);
    }
}