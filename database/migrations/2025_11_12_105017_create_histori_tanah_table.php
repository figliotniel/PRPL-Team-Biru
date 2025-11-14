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
    Schema::create('histori_tanah', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('tanah_id');
        $table->unsignedBigInteger('user_id')->nullable();
        $table->string('aksi', 50);
        $table->text('deskripsi_perubahan')->nullable();
        $table->timestamp('timestamp')->useCurrent();

        $table->foreign('tanah_id')->references('id')->on('tanah_kas_desa')->onDelete('cascade');
        $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('histori_tanah');
    }
};
