<?php
namespace App\Http\Controllers\Api;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        // Mengambil semua user, termasuk yang nonaktif (deleted_at)
        $users = User::withTrashed()->get();
        return response()->json($users);
    }

    // POST /api/users
    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role_id' => 'required|exists:roles,id',
            'password' => 'required|string|min:6|confirmed', // Laravel otomatis mencari password_confirmation
        ]);

        $user = User::create([
            'nama_lengkap' => $request->nama_lengkap,
            'email' => $request->email,
            'password' => Hash::make($request->password), // WAJIB: Hash password
            'role_id' => $request->role_id,
        ]);

        return response()->json(['message' => 'Pengguna berhasil dibuat.', 'user' => $user], 201);
    }

    // DELETE /api/users/{id} (Untuk Nonaktifkan Akun)
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        // Gunakan Soft Delete
        $user->delete(); 

        return response()->json(['message' => 'Pengguna berhasil dinonaktifkan.'], 200);
    }
}