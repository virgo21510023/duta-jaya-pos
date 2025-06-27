// backend/src/controllers/product.controller.js

const Product = require('../models/product.model');
const PriceTier = require('../models/price_tier.model');
const sequelize = require('../config/database.config');
const { Op, fn, col } = require('sequelize');

// V-- FUNGSI INI TELAH DIPERBARUI TOTAL UNTUK PAGINASI --V
exports.getAllProducts = async (req, res) => {
  try {
    // Ambil parameter halaman dan batas dari query, berikan nilai default
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Gunakan findAndCountAll untuk mendapatkan data dan total jumlahnya
    const { count, rows } = await Product.findAndCountAll({
      include: {
        model: PriceTier,
        as: 'price_tiers'
      },
      order: [
        ['name', 'ASC'],
        [{ model: PriceTier, as: 'price_tiers' }, 'min_qty', 'ASC']
      ],
      limit: limit,
      offset: offset,
      distinct: true // Penting untuk penghitungan yang benar saat menggunakan include
    });

    // Kirim kembali data dalam format yang mudah digunakan oleh frontend
    res.status(200).json({
      totalItems: count,
      products: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data produk', error: error.message });
  }
};

// ... (sisa fungsi lainnya tidak berubah)
exports.createProduct = async (req, res) => {
  try {
    const { product_code, name, grade, unit, stock_quantity, hpp, base_price } = req.body;
    if (!name || !hpp || !base_price) {
      return res.status(400).json({ message: 'Nama, HPP, dan Harga Jual tidak boleh kosong.' });
    }
    const newProduct = await Product.create({ product_code, name, grade, unit, stock_quantity, hpp, base_price });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat produk baru', error: error.message });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) { return res.status(404).json({ message: 'Produk tidak ditemukan.' }); }
    await product.update(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengupdate produk', error: error.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) { return res.status(404).json({ message: 'Produk tidak ditemukan.' }); }
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus produk', error: error.message });
  }
};
exports.getUniqueUnits = async (req, res) => {
  try {
    const units = await Product.findAll({ attributes: [[fn('DISTINCT', col('unit')), 'unit']], where: { unit: { [Op.ne]: null, [Op.ne]: '' } }, order: [['unit', 'ASC']] });
    res.json(units.map(item => item.unit));
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data satuan', error: error.message });
  }
};
exports.getUniqueGrades = async (req, res) => {
  try {
    const grades = await Product.findAll({ attributes: [[fn('DISTINCT', col('grade')), 'grade']], where: { grade: { [Op.ne]: null, [Op.ne]: '' } }, order: [['grade', 'ASC']] });
    res.json(grades.map(item => item.grade));
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data grade', error: error.message });
  }
};
exports.managePriceTiers = async (req, res) => {
  const { id } = req.params;
  const { tiers } = req.body;
  const t = await sequelize.transaction();
  try {
    await PriceTier.destroy({ where: { product_id: id }, transaction: t });
    if (tiers && tiers.length > 0) {
      const newTiers = tiers.map(tier => ({ product_id: id, min_qty: tier.min_qty, price: tier.price }));
      await PriceTier.bulkCreate(newTiers, { transaction: t });
    }
    await t.commit();
    res.status(200).json({ message: 'Tingkatan harga berhasil diperbarui.' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Gagal memperbarui tingkatan harga', error: error.message });
  }
};
