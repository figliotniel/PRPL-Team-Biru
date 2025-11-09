<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * 
     * Middleware ini bisa menerima multiple role IDs
     * Usage: Route::middleware(['check.role:1,2,3'])
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // Convert role IDs ke integer array
        $allowedRoles = array_map('intval', $roles);

        // Cek apakah user punya salah satu dari role yang diizinkan
        if (in_array($request->user()->role_id, $allowedRoles)) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Akses ditolak. Role Anda tidak memiliki izin.'
        ], 403);
    }
}