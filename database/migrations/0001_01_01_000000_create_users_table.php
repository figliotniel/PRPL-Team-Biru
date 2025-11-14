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
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('nama_lengkap');
        $table->string('email')->unique();
        $table->string('password');
        $table->unsignedBigInteger('role_id');
        $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
        $table->string('foto_profil')->nullable();
        $table->rememberToken();
        $table->timestamps();
        $table->foreign('role_id')->references('id')->on('roles');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
