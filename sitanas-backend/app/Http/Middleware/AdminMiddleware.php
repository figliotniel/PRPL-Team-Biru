<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // PENTING: Cek apakah user sudah login DAN role_id-nya adalah 1 (Admin)
        // Jika tidak ada user (misal token hilang/expired), request->user() akan null.
        if ($request->user() && $request->user()->role_id === 1) {
            return $next($request);
        }

        // Jika tidak terautentikasi atau bukan Admin, tolak akses
        return response()->json([
            'message' => 'Akses ditolak. Anda tidak memiliki izin Administrator.'
        ], 403);
    }
}