<?php

namespace App\Livewire\Auth;

use Livewire\Component;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;

#[Layout('layouts.app')]
class LoginPage extends Component
{
    public $email = '';
    public $password = '';

    // Fungsi ini akan dipanggil oleh <form wire:submit="login">
    public function login()
    {
        // 1. Validasi input
        $credentials = $this->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Tambahkan pengecekan STATUS AKTIF (sesuai rencana kita)
        $credentials['status'] = 'aktif';

        // 3. Coba login
        if (Auth::attempt($credentials)) {
            
            // 4. Regenerate session (keamanan)
            request()->session()->regenerate();

            // 5. Redirect ke dashboard (nanti kita buat di Langkah 5)
            return redirect()->intended('/'); // Redirect ke halaman utama
        
        }

        // 6. Jika login gagal
        session()->flash('error', 'Kombinasi Email atau Password salah, atau akun Anda tidak aktif.');
    }

    // Fungsi ini yang menampilkan HTML-nya
    public function render()
    {
        // 3. Hapus ->layout(...) dari sini
        return view('livewire.auth.login-page');
    }
}