    // backend/src/models/price_tier.model.js
    const { DataTypes } = require('sequelize');
    const sequelize = require('../config/database.config');

    const PriceTier = sequelize.define('PriceTier', {
      product_id: { type: DataTypes.INTEGER, allowNull: false },
      min_qty: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    }, { tableName: 'price_tiers' });

    module.exports = PriceTier;
    