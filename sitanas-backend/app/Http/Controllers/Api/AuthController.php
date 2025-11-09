<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// 1. Tambahkan import (Use) yang diperlukan
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle user login.
     */
    public function login(Request $request)
    {
        // 2. Validasi input dari frontend
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 3. Coba cari user berdasarkan email
        $user = User::where('email', $request->email)->first();

        // 4. Cek user dan password
        //    Gunakan Hash::check untuk membandingkan password
        if (! $user || ! Hash::check($request->password, $user->password)) {
            // Jika gagal, kirim error 401 (Unauthorized)
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        // 5. Jika berhasil, buat token API (Sanctum)
        $token = $user->createToken('auth_token')->plainTextToken;

        // 6. Kembalikan respon sesuai format yang diharapkan frontend
        //    (user dan token)
        return response()->json([
            'message' => 'Login berhasil',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                // Kita juga bisa tambahkan role jika perlu
                // 'role' => $user->role->name 
            ],
            'token' => $token,
        ], 200);
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request)
    {
        // Hapus token yang sedang digunakan untuk otentikasi
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ], 200);
    }
}