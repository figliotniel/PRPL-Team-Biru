<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\Attributes\Layout;
use App\Models\TanahKasDesa;
use Livewire\WithPagination;

#[Layout('layouts.app')]
class ArsipAset extends Component
{
    use WithPagination;

    public function mount()
    {
        // Lindungi halaman ini. Jika bukan Admin, lempar
        if (auth()->user()->role_id != 1) {
            return redirect('/');
        }
    }

    /**
     * Fungsi untuk PULIHKAN data
     */
    public function pulihkan($id)
    {
        // Cari data HANYA di dalam arsip
        $aset = TanahKasDesa::onlyTrashed()->find($id);

        if ($aset) {
            $aset->restore(); // Perintah untuk memulihkan
            session()->flash('success', 'Data aset berhasil dipulihkan.');
        }
    }

    /**
     * Fungsi untuk HAPUS PERMANEN
     */
    public function hapusPermanen($id)
    {
        $aset = TanahKasDesa::onlyTrashed()->find($id);

        if ($aset) {
            // Hapus file dokumen/pemanfaatan terkait (jika perlu)
            // ... (logika ini bisa ditambah nanti)

            $aset->forceDelete(); // Perintah untuk hapus permanen
            session()->flash('success', 'Data aset berhasil dihapus permanen.');
        }
    }

    public function render()
    {
        // Ambil data HANYA DARI ARSIP (yang di-soft-delete)
        $asetArsip = TanahKasDesa::onlyTrashed()->paginate(10);

        return view('livewire.admin.arsip-aset', [
            'asetArsip' => $asetArsip
        ]);
    }
}