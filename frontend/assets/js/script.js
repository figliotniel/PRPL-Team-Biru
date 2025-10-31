// Fungsi untuk menampilkan/menyembunyikan password
function togglePasswordVisibility(fieldId) {
    const input = document.getElementById(fieldId);
    const icon = input.nextElementSibling.querySelector('i');
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = "password";
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Fungsi untuk modal validasi di halaman dashboard
const modal = document.getElementById('validationModal');

function openValidationModal(status, asetId) {
    if (modal) {
        document.getElementById('modalAsetId').value = asetId;
        document.getElementById('modalStatus').value = status;
        
        const title = document.getElementById('modalTitle');
        const button = document.getElementById('modalSubmitButton');
        
        if (status === 'Disetujui') {
            title.innerText = 'Konfirmasi Persetujuan Aset';
            button.className = 'btn btn-success';
            button.innerText = 'Ya, Setujui Aset';
        } else {
            title.innerText = 'Konfirmasi Penolakan Aset';
            button.className = 'btn btn-danger';
            button.innerText = 'Ya, Tolak Aset';
        }

        modal.style.display = "flex";
    }
}

function closeValidationModal() {
    if (modal) {
        modal.style.display = "none";
        document.getElementById('catatan_validasi').value = '';
    }
}

// Klik di luar modal akan menutupnya
window.onclick = function(event) {
    if (event.target == modal) {
        closeValidationModal();
    }
}