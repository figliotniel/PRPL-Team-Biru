<div class="modal" style="display: flex; z-index: 1001;">
    <div class="modal-content">
        
        <span class="close-button" wire:click="$dispatch('user-updated')">&times;</span>

        <h3 id="modalTitle" style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
            Edit User: {{ $nama_lengkap }}
        </h3>

        <div class="card" style="margin-bottom: 1.5rem; box-shadow: none; border: 1px solid var(--border-color);">
            <div class="card-header"><h4><i class="fas fa-user-edit"></i> Edit Data</h4></div>
            <div class="card-body">
                <form wire:submit="updateData">
                    <div class="form-group">
                        <label for="edit_nama_lengkap">Nama Lengkap</label>
                        <input type="text" id="edit_nama_lengkap" wire:model.live="nama_lengkap" class="form-control" required>
                        @error('nama_lengkap') <span class="notification error">{{ $message }}</span> @enderror
                    </div>
                    <div class="form-group">
                        <label for="edit_email">Email</label>
                        <input type="email" id="edit_email" wire:model.live="email" class="form-control" required>
                        @error('email') <span class="notification error">{{ $message }}</span> @enderror
                    </div>
                    <div class="form-group">
                        <label for="edit_role_id">Peran</label>
                        <select id="edit_role_id" wire:model.live="role_id" class="form-control" required>
                            @foreach($roles as $role)
                                <option value="{{ $role->id }}">{{ $role->nama_role }}</option>
                            @endforeach
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Simpan Perubahan Data</button>
                </form>
            </div>
        </div>

        <div class="card" style="box-shadow: none; border: 1px solid var(--border-color);">
            <div class="card-header"><h4><i class="fas fa-key"></i> Reset Password</h4></div>
            <div class="card-body">
                
                @if (session('success_pass'))
                    <div class="notification success">{{ $message }}</div>
                @endif

                <form wire:submit="updatePassword">
                    <div class="form-group">
                        <label for="new_password">Password Baru (Min. 6 karakter)</label>
                        <input type="password" id="new_password" wire:model="new_password" class="form-control" required>
                        @error('new_password') <span class="notification error">{{ $message }}</span> @enderror
                    </div>
                    <div class="form-group">
                        <label for="new_password_confirmation">Konfirmasi Password Baru</label>
                        <input type="password" id="new_password_confirmation" wire:model="new_password_confirmation" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-danger">Reset Password</button>
                </form>
            </div>
        </div>

    </div>
</div>