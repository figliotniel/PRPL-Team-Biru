<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth; // Pastikan ini ada
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // INI PERBAIKANNYA:
        // Kita paksa Auth untuk pakai guard 'web' (sesi)
        // bukan guard 'api' (token)
        if (!Auth::guard('web')->attempt($request->only('email', 'password'))) {
            
            return response()->json([
                'message' => 'Email atau Password salah'
            ], 401);
        }

        /** @var \App\Models\User $user */
        
        // Ambil user yang baru saja login via 'web' guard
        $user = Auth::guard('web')->user();

        // Buat token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;
        
        // Kembalikan token & user
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'nama_lengkap' => $user->nama_lengkap,
                'email' => $user->email,
                'role_id' => $user->role_id,
            ]
        ], 200);
    }
    
    // ... (fungsi 'logout' dan 'user' biarkan saja, sudah benar)
    
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Berhasil logout'], 200);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'id' => $user->id,
            'nama_lengkap' => $user->nama_lengkap,
            'email' => $user->email,
            'role_id' => $user->role_id,
        ], 200);
    }
}