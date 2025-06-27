// backend/src/config/database.config.js
require('dotenv').config(); // Memuat variabel dari .env
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false, // Set ke `true` jika ingin melihat query SQL di console
  }
);

module.exports = sequelize;