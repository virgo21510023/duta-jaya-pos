// backend/server.js

// 1. Impor Modul & Model
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database.config');

const Product = require('./src/models/product.model');
const Transaction = require('./src/models/transaction.model');
const TransactionDetail = require('./src/models/transaction_detail.model');
const User = require('./src/models/user.model');
const PriceTier = require('./src/models/price_tier.model');
const StockEntry = require('./src/models/stock_entry.model');

// Impor Rute
const productRoutes = require('./src/api/products.routes');
const transactionRoutes = require('./src/api/transactions.routes');
const reportRoutes = require('./src/api/reports.routes');
const authRoutes = require('./src/api/auth.routes');
const purchaseRoutes = require('./src/api/purchases.routes');
const userRoutes = require('./src/api/users.routes'); // <-- Impor rute baru
const returnRoutes = require('./src/api/returns.routes');

// 2. Inisialisasi Aplikasi & Middleware
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

// 3. Koneksi Database & Asosiasi Model
Transaction.hasMany(TransactionDetail, { foreignKey: 'transaction_id' });
TransactionDetail.belongsTo(Transaction, { foreignKey: 'transaction_id' });
Product.hasMany(TransactionDetail, { foreignKey: 'product_id' });
TransactionDetail.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(PriceTier, { as: 'price_tiers', foreignKey: 'product_id' });
PriceTier.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(StockEntry, { foreignKey: 'product_id' });
StockEntry.belongsTo(Product, { foreignKey: 'product_id' });

async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi database MariaDB berhasil.');
  } catch (error) {
    console.error('❌ GAGAL TERHUBUNG KE DATABASE:', error);
    process.exit(1);
  }
}
testDbConnection();

// 4. Definisi Rute Aplikasi
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/users', userRoutes); // <-- Daftarkan rute baru
app.use('/api/returns', returnRoutes);

app.get('/', (req, res) => {
  res.send('🎉 Server Backend Duta Jaya POS Aktif!');
});

// 5. Menjalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
