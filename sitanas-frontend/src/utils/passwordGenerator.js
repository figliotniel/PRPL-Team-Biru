/**
 * Generate password kuat dengan kombinasi huruf besar, kecil, angka, dan simbol
 * @param {number} length - Panjang password yang diinginkan (default: 12)
 * @returns {string} Password yang ter-generate
 */
export const generateStrongPassword = (length = 12) => {
    // Karakter yang akan digunakan
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";
    
    // Gabungkan semua karakter
    const allChars = lowercase + uppercase + numbers + symbols;
    
    let password = "";
    
    // Pastikan password memiliki minimal 1 dari setiap jenis karakter
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Isi sisa panjang password dengan karakter random
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Acak urutan karakter agar lebih random
    return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Validasi kekuatan password
 * @param {string} password - Password yang akan divalidasi
 * @returns {object} Object berisi score dan message
 */
export const validatePasswordStrength = (password) => {
    let score = 0;
    let message = "";
    
    if (!password) {
        return { score: 0, message: "Password kosong", strength: "very-weak" };
    }
    
    // Cek panjang
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Cek kompleksitas
    if (/[a-z]/.test(password)) score++; // Huruf kecil
    if (/[A-Z]/.test(password)) score++; // Huruf besar
    if (/[0-9]/.test(password)) score++; // Angka
    if (/[^a-zA-Z0-9]/.test(password)) score++; // Simbol
    
    // Tentukan kekuatan
    if (score <= 2) {
        message = "Sangat Lemah";
        return { score, message, strength: "very-weak" };
    } else if (score <= 3) {
        message = "Lemah";
        return { score, message, strength: "weak" };
    } else if (score <= 4) {
        message = "Sedang";
        return { score, message, strength: "medium" };
    } else if (score <= 5) {
        message = "Kuat";
        return { score, message, strength: "strong" };
    } else {
        message = "Sangat Kuat";
        return { score, message, strength: "very-strong" };
    }
};

/**
 * Generate password dengan requirement khusus
 * @param {object} options - Opsi kustomisasi
 * @returns {string} Password yang ter-generate
 */
export const generateCustomPassword = (options = {}) => {
    const {
        length = 12,
        includeUppercase = true,
        includeLowercase = true,
        includeNumbers = true,
        includeSymbols = true,
        excludeSimilar = false, // Hindari karakter mirip seperti i,l,1,I,o,O,0
        excludeAmbiguous = false // Hindari karakter ambigu seperti {}[]()/\'"~,;:.<>
    } = options;
    
    let charset = "";
    let password = "";
    
    // Definisikan karakter
    let lowercase = "abcdefghijklmnopqrstuvwxyz";
    let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "0123456789";
    let symbols = "!@#$%^&*";
    
    // Exclude similar characters jika diminta
    if (excludeSimilar) {
        lowercase = lowercase.replace(/[ilo]/g, '');
        uppercase = uppercase.replace(/[IO]/g, '');
        numbers = numbers.replace(/[01]/g, '');
    }
    
    // Exclude ambiguous characters jika diminta
    if (excludeAmbiguous) {
        symbols = symbols.replace(/[{}[\]()/\\'"~,;:.<>]/g, '');
    }
    
    // Build charset based on options
    if (includeLowercase) charset += lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    
    if (!charset) {
        throw new Error("Minimal satu jenis karakter harus diaktifkan");
    }
    
    // Generate password
    for (let i = 0; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    return password;
};