Duta Jaya POS - Aplikasi Point of Sale
Sebuah aplikasi Point of Sale (POS) berbasis web modern yang dibangun dari nol, dirancang untuk manajemen toko kimia atau labware. Aplikasi ini memiliki backend yang kuat berbasis Node.js & Express, dan frontend yang reaktif serta elegan dibangun dengan Vue.js & Tailwind CSS.

Fitur Utama
Aplikasi ini mencakup alur kerja bisnis yang lengkap dari hulu ke hilir:

🖥️ Dashboard Informatif: Halaman utama yang menampilkan ringkasan performa bisnis harian secara sekilas.

🔐 Sistem Login & Peran: Keamanan multi-user dengan peran Admin dan Kasir yang memiliki hak akses berbeda.

🛒 Kasir (POS): Antarmuka penjualan yang cepat dan intuitif, dilengkapi dengan:

Pencarian produk.

Keranjang belanja dinamis.

Perhitungan harga bertingkat otomatis.

Berbagai metode pembayaran.

Pencetakan nota/struk.

📦 Manajemen Inventaris: Fitur CRUD penuh untuk mengelola produk, termasuk info stok, HPP, dan harga jual.

📈 Laporan Bisnis: Halaman laporan untuk menganalisis performa dengan filter tanggal, mencakup:

Laporan Penjualan (Omzet, total transaksi).

Laporan Laba-Rugi (Total HPP & Laba Kotor).

🚚 Stok Masuk (Pembelian): Fitur untuk mencatat pembelian barang dari supplier dan memperbarui stok secara otomatis.

↩️ Retur Barang: Alur kerja untuk memproses pengembalian barang dari pelanggan, yang akan menyesuaikan stok.

📖 Riwayat Transaksi: Halaman untuk melihat semua transaksi yang telah selesai dengan paginasi, pencarian, dan fitur cetak ulang nota.

⚙️ Pengaturan Fleksibel: Halaman khusus Admin untuk mengelola:

Informasi toko yang tampil di struk.

Pengguna aplikasi (tambah/hapus kasir).

Tema tampilan (Light/Dark/Sistem).

Pilihan latar belakang aplikasi.

Teknologi yang Digunakan
Backend: Node.js, Express.js, Sequelize (ORM), MariaDB/MySQL

Frontend: Vue.js, Vite, Pinia (State Management), Vue Router, Tailwind CSS

Autentikasi: JSON Web Tokens (JWT)

Keamanan: Password Hashing (bcryptjs)
