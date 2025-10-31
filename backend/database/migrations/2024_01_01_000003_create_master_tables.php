<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Master Kodefikasi
        Schema::create('master_kodefikasi', function (Blueprint $table) {
            $table->id();
            $table->string('kode_utama', 50);
            $table->string('nama_utama', 100);
            $table->string('kode_sub', 50)->nullable();
            $table->string('nama_sub', 100)->nullable();
            $table->timestamps();
            $table->index('kode_utama');
        });

        // Master Asal Perolehan
        Schema::create('master_asal_perolehan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_asal', 100);
            $table->timestamp('created_at')->useCurrent();
        });

        // Master Status Sertifikat
        Schema::create('master_status_sertifikat', function (Blueprint $table) {
            $table->id();
            $table->string('nama_status', 100);
            $table->timestamp('created_at')->useCurrent();
        });

        // Master Penggunaan
        Schema::create('master_penggunaan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_penggunaan', 100);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('master_penggunaan');
        Schema::dropIfExists('master_status_sertifikat');
        Schema::dropIfExists('master_asal_perolehan');
        Schema::dropIfExists('master_kodefikasi');
    }
};
