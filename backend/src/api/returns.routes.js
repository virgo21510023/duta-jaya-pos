    // backend/src/api/returns.routes.js
    const express = require('express');
    const router = express.Router();
    const returnController = require('../controllers/return.controller');
    const { verifyToken } = require('../middleware/auth.middleware');

    // Lindungi rute retur, hanya pengguna yang login yang bisa mengakses
    router.post('/', verifyToken, returnController.processReturn);

    module.exports = router;
    