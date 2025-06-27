    // backend/src/controllers/return.controller.js
    const sequelize = require('../config/database.config');
    const Transaction = require('../models/transaction.model');
    const TransactionDetail = require('../models/transaction_detail.model');
    const Product = require('../models/product.model');

    exports.processReturn = async (req, res) => {
      const t = await sequelize.transaction();
      try {
        const { originalTransactionId, itemsToReturn, returnReason } = req.body;

        // Validasi input
        if (!originalTransactionId || !itemsToReturn || itemsToReturn.length === 0) {
          return res.status(400).json({ message: 'Data retur tidak lengkap.' });
        }

        // Hitung total nilai retur
        const totalReturnValue = itemsToReturn.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Buat transaksi retur baru
        const returnTransaction = await Transaction.create({
          transaction_code: `RTN-${Date.now()}`,
          total_amount: -totalReturnValue, // Nilai retur dibuat negatif
          payment_method: 'refund',
          customer_name: returnReason, // Kita gunakan kolom ini untuk alasan retur
          status: 'completed',
          transaction_type: 'return',
          original_transaction_id: originalTransactionId
        }, { transaction: t });

        // Proses setiap item yang diretur
        for (const item of itemsToReturn) {
          // Buat catatan di detail transaksi untuk transaksi retur
          await TransactionDetail.create({
            transaction_id: returnTransaction.id,
            product_id: item.id,
            quantity: item.quantity,
            price_per_unit: item.price,
            subtotal: item.price * item.quantity
          }, { transaction: t });

          // Tambahkan kembali stok produk
          const product = await Product.findByPk(item.id, { transaction: t });
          if (product) {
            await product.increment('stock_quantity', { by: item.quantity, transaction: t });
          }
        }

        await t.commit();
        res.status(201).json({ message: 'Proses retur berhasil.', data: returnTransaction });

      } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Gagal memproses retur', error: error.message });
      }
    };
    