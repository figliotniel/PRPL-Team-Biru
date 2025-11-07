<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Tabel Master Asal Perolehan
        Schema::create('master_asal_perolehans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_asal');
        });

        // Tabel Master Status Sertifikat
        Schema::create('master_status_sertifikats', function (Blueprint $table) {
            $table->id();
            $table->string('nama_status');
        });

        // Tabel Master Penggunaan
        Schema::create('master_penggunaans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_penggunaan');
        });

        // Langsung isi data master (Seeding)
        DB::table('master_asal_perolehans')->insert([
            ['nama_asal' => 'Asli Desa'],
            ['nama_asal' => 'Bantuan Kabupaten'],
            ['nama_asal' => 'Bantuan Provinsi'],
            ['nama_asal' => 'Bantuan Pusat'],
            ['nama_asal' => 'Hibah / Sumbangan'],
            ['nama_asal' => 'Lainnya'],
        ]);
        DB::table('master_status_sertifikats')->insert([
            ['nama_status' => 'SHM (Sertifikat Hak Milik)'],
            ['nama_status' => 'HGB (Hak Guna Bangun)'],
            ['nama_status' => 'HGU (Hak Guna Usaha)'],
            ['nama_status' => 'Letter C / Girik'],
            ['nama_status' => 'Dalam Proses'],
        ]);
        DB::table('master_penggunaans')->insert([
            ['nama_penggunaan' => 'Kantor Desa'],
            ['nama_penggunaan' => 'Balai Desa'],
            ['nama_penggunaan' => 'Tanah Sawah Kas Desa'],
            ['nama_penggunaan' => 'Pasar Desa'],
            ['nama_penggunaan' => 'Jalan Desa'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_asal_perolehans');
        Schema::dropIfExists('master_status_sertifikats');
        Schema::dropIfExists('master_penggunaans');
    }
};