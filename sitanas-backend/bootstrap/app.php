<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\AdminMiddleware; // <-- WAJIB: Import class middleware Anda

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // 1. INI ADALAH BLOK YANG MENGATUR PENGECUALIAN CSRF
        $middleware->validateCsrfTokens(except: [
            'api/*', // MENGECUALIKAN SEMUA RUTE DI API.PHP
        ]);
        
        // 2. Aktifkan Sanctum State
        $middleware->statefulApi(); 
        
        // 3. REGISTRASI ALIAS MIDDLEWARE UNTUK ROUTE GROUPING
        $middleware->alias([
            'admin' => AdminMiddleware::class, // <-- BARIS BARU: Daftarkan 'admin' alias
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Biarkan ini kosong untuk sekarang
    })->create();