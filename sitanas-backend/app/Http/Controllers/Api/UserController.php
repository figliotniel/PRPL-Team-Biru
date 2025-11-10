<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// 1. Tambahkan import (Use) yang diperlukan
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Models\LogAktivitas; 
use App\Models\User;
use App\Models\Role;

class UserController extends Controller
{
    /**
     * Menampilkan daftar semua pengguna.
     * (Dipanggil oleh 'getAllUsers' di frontend)
     */
    public function index()
    {
        $users = User::with('role')->get();
        return response()->json($users);
    }
    public function getRoles()
    {
        $roles = Role::all();
        return response()->json($roles);
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        $user = User::create([
            'nama_lengkap' => $validatedData['nama_lengkap'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role_id' => $validatedData['role_id'],
            'status' => 'Aktif',
        ]);

        try {
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Membuat pengguna baru: ' . $user->nama_lengkap
            ]);
        } catch (\Exception $e) {
            // Abaikan error jika log gagal (opsional)
        }

        $user->load('role'); 
        return response()->json($user, 201);
    }

    /**
     * Menampilkan satu data pengguna.
     */
    public function show(string $id)
    {
        // Cari user, jika tidak ada, kirim error 404
        $user = User::with('role')->find($id);

        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        return response()->json($user);
    }

    /**
     * Mengupdate data pengguna di database.
     * (Belum kita implementasikan di frontend, tapi kita siapkan)
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        // 6. Validasi untuk update
        $validatedData = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            // Email unik, tapi abaikan email user ini sendiri
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role_id' => 'required|integer|exists:roles,id',
            // Password opsional, hanya di-update jika diisi
            'password' => 'nullable|string|min:8|confirmed'
        ]);

        // 7. Update data user
        $user->nama_lengkap = $validatedData['nama_lengkap'];
        $user->email = $validatedData['email'];
        $user->role_id = $validatedData['role_id'];

        // Hanya update password jika diisi
        if (!empty($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }

        $user->save();
        
        try {
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Mengupdate pengguna: ' . $user->nama_lengkap
            ]);
        } catch (\Exception $e) {
            // Abaikan error jika log gagal
        }
        
        $user->load('role');
        return response()->json($user);
    }

    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        if ($user->id === Auth::id()) {
             return response()->json(['message' => 'Anda tidak bisa menghapus akun Anda sendiri'], 403);
        }

        $namaUserDihapus = $user->nama_lengkap;
        $user->delete();

        try {
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Menghapus pengguna: ' . $namaUserDihapus
            ]);
        } catch (\Exception $e) {
            // Abaikan error jika log gagal
        }

        return response()->json(null, 204);
    }

    public function deactivate(string $id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'User tidak ditemukan'], 404);
    }
    if ($user->id === Auth::id()) {
        return response()->json(['message' => 'Anda tidak bisa menonaktifkan akun Anda sendiri'], 403);
    }

    $user->status = 'Tidak Aktif';
    $user->save();

    try {
        LogAktivitas::create([
            'user_id' => Auth::id(),
            'deskripsi' => 'Menonaktifkan pengguna: ' . $user->nama_lengkap
        ]);
    } catch (\Exception $e) {
    $user->load('role');
    return response()->json($user);
    }
}

    public function activate(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $user->status = 'Aktif';
        $user->save();
        
        try {
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'deskripsi' => 'Mengaktifkan pengguna: ' . $user->nama_lengkap
            ]);
        } catch (\Exception $e) { /* Abaikan error log */ }

        $user->load('role');
        return response()->json($user);
    }
}