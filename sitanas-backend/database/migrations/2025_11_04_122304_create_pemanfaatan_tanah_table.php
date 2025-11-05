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
        Schema::create('pemanfaatan_tanah', function (Blueprint $table) {
            $table->id(); // int(11)
            $table->foreignId('tanah_id')->constrained('tanah_kas_desa')->onDelete('cascade');
            $table->string('bentuk_pemanfaatan', 100);
            $table->string('pihak_ketiga');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->decimal('nilai_kontribusi', 15, 2)->default(0.00);
            $table->enum('status_pembayaran', ['Lunas', 'Belum Lunas'])->default('Belum Lunas');
            $table->string('path_bukti')->nullable();
            $table->text('keterangan')->nullable();
            $table->foreignId('diinput_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemanfaatan_tanah');
    }
};


