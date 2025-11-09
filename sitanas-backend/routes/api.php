<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController; 
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

    // Rute Dashboard & Statistik (Semua role bisa akses)
    Route::get('/stats', [DashboardController::class, 'stats']); 
    Route::get('/recent-activities', [DashboardController::class, 'recentActivities']); 
    
    // Rute Aset Tanah
    Route::get('/tanah', [TanahController::class, 'index']); // List
    Route::get('/tanah/{id}', [TanahController::class, 'show']); // Detail
    
    // Admin dan Kades bisa tambah/edit tanah
    Route::middleware(['check.role:1,2'])->group(function () {
        Route::post('/tanah', [TanahController::class, 'store']); // Create
        Route::put('/tanah/{id}', [TanahController::class, 'update']); // Update
    });
    
    // Hanya Admin bisa hapus
    Route::middleware('admin')->group(function () {
        Route::delete('/tanah/{id}', [TanahController::class, 'destroy']); // Delete
    });
    
    // Hanya Kades bisa validasi
    Route::middleware(['check.role:2'])->group(function () {
        Route::post('/tanah/{id}/validate', [TanahController::class, 'validate']); // Validasi
    });
    
    // Rute Manajemen Pengguna (Hanya untuk Admin Role ID 1)
    Route::middleware('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']); 
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::post('/users/{id}/restore', [UserController::class, 'restore']);
        
        // Rute Master Data (Roles)
        Route::get('/master-data/roles', function() {
            return Role::all(); 
        });
        
        // Rute Logs (Admin Only)
        Route::get('/logs', function() {
            // Sementara return empty jika tabel belum ada
            return response()->json([
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'total' => 0,
                'from' => 0,
                'to' => 0
            ]);
        });
    });
});