<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Hapus tabel 'users' jika sudah ada (untuk jaga-jaga)
        Schema::dropIfExists('users');

        // Buat tabel 'users' baru sesuai skema kita
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // Ini akan jadi bigint(20) unsigned
            $table->string('nama_lengkap');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->integer('role_id'); // Kolom untuk ID role
            $table->rememberToken();
            $table->timestamps(); // Ini akan membuat created_at dan updated_at
            $table->softDeletes(); // Ini akan membuat deleted_at (untuk nonaktifkan)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};