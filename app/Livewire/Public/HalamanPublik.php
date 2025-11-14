<?php

namespace App\Livewire\Public;

use Livewire\Component;
use Livewire\Attributes\Layout;
use App\Models\TanahKasDesa;
use Livewire\WithPagination;

#[Layout('layouts.app')] // Kita tetap pakai layout utama
class HalamanPublik extends Component
{
    use WithPagination;

    public function render()
    {
        // Ambil data (persis seperti logika publik.php lama)
        $asetPublik = TanahKasDesa::where('status_validasi', 'Disetujui')
                                ->orderBy('id', 'desc')
                                ->paginate(15); // 15 data per halaman

        return view('livewire.public.halaman-publik', [
            'asetPublik' => $asetPublik
        ]);
    }
}