<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TanahController;
use App\Http\Controllers\Api\UserController;
use App\Models\Role;
use App\Http\Controllers\Api\MasterDataController;
use App\Http\Controllers\Api\LogController;
use App\Http\Controllers\Api\LaporanController;

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
    Route::get('/tanah/{id}', [TanahController::class, 'show']); // Detail Aset

    // Rute Laporan & Log
    Route::get('/laporan', [LaporanController::class, 'index']); // <-- RUTE BARU
    Route::get('/logs', [LogController::class, 'index']);         // <-- RUTE BARU

    // Rute Master Data
    Route::get('/master-data/roles', function() {
        return Role::all();
    });
    Route::get('/master-data/tanah', [MasterDataController::class, 'tanah']);


    // -------------------------------------------------
    // Rute Khusus Admin (Role ID 1)
    // -------------------------------------------------
    Route::middleware('admin')->group(function () {
        // Manajemen Pengguna
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);    
        Route::put('/users/{id}', [UserController::class, 'update']);  
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        
        // Manajemen Aset (Hanya Admin)
        Route::post('/tanah', [TanahController::class, 'store']);   
        Route::put('/tanah/{id}', [TanahController::class, 'update']);
        Route::delete('/tanah/{id}', [TanahController::class, 'destroy']); 
        
        // Manajemen Pemanfaatan (Hanya Admin)
        Route::post('/tanah/{id}/pemanfaatan', [TanahController::class, 'storePemanfaatan']); 
    });

    // -------------------------------------------------
    // Rute Khusus Kades (Role ID 2)
    // -------------------------------------------------
    Route::middleware('kades')->group(function () {
        // Validasi Aset
        Route::post('/tanah/{id}/validate', [TanahController::class, 'validateTanah']); // <-- RUTE BARU
    });

});