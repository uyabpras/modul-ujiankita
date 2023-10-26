require('dotenv').config();
const Sequelize = require ('sequelize');


//const password = process.env.DB_PASSWORD.toString(); // Pastikan password adalah string
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT,

    pool: {
      min: process.env.POOL_MIN, // Nilai "min" harus sesuai
      max: process.env.POOL_MAX, // Nilai "max" sesuaikan dengan kebutuhan Anda
      idle: process.env.IDLE, // Waktu idle sesuaikan dengan kebutuhan Anda
    },
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.modul = require("../models/models")(sequelize, Sequelize.DataTypes);

module.exports = db;