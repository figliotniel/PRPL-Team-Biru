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
        Schema::create('tanah_kas_desa', function (Blueprint $table) {
            $table->id(); // int(11)
            $table->string('kode_barang', 100)->nullable();
            $table->string('nup', 50)->nullable();
            $table->string('asal_perolehan');
            $table->date('tanggal_perolehan')->nullable();
            $table->decimal('harga_perolehan', 15, 2)->default(0.00);
            $table->string('nomor_sertifikat', 100)->nullable();
            $table->string('status_sertifikat', 100)->nullable();
            $table->decimal('luas', 15, 2);
            $table->text('lokasi')->nullable();
            $table->string('penggunaan')->nullable();
            $table->string('koordinat', 100)->nullable();
            $table->enum('kondisi', ['Baik', 'Rusak Ringan', 'Rusak Berat'])->default('Baik');
            $table->string('batas_utara')->nullable();
            $table->string('batas_timur')->nullable();
            $table->string('batas_selatan')->nullable();
            $table->string('batas_barat')->nullable();
            $table->text('keterangan')->nullable();
            $table->enum('status_validasi', ['Diproses', 'Disetujui', 'Ditolak'])->default('Diproses');
            $table->text('catatan_validasi')->nullable();

            // Foreign Keys (Relasi)
            // Ini 'foreignId' untuk 'users.id' yang tipenya bigint unsigned
            $table->foreignId('diinput_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('divalidasi_oleh')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tanah_kas_desa');
    }
};