<div class="auth-container">
    <div class="auth-branding">
        <div class="branding-logo"><i class="fas fa-landmark"></i></div>
        <h1 class="branding-title">SITANAS</h1>
        <p class="branding-description">Sistem Informasi Tanah Kas Desa untuk pengelolaan aset yang transparan dan efisien.</p>
    </div>

    <div class="auth-form-wrapper">
        <div class="auth-form-container">
            <div class="form-header">
                <h2>Selamat Datang Kembali</h2>
                <p>Silakan masuk untuk melanjutkan ke dashboard.</p>
            </div>

            @if (session('error'))
                <div class="notification error" style="margin: 0 0 1.5rem 0;">{{ session('error') }}</div>
            @endif
            @if (session('success'))
                <div class="notification success" style="margin: 0 0 1.5rem 0;">{{ session('success') }}</div>
            @endif
            <form wire:submit="login">
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" wire:model="email" class="input-field" required placeholder="Masukkan email">
                    @error('email') <span class="notification error">{{ $message }}</span> @enderror
                </div>
                
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" wire:model="password" class="input-field" required placeholder="Masukkan password">
                    @error('password') <span class="notification error">{{ $message }}</span> @enderror
                </div>
                
                <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1.5rem;">Login</button>
                </form>

            <div class="divider">atau</div>
            
            <a href="{{ route('publik') }}" wire:navigate class="btn btn-secondary btn-block">Lihat Informasi Publik</a>
        </div>
    </div>
</div>