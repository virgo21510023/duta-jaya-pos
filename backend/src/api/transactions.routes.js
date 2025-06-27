// backend/src/api/transactions.routes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

// Rute untuk transaksi selesai
router.post('/', transactionController.createTransaction);

// Rute untuk riwayat transaksi
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById);

// Semua rute yang berhubungan dengan '/hold' dihapus

module.exports = router;
