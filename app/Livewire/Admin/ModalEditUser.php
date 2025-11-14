<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ModalEditUser extends Component
{
    // Properti yang dikirim dari halaman utama
    public $userId;

    // Properti untuk data user
    public $user;
    public $roles;

    // Properti untuk form 'Edit Data'
    public $nama_lengkap;
    public $email;
    public $role_id;

    // Properti untuk form 'Reset Password'
    public $new_password;
    public $new_password_confirmation;

    /**
     * Fungsi MOUNT()
     * Berjalan saat komponen modal ini dibuat.
     * Mengambil data user yang akan diedit.
     */
    public function mount($userId)
    {
        $this->userId = $userId;
        $this->user = User::find($userId);
        $this->roles = Role::all();

        // Isi properti form dengan data yang ada
        $this->nama_lengkap = $this->user->nama_lengkap;
        $this->email = $this->user->email;
        $this->role_id = $this->user->role_id;
    }

    /**
     * Fungsi untuk simpan perubahan data
     */
    public function updateData()
    {
        $validated = $this->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $this->userId, // Cek unik, kecuali untuk user ini
            'role_id' => 'required|exists:roles,id',
        ]);

        $this->user->update($validated);

        // Kirim event 'user-updated' ke halaman utama untuk menutup modal
        $this->dispatch('user-updated');
    }

    /**
     * Fungsi untuk simpan password baru
     */
    public function updatePassword()
    {
        $validated = $this->validate([
            'new_password' => ['required', 'confirmed', Password::min(6)],
        ]);

        $this->user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        // Kosongkan field password
        $this->reset('new_password', 'new_password_confirmation');

        // Tampilkan pesan sukses di dalam modal
        session()->flash('success_pass', 'Password user berhasil di-reset.');
    }

    public function render()
    {
        return view('livewire.admin.modal-edit-user');
    }
}