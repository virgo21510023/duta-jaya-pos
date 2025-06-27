// backend/src/controllers/user.controller.js

const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// Mengambil semua pengguna
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'createdAt', 'updatedAt'] // Jangan kirim password
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pengguna.' });
  }
};

// Membuat pengguna baru (biasanya untuk kasir)
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: role || 'kasir' // Default ke kasir jika tidak ditentukan
    });

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat pengguna baru.' });
  }
};

// Menghapus pengguna
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }
    // Tambahan: Jangan biarkan admin menghapus dirinya sendiri
    if (req.user.id === parseInt(id)) {
        return res.status(400).json({ message: 'Anda tidak dapat menghapus akun Anda sendiri.' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus pengguna.' });
  }
};
