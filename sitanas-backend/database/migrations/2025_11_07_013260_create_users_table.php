<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash; 
use Illuminate\Support\Facades\DB;   

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap');
            $table->string('email')->unique();
            $table->string('password');
            $table->foreignId('role_id')->constrained('roles'); // Relasi ke tabel roles
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes(); // Untuk fitur Nonaktifkan Akun
        });

        DB::table('users')->insert([
            'nama_lengkap' => 'Admin Utama',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'), // Password default adalah 'password'
            'role_id' => 1, // 1 = Admin Desa (dari migrasi roles)
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};