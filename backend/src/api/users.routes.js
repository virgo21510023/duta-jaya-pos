// backend/src/api/users.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Semua rute di bawah ini akan dilindungi.
// Pertama, verifikasi token, lalu cek apakah pengguna adalah admin.
router.use(verifyToken, isAdmin);

// GET /api/users -> Mengambil semua pengguna
router.get('/', userController.getAllUsers);

// POST /api/users -> Membuat pengguna baru
router.post('/', userController.createUser);

// DELETE /api/users/:id -> Menghapus pengguna
router.delete('/:id', userController.deleteUser);

module.exports = router;
