<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tanah_kas_desa', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('kode_barang', 100)->nullable();
            $table->string('nup', 50)->nullable();
            $table->string('asal_perolehan');
            $table->date('tanggal_perolehan')->nullable();
            $table->decimal('harga_perolehan', 15, 2)->default(0);
            $table->string('bukti_perolehan')->nullable();
            $table->string('nomor_sertifikat', 100)->nullable();
            $table->date('tanggal_sertifikat')->nullable();
            $table->string('status_sertifikat', 100)->nullable();
            $table->decimal('luas', 15, 2);
            $table->text('lokasi')->nullable();
            $table->string('penggunaan')->nullable();
            $table->string('koordinat', 100)->nullable()->comment('Format: lat,lng');
            $table->enum('kondisi', ['Baik', 'Kurang Baik', 'Rusak Berat'])->default('Baik');
            $table->string('batas_utara')->nullable();
            $table->string('batas_timur')->nullable();
            $table->string('batas_selatan')->nullable();
            $table->string('batas_barat')->nullable();
            $table->text('keterangan')->nullable();
            $table->enum('status_validasi', ['Diproses', 'Disetujui', 'Ditolak'])->default('Diproses');
            $table->text('catatan_validasi')->nullable();
            $table->foreignId('diinput_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('divalidasi_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->index('status_validasi');
            $table->index('kode_barang');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tanah_kas_desa');
    }
};
