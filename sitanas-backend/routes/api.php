<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController; 
use App\Http\Controllers\Api\TanahController; 
use App\Http\Controllers\Api\UserController;
use App\Models\Role;
use App\Http\Controllers\Api\MasterDataController;

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
    
    // Rute Manajemen Pengguna (Hanya untuk Admin Role ID 1)
    Route::middleware('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']); 
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        
        // Rute Master Data (Roles) - Gunakan Model Role yang sudah di-import
        Route::get('/master-data/roles', function() {
            return Role::all(); 
        });
    
        // Rute Master Data Tanah
        Route::get('/master-data/tanah', [MasterDataController::class, 'tanah']);

        // Detail Aset (Read)
        Route::get('/tanah/{id}', [TanahController::class, 'show']);

        Route::middleware('admin')->group(function () {
    // ... (rute CRUD lainnya) ...
    Route::put('/tanah/{id}', [TanahController::class, 'update']); // <-- Rute Edit
    });
    });
});