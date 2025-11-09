<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User; // <-- TAMBAHKAN IMPORT INI
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // <-- TAMBAHKAN IMPORT INI
use Illuminate\Support\Facades\Validator; // <-- TAMBAHKAN IMPORT INI

class UserController extends Controller
{
    /**
     * Menampilkan daftar pengguna (sudah benar)
     */
    public function index()
    {
        // Eager load relasi 'role'
        $users = User::with('role:id,nama_role')->get();
        return $users;
    }

    /**
     * Menyimpan pengguna baru (Ini perbaikannya)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'nama_lengkap' => $request->nama_lengkap,
            'email' => $request->email,
            'password' => Hash::make($request->password), // WAJIB: Hash password
            'role_id' => $request->role_id,
        ]);

        // Kembalikan user baru (tanpa relasi, atau dengan relasi)
        $user->load('role:id,nama_role'); 
        
        return response()->json($user, 201); // 201 = Created
    }


    /**
     * Menghapus pengguna (Ini perbaikannya)
     */
    public function destroy(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        // Jangan biarkan user menghapus dirinya sendiri
        if ($request->user()->id == $id) {
             return response()->json(['message' => 'Anda tidak bisa menghapus akun Anda sendiri'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus'], 200);
    }
}