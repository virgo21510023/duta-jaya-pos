// backend/src/controllers/purchase.controller.js
const sequelize = require('../config/database.config');
const Product = require('../models/product.model');
const StockEntry = require('../models/stock_entry.model');

exports.recordPurchase = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { productId, quantity, purchasePrice, supplier } = req.body;

    if (!productId || !quantity || !purchasePrice) {
      return res.status(400).json({ message: 'Produk, Kuantitas, dan Harga Beli harus diisi.' });
    }

    // 1. Catat entri pembelian
    const stockEntry = await StockEntry.create({
      product_id: productId,
      quantity_added: quantity,
      purchase_price: purchasePrice,
      supplier_info: supplier,
    }, { transaction: t });

    // 2. Tambah jumlah stok di tabel produk
    const product = await Product.findByPk(productId, { transaction: t });
    if (!product) {
      throw new Error('Produk tidak ditemukan.');
    }
    await product.increment('stock_quantity', { by: quantity, transaction: t });

    // Jika semua berhasil, commit transaksi
    await t.commit();
    res.status(201).json({ message: 'Pembelian berhasil dicatat', data: stockEntry });

  } catch (error) {
    // Jika ada error, batalkan semua perubahan
    await t.rollback();
    res.status(500).json({ message: 'Gagal mencatat pembelian', error: error.message });
  }
};