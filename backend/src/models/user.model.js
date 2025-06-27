// backend/src/models/user.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

// Mendefinisikan model 'User' yang merepresentasikan tabel 'users'
const User = sequelize.define('User', {
  // Kolom username
  username: {
    type: DataTypes.STRING,
    allowNull: false, // Tidak boleh kosong
    unique: true      // Harus unik, tidak boleh ada username yang sama
  },

  // Kolom password
  password: {
    type: DataTypes.STRING,
    allowNull: false // Tidak boleh kosong
  },

  // Kolom peran/role pengguna
  role: {
    type: DataTypes.ENUM('admin', 'kasir'), // Hanya boleh diisi 'admin' atau 'kasir'
    allowNull: false,
    defaultValue: 'kasir' // Nilai default jika tidak ditentukan
  },
}, {
  tableName: 'users' // Secara eksplisit memberitahu Sequelize nama tabelnya
});

// Mengekspor model User agar bisa digunakan di file lain
module.exports = User;
