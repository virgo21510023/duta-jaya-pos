    const User = require('../models/user.model');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    exports.login = async (req, res) => {
      try {
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ message: 'Username dan password harus diisi.' });
        }

        // 1. Cari pengguna berdasarkan username
        const user = await User.findOne({ where: { username } });
        if (!user) {
          return res.status(401).json({ message: 'Username atau password salah.' });
        }

        // 2. Bandingkan password yang diberikan dengan hash di database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Username atau password salah.' });
        }

        // 3. Jika valid, buat "tiket" (JWT)
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '8h' } // Token berlaku selama 8 jam
        );

        // 4. Kirim token dan data pengguna (tanpa password) ke frontend
        res.status(200).json({
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        });

      } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
      }
    };
    