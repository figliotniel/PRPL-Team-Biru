<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\PemanfaatanTanahController;
use App\Http\Controllers\Api\DokumenPendukungController;
use App\Http\Controllers\Api\TanahController; 
use App\Http\Controllers\Api\UserController;
use App\Models\Role;

// Rute publik (tanpa login)
Route::post('/login', [AuthController::class, 'login']);

// ------------------------------------------------------------------------
// GRUP RUTE TERLINDUNGI (Semua butuh Token Sanctum)
// ------------------------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {
    
    // Rute Otentikasi (Core)
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rute Dashboard & Aset
    Route::get('/stats', [DashboardController::class, 'stats']); 
    Route::get('/tanah', [TanahController::class, 'index']); 
    
    // START PERBAIKAN: Tambahkan rute POST untuk menyimpan data
    Route::post('/tanah', [TanahController::class, 'store']);
    Route::post('/reports/generate', [ReportController::class, 'generate']);
    Route::apiResource('/pemanfaatan-tanah', PemanfaatanTanahController::class);

    // Rute Manajemen Pengguna (Hanya untuk Admin Role ID 1)
    Route::middleware('admin')->group(function () {
    Route::get('/users', [UserController::class, 'index']); 
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/tanah/{id}', [TanahController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // (GET) Mengambil list dokumen untuk 1 tanah (via ?tanah_id=)
    Route::get('/dokumen-pendukung', [DokumenPendukungController::class, 'index']);
    
    // (POST) Upload dokumen baru
    Route::post('/dokumen-pendukung', [DokumenPendukungController::class, 'store']);
    
    // (DELETE) Hapus dokumen
    Route::delete('/dokumen-pendukung/{id}', [DokumenPendukungController::class, 'destroy']);
        
    // Rute Master Data (Roles)
    Route::get('/master-data/roles', function() {
        return Role::all(); 
        });
    });
});