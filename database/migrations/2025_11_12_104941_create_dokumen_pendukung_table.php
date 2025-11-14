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
    Schema::create('dokumen_pendukung', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('tanah_id');
        $table->string('nama_dokumen');
        $table->string('kategori_dokumen')->nullable(); // Dari upload.php
        $table->date('tanggal_kadaluarsa')->nullable(); // Dari upload.php
        $table->string('path_file');
        $table->timestamps(); // uploaded_at

        $table->foreign('tanah_id')->references('id')->on('tanah_kas_desa')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumen_pendukung');
    }
};
