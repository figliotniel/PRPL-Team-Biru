<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\TanahKasDesaController;
use App\Http\Controllers\API\ValidationController;
use App\Http\Controllers\API\DokumenController;
use App\Http\Controllers\API\PemanfaatanController;
use App\Http\Controllers\API\LogController;
use App\Http\Controllers\API\PublicController;

// ---> Tfunction tambahan<---
Route::get('/', function () {
    return response()->json(['message' => 'API is running']);
});
// ----------------------

// Public routes
Route::get('/public/assets', [PublicController::class, 'assets']);
Route::get('/public/statistics', [PublicController::class, 'statistics']);

// Auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    
    // Profile
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/avatar', [AuthController::class, 'uploadAvatar']);
    
    // Tanah Kas Desa
    Route::apiResource('tanah', TanahKasDesaController::class);
    Route::get('/tanah/{id}/export-detail', [TanahKasDesaController::class, 'exportDetail']);
    
    // Validation (Kepala Desa only)
    Route::middleware('role:Kepala Desa')->group(function () {
        Route::post('/tanah/{id}/validate', [ValidationController::class, 'validate']);
    });
    
    // Dokumen
    Route::post('/tanah/{id}/dokumen', [DokumenController::class, 'upload']);
    Route::get('/tanah/{id}/dokumen', [DokumenController::class, 'index']);
    Route::delete('/dokumen/{id}', [DokumenController::class, 'destroy']);
    
    // Pemanfaatan
    Route::post('/tanah/{id}/pemanfaatan', [PemanfaatanController::class, 'store']);
    Route::get('/tanah/{id}/pemanfaatan', [PemanfaatanController::class, 'index']);
    
    // Log Aktivitas (Admin only)
    Route::middleware('role:Admin Desa')->group(function () {
        Route::get('/logs', [LogController::class, 'index']);
        Route::get('/logs/export', [LogController::class, 'export']);
    });
    
    // Export
    Route::get('/export/csv', [TanahKasDesaController::class, 'export']);
});