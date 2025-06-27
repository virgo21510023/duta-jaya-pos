// backend/src/models/transaction.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Transaction = sequelize.define('Transaction', {
  transaction_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customer_name: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('completed', 'pending', 'cancelled'),
    allowNull: false,
    defaultValue: 'completed'
  },
  // V-- TAMBAHKAN DUA KOLOM BARU INI --V
  transaction_type: {
    type: DataTypes.ENUM('sale', 'return'),
    allowNull: false,
    defaultValue: 'sale'
  },
  original_transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: true // Bisa null karena tidak semua transaksi adalah retur
  }
}, {
  tableName: 'transactions'
});

module.exports = Transaction;
