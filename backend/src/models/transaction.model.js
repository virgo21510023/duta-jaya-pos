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
  // Kolom 'status' dihapus dari model
}, {
  tableName: 'transactions'
});

module.exports = Transaction;
