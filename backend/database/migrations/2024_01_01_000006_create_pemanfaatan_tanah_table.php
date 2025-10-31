<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pemanfaatan_tanah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tanah_id')->constrained('tanah_kas_desa')->cascadeOnDelete();
            $table->string('bentuk_pemanfaatan', 100);
            $table->string('pihak_ketiga');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->decimal('nilai_kontribusi', 15, 2)->default(0);
            $table->enum('status_pembayaran', ['Lunas', 'Belum Lunas'])->default('Belum Lunas');
            $table->string('path_bukti')->nullable();
            $table->text('keterangan')->nullable();
            $table->foreignId('diinput_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index('tanah_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pemanfaatan_tanah');
    }
};
