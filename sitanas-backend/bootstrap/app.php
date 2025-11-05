<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // 1. INI ADALAH BLOK YANG MENGATUR PENGECUALIAN CSRF
        // Kita secara eksplisit memberitahu Laravel untuk TIDAK memeriksa token CSRF
        // pada semua rute yang dimulai dengan 'api/'.
        $middleware->validateCsrfTokens(except: [
            'api/*', // <-- MENGECUALIKAN SEMUA RUTE DI API.PHP
        ]);
        
        // 2. Aktifkan Sanctum State
        // Ini WAJIB ada dan HANYA ini yang diperlukan untuk sesi API
        $middleware->statefulApi(); 

    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Biarkan ini kosong untuk sekarang
    })->create();