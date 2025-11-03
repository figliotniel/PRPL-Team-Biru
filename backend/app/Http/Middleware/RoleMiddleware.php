<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userRole = Auth::user()->role->nama_role ?? null;

        if (!in_array($userRole, $roles)) {
            return response()->json([
                'message' => 'Forbidden. Aksi ini memerlukan role: ' . implode(', ', $roles)
            ], 403);
        }

        return $next($request);
    }
}
