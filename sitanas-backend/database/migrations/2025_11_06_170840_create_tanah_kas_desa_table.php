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

            // Kunci Relasi (Foreign Keys)
            $table->foreignId('diinput_oleh')->constrained('users');
            $table->foreignId('validator_id')->nullable()->constrained('users');
            
            // Data Utama
            $table->string('kode_barang')->unique();
            $table->string('nup')->nullable();
            $table->string('asal_perolehan');
            $table->date('tanggal_perolehan')->nullable();
            $table->decimal('harga_perolehan', 15, 2)->nullable();
            $table->string('bukti_perolehan')->nullable();
            
            // Data Yuridis
            $table->string('status_sertifikat')->nullable();
            $table->string('nomor_sertifikat')->nullable();
            $table->date('tanggal_sertifikat')->nullable();
            
            // Data Fisik
            $table->decimal('luas', 10, 2);
            $table->text('lokasi')->nullable();
            $table->string('penggunaan')->nullable();
            $table->string('kondisi')->default('Baik');
            $table->string('koordinat')->nullable();
            
            // Batas
            $table->string('batas_utara')->nullable();
            $table->string('batas_timur')->nullable();
            $table->string('batas_selatan')->nullable();
            $table->string('batas_barat')->nullable();
            
            // Status & Keterangan
            $table->text('keterangan')->nullable();
            $table->string('status_validasi')->default('Diproses'); 
            $table->text('catatan_validasi')->nullable();
            
            $table->timestamps(); 
            $table->softDeletes();
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