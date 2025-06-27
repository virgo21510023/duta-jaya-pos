// backend/src/controllers/transaction.controller.js

const sequelize = require('../config/database.config');
const Transaction = require('../models/transaction.model');
const TransactionDetail = require('../models/transaction_detail.model');
const Product = require('../models/product.model');
const { Op, fn, col, literal } = require('sequelize');

// Fungsi untuk membuat transaksi yang sudah selesai
exports.createTransaction = async (req, res) => {
  console.log('--- [DEBUG] MASUK KE CONTROLLER createTransaction ---');
  console.log('--- [DEBUG] Request Body Diterima:', JSON.stringify(req.body, null, 2));

  const t = await sequelize.transaction();
  try {
    const { items, total_amount, payment_method, customer_name } = req.body;
    const transaction_code = `DJ-${Date.now()}`;

    const transaction = await Transaction.create({
      transaction_code,
      total_amount,
      payment_method,
      customer_name,
      status: 'completed'
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
      if (!product) {
        throw new Error(`Produk dengan ID ${item.id} tidak ditemukan.`);
      }
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Stok untuk ${product.name} tidak mencukupi.`);
      }
      
      // V-- PERBAIKAN UTAMA ADA DI SINI --V
      // Mengganti 'decrement' dengan cara yang lebih eksplisit dan aman
      product.stock_quantity -= item.quantity;
      await product.save({ transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Transaksi berhasil dibuat', transaction });

  } catch (error) {
    await t.rollback();
    console.error('*** ERROR SAAT MEMBUAT TRANSAKSI ***:', error);
    res.status(500).json({ message: 'Transaksi gagal', error: error.message });
  }
};

// ... (Sisa fungsi lainnya tidak berubah)
exports.holdTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, total_amount, customer_name } = req.body;
    const transaction_code = `HELD-${Date.now()}`;

    const transaction = await Transaction.create({
      transaction_code,
      total_amount,
      payment_method: 'pending',
      customer_name,
      status: 'pending'
    }, { transaction: t });

    for (const item of items) {
      await TransactionDetail.create({
        transaction_id: transaction.id,
        product_id: item.id,
        quantity: item.quantity,
        price_per_unit: item.base_price,
        subtotal: item.base_price * item.quantity
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Transaksi berhasil ditunda' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Gagal menunda transaksi', error: error.message });
  }
};

exports.getHeldTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { status: 'pending' },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil transaksi tertunda', error: error.message });
  }
};

exports.deleteHeldTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      where: { id, status: 'pending' }
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tertunda tidak ditemukan.' });
    }
    await transaction.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus transaksi tertunda', error: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { status: 'completed' },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil riwayat transaksi', error: error.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id, {
      include: {
        model: TransactionDetail,
        include: {
          model: Product,
          attributes: ['name', 'base_price', 'price_tiers']
        }
      }
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }
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

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Harap tentukan startDate dan endDate.' });
    }
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    const whereClause = {
      status: 'completed',
      createdAt: {
        [Op.between]: [new Date(startDate), endOfDay]
      }
    };

    const summary = await Transaction.findOne({
      attributes: [
        [fn('SUM', col('total_amount')), 'totalRevenue'],
        [fn('COUNT', col('id')), 'totalTransactions']
      ],
      where: whereClause,
      raw: true
    });

    const paymentMethodSummary = await Transaction.findAll({
        attributes: [ 'payment_method', [fn('SUM', col('total_amount')), 'total'] ],
        where: whereClause,
        group: ['payment_method'],
        raw: true
    });

    const paymentTotals = { cash: 0, qris: 0, transfer: 0 };
    paymentMethodSummary.forEach(item => {
        if (paymentTotals.hasOwnProperty(item.payment_method)) {
            paymentTotals[item.payment_method] = parseFloat(item.total);
        }
    });

    const transactions = await Transaction.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      summary: {
        totalRevenue: parseFloat(summary.totalRevenue) || 0,
        totalTransactions: summary.totalTransactions || 0,
        paymentMethodTotals: paymentTotals
      },
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil laporan penjualan', error: error.message });
  }
};
