<header class="topbar" style="justify-content: space-between; background-color: #111827; color: white;">

    <div class="sidebar-header" style="padding: 0; border: none; margin: 0;">
        <i class="fas fa-landmark sidebar-logo"></i>
        <h2 class="sidebar-title" style="font-size: 1.5rem;">SITANAS v2</h2>
    </div>

    <nav class="sidebar-nav" style="flex-grow: 0;">
        <ul style="display: flex; gap: 1rem;">
            <li><a href="/" wire:navigate><i class="fas fa-tachometer-alt fa-fw"></i> Dashboard</a></li>
            <li><a href="{{ route('laporan') }}" wire:navigate><i class="fas fa-file-alt fa-fw"></i> Laporan</a></li>
            @if(auth()->user()->role_id == 1)
                <li><a href="{{ route('admin.users') }}" wire:navigate><i class="fas fa-users fa-fw"></i> Manajemen User</a></li>
                <li><a href="{{ route('admin.arsip') }}" wire:navigate><i class="fas fa-archive fa-fw"></i> Arsip Aset</a></li>
            @endif
        </ul>
    </nav>

    <div class="profile-dropdown">
        <div class="profile-info">
            <span>Halo, <strong>{{ auth()->user()->nama_lengkap }}</strong></span>
            <button wire:click="logout" class="btn btn-danger btn-sm" style="margin-left: 1rem;">Logout</button>
        </div>
    </div>
</header>