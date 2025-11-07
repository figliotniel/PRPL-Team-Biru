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
        // Tabel Logs
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tanah_id')->nullable()->constrained('tanah_kas_desa');
            $table->foreignId('user_id')->nullable()->constrained('users');
            $table->string('aksi');
            $table->text('deskripsi');
            $table->ipAddress('ip_address')->nullable();
            $table->timestamp('timestamp')->useCurrent();
        });

        // Tabel Pemanfaatan
        Schema::create('pemanfaatan_tanah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tanah_id')->constrained('tanah_kas_desa');
            $table->foreignId('user_id')->constrained('users');
            $table->string('bentuk_pemanfaatan');
            $table->string('pihak_ketiga');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->decimal('nilai_kontribusi', 15, 2);
            $table->string('status_pembayaran');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logs');
        Schema::dropIfExists('pemanfaatan_tanah');
    }
};