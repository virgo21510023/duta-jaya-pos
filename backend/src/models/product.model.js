// backend/src/models/product.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config'); // Path ini benar dari lokasi file ini

const Product = sequelize.define('Product', {
  product_code: {
    type: DataTypes.STRING,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grade: {
    type: DataTypes.STRING,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock_quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  hpp: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: 'Harga Pokok Penjualan',
  },
  base_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: 'Harga Jual Dasar',
  },
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;