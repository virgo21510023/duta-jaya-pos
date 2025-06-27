// backend/src/models/stock_entry.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const StockEntry = sequelize.define('StockEntry', {
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity_added: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  purchase_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  supplier_info: { type: DataTypes.STRING },
  entry_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'stock_entries' });

module.exports = StockEntry;