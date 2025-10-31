<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('histori_tanah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tanah_id')->constrained('tanah_kas_desa')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('aksi', 50);
            $table->text('deskripsi_perubahan')->nullable();
            $table->json('data_before')->nullable();
            $table->json('data_after')->nullable();
            $table->timestamp('timestamp')->useCurrent();
            $table->index('tanah_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('histori_tanah');
    }
};
