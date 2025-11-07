<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule; // <-- Tambahkan ini untuk validasi update

class UserController extends Controller
{
    /**
     * GET /api/users
     * Mengambil semua pengguna
     */
    public function index()
    {
        // Mengambil semua user, termasuk yang nonaktif (deleted_at)
        // TAMBAHKAN: with('role') agar nama role ikut terkirim
        $users = User::withTrashed()->with('role')->get();
        return response()->json($users);
    }

    /**
     * POST /api/users
     * Membuat pengguna baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role_id' => 'required|exists:roles,id',
            // Diperbarui: 'konfirmasi_password' harusnya 'password_confirmation' agar otomatis
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'nama_lengkap' => $request->nama_lengkap,
            'email' => $request->email,
            'password' => Auth::make($request->password), // WAJIB: Hash password
            'role_id' => $request->role_id,
        ]);

        // Muat relasi role setelah dibuat
        $user->load('role');

        return response()->json(['message' => 'Pengguna berhasil dibuat.', 'user' => $user], 201);
    }

    /**
     * --- FUNGSI BARU ---
     * GET /api/users/{id}
     * Mengambil detail satu pengguna
     */
    public function show($id)
    {
        // Temukan user atau gagal (404)
        $user = User::with('role')->findOrFail($id);
        return response()->json($user);
    }

    /**
     * --- FUNGSI BARU ---
     * PUT /api/users/{id}
     * Mengupdate pengguna
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            // Validasi email unik, tapi abaikan email user saat ini
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'role_id' => 'required|exists:roles,id',
            // Password opsional, hanya jika diisi
            'password' => 'nullable|string|min:8',
        ]);

        // Update data dasar
        $user->nama_lengkap = $request->nama_lengkap;
        $user->email = $request->email;
        $user->role_id = $request->role_id;

        // Update password HANYA JIKA diisi
        if ($request->filled('password')) {
            $user->password = Auth::make($request->password);
        }

        $user->save();
        
        // Muat relasi role setelah di-update
        $user->load('role');

        return response()->json(['message' => 'Pengguna berhasil diperbarui.', 'user' => $user], 200);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Jangan biarkan user menghapus dirinya sendiri
        if (Auth::id() == $id) {
            return response()->json(['message' => 'Anda tidak dapat menghapus akun Anda sendiri.'], 403);
        }
        
        // Gunakan Soft Delete
        $user->delete();

        return response()->json(['message' => 'Pengguna berhasil dinonaktifkan.'], 200);
    }
}