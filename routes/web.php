<?php

use Illuminate\Support\Facades\Route;
use App\Livewire\Auth\LoginPage;
use App\Livewire\Dashboard\DashboardPage;
use App\Livewire\Aset\FormAset;
use App\Livewire\Aset\EditAset;
use App\Livewire\Aset\DetailPage;
use App\Livewire\Admin\ManajemenUser;
use App\Livewire\Laporan\LaporanPage;
use App\Livewire\Admin\ArsipAset;
use App\Livewire\Public\HalamanPublik;


Route::get('/publik', HalamanPublik::class)->name('publik');



Route::middleware('guest')->group(function () {
    Route::get('/login', LoginPage::class)->name('login');
});


Route::middleware('auth')->group(function () {
    
    // Rute Dashboard
    Route::get('/', DashboardPage::class)->name('dashboard');

    // Rute Aset (Hilangkan duplikat)
    Route::get('/tanah/tambah', FormAset::class)->name('aset.tambah');
    Route::get('/tanah/{aset}/edit', EditAset::class)->withTrashed()->name('aset.edit');
    Route::get('/tanah/{aset}', DetailPage::class)->name('aset.detail');

    // Rute Laporan (Gabung di sini)
    Route::get('/laporan', LaporanPage::class)->name('laporan');

    // Rute Admin (Gabung di sini)
    Route::get('/admin/users', ManajemenUser::class)->name('admin.users');
    Route::get('/admin/arsip', ArsipAset::class)->name('admin.arsip');
    
});