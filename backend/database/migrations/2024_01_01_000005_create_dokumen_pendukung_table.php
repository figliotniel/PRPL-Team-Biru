<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('dokumen_pendukung', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tanah_id')->constrained('tanah_kas_desa')->cascadeOnDelete();
            $table->string('nama_dokumen');
            $table->string('kategori_dokumen', 50)->default('Lain-lain');
            $table->string('path_file');
            $table->integer('file_size')->nullable()->comment('in bytes');
            $table->string('mime_type', 100)->nullable();
            $table->date('tanggal_kadaluarsa')->nullable();
            $table->timestamps();
            $table->index('tanah_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('dokumen_pendukung');
    }
};
