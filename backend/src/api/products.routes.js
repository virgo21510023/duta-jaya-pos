// backend/src/api/products.routes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Rute ini sudah ada
router.get('/', productController.getAllProducts);

// V-- TAMBAHKAN RUTE BARU INI --V
// Ketika ada request POST ke '/api/products', jalankan fungsi createProduct
router.post('/', productController.createProduct);
router.get('/units', productController.getUniqueUnits);
router.get('/grades', productController.getUniqueGrades);
router.delete('/:id', productController.deleteProduct);

// Ketika ada request PUT ke '/api/products/123', jalankan fungsi updateProduct
router.put('/:id', productController.updateProduct);
router.put('/:id/tiers', productController.managePriceTiers);

module.exports = router;