<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('log_aktivitas')) {
            Schema::create('log_aktivitas', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
                $table->string('aksi')->nullable();
                $table->text('deskripsi');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('log_aktivitas');
    }
};