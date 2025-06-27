// backend/src/controllers/report.controller.js

const Transaction = require('../models/transaction.model');
const TransactionDetail = require('../models/transaction_detail.model');
const Product = require('../models/product.model');
const { Op, fn, col, literal } = require('sequelize');

// Fungsi untuk Laporan Penjualan (Tidak berubah, sudah benar)
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
      createdAt: { [Op.between]: [new Date(startDate), endOfDay] }
    };

    const summary = await Transaction.findOne({
      attributes: [
        [fn('SUM', col('total_amount')), 'totalRevenue'],
        [fn('COUNT', col('id')), 'totalTransactions']
      ],
      where: whereClause, raw: true
    });

    const paymentMethodSummary = await Transaction.findAll({
      attributes: [ 'payment_method', [fn('SUM', col('total_amount')), 'total'] ],
      where: whereClause, group: ['payment_method'], raw: true
    });

    const paymentTotals = { cash: 0, qris: 0, transfer: 0 };
    paymentMethodSummary.forEach(item => {
      if (paymentTotals.hasOwnProperty(item.payment_method)) {
        paymentTotals[item.payment_method] = parseFloat(item.total);
      }
    });

    const transactions = await Transaction.findAll({
      where: whereClause, order: [['createdAt', 'DESC']]
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

// V-- FUNGSI INI TELAH DIPERBAIKI --V
exports.getProfitLossReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Harap tentukan startDate dan endDate.' });
    }
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    const cogsResult = await TransactionDetail.findOne({
      attributes: [
        [fn('SUM', literal('`TransactionDetail`.`quantity` * `Product`.`hpp`')), 'totalCogs']
      ],
      include: [
        { model: Product, attributes: [] },
        {
          model: Transaction,
          attributes: [],
          // PERBAIKAN: Pastikan hanya menghitung HPP dari transaksi yang sudah 'completed'
          where: {
            status: 'completed',
            createdAt: { [Op.between]: [new Date(startDate), endOfDay] }
          }
        }
      ],
      raw: true
    });

    res.status(200).json({ totalCogs: parseFloat(cogsResult.totalCogs) || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil laporan laba-rugi', error: error.message });
  }
};

// Fungsi Dashboard (Tidak berubah)
exports.getDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const salesToday = await Transaction.findOne({
      attributes: [
        [fn('SUM', col('total_amount')), 'totalRevenue'],
        [fn('COUNT', col('id')), 'totalTransactions']
      ],
      where: { status: 'completed', createdAt: { [Op.between]: [todayStart, todayEnd] } },
      raw: true
    });

    const topProductsToday = await TransactionDetail.findAll({
      attributes: [ 'product_id', [fn('SUM', col('quantity')), 'totalQuantitySold'] ],
      include: [
        { model: Product, attributes: ['name'] },
        { model: Transaction, attributes: [], where: { status: 'completed', createdAt: { [Op.between]: [todayStart, todayEnd] } } }
      ],
      group: ['product_id', 'Product.id'],
      order: [[literal('totalQuantitySold'), 'DESC']],
      limit: 5,
      raw: true
    });

    res.status(200).json({
      salesSummary: {
        totalRevenue: parseFloat(salesToday.totalRevenue) || 0,
        totalTransactions: salesToday.totalTransactions || 0,
      },
      topProducts: topProductsToday.map(p => ({
        name: p['Product.name'],
        sold: parseInt(p.totalQuantitySold)
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data dashboard', error: error.message });
  }
};
