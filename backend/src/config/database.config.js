// backend/src/config/database.config.js

// 1. Memuat variabel dari file .env agar bisa digunakan di sini
require('dotenv').config();

// 2. Mengimpor library Sequelize
const { Sequelize } = require('sequelize');

// 3. Membuat objek koneksi (instance) Sequelize
//    Sequelize akan secara otomatis membaca variabel-variabel dari process.env
//    yang telah kita muat dari file .env
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nama database
  process.env.DB_USER,      // Username database
  process.env.DB_PASSWORD,  // Password database
  {
    host: process.env.DB_HOST,      // Host database (biasanya 'localhost')
    port: process.env.DB_PORT,      // Port database (biasanya 3306 untuk MariaDB/MySQL)
    dialect: process.env.DB_DIALECT, // Jenis database yang digunakan ('mysql')
    
    // Opsi tambahan (opsional tapi bagus untuk dimiliki)
    logging: false, // Set ke `console.log` untuk melihat semua query SQL yang dijalankan Sequelize
    pool: {
      max: 5,       // Jumlah koneksi maksimum
      min: 0,       // Jumlah koneksi minimum
      acquire: 30000, // Waktu maksimum (ms) untuk mencoba mendapatkan koneksi sebelum error
      idle: 10000   // Waktu maksimum (ms) sebuah koneksi bisa idle sebelum dilepaskan
    }
  }
);

// 4. Mengekspor instance sequelize agar bisa di-`require` oleh file lain
//    (seperti server.js dan file-file model Anda)
module.exports = sequelize;