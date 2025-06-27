// backend/src/controllers/transaction.controller.js

const sequelize = require('../config/database.config');
const Transaction = require('../models/transaction.model');
const TransactionDetail = require('../models/transaction_detail.model');
const Product = require('../models/product.model');
const PriceTier = require('../models/price_tier.model'); // Pastikan model ini diimpor
const { Op } = require('sequelize');

// Fungsi untuk membuat transaksi yang sudah selesai
exports.createTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, total_amount, payment_method, customer_name } = req.body;
    const transaction_code = `DJ-${Date.now()}`;
    const transaction = await Transaction.create({
      transaction_code,
      total_amount,
      payment_method,
      customer_name,
      status: 'completed',
      transaction_type: 'sale'
    }, { transaction: t });

    for (const item of items) {
      await TransactionDetail.create({
        transaction_id: transaction.id,
        product_id: item.id,
        quantity: item.quantity,
        price_per_unit: item.price,
        subtotal: item.price * item.quantity
      }, { transaction: t });

      const product = await Product.findByPk(item.id, { transaction: t });
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Stok untuk ${product.name} tidak mencukupi.`);
      }
      await product.decrement('stock_quantity', { by: item.quantity, transaction: t });
    }
    await t.commit();
    res.status(201).json({ message: 'Transaksi berhasil dibuat', transaction });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Transaksi gagal', error: error.message });
  }
};

// Fungsi untuk mengambil semua riwayat transaksi yang sudah selesai
exports.getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = { status: 'completed' };

    if (search) {
      whereClause[Op.or] = [
        { transaction_code: { [Op.like]: `%${search}%` } },
        { customer_name: { [Op.like]: `%${search}%` } }
      ];
    }

    if (startDate && endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      whereClause.createdAt = { [Op.between]: [new Date(startDate), endOfDay] };
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset,
    });

    res.status(200).json({
      totalItems: count,
      transactions: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil riwayat transaksi', error: error.message });
  }
};


// Fungsi untuk mengambil detail satu transaksi berdasarkan ID numeriknya
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          model: TransactionDetail,
          include: [{
            model: Product,
            attributes: ['name', 'base_price'],
            include: [{
              model: PriceTier,
              as: 'price_tiers',
              attributes: ['min_qty', 'price']
            }]
          }]
        }
      ]
    });
    if (!transaction) { return res.status(404).json({ message: 'Transaksi tidak ditemukan.' }); }
    
    const formattedTransaction = {
      ...transaction.toJSON(),
      items: transaction.TransactionDetails.map(detail => ({
        id: detail.product_id,
        name: detail.Product.name,
        quantity: detail.quantity,
        base_price: detail.Product.base_price,
        price_tiers: detail.Product.price_tiers || [],
        price: detail.price_per_unit
      }))
    };
    delete formattedTransaction.TransactionDetails;
    res.status(200).json(formattedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil detail transaksi', error: error.message });
  }
};

// Fungsi untuk mencari transaksi berdasarkan kodenya
exports.getTransactionByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const transaction = await Transaction.findOne({
      where: { transaction_code: code, status: 'completed' },
      include: [
        {
          model: TransactionDetail,
          include: [{
            model: Product,
            attributes: ['name', 'base_price'],
            include: [{
              model: PriceTier,
              as: 'price_tiers',
              attributes: ['min_qty', 'price']
            }]
          }]
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi dengan kode tersebut tidak ditemukan atau belum selesai.' });
    }
    
    const formattedTransaction = {
      ...transaction.toJSON(),
      items: transaction.TransactionDetails.map(detail => {
        if (!detail.Product) {
          return { id: detail.product_id, name: 'PRODUK TELAH DIHAPUS', quantity: detail.quantity, price: detail.price_per_unit };
        }
        return {
          id: detail.product_id,
          name: detail.Product.name,
          quantity: detail.quantity,
          base_price: detail.Product.base_price,
          price_tiers: detail.Product.price_tiers || [],
          price: detail.price_per_unit
        };
      })
    };
    delete formattedTransaction.TransactionDetails;

    res.status(200).json(formattedTransaction);
  } catch (error) {
    console.error("--- [FATAL ERROR] Terjadi kesalahan di dalam getTransactionByCode:", error);
    res.status(500).json({ message: 'Gagal mengambil detail transaksi', error: error.message });
  }
};
