const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase.controller');

router.post('/', purchaseController.recordPurchase);

module.exports = router;