<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user dan generate token Sanctum
     */
    public function login(Request $request)
    {
        try {
            // Validasi input
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            // Cari user berdasarkan email
            $user = User::where('email', $request->email)->first();

            // Cek apakah user ada dan password benar
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'message' => 'Email atau Password salah'
                ], 401);
            }

            // Cek apakah user sudah dinonaktifkan (soft delete)
            if ($user->trashed()) {
                return response()->json([
                    'message' => 'Akun Anda telah dinonaktifkan. Hubungi administrator.'
                ], 403);
            }

            // Hapus token lama (optional - untuk keamanan)
            $user->tokens()->delete();

            // Buat token Sanctum baru
            $token = $user->createToken('auth_token')->plainTextToken;
            
            // Kembalikan response sukses
            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'nama_lengkap' => $user->nama_lengkap,
                    'email' => $user->email,
                    'role_id' => $user->role_id,
                ]
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            // Log error untuk debugging
            Auth::error('Login Error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Terjadi kesalahan di server',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
    
    /**
     * Logout user (hapus token)
     */
    public function logout(Request $request)
    {
        try {
            // Hapus token saat ini
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'message' => 'Berhasil logout'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal logout',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get data user yang sedang login
     */
    public function user(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 401);
            }
            
            return response()->json([
                'id' => $user->id,
                'nama_lengkap' => $user->nama_lengkap,
                'email' => $user->email,
                'role_id' => $user->role_id,
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}