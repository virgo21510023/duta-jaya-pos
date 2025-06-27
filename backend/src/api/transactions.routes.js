// backend/src/api/transactions.routes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

// Rute untuk transaksi selesai
router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getAllTransactions);

// V-- RUTE BARU UNTUK MENCARI BERDASARKAN KODE --V
// Tempatkan ini SEBELUM rute /:id agar tidak terjadi konflik
router.get('/code/:code', transactionController.getTransactionByCode);

// Rute untuk mengambil satu transaksi berdasarkan ID numeriknya
router.get('/:id', transactionController.getTransactionById);


module.exports = router;
