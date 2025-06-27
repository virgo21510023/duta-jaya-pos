// backend/src/api/reports.routes.js

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

// Rute untuk Laporan Penjualan
router.get('/sales', reportController.getSalesReport);

// Rute untuk Laporan Laba-Rugi
router.get('/profit-loss', reportController.getProfitLossReport);

// Rute untuk Dashboard
router.get('/dashboard', reportController.getDashboardStats);

module.exports = router;
