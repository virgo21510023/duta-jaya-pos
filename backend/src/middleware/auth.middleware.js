// backend/src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');

// Middleware untuk memverifikasi token
const verifyToken = (req, res, next) => {
  // Ambil token dari header 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formatnya: "Bearer <TOKEN>"

  if (!token) {
    return res.status(403).json({ message: 'Tidak ada token yang diberikan. Akses ditolak.' });
  }

  // Verifikasi token menggunakan secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
    }
    // Simpan data pengguna dari token ke object request
    req.user = decoded;
    next(); // Lanjutkan ke middleware atau controller berikutnya
  });
};

// Middleware untuk memeriksa apakah pengguna adalah admin
const isAdmin = (req, res, next) => {
  // Fungsi ini harus dijalankan SETELAH verifyToken
  if (req.user && req.user.role === 'admin') {
    next(); // Pengguna adalah admin, lanjutkan
  } else {
    res.status(403).json({ message: 'Akses ditolak. Membutuhkan peran Admin.' });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
