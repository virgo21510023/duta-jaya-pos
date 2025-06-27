const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');
const TransactionDetail = sequelize.define('TransactionDetail', {
  transaction_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price_per_unit: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
}, { tableName: 'transaction_details' });
module.exports = TransactionDetail;