<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth; // <-- TAMBAHKAN INI

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Perbaikan: Ganti auth()->check() menjadi Auth::check() untuk lebih eksplisit
        if (Auth::check() && Auth::user()->role_id === 1) {
            return $next($request);
        }
        
        // Jika tidak, tolak dengan response 403 (Forbidden)
        return response()->json(['message' => 'Akses ditolak. Hanya untuk Admin.'], 403);
    }
}