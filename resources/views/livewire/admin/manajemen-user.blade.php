<div>
    <div class="content-header">
        <h1>Manajemen User</h1>
    </div>

    <div class="profile-grid"> <div class="card profile-card">
            <div class="card-header"><h4>Buat Akun Baru</h4></div>
            <div class="card-body">

                @if (session('success_user'))
                    <div class="notification success">{{ session('success_user') }}</div>
                @endif

                <form wire:submit="simpanUserBaru">
                    <div class="form-group">
                        <label for="nama_lengkap">Nama Lengkap</label>
                        <input type="text" id="nama_lengkap" wire:model="nama_lengkap" class="form-control" required>
                        @error('nama_lengkap') <span class="notification error">{{ $message }}</span> @enderror
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" wire:model="email" class="form-control" required>
                        @error('email') <span class="notification error">{{ $message }}</span> @enderror
                    </div>
                    <div class="form-group">
                        <label for="role_id">Peran</label>
                        <select id="role_id" wire:model="role_id" class="form-control" required>
                            <option value="">-- Pilih Peran --</option>
                            @foreach($roles as $role)
                                <option value="{{ $role->id }}">{{ $role->nama_role }}</option>
                            @endforeach
                        </select>
                        @error('role_id') <span class="notification error">{{ $message }}</span> @enderror
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" wire:model="password" class="form-control" required>
                        @error('password') <span class="notification error">{{ $message }}</span> @enderror
                    </div>
                    <div class="form-group">
                        <label for="password_confirmation">Konfirmasi Password</label>
                        <input type="password" id="password_confirmation" wire:model="password_confirmation" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Buat Akun</button>
                </form>
            </div>
        </div>

        <div class="profile-details">
            <div class="card">
                <div class="card-header"><h4>Daftar User Terdaftar</h4></div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Peran</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($users as $user)
                                <tr>
                                    <td>{{ $user->nama_lengkap }}</td>
                                    <td>{{ $user->email }}</td>
                                    <td>{{ $user->role->nama_role }}</td>
                                    <td>
                                        <span class="status {{ $user->status == 'aktif' ? 'disetujui' : 'ditolak' }}">
                                            {{ $user->status }}
                                        </span>
                                    </td>
                                    <td class="action-buttons">
                                        <button wire:click="openEditModal({{ $user->id }})" class="btn btn-sm btn-warning" title="Edit"><i class="fas fa-edit"></i></button>

                                        @if($user->id != auth()->id()) @if($user->status == 'aktif')
                                                <button 
                                                    wire:click="toggleStatus({{ $user->id }})" 
                                                    wire:confirm="Anda yakin ingin MENONAKTIFKAN user ini?"
                                                    class="btn btn-sm btn-danger" 
                                                    title="Nonaktifkan User">
                                                    <i class="fas fa-toggle-off"></i>
                                                </button>
                                            @else
                                                <button 
                                                    wire:click="toggleStatus({{ $user->id }})"
                                                    wire:confirm="Anda yakin ingin MENGAKTIFKAN user ini?"
                                                    class="btn btn-sm btn-success" 
                                                    title="Aktifkan User">
                                                    <i class="fas fa-toggle-on"></i>
                                                </button>
                                            @endif
                                        @endif
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @if($showEditModal && $editingUserId)
        <livewire:admin.modal-edit-user :userId="$editingUserId" :key="$editingUserId" />
    @endif
</div>