<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TanahController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LogController;
use App\Http\Controllers\Api\PemanfaatanTanahController;
use App\Http\Controllers\Api\DokumenPendukungController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\MasterDataController;
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

    // Rute Dashboard & Statistik (Semua role bisa akses)
    Route::get('/stats', [DashboardController::class, 'stats']);
    Route::get('/recent-activities', [DashboardController::class, 'recentActivities']);
    
    // Rute Master Data (Semua role bisa akses)
    Route::get('/master-data/tanah', [MasterDataController::class, 'tanah']);
    Route::get('/roles', [UserController::class, 'getRoles']);

    // Rute Aset Tanah (GET, GET/{id})
    Route::get('/tanah', [TanahController::class, 'index']); // List
    Route::get('/tanah/{id}', [TanahController::class, 'show']); // Detail
    
    // Admin dan Kades bisa tambah/edit tanah
    Route::middleware(['check.role:1,2'])->group(function () {
        Route::post('/tanah', [TanahController::class, 'store']); // Create
        Route::put('/tanah/{id}', [TanahController::class, 'update']); // Update
    });
    
    // Khusus Kades: Validasi
    Route::middleware(['check.role:2'])->group(function () {
        Route::post('/tanah/{id}/validate', [TanahController::class, 'validate']);
    });
    
    // Hanya Admin bisa hapus, restore, dan kelola user
    Route::middleware('admin')->group(function () {
        // Tanah
        Route::delete('/tanah/{id}', [TanahController::class, 'destroy']); // Soft Delete
        Route::post('/tanah/{id}/restore', [TanahController::class, 'restore']); // Restore <-- TAMBAHAN
        
        // Users
        Route::apiResource('/users', UserController::class); 
        Route::post('/users/{id}/deactivate', [UserController::class, 'deactivate']);
        Route::post('/users/{id}/activate', [UserController::class, 'activate']);
        
        // Logs
        Route::get('/logs', [LogController::class, 'index']);
        
        // Dokumen & Pemanfaatan
        Route::apiResource('/pemanfaatan', PemanfaatanTanahController::class);
        Route::apiResource('/dokumen-pendukung', DokumenPendukungController::class);
        
        // Laporan
        Route::get('/laporan', [LaporanController::class, 'index']);
        Route::post('/reports/generate', [LaporanController::class, 'index']);
    });
});