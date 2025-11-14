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
            $table->id();
            $table->string('kode_barang')->nullable();
            $table->string('nup')->nullable();
            $table->string('asal_perolehan'); // Dulu NOT NULL, kita pertahankan
            $table->date('tanggal_perolehan')->nullable();
            $table->decimal('harga_perolehan', 15, 2)->nullable()->default(0);
            $table->string('bukti_perolehan')->nullable(); // Ditambah dari edit.php
            $table->string('nomor_sertifikat')->nullable();
            $table->date('tanggal_sertifikat')->nullable(); // Ditambah dari edit.php
            $table->string('status_sertifikat')->nullable();
            $table->decimal('luas', 15, 2); // Dulu NOT NULL, kita pertahankan
            $table->text('lokasi')->nullable();
            $table->string('penggunaan')->nullable();
            $table->string('koordinat')->nullable();
            // Mengikuti form di tambah.php
            $table->enum('kondisi', ['Baik', 'Kurang Baik', 'Rusak Berat'])->default('Baik');
            $table->string('batas_utara')->nullable();
            $table->string('batas_timur')->nullable();
            $table->string('batas_selatan')->nullable();
            $table->string('batas_barat')->nullable();
            $table->text('keterangan')->nullable();
            $table->enum('status_validasi', ['Diproses', 'Disetujui', 'Ditolak'])->default('Diproses');
            $table->text('catatan_validasi')->nullable();

            $table->unsignedBigInteger('diinput_oleh')->nullable();
            $table->unsignedBigInteger('divalidasi_oleh')->nullable();

            $table->timestamps(); // created_at dan updated_at
            $table->softDeletes(); // <-- INI FITUR ARSIP BARU KITA (menambah kolom deleted_at)

            // Membuat relasi (foreign key) ke tabel users
            $table->foreign('diinput_oleh')->references('id')->on('users')->onDelete('set null');
            $table->foreign('divalidasi_oleh')->references('id')->on('users')->onDelete('set null');
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