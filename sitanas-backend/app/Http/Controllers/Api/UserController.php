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

class UserController extends Controller
{
    /**
     * Menampilkan daftar semua pengguna.
     * (Dipanggil oleh 'getAllUsers' di frontend)
     */
    public function index()
    {
        // 2. Ambil semua user, 'with('role')' penting
        //    agar data role ikut terkirim ke frontend.
        $users = User::with('role')->get();
        
        return response()->json($users);
    }

    /**
     * Menyimpan pengguna baru ke database.
     * (Dipanggil oleh 'createUser' di frontend)
     */
    public function store(Request $request)
    {
        // 3. Validasi data yang dikirim dari AddUserModal
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|integer|exists:roles,id', // Pastikan role_id ada di tabel roles
        ]);

        // 4. Buat user baru
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']), // Wajib HASH password
            'role_id' => $validatedData['role_id'],
        ]);

      try {
            LogAktivitas::create([
                'user_id' => Auth::id(), // ID user yang sedang login
                'deskripsi' => 'Membuat pengguna baru: ' . $user->name
            ]);
        } catch (\Exception $e) {
            // Abaikan error jika log gagal (opsional)
        }
        // --- Akhir Blok Log ---

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
            'name' => 'required|string|max:255',
            // Email unik, tapi abaikan email user ini sendiri
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role_id' => 'required|integer|exists:roles,id',
            // Password opsional, hanya di-update jika diisi
            'password' => 'nullable|string|min:8'
        ]);

        // 7. Update data user
        $user->name = $validatedData['name'];
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
                'deskripsi' => 'Mengupdate pengguna: ' . $user->name
            ]);
        } catch (\Exception $e) {
            // Abaikan error jika log gagal
        }
        // --- Akhir Blok Log ---
        
        $user->load('role');
        return response()->json($user);
    }

    /**
     * Menghapus pengguna dari database.
     * (Dipanggil oleh 'deleteUser' di frontend)
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        // (Opsional: Jangan biarkan user menghapus dirinya sendiri)
        if ($user->id === Auth::id()) {
             return response()->json(['message' => 'Anda tidak bisa menghapus akun Anda sendiri'], 403);
        }
        $namaUserDihapus = $user->name;
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
}