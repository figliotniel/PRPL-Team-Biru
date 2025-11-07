<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Menangani permintaan login API.
     * POST /api/login
     */
    public function login(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Cari user berdasarkan email
        // Kita pakai with('role') agar data role (misal: "Admin Desa") ikut terkirim
        $user = User::with('role')->where('email', $request->email)->first();

        // 3. Cek User dan Password
        // Cek apakah user-nya ada DAN password-nya cocok
        if (!$user || !Hash::check($request->password, $user->password)) {
            // Jika tidak ada atau password salah, kirim 401
            return response()->json([
                'message' => 'Email atau Password salah'
            ], 401);
        }

        // 4. Buat Token
        // Jika lolos, login berhasil
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. Kembalikan data ke Frontend
        return response()->json([
            'token' => $token,
            'user' => $user // Kita kirim semua data user (termasuk role)
        ], 200);
    }

    /**
     * Menangani permintaan logout API.
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        // Hapus token yang sedang dipakai
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Berhasil logout'], 200);
    }

    /**
     * Mengambil data user yang sedang login.
     * GET /api/user
     */
    public function user(Request $request)
    {
        // Ambil data user yang sedang login (via token)
        // Kita pakai with('role') agar data role selalu update
        $user = User::with('role')->find($request->user()->id);
        
        return response()->json($user);
    }
}