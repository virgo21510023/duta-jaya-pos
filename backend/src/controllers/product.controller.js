// backend/src/controllers/product.controller.js

// Impor semua model dan utilitas yang dibutuhkan di bagian atas
const Product = require('../models/product.model');
const PriceTier = require('../models/price_tier.model');
const sequelize = require('../config/database.config');
const { Op, fn, col } = require('sequelize');

// Mengambil semua produk beserta tingkatan harganya
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: PriceTier,
        as: 'price_tiers' // 'as' harus cocok dengan yang di asosiasi server.js
      },
      order: [
        ['name', 'ASC'],
        // Urutkan juga tingkatan harga dari kuantitas terkecil ke terbesar
        [{ model: PriceTier, as: 'price_tiers' }, 'min_qty', 'ASC']
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data produk', error: error.message });
  }
};

// Membuat produk baru
exports.createProduct = async (req, res) => {
  try {
    const { product_code, name, grade, unit, stock_quantity, hpp, base_price } = req.body;
    if (!name || !hpp || !base_price) {
      return res.status(400).json({ message: 'Nama, HPP, dan Harga Jual tidak boleh kosong.' });
    }
    const newProduct = await Product.create({
      product_code,
      name,
      grade,
      unit,
      stock_quantity,
      hpp,
      base_price,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat produk baru', error: error.message });
  }
};

// Mengupdate produk yang sudah ada
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }
    await product.update(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate produk', error: error.message });
  }
};

// Menghapus produk
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus produk', error: error.message });
  }
};

// Mengambil daftar satuan (unit) yang unik
exports.getUniqueUnits = async (req, res) => {
  try {
    const units = await Product.findAll({
      attributes: [[fn('DISTINCT', col('unit')), 'unit']],
      where: {
        unit: {
          [Op.ne]: null,
          [Op.ne]: ''
        }
      },
      order: [['unit', 'ASC']]
    });
    res.json(units.map(item => item.unit));
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data satuan', error: error.message });
  }
};

// Mengambil daftar grade yang unik
exports.getUniqueGrades = async (req, res) => {
  try {
    const grades = await Product.findAll({
      attributes: [[fn('DISTINCT', col('grade')), 'grade']],
       where: {
        grade: {
          [Op.ne]: null,
          [Op.ne]: ''
        }
      },
      order: [['grade', 'ASC']]
    });
    res.json(grades.map(item => item.grade));
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data grade', error: error.message });
  }
};

// Fungsi baru untuk mengelola (menyimpan/mengupdate) tingkatan harga
exports.managePriceTiers = async (req, res) => {
  const { id } = req.params; // ID Produk
  const { tiers } = req.body; // Array berisi tingkatan harga baru
  const t = await sequelize.transaction();

  try {
    // 1. Hapus semua tingkatan harga lama untuk produk ini
    await PriceTier.destroy({ where: { product_id: id }, transaction: t });

    // 2. Jika ada tingkatan harga baru yang dikirim, masukkan satu per satu
    if (tiers && tiers.length > 0) {
      const newTiers = tiers.map(tier => ({
        product_id: id,
        min_qty: tier.min_qty,
        price: tier.price
      }));
      await PriceTier.bulkCreate(newTiers, { transaction: t });
    }

    await t.commit();
    res.status(200).json({ message: 'Tingkatan harga berhasil diperbarui.' });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Gagal memperbarui tingkatan harga', error: error.message });
  }
};
