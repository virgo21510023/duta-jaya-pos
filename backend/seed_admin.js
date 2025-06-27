// backend/seed_admin.js
require('dotenv').config();
const sequelize = require('./src/config/database.config');
const User = require('./src/models/user.model');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // Sinkronisasi model User dengan database
    await User.sync();
    console.log('Model User telah disinkronkan.');

    // Cek apakah admin sudah ada
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    if (existingAdmin) {
      console.log('Pengguna admin sudah ada.');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10); // 10 adalah salt rounds

    // Buat pengguna admin baru
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Pengguna admin berhasil dibuat!');
    console.log('   Username: admin');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Gagal membuat pengguna admin:', error);
  } finally {
    await sequelize.close(); // Tutup koneksi database
  }
}

createAdmin();
