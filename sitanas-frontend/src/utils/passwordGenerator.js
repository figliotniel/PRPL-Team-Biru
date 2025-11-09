// sitanas-frontend/src/utils/passwordGenerator.js
// Fungsi sederhana untuk membuat password acak
export const generatePassword = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    const charactersLength = characters.length;
    
    // Pastikan password minimal mengandung satu huruf besar, satu huruf kecil, satu angka, dan satu simbol.
    // Jika length >= 4, kita jamin kompleksitas minimum.
    if (length >= 4) {
        // Tambahkan 1 huruf besar
        result += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
        // Tambahkan 1 huruf kecil
        result += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
        // Tambahkan 1 angka
        result += '0123456789'[Math.floor(Math.random() * 10)];
        // Tambahkan 1 simbol
        result += '!@#$%^&*}'[Math.floor(Math.random() * 8)];
    }

    // Isi sisanya secara acak
    for (let i = result.length; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    // Acak urutan karakter agar tidak terprediksi
    result = result.split('').sort(() => 0.5 - Math.random()).join('');
    
    return result;
};