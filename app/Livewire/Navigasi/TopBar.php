<?php

namespace App\Livewire\Navigasi;

use Livewire\Component;
use Illuminate\Support\Facades\Auth;

class TopBar extends Component
{
    // Fungsi ini menggantikan logout.php
    public function logout()
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        // Redirect ke halaman login
        return $this->redirect('/login', navigate: true);
    }

    public function render()
    {
        return view('livewire.navigasi.top-bar');
    }
}